'use client';
import { useEffect, useRef, useState } from 'react';

const IMAGE_NAMES = ['i_green', 'B', 'r', 'i', 'd', 'g', 'e'];
const IMAGE_HEIGHTS = [105, 135, 80, 100, 110, 105, 80];
const IMAGE_SPACING = [20, 70, 170, 243, 285, 368, 448];
const IMAGE_Y_POSITIONS = [75, 42, 95, 75, 65, 100, 98];

interface ImgObj {
  img: HTMLImageElement;
  x: number;
  y: number;
  baseY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  maxOffset: number;
  direction: number;
  alpha: number;
}

export default function StartLogoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<ImgObj[]>([]);
  const animationRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDpr(window.devicePixelRatio || 1);
    }
  }, []);

  const CSS_WIDTH = 800;
  const CSS_HEIGHT = 300;

  // 🔧 DPR 변경 감지 (브라우저 확대/축소 반영)
  useEffect(() => {
    const updateDpr = () => {
      setDpr(window.devicePixelRatio || 1);
    };
    const mediaQuery = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    mediaQuery.addEventListener('change', updateDpr);

    return () => mediaQuery.removeEventListener('change', updateDpr);
  }, []);

  // 🔧 canvas 해상도 조정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CSS_WIDTH * dpr;
    canvas.height = CSS_HEIGHT * dpr;
    canvas.style.width = `${CSS_WIDTH}px`;
    canvas.style.height = `${CSS_HEIGHT}px`;
  }, [dpr]);

  // 🔧 이미지 로딩 (해상도에 맞게 이미지 선택)
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: ImgObj[] = await Promise.all(
        IMAGE_NAMES.map((name, i) => {
          return new Promise<ImgObj>((resolve) => {
            const img = new Image();
            const imageSuffix = dpr >= 3 ? '3x' : dpr >= 2 ? '2x' : '1x';
            img.src = `/images/StartLogoAlphabets/${name}_${imageSuffix}.png`;

            img.onload = () => {
              const height = IMAGE_HEIGHTS[i];
              const ratio = img.naturalWidth / img.naturalHeight;
              const width = height * ratio;

              const targetX = 50 + IMAGE_SPACING[i];
              const targetY = IMAGE_Y_POSITIONS[i];

              resolve({
                img,
                x: Math.random() * CSS_WIDTH,
                y: Math.random() * CSS_HEIGHT,
                baseY: targetY,
                targetX,
                targetY,
                vx: 0,
                vy: 0,
                width,
                height,
                maxOffset: 20 + Math.random() * 30,
                direction: Math.random() > 0.5 ? 1 : -1,
                alpha: 0,
              });
            };
          });
        }),
      );
      imagesRef.current = loadedImages;
      setLoaded(true);
    };

    loadImages();
  }, [dpr]);

  // 🔧 애니메이션
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const draw = () => {
      ctx.clearRect(0, 0, CSS_WIDTH * dpr, CSS_HEIGHT * dpr);
      let allReached = true;
      for (const img of imagesRef.current) {
        const dx = img.targetX - img.x;
        const dy = img.targetY - img.y;

        img.vx = dx * 0.05;
        img.vy = dy * 0.05;

        img.x += img.vx;
        img.y += img.vy;
        img.alpha = Math.min(img.alpha + 0.03, 1);

        ctx.save();
        ctx.globalAlpha = img.alpha;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          img.img,
          img.x * dpr,
          img.y * dpr,
          img.width * dpr,
          img.height * dpr,
        );
        ctx.restore();

        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5 || img.alpha < 1) {
          allReached = false;
        }
      }

      if (!allReached) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current ?? 0);
  }, [loaded, dpr]);

  // 🔧 스크롤 반응 애니메이션
  useEffect(() => {
    const handleScroll = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const scrollY = window.scrollY;

      imagesRef.current.forEach((img) => {
        const scrollRatio = Math.min(scrollY / 50, 1);
        const offset = scrollRatio * img.maxOffset * img.direction;
        img.y = img.baseY + offset;
      });

      ctx.clearRect(0, 0, CSS_WIDTH * dpr, CSS_HEIGHT * dpr);
      imagesRef.current.forEach((img) => {
        ctx.save();
        ctx.globalAlpha = img.alpha;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          img.img,
          img.x * dpr,
          img.y * dpr,
          img.width * dpr,
          img.height * dpr,
        );
        ctx.restore();
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loaded, dpr]);

  return (
    <div>
      <canvas ref={canvasRef} className="" />
    </div>
  );
}
