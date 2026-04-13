import React from 'react';
import { toast, Toaster, ToastBar, CheckCircle, XCircle, Info, Bell } from 'react-hot-toast';

export const Ease2eventToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      className: 'bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-subtle)] text-[var(--ease2event-text-primary)] rounded-3xl shadow-[var(--ease2event-shadow-lg)] px-6 py-4 font-bold uppercase tracking-tight text-xs flex items-center gap-3',
      style: {
        background: 'var(--ease2event-bg-surface)',
        color: 'var(--ease2event-text-primary)',
        border: '1px solid var(--ease2event-border-subtle)',
        borderRadius: '1.5rem',
        boxShadow: 'var(--ease2event-shadow-lg)',
        padding: '1rem 1.5rem',
      },
      success: {
        icon: <CheckCircle className="text-green-500" size={20} />,
      },
      error: {
        icon: <XCircle className="text-red-500" size={20} />,
        duration: 5000,
      },
    }}
  >
    {(t) => (
      <ToastBar toast={t}>
        {({ icon, message }) => (
          <div className="flex items-center gap-3">
            {icon}
            <div className="flex-1 font-black tracking-tight">{message}</div>
            {t.type !== 'loading' && (
              <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-2 p-1 hover:bg-[var(--ease2event-bg-elevated)] rounded-full transition-colors"
                aria-label="Close"
              >
                <XCircle size={14} className="text-[var(--ease2event-text-muted)]" />
              </button>
            )}
          </div>
        )}
      </ToastBar>
    )}
  </Toaster>
);

export const notify = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  info: (msg: string) => toast(msg, { icon: <Info className="text-[var(--ease2event-brand-primary)]" size={20} /> }),
  loading: (msg: string) => toast.loading(msg),
  dismiss: (id?: string) => toast.dismiss(id),
};
