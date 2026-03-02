import { useEffect, useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { Skeleton } from '../components/ui/skeleton';
import { mockRoomStatus, mockArrivals, mockDepartures } from '../lib/mockData';
import { Clock, ArrowDownToLine, ArrowUpFromLine, BedDouble } from 'lucide-react';

type RoomStatus = 'occupied' | 'available' | 'checkout' | 'maintenance';

const statusConfig: Record<RoomStatus, { label: string; color: string; bg: string }> = {
  occupied: { label: 'Occupied', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  available: { label: 'Available', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  checkout: { label: 'Checkout', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  maintenance: { label: 'Maint.', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

export default function StaffPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const rooms = mockRoomStatus;
  const arrivals = mockArrivals;
  const departures = mockDepartures;

  const totalOccupied = rooms.filter((r) => r.status === 'occupied').length;
  const totalAvailable = rooms.filter((r) => r.status === 'available').length;
  const totalCheckout = rooms.filter((r) => r.status === 'checkout').length;
  const totalMaintenance = rooms.filter((r) => r.status === 'maintenance').length;

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <TopBar title="Operations" />

      <div className="px-6 py-6 space-y-8">
        {/* Status Summary */}
        <section>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#475569', fontWeight: 500 }}>
            Room Status Overview
          </p>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl p-5 border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                  <Skeleton className="h-3 w-20 mb-3" style={{ backgroundColor: '#334155' }} />
                  <Skeleton className="h-7 w-12" style={{ backgroundColor: '#334155' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Occupied', value: totalOccupied, ...statusConfig.occupied },
                { label: 'Available', value: totalAvailable, ...statusConfig.available },
                { label: 'Checkout Today', value: totalCheckout, ...statusConfig.checkout },
                { label: 'Maintenance', value: totalMaintenance, ...statusConfig.maintenance },
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-5 border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#64748b', fontWeight: 500 }}>
                    {item.label}
                  </p>
                  <p className="text-2xl" style={{ color: item.color, fontWeight: 600 }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Congestion Alert */}
        {!isLoading && (
          <div
            className="rounded-xl p-4 border-l-[3px] border"
            style={{
              borderLeftColor: '#f59e0b',
              borderTopColor: 'rgba(51,65,85,0.5)',
              borderRightColor: 'rgba(51,65,85,0.5)',
              borderBottomColor: 'rgba(51,65,85,0.5)',
              backgroundColor: 'rgba(245,158,11,0.06)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} style={{ color: '#f59e0b' }} />
              <p className="text-sm" style={{ color: '#fcd34d', fontWeight: 500 }}>
                Check-in congestion expected 14:00–16:00
              </p>
            </div>
            <p className="text-xs ml-5" style={{ color: '#94a3b8' }}>
              23 arrivals confirmed in a 2-hour window. Consider pre-arrival messaging to stagger check-ins.
            </p>
          </div>
        )}

        {/* Arrivals & Departures */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Arrivals */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ArrowDownToLine size={14} style={{ color: '#34d399' }} />
                <p className="text-sm" style={{ color: '#f1f5f9', fontWeight: 600 }}>
                  Today's Arrivals
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(52,211,153,0.1)', color: '#34d399', fontWeight: 500 }}
                >
                  {arrivals.length}
                </span>
              </div>
              <div className="space-y-2">
                {isLoading
                  ? [0, 1, 2].map((i) => (
                      <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                        <Skeleton className="h-3 w-32 mb-2" style={{ backgroundColor: '#334155' }} />
                        <Skeleton className="h-3 w-20" style={{ backgroundColor: '#334155' }} />
                      </div>
                    ))
                  : arrivals.map((a, i) => (
                      <div key={i} className="rounded-xl p-4 border flex items-center justify-between" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                        <div>
                          <p className="text-sm" style={{ color: '#e2e8f0', fontWeight: 500 }}>
                            {a.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                            Room {a.room} · {a.nights} night{a.nights !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {a.type === 'VIP' && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: 'rgba(167,139,250,0.15)', color: '#a78bfa', fontWeight: 500 }}
                            >
                              VIP
                            </span>
                          )}
                          <span className="text-xs" style={{ color: '#94a3b8' }}>
                            {a.time}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Departures */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ArrowUpFromLine size={14} style={{ color: '#f59e0b' }} />
                <p className="text-sm" style={{ color: '#f1f5f9', fontWeight: 600 }}>
                  Today's Departures
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 500 }}
                >
                  {departures.length}
                </span>
              </div>
              <div className="space-y-2">
                {isLoading
                  ? [0, 1, 2].map((i) => (
                      <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                        <Skeleton className="h-3 w-32 mb-2" style={{ backgroundColor: '#334155' }} />
                        <Skeleton className="h-3 w-20" style={{ backgroundColor: '#334155' }} />
                      </div>
                    ))
                  : departures.map((d, i) => (
                      <div key={i} className="rounded-xl p-4 border flex items-center justify-between" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                        <div>
                          <p className="text-sm" style={{ color: '#e2e8f0', fontWeight: 500 }}>
                            {d.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                            Room {d.room} · {d.nights} night{d.nights !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className="text-xs" style={{ color: '#94a3b8' }}>
                          {d.time}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </section>

        {/* Room Status Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BedDouble size={14} style={{ color: '#64748b' }} />
            <p className="text-sm" style={{ color: '#f1f5f9', fontWeight: 600 }}>
              Room Status
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {isLoading
              ? Array.from({ length: 15 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" style={{ backgroundColor: '#1e293b' }} />
                ))
              : rooms.map((room) => {
                  const s = statusConfig[room.status];
                  return (
                    <div
                      key={room.room}
                      className="rounded-xl p-3 border text-center"
                      style={{ backgroundColor: s.bg, borderColor: `${s.color}30` }}
                    >
                      <p className="text-sm mb-0.5" style={{ color: s.color, fontWeight: 600 }}>
                        {room.room}
                      </p>
                      <p className="text-xs" style={{ color: s.color, opacity: 0.7 }}>
                        {s.label}
                      </p>
                    </div>
                  );
                })}
          </div>
        </section>
      </div>
    </div>
  );
}
