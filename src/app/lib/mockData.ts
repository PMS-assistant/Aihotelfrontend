export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface KPIData {
  occupancyToday: number;
  occupancyTrend: number;
  adrToday: number;
  adrTrend: number;
  revpar: number;
  revparTrend: number;
  roomsAvailable: number;
  totalRooms: number;
  cancellationRate: number;
  cancellationRateTrend: number;
}

export interface AlertData {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  category: string;
}

export interface ForecastPoint {
  date: string;
  occupancy: number;
  revpar: number;
  adr: number;
}

export interface PickupPoint {
  day: string;
  thisWeek: number;
  lastWeek: number;
}

export interface RoomStatusData {
  room: string;
  floor: number;
  status: 'occupied' | 'available' | 'checkout' | 'maintenance';
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
}

export const mockKPIs: KPIData = {
  occupancyToday: 71.3,
  occupancyTrend: -2.8,
  adrToday: 142.5,
  adrTrend: 4.2,
  revpar: 101.6,
  revparTrend: -1.4,
  roomsAvailable: 27,
  totalRooms: 94,
  cancellationRate: 8.2,
  cancellationRateTrend: 4.3,
};

export const mockAlerts: AlertData[] = [
  {
    id: 'alert_1',
    title: 'Cancellations running 2× baseline',
    description:
      'OTA cancellations elevated at 8.2% vs 3.9% baseline. 14 room nights lost this week representing ~£1,995 in unrealised revenue.',
    severity: 'warning',
    timestamp: '2026-02-27T08:15:00Z',
    category: 'Revenue',
  },
  {
    id: 'alert_2',
    title: 'Weekend demand unusually high',
    description:
      'Saturday tracking at 94% occupancy with 4 days remaining. Current BAR of £149 may be suppressed — yield review recommended.',
    severity: 'info',
    timestamp: '2026-02-27T07:30:00Z',
    category: 'Demand',
  },
  {
    id: 'alert_3',
    title: 'Check-in congestion expected 14:00–16:00',
    description:
      '23 arrivals confirmed in a 2-hour window today. Consider pre-arrival guest communications to stagger check-ins.',
    severity: 'warning',
    timestamp: '2026-02-27T06:00:00Z',
    category: 'Operations',
  },
  {
    id: 'alert_4',
    title: '3 VIP arrivals without pre-authorisation',
    description:
      'Rooms 204, 312, 418 require card pre-authorisation before arrival. Contact front desk to process before 12:00.',
    severity: 'critical',
    timestamp: '2026-02-27T09:00:00Z',
    category: 'Operations',
  },
];

export const mockForecast: ForecastPoint[] = [
  { date: 'Fri 28', occupancy: 68, revpar: 87, adr: 128 },
  { date: 'Sat 1 Mar', occupancy: 94, revpar: 149, adr: 158 },
  { date: 'Sun 2 Mar', occupancy: 89, revpar: 126, adr: 142 },
  { date: 'Mon 3', occupancy: 61, revpar: 68, adr: 112 },
  { date: 'Tue 4', occupancy: 58, revpar: 63, adr: 108 },
  { date: 'Wed 5', occupancy: 64, revpar: 76, adr: 118 },
  { date: 'Thu 6', occupancy: 71, revpar: 93, adr: 131 },
];

export const mockPickup: PickupPoint[] = [
  { day: 'Mon', thisWeek: 8, lastWeek: 5 },
  { day: 'Tue', thisWeek: 12, lastWeek: 9 },
  { day: 'Wed', thisWeek: 7, lastWeek: 6 },
  { day: 'Thu', thisWeek: 11, lastWeek: 8 },
  { day: 'Fri', thisWeek: 9, lastWeek: 11 },
  { day: 'Sat', thisWeek: 14, lastWeek: 10 },
  { day: 'Sun', thisWeek: 4, lastWeek: 7 },
];

export const mockRoomStatus: RoomStatusData[] = [
  { room: '101', floor: 1, status: 'occupied', guestName: 'J. Thompson', checkIn: '26 Feb', checkOut: '28 Feb', nights: 2 },
  { room: '102', floor: 1, status: 'available' },
  { room: '103', floor: 1, status: 'checkout', guestName: 'A. Patel', checkIn: '25 Feb', checkOut: '27 Feb', nights: 2 },
  { room: '104', floor: 1, status: 'occupied', guestName: 'S. Williams', checkIn: '27 Feb', checkOut: '1 Mar', nights: 2 },
  { room: '105', floor: 1, status: 'maintenance' },
  { room: '201', floor: 2, status: 'occupied', guestName: 'M. Chen', checkIn: '26 Feb', checkOut: '28 Feb', nights: 2 },
  { room: '202', floor: 2, status: 'available' },
  { room: '203', floor: 2, status: 'occupied', guestName: 'R. Sharma', checkIn: '27 Feb', checkOut: '2 Mar', nights: 3 },
  { room: '204', floor: 2, status: 'available' },
  { room: '205', floor: 2, status: 'occupied', guestName: 'L. Davies', checkIn: '25 Feb', checkOut: '27 Feb', nights: 2 },
  { room: '301', floor: 3, status: 'available' },
  { room: '302', floor: 3, status: 'occupied', guestName: 'P. Johnson', checkIn: '27 Feb', checkOut: '3 Mar', nights: 4 },
  { room: '303', floor: 3, status: 'checkout', guestName: 'K. Brown', checkIn: '24 Feb', checkOut: '27 Feb', nights: 3 },
  { room: '304', floor: 3, status: 'occupied', guestName: 'E. Wilson', checkIn: '26 Feb', checkOut: '1 Mar', nights: 3 },
  { room: '305', floor: 3, status: 'available' },
];

export const mockArrivals = [
  { name: 'H. Clarke', room: '204', time: '14:00', type: 'VIP', nights: 2 },
  { name: 'B. Roberts', room: '312', time: '14:30', type: 'Standard', nights: 1 },
  { name: 'F. Martinez', room: '418', time: '14:45', type: 'VIP', nights: 3 },
  { name: 'G. Taylor', room: '108', time: '15:00', type: 'Standard', nights: 2 },
  { name: 'N. Anderson', room: '220', time: '15:15', type: 'Corporate', nights: 1 },
  { name: 'C. Thomas', room: '335', time: '15:30', type: 'Standard', nights: 2 },
];

export const mockDepartures = [
  { name: 'A. Patel', room: '103', time: '10:00', nights: 2 },
  { name: 'L. Davies', room: '205', time: '11:00', nights: 2 },
  { name: 'K. Brown', room: '303', time: '11:30', nights: 3 },
  { name: 'T. Jackson', room: '417', time: '12:00', nights: 1 },
];
