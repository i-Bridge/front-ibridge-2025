// lib/toast.tsx
'use client';

import { toast } from 'sonner';
import type { ReactNode } from 'react';

const successIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const errorIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const infoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
    />
  </svg>
);

const warningIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
    />
  </svg>
);

type ToastType = 'success' | 'error' | 'warning' | 'info';

const toastIcons: Record<ToastType, ReactNode> = {
  success: successIcon,
  error: errorIcon,
  warning: warningIcon,
  info: infoIcon,
};

const toastColors: Record<
  ToastType,
  { bg: string; text: string; border: string; hex: string }
> = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',

    hex: '#f0fdf4',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',

    hex: '#fef2f2',
  },
  warning: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',

    hex: '#fef9c3',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',

    hex: '#eff6ff',
  },
};

export const showSuccess = (message: string | ReactNode) =>
  createToast('success', message);

export const showError = (message: string | ReactNode) =>
  createToast('error', message);

export const showWarning = (message: string | ReactNode) =>
  createToast('warning', message);

export const showInfo = (message: string | ReactNode) =>
  createToast('info', message);

const createToast = (type: ToastType, message: string | ReactNode) => {
  const { text, border, hex } = toastColors[type];
  const icon = toastIcons[type];

  toast.custom((t) => (
    <div
      style={{ backgroundColor: hex }}
      className={`w-72 shadow-md rounded-lg px-4 py-3 text-sm font-medium flex items-start justify-between gap-3 ${text} ${border} border`}
    >
      <div className="flex items-start gap-2">
        <span className="mt-[2px]">{icon}</span>
        <div className="text-sm">{message}</div>
      </div>
      <button
        onClick={() => toast.dismiss(t)}
        className="text-gray-400 hover:text-gray-600 mt-1"
      >
        ✕
      </button>
    </div>
  ));
};

export const showConfirmToast = ({
  message,
  onConfirm,
}: {
  message: string | ReactNode;
  onConfirm: () => void;
}) => {
  toast.custom((t) => (
    <div className="w-72 bg-white border border-gray-300 rounded-lg p-4 shadow-md">
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
