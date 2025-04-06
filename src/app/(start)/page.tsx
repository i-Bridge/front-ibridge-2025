'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import LoginButton from '@/components/Auth/LoginButton';

export default function StartPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-i-ivory py-24 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-6xl text-i-darkblue font-bold mb-4"
              >
                Welcome to iBridge
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="text-xl text-i-darkblue mb-4"
              >
                감정은 행동이 아닌, 말로 표현될 수 있어야 합니다.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
                className="text-lg text-i-darkblue mb-8"
              >
                iBridge는 부모가 아이의 진짜 마음을 이해할 수 있도록 돕는, 감정
                분석 기반의 소통 플랫폼입니다.
              </motion.p>
              <div className="flex gap-4">
                <div className="bg-i-lightpurple text-blue-900 px-4 py-1 rounded-full text-sm">
                  2026
                </div>
                <div className="bg-i-lightgrey text-blue-900 px-4 py-1 rounded-md text-sm">
                  Team i-Bridge
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="w-80"
            >
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-i-lightpurple to-i-pink"></div>
                <div className="space-y-3">
                  <LoginButton />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Intro Text Section */}
        <section className="max-w-5xl mx-auto px-16 mb-32 relative text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-i-darkblue mb-8"
          >
            부모와 자녀, 감정의 다리를 잇다 — iBridge
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-lg text-i-darkblue leading-relaxed mb-8"
          >
            아이의 행동 이면에는 언제나 "나를 이해해 줘!"라는 외침이 있습니다.
            하지만 부모도 완벽할 수 없기에, 올바른 소통을 위한 도구가
            필요합니다. iBridge는 부모가 감정을 개입하지 않고 자녀의 속마음을
            이해할 수 있도록 도와주는 웹 플랫폼입니다.
          </motion.p>
        </section>

        {/* Long Scroll Dummy Section */}
        <section className="max-w-5xl mx-auto px-16 mb-32">
          <div className="space-y-20">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-lg text-i-darkblue">
                  감정 이해와 소통의 다리를 놓는 iBridge — 더 나은 가족 관계를
                  위한 여정을 함께해요. (섹션 {index + 1})
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Parent and Child Service Sections */}
        <div className="w-full mx-auto px-8 mb-16">
          <div className="flex justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="w-full sm:w-[45%] bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-4xl text-i-darkblue font-bold mb-8">
                For Parent
              </h2>
              <p className="text-blue-900 leading-relaxed mb-8">
                감정적인 해석을 최소화하고, 자녀의 생각을 보다 명확히 이해할 수
                있도록 돕는 인사이트 제공 서비스.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="w-full sm:w-[45%] bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-4xl text-i-darkblue font-bold mb-8">
                For Child
              </h2>
              <p className="text-blue-900 leading-relaxed mb-8">
                귀여운 캐릭터와의 대화를 통해 자연스럽게 감정을 표현하고, 자신을
                이해받는 경험을 쌓을 수 있는 공간.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
