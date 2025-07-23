'use client';
import { useEffect, useRef, useState } from 'react';

const IMAGE_NAMES = ['i_green', 'B', 'r', 'i', 'd', 'g', 'e'];

// 세로 높이 지정 (가로는 자동 비율)
const IMAGE_HEIGHTS = [105, 135, 80, 100, 110, 105, 80];

// x 간격 설정
const IMAGE_SPACING = [20, 70, 170, 243, 285, 368, 448];

// y 위치 설정 (기준선에 맞추지 않고 임의 지정)
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loadImages = async () => {
      const loadedImages: ImgObj[] = await Promise.all(
        IMAGE_NAMES.map((name, i) => {
          return new Promise<ImgObj>((resolve) => {
            const img = new Image();
            img.src = `/images/${name}.png`;
            img.onload = () => {
              const height = IMAGE_HEIGHTS[i];
              const ratio = img.naturalWidth / img.naturalHeight;
              const width = height * ratio;

              const targetX = 50 + IMAGE_SPACING[i];
              const targetY = IMAGE_Y_POSITIONS[i];

              resolve({
                img,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                baseY: targetY,
                targetX,
                targetY,
                vx: 0,
                vy: 0,
                width,
                height,
                maxOffset: 20 + Math.random() * 30,
                direction: Math.random() > 0.5 ? 1 : -1,
                alpha: 0, // 처음엔 투명
              });
            };
          });
        }),
      );
      imagesRef.current = loadedImages;
      setLoaded(true);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const animateToPosition = () => {
      const images = imagesRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allReached = true;

      for (const img of images) {
        const dx = img.targetX - img.x;
        const dy = img.targetY - img.y;

        img.vx = dx * 0.05;
        img.vy = dy * 0.05;

        img.x += img.vx;
        img.y += img.vy;
        img.alpha = Math.min(img.alpha + 0.03, 1);

        ctx.save();
        ctx.globalAlpha = img.alpha;
        ctx.drawImage(img.img, img.x, img.y, img.width, img.height);
        ctx.restore();

        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5 || img.alpha < 1) {
          allReached = false;
        }
      }

      if (!allReached) {
        animationRef.current = requestAnimationFrame(animateToPosition);
      }
    };

    animateToPosition();

    return () => cancelAnimationFrame(animationRef.current ?? 0);
  }, [loaded]);

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

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      imagesRef.current.forEach((img) => {
        ctx.save();
        ctx.globalAlpha = img.alpha;
        ctx.drawImage(img.img, img.x, img.y, img.width, img.height);
        ctx.restore();
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loaded]);

  return <canvas ref={canvasRef} width={800} height={250} className="" />;
}
