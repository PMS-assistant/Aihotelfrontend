import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore } from '../../stores/useUserStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';

interface CredentialModalProps {
  open: boolean;
  onClose: () => void;
}

export function CredentialModal({ open, onClose }: CredentialModalProps) {
  const { setPmsConnected } = useUserStore();
  const [siteId, setSiteId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!siteId.trim() || !username.trim() || !password.trim()) {
      toast.error('All fields are required');
      return;
    }
    setIsConnecting(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 2200));
      setPmsConnected(true, new Date().toISOString());
      toast.success('Guestline connected successfully');
      onClose();
    } catch {
      toast.error('Connection failed. Check your credentials and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const inputStyle: CSSProperties = {
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

  const labelStyle: CSSProperties = {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: 500,
    display: 'block',
    marginBottom: '0.375rem',
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="border sm:max-w-md"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155', fontFamily: "'Inter', sans-serif" }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#f1f5f9' }}>Connect Guestline (Rezlynx)</DialogTitle>
          <DialogDescription style={{ color: '#64748b' }}>
            Enter your Guestline credentials to establish the data connection. Credentials are
            transmitted securely and never stored in plain text.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label style={labelStyle}>Site ID</label>
            <input
              type="text"
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              placeholder="e.g. GMRD001"
              style={inputStyle}
              disabled={isConnecting}
            />
          </div>

          <div>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Guestline username"
              style={inputStyle}
              disabled={isConnecting}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Guestline password"
                style={{ ...inputStyle, paddingRight: '2.5rem' }}
                disabled={isConnecting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#475569' }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all disabled:opacity-60"
              style={{ backgroundColor: '#7c3aed', color: '#fff', fontWeight: 500 }}
            >
              {isConnecting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Connecting…
                </>
              ) : (
                'Connect Guestline'
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isConnecting}
              className="px-4 py-2.5 rounded-lg text-sm transition-colors hover:bg-slate-700"
              style={{ backgroundColor: '#334155', color: '#94a3b8' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
