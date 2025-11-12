'use client';

import { useState, useEffect } from 'react';
import { Fetcher } from '@/lib/api/fetcher';
import { useRouter, useParams } from 'next/navigation';
import { useSubjectStore } from '@/store/useSubjectStore';
import {
  Type1Notice,
  Type2Notice,
  Type3Notice,
  Type4Notice,
} from './MailTypes'; // MailTypes 컴포넌트 경로는 실제 위치에 맞게 수정해주세요.
import emitter from '@/lib/eventBus';
import { useSubjectsInfinite } from '@/hooks/parentHome/useSubjectsInfinite';

// --- 레이아웃 및 UI 컴포넌트 임포트 (경로 확인 필요) ---
import ParentLayout from '../../_components/Layout/ParentLayout';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import EmptyPlaceholder from '@/ui/loading/EmptyPlaceHolder';

// ✅ 스켈레톤 컴포넌트 임포트
// (경로는 실제 MailBoxSkeleton.tsx 파일 위치에 맞게 수정해주세요)
import MailBoxSkeleton from './MailBoxSkeleton';

interface Notice {
  noticeId: number;
  type: 1 | 2 | 3 | 4;
  senderId: number | null;
  senderName: string | null;
  time: string;
  subject: number;
  accept: boolean;
}

interface NoticeData {
  notices: Notice[];
  newCount: number;
}

// 🔹Notice data Fetcher
async function fetchNoticeData(
  setNoticeData: (data: NoticeData | null) => void,
  setError: (msg: string | null) => void,
  setLoading?: (loading: boolean) => void,
) {
  if (setLoading) setLoading(true);
  try {
    const res = await Fetcher<NoticeData>('/parent/notice');
    if (res && res.data) {
      setNoticeData(res.data);
    } else {
      setNoticeData(null);
    }
    console.log('💓 NoticeData:', res);
  } catch (err) {
    console.error('요청 중 오류 발생:', err);
    setError('⚠️ 알림을 불러오는 중 오류가 발생했습니다.');
  } finally {
    if (setLoading) setLoading(false);
  }
}

export default function MailPage() {
  const router = useRouter();
  const params = useParams();
  const [noticeData, setNoticeData] = useState<NoticeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSelectedSubjectId, setShowPanels } = useSubjectStore();
  const { loadNext } = useSubjectsInfinite();

  // ✅ 컴포넌트 마운트 시 데이터 1회 호출
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchNoticeData(setNoticeData, setError, setLoading);
    };

    loadInitialData();
  }, []);

  // 🔹 자식 답변 열람 handle
  async function handleView(
    noticeId: number,
    senderId: number | null,
    subjectId: number,
    time: string,
  ) {
    if (!noticeId || !time) return;
    loadNext(noticeId, subjectId);
    await fetchNoticeData(setNoticeData, setError); // 알람 업데이트
    const currentChildId = Number(params.childId);
    setSelectedSubjectId(subjectId);
    setShowPanels(true);

    if (currentChildId !== senderId) {
      router.push(`/parent/${senderId}/home`);
    } else {
      emitter.emit('reloadReadData');
    }
  }

  // 🔹요청 accept handle
  async function handleAccept(senderId: number | null) {
    if (!senderId) return;
    const res = await Fetcher('/parent/notice/accept', {
      method: 'POST',
      data: { parentId: senderId },
    });
    if (res.isSuccess) {
      await fetchNoticeData(setNoticeData, setError);
    } else {
      console.error('수락 실패:', res.message);
    }
  }

  // 🔹요청 decline handle
  async function handleDecline(senderId: number | null) {
    if (!senderId) return;
    const res = await Fetcher('/parent/notice/decline', {
      method: 'POST',
      data: { parentId: senderId },
    });
    if (res.isSuccess) {
      await fetchNoticeData(setNoticeData, setError);
    } else {
      console.error('거절 실패:', res.message);
    }
  }

  // 🔹 모두 열람 버튼 핸들러
  const handleReadAll = async () => {
    if (loading) return;
    const res = await Fetcher('/parent/notice/readAll', {
      method: 'POST',
    });
    if (res.isSuccess) {
      await fetchNoticeData(setNoticeData, setError, setLoading);
    } else {
      console.error('모두 열람 실패:', res.message);
    }
  };

  // 🔹 로딩, 에러, 빈 상태를 표시할 내부 컴포넌트
  const renderMailList = () => {
    // ✅ 1. 로딩 중일 때 스켈레톤 UI 반환
    if (loading) {
      // MailBoxSkeleton은 Figma의 px-10, gap-5 등 모든 래퍼를 포함합니다.
      return <MailBoxSkeleton />;
    }

    // ✅ 2. 로딩이 끝난 후, 스켈레톤과 동일한 래퍼로 실제 콘텐츠를 감쌉니다.
    return (
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          {/* --- 여기부터 로딩 아닐 때의 분기 --- */}
          {error ? (
            <div className="flex justify-center items-center h-24 self-stretch px-7 py-5 bg-red-50 rounded-xl border border-red-200">
              <Text variant="body01" className="text-red-500">
                {error}
              </Text>
            </div>
          ) : noticeData?.notices.length === 0 ? (
            // EmptyPlaceholder는 self-stretch가 필요할 수 있으므로 래퍼로 감쌀 수 있습니다.
            // 혹은 EmptyPlaceholder 자체에서 너비를 100%로 설정해도 됩니다.
            <div className="self-stretch">
              <EmptyPlaceholder>아직 알림이 없어요!</EmptyPlaceholder>
            </div>
          ) : (
            // 🔹 실제 메일 목록 렌더링
            noticeData?.notices.map((mail) => {
              switch (mail.type) {
                case 1:
                  return (
                    <Type1Notice
                      key={mail.noticeId}
                      mail={mail}
                      onView={() =>
                        handleView(
                          mail.noticeId,
                          mail.senderId,
                          mail.subject,
                          mail.time,
                        )
                      }
                    />
                  );
                case 2:
                  return (
                    <Type2Notice
                      key={mail.noticeId}
                      mail={mail}
                      onAccept={() => handleAccept(mail.senderId)}
                      onDecline={() => handleDecline(mail.senderId)}
                    />
                  );
                case 3:
                  return <Type3Notice key={mail.noticeId} mail={mail} />;
                case 4:
                  return <Type4Notice key={mail.noticeId} mail={mail} />;
                default:
                  return null;
              }
            })
          )}
          {/* --- 분기 끝 --- */}
        </div>
      </div>
    );
  };

  return (
    <ParentLayout
      title={
        <div className="flex w-full items-center justify-between">
          <div className="flex ">
            <Text as="span" variant="title01">
              새로운 알림이{' '}
              <span className="text-primary-primary">
                {/* 로딩 중일 땐 카운트가 0 또는 null일 수 있으므로 '...' 등으로 표시하는 것도 좋습니다. */}
                {loading ? '...' : (noticeData?.newCount ?? 0)}개
              </span>{' '}
              있어요.
            </Text>
          </div>
          <Button
            onClick={handleReadAll}
            disabled={(noticeData?.newCount ?? 0) === 0 || loading}
            variant={'grayscale'}
            className="h-10 px-4 py-2.5 w-auto bg-grayscale-gray5"
            textVariant={'caption04'}
            textClass="text-grayscale-gray70"
          >
            모두 읽음 처리
          </Button>
        </div>
      }
    >
      {/* ✅ renderMailList가 이제 스켈레톤 또는
        실제 콘텐츠 래퍼를 '직접' 반환하므로,
        여기서는 추가 래퍼가 필요 없습니다.
      */}
      {renderMailList()}
    </ParentLayout>
  );
}
