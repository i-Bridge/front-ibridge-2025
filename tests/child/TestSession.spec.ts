import { test, expect } from '@playwright/test';

test.describe('TalkSession - question 모드', () => {
  test.beforeEach(async ({ page }) => {
    // ✅ 실제 프론트 서버 페이지 열기
    await page.goto('/child/10/talk/question');

    // ✅ API mock (프론트 코드에서 호출하는 실제 엔드포인트와 동일해야 함)
    await page.route('**/api/talk/predesigned**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ subjectId: 123, question: '안녕하세요!' }),
      });
    });

    await page.route('**/api/talk/answer**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ finished: true, ai: '좋아요!' }),
      });
    });

    // ✅ 브라우저 API mock
    await page.addInitScript(() => {
      // navigator.mediaDevices
      Object.defineProperty(navigator, 'mediaDevices', {
        value: { getUserMedia: async () => new MediaStream() },
        configurable: true,
      });

      // MediaRecorder
      (window as any).MediaRecorder = class {
        ondataavailable: ((e: any) => void) | null = null;
        onstop: (() => void) | null = null;
        start() { console.log('MediaRecorder start'); }
        stop() { console.log('MediaRecorder stop'); this.onstop?.(); }
      };

      // SpeechRecognition
      (window as any).SpeechRecognition = class {
        lang = 'ko-KR';
        interimResults = true;
        continuous = true;
        onresult: ((e: any) => void) | null = null;
        start() { console.log('STT start'); }
        stop() { console.log('STT stop'); }
      };
      (window as any).webkitSpeechRecognition = (window as any).SpeechRecognition;

      // Audio
      (window as any).Audio = class {
        src = '';
        onended: (() => void) | null = null;
        play = async () => { console.log('Audio play', this.src); this.onended?.(); };
        pause = () => console.log('Audio pause');
      };
    });
  });

  test('질문 모드: 시작 → 질문 표시 → 녹화 → AI 응답 → UI 초기화', async ({ page }) => {
    // 시작 버튼 클릭
    const startBtn = page.locator('button:has-text("오늘의 질문을 시작해봐")');
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // 질문 표시 확인
    const speechBubble = page.locator('p:has-text("안녕하세요!")');
    await expect(speechBubble).toBeVisible();

    // VideoRecorder 렌더링 확인
    const video = page.locator('video');
    await expect(video).toBeVisible();

    // 녹화 버튼 → 종료 버튼 클릭 시뮬레이션
    const recordBtn = page.locator('button:has-text("🎬")').first();
    await recordBtn.click();
    const stopBtn = page.locator('button:has-text("🛑")').first();
    await stopBtn.click();

    // AI 응답 표시
    const aiText = page.locator('p:has-text("좋아요!")');
    await expect(aiText).toBeVisible();

    // 대화 종료 후 다시 시작 버튼 보이는지 확인
    await expect(startBtn).toBeVisible();
  });
});
