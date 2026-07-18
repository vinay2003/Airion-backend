import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Bell, Lock, Activity, CreditCard } from 'lucide-react';
import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import PreferenceSettings from '../components/settings/PreferenceSettings';

const Settings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read active tab from URL query params. Fallback to 'profile'
  const activeTabParam = searchParams.get('tab');
  
  const tabs = useMemo(() => [
    { id: 'profile', label: 'Profile', icon: User, desc: 'Personal & business details', available: true },
    { id: 'security', label: 'Security', icon: Lock, desc: 'Password & access logs', available: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alerts & emails', available: false },
    { id: 'preferences', label: 'Preferences', icon: Activity, desc: 'Theme & display', available: true },
    { id: 'payouts', label: 'Payout Methods', icon: CreditCard, desc: 'Bank & UPI details', available: false },
  ], []);

  // Validate the current tab. If invalid, fallback to 'profile'
  const currentTab = useMemo(() => {
    const isValid = tabs.some(t => t.id === activeTabParam);
    return isValid ? activeTabParam : 'profile';
  }, [activeTabParam, tabs]);

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'preferences':
        return <PreferenceSettings />;
      case 'notifications':
      case 'payouts':
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 bg-[var(--ease2event-bg-elevated)]/20 rounded-3xl border border-[var(--ease2event-border-subtle)] border-dashed">
            <div className="p-4 bg-[var(--ease2event-bg-surface)] rounded-2xl shadow-sm border border-[var(--ease2event-border-base)]">
              {currentTab === 'notifications' ? <Bell className="size-8 text-[var(--ease2event-text-muted)]" /> : <CreditCard className="size-8 text-[var(--ease2event-text-muted)]" />}
            </div>
            <h3 className="text-xl font-bold text-[var(--ease2event-text-primary)] tracking-tight">Coming Soon</h3>
            <p className="text-sm font-semibold text-[var(--ease2event-text-secondary)] max-w-sm">
              We're currently building the {currentTab === 'notifications' ? 'notification preferences' : 'payout methods'} management system. Check back later!
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 px-6 w-full max-w-7xl mx-auto pb-32 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--ease2event-border-subtle)] pb-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight leading-normal text-[var(--ease2event-text-primary)]">Settings Hub</h1>
          <p className="text-sm font-semibold text-[var(--ease2event-text-secondary)]">Manage your preferences, security, and profile from one place</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 🧭 Navigation */}
        <div className="w-full lg:w-72 shrink-0">
          {/* Mobile/Tablet Horizontal Scrollable Tabs */}
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-4 lg:pb-0 hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-shrink-0 lg:flex-shrink-auto flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden cursor-pointer whitespace-nowrap lg:whitespace-normal text-left min-w-[200px] lg:min-w-0 ${
                  currentTab === tab.id
                    ? 'bg-[var(--ease2event-brand-primary)] text-white shadow-md lg:scale-105 z-10'
                    : 'bg-[var(--ease2event-bg-surface)] text-[var(--ease2event-text-muted)] border border-[var(--ease2event-border-base)] hover:text-[var(--ease2event-text-primary)] hover:border-[var(--ease2event-border-subtle)]'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 transition-all ${
                  currentTab === tab.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-[var(--ease2event-bg-elevated)] text-[var(--ease2event-text-muted)] group-hover:bg-[var(--ease2event-brand-primary)]/10 group-hover:text-[var(--ease2event-brand-primary)]'
                }`}>
                  <tab.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm leading-none truncate">{tab.label}</p>
                    {!tab.available && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${
                        currentTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-500'
                      }`}>
                        Soon
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] font-semibold mt-1.5 truncate ${
                    currentTab === tab.id ? 'text-white/80' : 'text-[var(--ease2event-text-muted)] opacity-80'
                  }`}>
                    {tab.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 🛰️ Content Panel */}
        <div className="flex-1 min-w-0">
          <div className="bg-[var(--ease2event-bg-surface)] border border-[var(--ease2event-border-base)] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm min-h-[500px]">
            {renderContent()}
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Settings;
