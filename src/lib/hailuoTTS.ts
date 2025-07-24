export const fetchHailuoSpeechUrl = async (
  text: string,
): Promise<string | null> => {
  try {
    const res = await fetch('https://api.hailuo.co.kr/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HAILUO_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        speaker: 'child_friendly', // 또는 'kid', 'teacher' 등
        emotion: 'cheerful', // 또는 'neutral', 'sad'
        speed: 1.0,
        pitch: 1.0,
      }),
    });

    if (!res.ok) throw new Error('Hailuo TTS 요청 실패');
    const data = await res.json();
    return data.url; // Hailuo는 보통 { url: "https://..." } 형태로 반환
  } catch (err) {
    console.error('❌ Hailuo TTS 오류:', err);
    return null;
  }
};
