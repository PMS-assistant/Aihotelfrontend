import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'owner' | 'manager' | 'staff';
export type DataHealth = 'healthy' | 'delayed' | 'error';
export type SyncHealth = 'healthy' | 'delayed' | 'error';

export interface OtaChannel {
  id: string;
  name: string;
  connected: boolean;
  lastSyncTime: string | null;
  roomsThisMonth: number | null;
}

const DEFAULT_OTA_CHANNELS: OtaChannel[] = [
  { id: 'booking_com',    name: 'Booking.com',      connected: false, lastSyncTime: null, roomsThisMonth: null },
  { id: 'expedia',        name: 'Expedia',           connected: false, lastSyncTime: null, roomsThisMonth: null },
  { id: 'airbnb',         name: 'Airbnb',            connected: false, lastSyncTime: null, roomsThisMonth: null },
  { id: 'hotels_com',     name: 'Hotels.com',        connected: false, lastSyncTime: null, roomsThisMonth: null },
  { id: 'agoda',          name: 'Agoda',             connected: false, lastSyncTime: null, roomsThisMonth: null },
  { id: 'google_hotels',  name: 'Google Hotel Ads',  connected: false, lastSyncTime: null, roomsThisMonth: null },
];

interface UserState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: Role;
  hotelName: string;
  hotelId: string;

  // PMS — Guestline / Rezlynx
  pmsConnected: boolean;
  pmsLastSyncTime: string | null;
  pmsDataHealth: DataHealth;

  // Accounting — Xero
  xeroConnected: boolean;
  xeroOrganisationName: string | null;
  xeroLastSyncTime: string | null;
  xeroSyncHealth: SyncHealth;

  // OTA Channels
  connectedOtas: OtaChannel[];

  // Actions
  login: (email: string, role: Role) => void;
  logout: () => void;
  setPmsConnected: (connected: boolean, syncTime?: string) => void;
  setPmsDataHealth: (health: DataHealth) => void;
  setXeroConnected: (orgName: string) => void;
  disconnectXero: () => void;
  connectOta: (id: string) => void;
  disconnectOta: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      email: null,
      role: 'owner',
      hotelName: 'The Grand Meridian',
      hotelId: 'hotel_001',

      pmsConnected: false,
      pmsLastSyncTime: null,
      pmsDataHealth: 'healthy',

      xeroConnected: false,
      xeroOrganisationName: null,
      xeroLastSyncTime: null,
      xeroSyncHealth: 'healthy',

      connectedOtas: DEFAULT_OTA_CHANNELS,

      login: (email, role) =>
        set({
          isAuthenticated: true,
          userId: `user_${Date.now()}`,
          email,
          role,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          userId: null,
          email: null,
          pmsConnected: false,
          pmsLastSyncTime: null,
          xeroConnected: false,
          xeroOrganisationName: null,
          xeroLastSyncTime: null,
          connectedOtas: DEFAULT_OTA_CHANNELS,
        }),

      setPmsConnected: (connected, syncTime) =>
        set({
          pmsConnected: connected,
          pmsLastSyncTime: connected ? (syncTime ?? new Date().toISOString()) : null,
        }),

      setPmsDataHealth: (health) => set({ pmsDataHealth: health }),

      setXeroConnected: (orgName) =>
        set({
          xeroConnected: true,
          xeroOrganisationName: orgName,
          xeroLastSyncTime: new Date().toISOString(),
          xeroSyncHealth: 'healthy',
        }),

      disconnectXero: () =>
        set({
          xeroConnected: false,
          xeroOrganisationName: null,
          xeroLastSyncTime: null,
        }),

      connectOta: (id) =>
        set((state) => ({
          connectedOtas: state.connectedOtas.map((ota) =>
            ota.id === id
              ? {
                  ...ota,
                  connected: true,
                  lastSyncTime: new Date().toISOString(),
                  roomsThisMonth: Math.floor(Math.random() * 180) + 20,
                }
              : ota
          ),
        })),

      disconnectOta: (id) =>
        set((state) => ({
          connectedOtas: state.connectedOtas.map((ota) =>
            ota.id === id
              ? { ...ota, connected: false, lastSyncTime: null, roomsThisMonth: null }
              : ota
          ),
        })),
    }),
    { name: 'meridian-user-store-v2' }
  )
);
