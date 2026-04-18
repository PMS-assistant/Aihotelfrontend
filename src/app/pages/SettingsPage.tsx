import { useState } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router';
import { LogOut, Trash2, ShieldCheck, AlertTriangle, Plug } from 'lucide-react';
import { apiClient } from '../lib/axios';
import { toast, Toaster } from 'sonner';

export default function SettingsPage() {
  const { email, role, hotelName, hotelId, logout } = useUserStore();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete('/auth/account');
      logout();
      navigate('/signup', { replace: true });
    } catch {
      toast.error('Could not delete account. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const section = (title: string) => (
    <h3
      className="text-xs uppercase tracking-widest mb-3 mt-6"
      style={{ color: 'var(--vzir-text-3)', fontWeight: 500 }}
    >
      {title}
    </h3>
  );

  const row = (label: string, value: string) => (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl border"
      style={{ borderColor: 'var(--vzir-border)', backgroundColor: 'var(--vzir-surface)' }}
    >
      <span className="text-sm" style={{ color: 'var(--vzir-text-2)' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: 'var(--vzir-text)' }}>{value}</span>
    </div>
  );

  return (
    <div
      className="flex-1 overflow-y-auto px-6 py-8 pb-12"
      style={{ backgroundColor: 'var(--vzir-bg)' }}
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--vzir-surface-2)',
            border: '1px solid var(--vzir-border)',
            color: 'var(--vzir-text)',
          },
        }}
      />

      <div className="max-w-xl mx-auto">

        {/* Header */}
        <h1
          className="text-xl mb-1"
          style={{ color: 'var(--vzir-text)', fontWeight: 300, letterSpacing: '-0.01em' }}
        >
          Settings
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--vzir-text-3)' }}>
          Manage your account and property
        </p>

        {/* Account */}
        {section('Account')}
        <div className="space-y-2">
          {row('Email', email ?? '—')}
          {row('Role', role.charAt(0).toUpperCase() + role.slice(1))}
        </div>

        {/* Property */}
        {section('Property')}
        <div className="space-y-2">
          {row('Hotel name', hotelName)}
          {row('Hotel ID', hotelId ?? '—')}
        </div>

        {/* Integrations shortcut */}
        {section('Integrations')}
        <button
          onClick={() => navigate('/integrations')}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left"
          style={{ borderColor: 'var(--vzir-border)', backgroundColor: 'var(--vzir-surface)' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--vzir-primary-dim)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--vzir-border)')}
        >
          <div className="flex items-center gap-3">
            <Plug size={15} style={{ color: 'var(--vzir-primary)' }} />
            <span className="text-sm" style={{ color: 'var(--vzir-text)' }}>
              Manage connected systems
            </span>
          </div>
          <span className="text-xs" style={{ color: 'var(--vzir-text-3)' }}>
            Cloudbeds, Xero →
          </span>
        </button>

        {/* Session */}
        {section('Session')}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
          style={{ borderColor: 'var(--vzir-border)', backgroundColor: 'var(--vzir-surface)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--vzir-red)';
            e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--vzir-border)';
            e.currentTarget.style.backgroundColor = 'var(--vzir-surface)';
          }}
        >
          <LogOut size={15} style={{ color: 'var(--vzir-red)' }} />
          <span className="text-sm" style={{ color: 'var(--vzir-red)' }}>
            Sign out
          </span>
        </button>

        {/* Danger zone */}
        {section('Danger Zone')}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
            style={{ borderColor: 'var(--vzir-border)', backgroundColor: 'var(--vzir-surface)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--vzir-red)';
              e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--vzir-border)';
              e.currentTarget.style.backgroundColor = 'var(--vzir-surface)';
            }}
          >
            <Trash2 size={15} style={{ color: 'var(--vzir-red)' }} />
            <span className="text-sm" style={{ color: 'var(--vzir-red)' }}>
              Delete account & all data
            </span>
          </button>
        ) : (
          <div
            className="px-4 py-4 rounded-xl border"
            style={{ borderColor: 'var(--vzir-red)', backgroundColor: 'rgba(248,113,113,0.05)' }}
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--vzir-red)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--vzir-text)' }}>
                  This cannot be undone
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--vzir-text-2)' }}>
                  Your account, all conversations, and hotel data will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-lg text-xs border transition-all"
                style={{
                  borderColor: 'var(--vzir-border)',
                  backgroundColor: 'var(--vzir-surface-2)',
                  color: 'var(--vzir-text-2)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-lg text-xs transition-all disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--vzir-red)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                {isDeleting ? 'Deleting…' : 'Yes, delete everything'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
