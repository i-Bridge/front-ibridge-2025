'use client';

import { useState, useEffect, type ReactNode } from 'react'; // [1] ReactNode import 추가
import { Text } from '@/ui/Text';

interface TitleProps {
  // [2] title 타입을 string -> ReactNode로 변경
  // 이렇게 하면 문자열도 받을 수 있고, <span>이 포함된 JSX도 받을 수 있습니다.
  title: ReactNode; 
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

  useEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth < 768 ? 's' : 'l');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-start';
  const titleVariant = size === 's' ? 'title03' : 'title01';
  const subtitleVariant = size === 's' ? 'body04' : 'body03';

  const subtitleElement = subtitle ? (
    <Text variant={subtitleVariant} className='text-grayscale-gray60 whitespace-pre-line'>
      {subtitle}
    </Text>
  ) : null;

  // [3] title이 ReactNode이므로 Text 컴포넌트가 그대로 렌더링합니다.
  const titleElement = (
    <Text variant={titleVariant} className='text-grayscale-gray90 whitespace-pre-line'>
      {title}
    </Text>
  );

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