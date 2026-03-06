import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { Sidebar } from './Sidebar';
import { useUserStore } from '../../stores/useUserStore';
import { apiClient } from '../../lib/axios';

export function Root() {
  const { isAuthenticated, role, pmsConnected, setAuthFromApi } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasApi = !!import.meta.env.VITE_API_BASE_URL;
    if (hasApi && isAuthenticated) {
      apiClient
        .get<{ id: string; email: string; role: string; hotelId: string }>('/auth/me')
        .then(({ data }) => setAuthFromApi(data))
        .catch(() => {});
    }
  }, [isAuthenticated, setAuthFromApi]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (!pmsConnected && location.pathname !== '/integrations') {
      navigate('/integrations', { replace: true });
      return;
    }

    if (pmsConnected && role === 'staff' && location.pathname === '/dashboard') {
      navigate('/staff', { replace: true });
      return;
    }
  }, [isAuthenticated, role, pmsConnected, location.pathname, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: '#0f172a', fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Outlet />
      </div>
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
    </div>
  );
}
