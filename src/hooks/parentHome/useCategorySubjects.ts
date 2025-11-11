import { create } from 'zustand';
import { Subject } from '@/types/index';
import { Fetcher } from '@/lib/fetcher';
import { showError } from '@/lib/toast';

// API 응답 타입
interface CategorySubjectsListResponse {
  subjects: Subject[];
}

// 스토어의 상태 및 액션 타입
interface CategorySubjectsCacheState {
  cache: Map<string, Subject[]>;
  /**
   * 현재 Fetcher로 요청 중인 category 목록 (중복 호출 방지용)
   */
  loadingCategories: Set<string>; // [수정] loadingKeywords -> loadingCategories
  /**
   * 카테고리에 해당하는 주제 목록을 가져오는 액션.
   * 캐시를 확인하고, 없으면 Fetcher로 API를 호출합니다.
   * @param childId - 아이 ID
   * @param category - 캐시 키 및 API 쿼리로 사용될 카테고리
   * @returns Subject 배열 또는 실패 시 null
   */
  fetchSubjects: (
    childId: string,
    category: string,
  ) => Promise<Subject[] | null>;
  /**
   * 캐시를 수동으로 비웁니다.
   */
  clearCache: () => void;
}

export const useCategorySubjectsCache = create<CategorySubjectsCacheState>(
  (set, get) => ({
    cache: new Map(),
    loadingCategories: new Set(), // [수정] loadingKeywords -> loadingCategories

    fetchSubjects: async (childId: string, category: string) => {
      // [수정] keyword -> category
      const { cache, loadingCategories } = get(); // [수정] loadingKeywords -> loadingCategories

      // 1. 이미 로딩 중인지 확인 (중복 호출 방지)
      if (loadingCategories.has(category)) {
        // [수정] keyword -> category
        return null; // 이미 요청이 진행 중
      }

      // 2. 캐시에 데이터가 있는지 확인
      if (cache.has(category)) {
        // [수정] keyword -> category
        return cache.get(category)!; // 캐시된 데이터 반환
      }

      // 3. 캐시에 없으므로 API 호출 시작
      // 로딩 상태로 변경
      set((state) => ({
        loadingCategories: new Set(state.loadingCategories).add(category), // [수정]
      }));

      try {
        const url = `/parent/${childId}/stat/subject?keyword=${category}`;
        const res = await Fetcher<CategorySubjectsListResponse>(url);

        if (res.isSuccess && res.data) {
          const subjects = res.data.subjects;
          // 성공 시 캐시에 저장
          set((state) => ({
            cache: new Map(state.cache).set(category, subjects), // [수정]
          }));
          return subjects; // 새로 가져온 데이터 반환
        } else {
          showError(res.message || '대화 목록을 불러오는데 실패했습니다.');
          return null;
        }
      } catch (err) {
        console.error('Failed to fetch subjects cache:', err);
        showError('오류가 발생했습니다. 다시 시도해주세요.');
        return null;
      } finally {
        // 4. 로딩 상태 해제
        set((state) => {
          const newLoadingCategories = new Set(state.loadingCategories); // [수정]
          newLoadingCategories.delete(category); // [수정]
          return { loadingCategories: newLoadingCategories }; // [수정]
        });
      }
    },

    clearCache: () => {
      set({ cache: new Map(), loadingCategories: new Set() }); // [수정]
    },
  }),
);
