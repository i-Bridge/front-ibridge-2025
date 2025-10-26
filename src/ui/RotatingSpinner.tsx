import Image from 'next/image';

interface RotatingSpinnerProps {
  className?: string;
  variant?: 'primary' | 'gray';
}

const RotatingSpinner = ({
  className = 'w-20 h-20',
  variant = 'primary',
}: RotatingSpinnerProps) => {
  const spinnerSrc =
    variant === 'primary'
      ? '/images/primary-spinner.svg'
      : '/images/gray-spinner.svg';

  return (
    <div className={className}>
      <Image
        src={spinnerSrc}
        alt="로딩 스피너"
        width={80}
        height={80}
        className="h-full w-full animate-spin"
        priority 
      />
    </div>
  );
};

export default RotatingSpinner;