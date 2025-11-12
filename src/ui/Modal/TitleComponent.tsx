'use client';

import { useState, useEffect } from 'react';
import { Text } from '@/ui/Text';

interface TitleProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'start';
  subtitlePosition?: 'top' | 'bottom';
}

export default function TitleComponent({
  title,
  subtitle,
  align = 'center',
  subtitlePosition = 'bottom',
}: TitleProps) {
  const [size, setSize] = useState<'s' | 'l'>('l');

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth < 768 ? 's' : 'l');
    };

    handleResize(); // 초기값 설정
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-start';
  const titleVariant = size === 's' ? 'title03' : 'title01';
  const subtitleVariant = size === 's' ? 'body04' : 'body03';

  const subtitleElement = subtitle ? <Text variant={subtitleVariant} className='text-grayscale-gray60'>{subtitle}</Text> : null;
  const titleElement = <Text variant={titleVariant} className='text-grayscale-gray90'>{title}</Text>;

  return (
    <div className={`self-stretch inline-flex flex-col justify-start ${alignClass} gap-3`}>
      {subtitlePosition === 'top' ? (
        <>
          {subtitleElement}
          {titleElement}
        </>
      ) : (
        <>
          {titleElement}
          {subtitleElement}
        </>
      )}
    </div>
  );
}
