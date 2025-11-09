import React from 'react';

// interface RotatingSpinnerProps는 이미 주어졌습니다.
interface RotatingSpinnerProps {
  className?: string;
  variant?: 'primary' | 'grayscale';
}

const RotatingSpinner = ({
  className = 'w-20 h-20',
  variant = 'primary',
}: RotatingSpinnerProps) => {

  // 1. variant에 따라 렌더링할 SVG의 JSX 코드를 선택합니다.
  const spinnerSvg = variant === 'primary' ? (
    // PRIMARY SVG JSX 코드
    <svg
      // ⚠️ 여기에 width, height, className="h-full w-full animate-spin" 속성을 적용합니다.
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full animate-spin"
      // 'alt'는 SVG 태그에 직접 적용되지 않으므로, 접근성은 title/desc를 사용하거나,
      // 부모 div의 aria-label로 대체할 수 있습니다. 여기서는 div에 aria-label을 사용합니다.
    >
      <g filter="url(#filter0_i_641_15961)">
        <circle cx="40" cy="40" r="34" stroke="#F9FAFB" strokeWidth="12" />
      </g>
      <path
        d="M40 6C46.7246 6 53.2981 7.99407 58.8894 11.73C64.4807 15.466 68.8385 20.7761 71.4119 26.9888C73.9853 33.2015 74.6586 40.0377 73.3467 46.6331C72.0348 53.2284 68.7966 59.2866 64.0416 64.0416C59.2866 68.7966 53.2284 72.0348 46.6331 73.3467C40.0377 74.6586 33.2015 73.9853 26.9888 71.4119C20.7761 68.8385 15.466 64.4807 11.73 58.8894C7.99406 53.2981 6 46.7246 6 40"
        stroke="#FF6B31"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="bevel"
      />
      <defs>
        <filter
          id="filter0_i_641_15961"
          x="0"
          y="0"
          width="80"
          height="80"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB" // color-interpolation-filters -> colorInterpolationFilters (JSX 변환)
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" /> 
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_641_15961"
          />
        </filter>
      </defs>
    </svg>
  ) : (
    // GRAY SVG JSX 코드
    <svg
      // ⚠️ 여기에 width, height, className="h-full w-full animate-spin" 속성을 적용합니다.
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full animate-spin"
    >
      <g filter="url(#filter0_i_627_4580)">
        <circle cx="40" cy="40" r="34" stroke="#F9FAFB" strokeWidth="12" />
      </g>
      <path
        d="M40 6C46.7246 6 53.2981 7.99407 58.8894 11.73C64.4807 15.466 68.8385 20.7761 71.4119 26.9888C73.9853 33.2015 74.6586 40.0377 73.3467 46.6331C72.0348 53.2284 68.7966 59.2866 64.0416 64.0416C59.2866 68.7966 53.2284 72.0348 46.6331 73.3467C40.0377 74.6586 33.2015 73.9853 26.9888 71.4119C20.7761 68.8385 15.466 64.4807 11.73 58.8894C7.99406 53.2981 6 46.7246 6 40"
        stroke="#B0B8C1"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="bevel"
      />
      <defs>
        <filter
          id="filter0_i_627_4580"
          x="0"
          y="0"
          width="80"
          height="80"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB" // JSX 변환
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_627_4580"
          />
        </filter>
      </defs>
    </svg>
  );

  return (
    // alt="로딩 스피너" 대신 aria-label을 사용하여 접근성을 확보합니다.
    <div className={className} role="img" aria-label="로딩 중"> 
      {spinnerSvg}
    </div>
  );
};

export default RotatingSpinner;