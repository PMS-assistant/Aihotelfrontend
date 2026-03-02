import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Shield,
  Plug,
  BookOpen,
  Globe,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Unplug,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore, type DataHealth, type SyncHealth, type OtaChannel } from '../stores/useUserStore';
import { CredentialModal } from '../components/connect/CredentialModal';
import { TopBar } from '../components/layout/TopBar';
import { formatDateTime } from '../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type XeroOAuthPhase = 'idle' | 'redirecting' | 'authorising' | 'syncing';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: 'rgba(124,58,237,0.12)' }}
      >
        <span style={{ color: '#a78bfa' }}>{icon}</span>
      </div>
      <div>
        <h2 className="text-sm" style={{ color: '#f1f5f9', fontWeight: 600 }}>
          {title}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  connected,
  health,
  label,
}: {
  connected: boolean;
  health?: DataHealth | SyncHealth;
  label?: string;
}) {
  const healthColours: Record<DataHealth | SyncHealth, { color: string; bg: string }> = {
    healthy:  { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    delayed:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    error:    { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  };

  if (!connected) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
        style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 500 }}
      >
        <XCircle size={11} />
        Not Connected
      </span>
    );
  }

  const hc = health ? healthColours[health] : healthColours.healthy;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
      style={{ backgroundColor: hc.bg, color: hc.color, fontWeight: 500 }}
    >
      <CheckCircle2 size={11} />
      {label ?? 'Connected'}
    </span>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: '#475569' }}>{icon}</span>
      <span className="text-xs" style={{ color: '#64748b' }}>
        {label}:
      </span>
      <span className="text-xs" style={{ color: '#94a3b8', fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}

// ─── PMS Section ──────────────────────────────────────────────────────────────

function PmsSection() {
  const { pmsConnected, pmsLastSyncTime, pmsDataHealth, role } = useUserStore();
  const [modalOpen, setModalOpen] = useState(false);

  const healthLabel: Record<DataHealth, string> = {
    healthy: 'Data Healthy',
    delayed: 'Data Delayed',
    error:   'Data Error',
  };

  return (
    <div>
      <SectionHeader
        icon={<Plug size={16} />}
        title="PMS — Guestline (Rezlynx)"
        description="Primary property management system. Required for all dashboard data and AI insights."
      />

      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <StatusBadge
            connected={pmsConnected}
            health={pmsConnected ? pmsDataHealth : undefined}
            label={pmsConnected ? healthLabel[pmsDataHealth] : undefined}
          />
          {pmsConnected && (
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
              Rezlynx API v3
            </span>
          )}
        </div>

        {/* Meta */}
        {pmsConnected ? (
          <div className="space-y-2 mb-5">
            <MetaRow
              icon={<Clock size={12} />}
              label="Last sync"
              value={pmsLastSyncTime ? formatDateTime(pmsLastSyncTime) : 'Never'}
            />
            <MetaRow
              icon={<RefreshCw size={12} />}
              label="Sync interval"
              value="Every 5 minutes"
            />
          </div>
        ) : (
          <p className="text-xs mb-5" style={{ color: '#64748b' }}>
            Connect your Guestline account to unlock occupancy, ADR, RevPAR and all AI-powered
            operational insights.
          </p>
        )}

        {/* Actions */}
        {role === 'owner' ? (
          <div className="flex items-center gap-2">
            {pmsConnected ? (
              <>
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs transition-colors hover:bg-slate-700"
                  style={{ backgroundColor: '#334155', color: '#94a3b8', fontWeight: 500 }}
                >
                  Reconfigure
                </button>
              </>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all"
                style={{ backgroundColor: '#7c3aed', color: '#fff', fontWeight: 500 }}
              >
                <Plug size={12} />
                Connect Guestline
              </button>
            )}
          </div>
        ) : (
          !pmsConnected && (
            <p className="text-xs" style={{ color: '#475569' }}>
              Integration setup requires Owner access.
            </p>
          )
        )}
      </div>

      <CredentialModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

// ─── Xero Section ─────────────────────────────────────────────────────────────

function XeroSection() {
  const { xeroConnected, xeroOrganisationName, xeroLastSyncTime, xeroSyncHealth, setXeroConnected, disconnectXero, role } = useUserStore();
  const [oauthPhase, setOauthPhase] = useState<XeroOAuthPhase>('idle');
  const [disconnecting, setDisconnecting] = useState(false);

  const syncHealthLabel: Record<SyncHealth, string> = {
    healthy: 'Sync Healthy',
    delayed: 'Sync Delayed',
    error:   'Sync Error',
  };

  const handleConnectXero = async () => {
    if (oauthPhase !== 'idle') return;

    setOauthPhase('redirecting');
    await new Promise<void>((r) => setTimeout(r, 1600));

    setOauthPhase('authorising');
    await new Promise<void>((r) => setTimeout(r, 1800));

    setOauthPhase('syncing');
    await new Promise<void>((r) => setTimeout(r, 1200));

    setXeroConnected('The Grand Meridian Ltd');
    setOauthPhase('idle');
    toast.success('Xero connected — organisation synced successfully');
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    await new Promise<void>((r) => setTimeout(r, 800));
    disconnectXero();
    setDisconnecting(false);
    toast.success('Xero disconnected');
  };

  const phaseLabel: Record<XeroOAuthPhase, string> = {
    idle:         '',
    redirecting:  'Opening Xero authorisation…',
    authorising:  'Authorising with Xero…',
    syncing:      'Syncing organisation data…',
  };

  return (
    <div>
      <SectionHeader
        icon={<BookOpen size={16} />}
        title="Accounting — Xero"
        description="Connect Xero to unlock financial comparison dashboards, budget vs actual revenue, and P&L summaries."
      />

      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <StatusBadge
            connected={xeroConnected}
            health={xeroConnected ? xeroSyncHealth : undefined}
            label={xeroConnected ? syncHealthLabel[xeroSyncHealth] : undefined}
          />
          {xeroConnected && xeroOrganisationName && (
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,176,122,0.12)', color: '#34d399' }}>
              {xeroOrganisationName}
            </span>
          )}
        </div>

        {/* Meta */}
        {xeroConnected ? (
          <div className="space-y-2 mb-5">
            {xeroOrganisationName && (
              <MetaRow
                icon={<BookOpen size={12} />}
                label="Organisation"
                value={xeroOrganisationName}
              />
            )}
            <MetaRow
              icon={<Clock size={12} />}
              label="Last sync"
              value={xeroLastSyncTime ? formatDateTime(xeroLastSyncTime) : 'Never'}
            />
            <MetaRow
              icon={<RefreshCw size={12} />}
              label="Sync scope"
              value="Revenue, Invoices, P&L"
            />
          </div>
        ) : (
          <p className="text-xs mb-5" style={{ color: '#64748b' }}>
            Financial comparison charts and budget analysis will be visible once Xero is connected.
            The dashboard remains fully functional without Xero.
          </p>
        )}

        {/* OAuth loading indicator */}
        {oauthPhase !== 'idle' && (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 mb-4 text-xs"
            style={{ backgroundColor: 'rgba(124,58,237,0.1)', color: '#a78bfa' }}
          >
            <Loader2 size={12} className="animate-spin shrink-0" />
            {phaseLabel[oauthPhase]}
          </div>
        )}

        {/* Actions */}
        {role === 'owner' ? (
          <div className="flex items-center gap-2">
            {xeroConnected ? (
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-colors hover:bg-slate-700 disabled:opacity-60"
                style={{ backgroundColor: '#334155', color: '#94a3b8', fontWeight: 500 }}
              >
                {disconnecting ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Unplug size={11} />
                )}
                Disconnect Xero
              </button>
            ) : (
              <button
                onClick={handleConnectXero}
                disabled={oauthPhase !== 'idle'}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all disabled:opacity-60"
                style={{ backgroundColor: '#00b07a', color: '#fff', fontWeight: 500 }}
              >
                {oauthPhase !== 'idle' ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <ExternalLink size={11} />
                )}
                Connect with Xero
              </button>
            )}
          </div>
        ) : (
          !xeroConnected && (
            <p className="text-xs" style={{ color: '#475569' }}>
              Xero connection requires Owner access.
            </p>
          )
        )}
      </div>
    </div>
  );
}

// ─── OTA Channel Card ─────────────────────────────────────────────────────────

const OTA_ACCENT_MAP: Record<string, { color: string; bg: string; initials: string }> = {
  booking_com:   { color: '#003580', bg: 'rgba(0,53,128,0.18)',    initials: 'BK' },
  expedia:       { color: '#FFD700', bg: 'rgba(255,215,0,0.15)',    initials: 'EX' },
  airbnb:        { color: '#FF5A5F', bg: 'rgba(255,90,95,0.15)',    initials: 'AB' },
  hotels_com:    { color: '#D70F64', bg: 'rgba(215,15,100,0.15)',   initials: 'HC' },
  agoda:         { color: '#E2173B', bg: 'rgba(226,23,59,0.15)',    initials: 'AG' },
  google_hotels: { color: '#4285F4', bg: 'rgba(66,133,244,0.15)',   initials: 'GH' },
};

function OtaCard({ channel, onConnect, onDisconnect, isOwner }: {
  channel: OtaChannel;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  isOwner: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const accent = OTA_ACCENT_MAP[channel.id] ?? { color: '#a78bfa', bg: 'rgba(124,58,237,0.15)', initials: '??' };

  const handleToggle = async () => {
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 1000));
    if (channel.connected) {
      onDisconnect(channel.id);
      toast.success(`${channel.name} disconnected`);
    } else {
      onConnect(channel.id);
      toast.success(`${channel.name} connected and syncing`);
    }
    setLoading(false);
  };

  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ backgroundColor: '#1e293b', borderColor: channel.connected ? 'rgba(34,197,94,0.2)' : '#334155' }}
    >
      {/* Logo + name */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs"
          style={{ backgroundColor: accent.bg, color: accent.color, fontWeight: 700 }}
        >
          {accent.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm truncate" style={{ color: '#e2e8f0', fontWeight: 500 }}>
            {channel.name}
          </p>
          {channel.connected ? (
            <span className="text-xs" style={{ color: '#22c55e' }}>
              Active
            </span>
          ) : (
            <span className="text-xs" style={{ color: '#475569' }}>
              Not connected
            </span>
          )}
        </div>
        <span style={{ color: channel.connected ? '#22c55e' : '#334155' }}>
          {channel.connected ? <Wifi size={14} /> : <WifiOff size={14} />}
        </span>
      </div>

      {/* Stats */}
      {channel.connected && (
        <div className="space-y-1.5">
          {channel.roomsThisMonth !== null && (
            <MetaRow
              icon={<CheckCircle2 size={11} />}
              label="Rooms this month"
              value={channel.roomsThisMonth.toString()}
            />
          )}
          {channel.lastSyncTime && (
            <MetaRow
              icon={<Clock size={11} />}
              label="Last sync"
              value={formatDateTime(channel.lastSyncTime)}
            />
          )}
        </div>
      )}

      {/* Action */}
      {isOwner && (
        <button
          onClick={handleToggle}
          disabled={loading}
          className="mt-auto flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs transition-all disabled:opacity-60"
          style={{
            backgroundColor: channel.connected ? '#334155' : 'rgba(124,58,237,0.2)',
            color: channel.connected ? '#94a3b8' : '#a78bfa',
            fontWeight: 500,
          }}
        >
          {loading ? (
            <Loader2 size={11} className="animate-spin" />
          ) : channel.connected ? (
            <>
              <Unplug size={11} /> Disconnect
            </>
          ) : (
            <>
              <Plug size={11} /> Connect
            </>
          )}
        </button>
      )}
    </div>
  );
}

function OtaSection() {
  const { connectedOtas, connectOta, disconnectOta, role } = useUserStore();
  const connectedCount = connectedOtas.filter((o) => o.connected).length;
  const isOwner = role === 'owner';

  return (
    <div>
      <SectionHeader
        icon={<Globe size={16} />}
        title="OTA Channels"
        description="Connect online travel agencies to consolidate booking data and channel performance analytics."
      />

      {connectedCount > 0 && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4 text-xs"
          style={{ backgroundColor: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.15)' }}
        >
          <CheckCircle2 size={12} />
          {connectedCount} of {connectedOtas.length} channels connected
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {connectedOtas.map((channel) => (
          <OtaCard
            key={channel.id}
            channel={channel}
            onConnect={connectOta}
            onDisconnect={disconnectOta}
            isOwner={isOwner}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const { pmsConnected } = useUserStore();

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <TopBar title="Integrations" />

      <div className="px-6 py-8 max-w-4xl mx-auto space-y-10">
        {/* PMS not connected warning banner */}
        {!pmsConnected && (
          <div
            className="flex items-start gap-3 rounded-xl border px-4 py-3"
            style={{
              backgroundColor: 'rgba(239,68,68,0.07)',
              borderColor: 'rgba(239,68,68,0.2)',
            }}
          >
            <AlertTriangle size={15} className="shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
            <p className="text-xs" style={{ color: '#fca5a5' }}>
              <span style={{ fontWeight: 600 }}>PMS connection required.</span> Connect Guestline
              below to unlock the dashboard, AI intelligence, and all operational insights.
            </p>
          </div>
        )}

        {/* Section 1 — PMS */}
        <section>
          <PmsSection />
        </section>

        <div style={{ borderColor: '#1e293b' }} className="border-t" />

        {/* Section 2 — Xero */}
        <section>
          <XeroSection />
        </section>

        <div style={{ borderColor: '#1e293b' }} className="border-t" />

        {/* Section 3 — OTA Channels */}
        <section>
          <OtaSection />
        </section>

        {/* Security footer */}
        <div
          className="rounded-xl p-4 border flex items-start gap-3"
          style={{
            backgroundColor: 'rgba(124,58,237,0.06)',
            borderColor: 'rgba(124,58,237,0.2)',
          }}
        >
          <Shield size={14} className="mt-0.5 shrink-0" style={{ color: '#a78bfa' }} />
          <div>
            <p className="text-xs mb-1" style={{ color: '#a78bfa', fontWeight: 500 }}>
              Read-only access only
            </p>
            <p className="text-xs" style={{ color: '#64748b' }}>
              Meridian Intelligence operates as a read-only intelligence layer. No data is written
              back to connected systems. All credentials and tokens are encrypted at rest and used
              solely for authenticated API access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}