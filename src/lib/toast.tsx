// lib/toast.tsx
'use client';

import { toast } from 'sonner';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const toastColors: Record<
  ToastType,
  { text: string; border: string; icon: string }
> = {
  success: {
    text: 'text-green-700',
    border: 'border-green-200',
    icon: '✅',
  },
  error: {
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '❌',
  },
  warning: {
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    icon: '⚠️',
  },
  info: {
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: 'ℹ️',
  },
};

const baseStyle =
  'bg-white border shadow-md rounded-lg px-4 py-3 text-sm font-medium w-72';

// ✅ 공통 토스트 생성 함수
const createToast = (type: ToastType, message: string | ReactNode) => {
  const { text, border, icon } = toastColors[type];
  toast.custom((t) => (
    <div
      className={`${baseStyle} ${text} ${border} flex items-start justify-between gap-3`}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg">{icon}</span>
        <div className="text-sm">{message}</div>
      </div>
      <button
        onClick={() => toast.dismiss(t)}
        className="text-gray-400 hover:text-gray-600 text-xs mt-1"
      >
        ✕
      </button>
    </div>
  ));
};

// ✅ export 함수들
export const showSuccess = (message: string | ReactNode) =>
  createToast('success', message);

export const showError = (message: string | ReactNode) =>
  createToast('error', message);

export const showWarning = (message: string | ReactNode) =>
  createToast('warning', message);

export const showInfo = (message: string | ReactNode) =>
  createToast('info', message);

// ✅ confirm toast
export const showConfirmToast = ({
  message,
  onConfirm,
}: {
  message: string | ReactNode;
  onConfirm: () => void;
}) => {
  toast.custom((t) => (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md w-72">
      <p className="text-sm text-gray-800 font-medium mb-3">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            toast.dismiss(t);
            onConfirm();
          }}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
        >
          예
        </button>
        <button
          onClick={() => toast.dismiss(t)}
          className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 text-sm"
        >
          아니오
        </button>
      </div>
    </div>
  ));
};
