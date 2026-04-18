import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TopBar } from '../components/layout/TopBar';
import { useOperations } from '../hooks/useOperations';
import {
  Clock, ArrowDownToLine, ArrowUpFromLine, BedDouble,
  ChevronDown, CheckCircle2, Wrench, LogOut, Circle,
} from 'lucide-react';

type RoomStatus = 'occupied' | 'available' | 'checkout' | 'maintenance';

const statusConfig: Record<RoomStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  occupied:    { label: 'Occupied',    color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.25)', icon: <Circle size={9} fill="currentColor" /> },
  available:   { label: 'Available',  color: '#10B981', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.25)',  icon: <CheckCircle2 size={9} /> },
  checkout:    { label: 'Checkout',   color: '#D97706', bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.25)',  icon: <LogOut size={9} /> },
  maintenance: { label: 'Maint.',     color: '#64748B', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.25)', icon: <Wrench size={9} /> },
};

const STATUS_OPTIONS: RoomStatus[] = ['available', 'occupied', 'checkout', 'maintenance'];

function RoomCard({
  room,
  onStatusChange,
}: {
  room: { room: string; status: RoomStatus; guestName?: string };
  onStatusChange: (roomNumber: string, status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const s = statusConfig[room.status];

  return (
    <div
      className="rounded-xl p-3 border text-center relative cursor-pointer select-none transition-all duration-200 hover:shadow-sm"
      style={{ backgroundColor: s.bg, borderColor: s.border }}
      onClick={() => setOpen((v) => !v)}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; setOpen(false); }}
    >
      <p className="text-sm font-bold mb-1" style={{ color: s.color }}>
        {room.room}
      </p>
      <div className="flex items-center justify-center gap-0.5">
        <span style={{ color: s.color }}>{s.icon}</span>
        <p className="text-xs ml-1" style={{ color: s.color, opacity: 0.85 }}>
          {s.label}
        </p>
        <ChevronDown size={9} style={{ color: s.color, opacity: 0.5, marginLeft: 1 }} />
      </div>

      {open && (
        <div
          className="absolute z-20 top-full left-1/2 -translate-x-1/2 mt-1.5 rounded-xl border py-1.5 min-w-[130px] shadow-lg"
          style={{ backgroundColor: '#fff', borderColor: 'var(--vzir-border)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {STATUS_OPTIONS.map((opt) => {
            const sc = statusConfig[opt];
            return (
              <button
                key={opt}
                className="w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 transition-colors"
                style={{ color: sc.color }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sc.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                onClick={() => {
                  setOpen(false);
                  if (opt !== room.status) onStatusChange(room.room, opt);
                }}
              >
                <span>{sc.icon}</span>
                {sc.label}
                {opt === room.status && <span className="ml-auto">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, bg, border }: { label: string; value: number; color: string; bg: string; border: string }) {
  return (
    <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--vzir-text-3)' }}>
          {label}
        </p>
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

export default function StaffPage() {
  const { data, isLoading, error, refetch, updateRoomStatus } = useOperations();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const rooms = data?.rooms ?? [];
  const arrivals = data?.arrivals ?? [];
  const departures = data?.departures ?? [];

  const totalOccupied    = rooms.filter((r) => r.status === 'occupied').length;
  const totalAvailable   = rooms.filter((r) => r.status === 'available').length;
  const totalCheckout    = rooms.filter((r) => r.status === 'checkout').length;
  const totalMaintenance = rooms.filter((r) => r.status === 'maintenance').length;

  const handleStatusChange = async (roomNumber: string, status: string) => {
    try {
      await updateRoomStatus(roomNumber, status);
      toast.success(`Room ${roomNumber} → ${statusConfig[status as RoomStatus]?.label ?? status}`);
    } catch {
      toast.error(`Failed to update room ${roomNumber}`);
    }
  };

  const sectionLabel = (text: string) => (
    <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: 'var(--vzir-text-3)' }}>
      {text}
    </p>
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--vzir-bg)' }}>
      <TopBar title="Operations" onRefresh={refetch} isRefreshing={isLoading} />

      <div className="px-6 py-6 space-y-8 pb-12">

        {/* Room Status Summary */}
        <section>
          {sectionLabel('Room Status Overview')}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[0,1,2,3].map((i) => (
                <div key={i} className="rounded-2xl p-5 border animate-pulse" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
                  <div className="h-3 w-16 rounded mb-3" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
                  <div className="h-8 w-10 rounded" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Occupied"      value={totalOccupied}    color="#7C3AED" bg="rgba(124,58,237,0.08)"  border="rgba(124,58,237,0.25)" />
              <StatCard label="Available"     value={totalAvailable}   color="#10B981" bg="rgba(16,185,129,0.08)"   border="rgba(16,185,129,0.25)"  />
              <StatCard label="Checkout Today" value={totalCheckout}   color="#D97706" bg="rgba(217,119,6,0.08)"   border="rgba(217,119,6,0.25)"  />
              <StatCard label="Maintenance"   value={totalMaintenance} color="#64748B" bg="rgba(100,116,139,0.08)" border="rgba(100,116,139,0.25)" />
            </div>
          )}
        </section>

        {/* Congestion Alert */}
        {!isLoading && arrivals.length > 5 && (
          <div
            className="rounded-2xl p-4 border-l-4 border flex items-start gap-3"
            style={{ borderLeftColor: '#D97706', borderTopColor: 'rgba(217,119,6,0.15)', borderRightColor: 'rgba(217,119,6,0.15)', borderBottomColor: 'rgba(217,119,6,0.15)', backgroundColor: 'rgba(217,119,6,0.05)' }}
          >
            <Clock size={15} className="mt-0.5 shrink-0" style={{ color: '#D97706' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#92400E' }}>
                Check-in congestion expected 14:00–16:00
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#B45309' }}>
                {arrivals.length} arrivals confirmed in a 2-hour window. Consider pre-arrival messaging to stagger check-ins.
              </p>
            </div>
          </div>
        )}

        {/* Arrivals & Departures */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Arrivals */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.10)' }}>
                  <ArrowDownToLine size={13} style={{ color: '#10B981' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>
                  Today's Arrivals
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(16,185,129,0.10)', color: '#10B981' }}>
                  {arrivals.length}
                </span>
              </div>
              <div className="space-y-2">
                {isLoading ? (
                  [0,1,2].map((i) => (
                    <div key={i} className="rounded-xl p-4 border animate-pulse" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
                      <div className="h-3 w-32 rounded mb-2" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
                      <div className="h-3 w-20 rounded" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
                    </div>
                  ))
                ) : arrivals.length === 0 ? (
                  <div className="rounded-xl p-6 border text-center" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
                    <p className="text-sm" style={{ color: 'var(--vzir-text-3)' }}>No arrivals today</p>
                  </div>
                ) : (
                  arrivals.map((a, i) => (
                    <div key={i} className="rounded-xl p-4 border flex items-center justify-between transition-all hover:shadow-sm" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>{a.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--vzir-text-2)' }}>
                          Room {a.room} · {a.nights} night{a.nights !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.type === 'VIP' && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(124,58,237,0.10)', color: '#7C3AED' }}>
                            VIP
                          </span>
                        )}
                        <span className="text-xs font-medium" style={{ color: 'var(--vzir-text-3)' }}>{a.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Departures */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(217,119,6,0.10)' }}>
                  <ArrowUpFromLine size={13} style={{ color: '#D97706' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>
                  Today's Departures
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(217,119,6,0.10)', color: '#D97706' }}>
                  {departures.length}
                </span>
              </div>
              <div className="space-y-2">
                {isLoading ? (
                  [0,1,2].map((i) => (
                    <div key={i} className="rounded-xl p-4 border animate-pulse" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
                      <div className="h-3 w-32 rounded mb-2" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
                      <div className="h-3 w-20 rounded" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
                    </div>
                  ))
                ) : departures.length === 0 ? (
                  <div className="rounded-xl p-6 border text-center" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
                    <p className="text-sm" style={{ color: 'var(--vzir-text-3)' }}>No departures today</p>
                  </div>
                ) : (
                  departures.map((d, i) => (
                    <div key={i} className="rounded-xl p-4 border flex items-center justify-between transition-all hover:shadow-sm" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>{d.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--vzir-text-2)' }}>
                          Room {d.room} · {d.nights} night{d.nights !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--vzir-text-3)' }}>{d.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Room Status Grid */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,0.10)' }}>
              <BedDouble size={13} style={{ color: '#7C3AED' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>Room Status</p>
            <p className="text-xs" style={{ color: 'var(--vzir-text-3)' }}>Click a room to update status</p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4">
            {STATUS_OPTIONS.map((opt) => {
              const sc = statusConfig[opt];
              return (
                <div key={opt} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sc.color }} />
                  <span className="text-xs" style={{ color: 'var(--vzir-text-2)' }}>{sc.label}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
            {isLoading
              ? Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--vzir-surface-2)' }} />
                ))
              : rooms.map((room) => (
                  <RoomCard
                    key={room.room}
                    room={room as { room: string; status: RoomStatus; guestName?: string }}
                    onStatusChange={handleStatusChange}
                  />
                ))}
          </div>
        </section>
      </div>
    </div>
  );
}
