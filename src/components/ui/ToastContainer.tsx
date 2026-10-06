'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type || 'success'}`}>
          {toast.type === 'error' ? (
            <AlertCircle size={16} color="#FF8E8E" />
          ) : toast.type === 'info' ? (
            <Info size={16} color="#A7D2B6" />
          ) : (
            <CheckCircle2 size={16} color="#D4AF37" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
