'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function WalkingMan() {
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const totalFrames: number = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) =>
        prevFrame === totalFrames ? 1 : prevFrame + 1,
      );
    }, 500); // 프레임 변경 간격 (밀리초)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        animate={{
          x: [0, 400, 0], // 좌우로 300px 이동
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <motion.img
          src={`/images/walk/walk${currentFrame}.png`}
          alt="Walking person"
          className="w-32 h-32" // 이미지 크기 조정
        />
      </motion.div>
    </div>
  );
}
