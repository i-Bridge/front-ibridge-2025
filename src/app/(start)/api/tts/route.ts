import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'icn1'; // or 'hnd1'
const BASE_URLS = [
  'https://api.minimax.io/v1/t2a_v2',
  'https://api.minimaxi.chat/v1/t2a_v2',
];

interface MiniMaxJsonResponse {
  base_resp?: {
    status_code: number;
    status_msg?: string;
  };
  data?: {
    audio?: string;
    audio_hex?: string;
  };
  audio?: string;
  audio_hex?: string;
}

export async function POST(req: NextRequest) {
  try {
    const {
      text,
      speed = 1.0,
      pitch = 0,
      emotion = 'neutral',
    } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const apiKey = process.env.MINIMAX_API_KEY;
    const groupId = process.env.MINIMAX_GROUP_ID;
    const model = process.env.MINIMAX_TTS_MODEL || 'speech-02-turbo';
    const voice = 'Sweet_Girl_2';

    if (!apiKey || !groupId) {
      console.error('❌ Missing env', {
        hasApiKey: !!apiKey,
        hasGroupId: !!groupId,
      });
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 500 },
      );
    }

    // MiniMax HTTP Non-streaming: body 스키마 & GroupId 쿼리
    const body = {
      text,
      model,
      voice_setting: {
        voice_id: voice,
        speed, // 0.5~2.0
        pitch, // -12~12 (정수 권장)
        emotion, // 'neutral' 등
      },
      // language_boost: 'Korean', // 필요 시 사용
      // stream: false, // 명시해도 OK
    };

    let lastError = '';

    for (const base of BASE_URLS) {
      const url = `${base}?GroupId=${encodeURIComponent(groupId)}`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
          cache: 'no-store',
        });

        const ct = res.headers.get('content-type') || '';
        const st = res.status;

        if (!res.ok) {
          const err = await res.text();
          console.error(`❌ MiniMax fail @${base} [${st}]`, err.slice(0, 500));
          lastError = `status=${st}, body=${err.slice(0, 500)}`;
          continue; // 다음 도메인 시도
        }

        // 응답은 JSON에 hex 오디오가 들어오는 경우가 일반적
        if (ct.includes('application/json')) {
          const json = (await res.json()) as MiniMaxJsonResponse;

          // MiniMax 표준: base_resp.status_code === 0 이면 성공
          if (json?.base_resp?.status_code !== 0) {
            lastError = `api_error=${json?.base_resp?.status_msg || 'unknown'}`;
            console.error('❌ MiniMax API error:', json?.base_resp);
            continue;
          }

          const hex =
            json?.data?.audio ||
            json?.audio ||
            json?.data?.audio_hex ||
            json?.audio_hex;

          if (!hex || typeof hex !== 'string') {
            lastError = 'No audio(hex) field in JSON';
            console.error('❌ No audio(hex) in response:', json);
            continue;
          }

          const buf = Buffer.from(hex, 'hex'); // 🔑 HEX → 바이너리
          return new NextResponse(buf, {
            status: 200,
            headers: { 'Content-Type': 'audio/mpeg' }, // 기본 mp3
          });
        }

        // 혹시 바이너리로 오는 계정/플랜 대비
        const buf = await res.arrayBuffer();
        return new NextResponse(buf, {
          status: 200,
          headers: { 'Content-Type': ct || 'audio/mpeg' },
        });
      } catch (err) {
        // ✅ [수정 2] (err: any) 대신 (err)를 사용합니다.
        // ✅ 에러 타입을 확인하여 안전하게 메시지에 접근합니다.
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`❌ fetch error @${base}:`, errorMessage);
        lastError = errorMessage;
      }
    }

    return NextResponse.json(
      { error: 'MiniMax TTS failed on all endpoints', detail: lastError },
      { status: 502 },
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('❌ /api/tts handler error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
