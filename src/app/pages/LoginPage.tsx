import { toast, Toaster } from 'sonner';
import { useUserStore, type Role } from '../stores/useUserStore';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Building2, Loader2 } from 'lucide-react';

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: 'owner', label: 'Owner', description: 'Full platform access' },
  { value: 'manager', label: 'Manager', description: 'Revenue & operations' },
  { value: 'staff', label: 'Staff', description: 'Operational view only' },
];

export default function LoginPage() {
  const { login } = useUserStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('owner');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    setIsLoading(true);
    await new Promise<void>((r) => setTimeout(r, 1000));
    login(email.trim(), role);
    setIsLoading(false);

    // Read fresh state after login
    const { pmsConnected } = useUserStore.getState();
    if (!pmsConnected) {
      navigate('/integrations', { replace: true });
    } else {
      navigate(role === 'staff' ? '/staff' : '/dashboard', { replace: true });
    }
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '0.5rem',
    color: '#f1f5f9',
    padding: '0.625rem 0.875rem',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0f172a', fontFamily: "'Inter', sans-serif" }}
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#f1f5f9',
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />

      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#7c3aed' }}
          >
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="text-base" style={{ color: '#f1f5f9', fontWeight: 600 }}>
              Meridian Intelligence
            </p>
            <p className="text-xs" style={{ color: '#64748b' }}>
              AI Hotel Intelligence Platform
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
        >
          <h1 className="text-base mb-1" style={{ color: '#f1f5f9', fontWeight: 600 }}>
            Sign in
          </h1>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>
            Access your hotel intelligence dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#94a3b8', fontWeight: 500 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hotel.com"
                style={inputStyle}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#94a3b8', fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={inputStyle}
                autoComplete="current-password"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs mb-2" style={{ color: '#94a3b8', fontWeight: 500 }}>
                Account role
              </label>
              <div className="space-y-2">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                    style={{
                      backgroundColor: role === r.value ? 'rgba(124,58,237,0.12)' : '#0f172a',
                      border: `1px solid ${role === r.value ? '#7c3aed' : '#334155'}`,
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={() => setRole(r.value)}
                      className="hidden"
                    />
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: role === r.value ? '#7c3aed' : '#475569' }}
                    >
                      {role === r.value && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7c3aed' }} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#e2e8f0', fontWeight: 500 }}>
                        {r.label}
                      </p>
                      <p className="text-xs" style={{ color: '#64748b' }}>
                        {r.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm transition-all mt-2 disabled:opacity-60"
              style={{ backgroundColor: '#7c3aed', color: '#fff', fontWeight: 500 }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: '#334155' }}>
          Demo platform — no real credentials required.
        </p>
      </div>
    </div>
  );
}