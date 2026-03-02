import { useState, useEffect, useCallback } from 'react';
import { mockKPIs, mockAlerts, mockForecast, mockPickup, type KPIData, type AlertData, type ForecastPoint, type PickupPoint } from '../lib/mockData';

interface DashboardData {
  kpis: KPIData;
  alerts: AlertData[];
  forecast: ForecastPoint[];
  pickup: PickupPoint[];
}

interface UseDashboardReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  refetch: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));
      setData({
        kpis: mockKPIs,
        alerts: mockAlerts,
        forecast: mockForecast,
        pickup: mockPickup,
      });
      setLastRefresh(new Date());
    } catch {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, lastRefresh, refetch: fetchData };
}
