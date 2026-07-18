import React, { useState } from 'react';
import { Lock, ShieldCheck, Eye, Loader2 } from 'lucide-react';
import { Badge, Button } from '@ease2event/ui';
import { useAuth } from '@ease2event/shared';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const SecuritySettings: React.FC = () => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdatePassword = async () => {
    if (!passwords.newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/change-password', {
        oldPassword: passwords.oldPassword || undefined,
        newPassword: passwords.newPassword
      });
      toast.success('Password updated successfully!');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      console.error('Failed to update password:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to update password.';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-b border-[var(--ease2event-border-subtle)] pb-6 sm:pb-6">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--ease2event-bg-elevated)] border border-[var(--ease2event-border-base)] text-amber-500 shrink-0">
          <Lock className="size-6 sm:size-8" />
        </div>
        <div>
          <h2 className="text-xl sm:text-lg font-semibold text-[var(--ease2event-text-primary)] leading-none tracking-tight">Security Settings</h2>
          <p className="text-[10px] sm:text-sm text-[var(--ease2event-text-secondary)] font-semibold mt-1.5 sm:mt-3 tracking-normal">Manage your password and security logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6 bg-[var(--ease2event-bg-elevated)]/20 p-6 sm:p-12 rounded-xl sm:rounded-[40px] border border-[var(--ease2event-border-subtle)]">
          <div className="space-y-5">
            <div className="space-y-4 sm:space-y-5">
              <label className="text-[11px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest ml-1">Current Password</label>
              <input
                type="password"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full h-12 sm:h-10 bg-[var(--ease2event-bg-surface)] px-5 sm:px-6 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold tracking-widest text-base sm:text-lg outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <div className="space-y-4 sm:space-y-5">
              <label className="text-[11px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest ml-1">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full h-12 sm:h-10 bg-[var(--ease2event-bg-surface)] px-5 sm:px-6 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold tracking-widest text-base sm:text-lg outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <div className="space-y-4 sm:space-y-5">
              <label className="text-[11px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest ml-1">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full h-12 sm:h-10 bg-[var(--ease2event-bg-surface)] px-5 sm:px-6 rounded-xl sm:rounded-2xl border border-[var(--ease2event-border-subtle)] font-bold tracking-widest text-base sm:text-lg outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>
          <Button
            onClick={handleUpdatePassword}
            disabled={submitting}
            className="h-12 sm:h-10 w-full bg-amber-500 text-white shadow-amber-500/20 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-bold tracking-widest transition-all"
          >
            {submitting ? <Loader2 className="animate-spin mx-auto" /> : 'UPDATE PASSWORD'}
          </Button>
        </div>

        <div className="card-minimal p-6 bg-gradient-to-br from-amber-500/[0.04] to-transparent border-amber-500/20 flex flex-col justify-between rounded-xl">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/10">
                <ShieldCheck size={16} />
              </div>
              <h3 className="text-base font-bold text-[var(--ease2event-text-primary)] tracking-widest">Security Status</h3>
            </div>
            <p className="text-[11px] text-[var(--ease2event-text-secondary)] font-bold leading-relaxed">
              Your account is secured with industry-standard encryption. We monitor active sessions for suspicious activity.
            </p>
          </div>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-[9px] px-4 py-2 rounded-xl tracking-widest w-full sm:w-auto text-center">SECURED</Badge>
            <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold text-[9px] px-4 py-2 rounded-xl tracking-widest w-full sm:w-auto text-center">ENCRYPTED</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4 sm:gap-0">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Recent Login Activity</h3>
            <p className="text-[8px] sm:text-[9px] text-[var(--ease2event-text-secondary)] font-bold mt-1 sm:mt-2 tracking-widest">History of account access</p>
          </div>
          <button className="text-[11px] sm:text-sm font-bold text-[var(--ease2event-brand-primary)] tracking-widest hover:underline flex items-center gap-2 sm:gap-3 group w-fit">
            <Eye size={12} className="sm:size-[14px] group-hover:scale-125 transition-transform" />
            VIEW ALL ACTIVITY
          </button>
        </div>

        <div className="overflow-x-auto border border-[var(--ease2event-border-subtle)] rounded-2xl sm:rounded-[32px] bg-[var(--ease2event-bg-elevated)]/10">
          <table className="w-full text-left min-w-[600px] sm:min-w-0">
            <thead>
              <tr className="bg-[var(--ease2event-bg-elevated)]/40 border-b border-[var(--ease2event-border-subtle)]">
                <th className="px-6 sm:px-6 py-5 sm:py-6 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Device / Terminal</th>
                <th className="px-6 sm:px-6 py-5 sm:py-6 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Auth Method</th>
                <th className="px-6 sm:px-6 py-5 sm:py-6 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest">Timestamp</th>
                <th className="px-6 sm:px-6 py-5 sm:py-6 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--ease2event-border-subtle)]">
              {[
                { node: 'CURRENT_DEVICE', type: 'LOGIN_AUTH', time: (user as any)?.lastLoginAt ? new Date((user as any).lastLoginAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase() : 'RECENT', status: 'AUTHORIZED' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-[var(--ease2event-brand-primary)]/[0.03] transition-all cursor-pointer group">
                  <td className="px-6 sm:px-6 py-5 sm:py-7 font-bold text-[10px] sm:text-[11px] text-[var(--ease2event-text-primary)] tracking-tight group-hover:translate-x-2 transition-transform">{log.node}</td>
                  <td className="px-6 sm:px-6 py-5 sm:py-7 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest">{log.type}</td>
                  <td className="px-6 sm:px-6 py-5 sm:py-7 text-[10px] sm:text-sm font-bold text-[var(--ease2event-text-secondary)] tracking-widest">{log.time}</td>
                  <td className="px-6 sm:px-6 py-5 sm:py-7">
                    <div className="flex justify-center">
                      <Badge className={`font-bold text-[8px] sm:text-[9px] px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl tracking-widest border transition-all ${log.status === 'AUTHORIZED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                        {log.status}
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
