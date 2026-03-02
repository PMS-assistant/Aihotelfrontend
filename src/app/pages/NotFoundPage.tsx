import { useNavigate } from 'react-router';
import { useUserStore } from '../stores/useUserStore';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { role } = useUserStore();

  const handleBack = () => {
    navigate(role === 'staff' ? '/staff' : '/dashboard');
  };

  return (
    <div
      className="flex flex-col items-center justify-center flex-1 px-6 py-20"
      style={{ backgroundColor: '#0f172a' }}
    >
      <p className="text-5xl mb-4" style={{ color: '#1e293b', fontWeight: 700 }}>
        404
      </p>
      <p className="text-base mb-2" style={{ color: '#f1f5f9', fontWeight: 600 }}>
        Page not found
      </p>
      <p className="text-sm mb-8 text-center" style={{ color: '#64748b', maxWidth: '320px' }}>
        The page you're looking for doesn't exist or you don't have access.
      </p>
      <button
        onClick={handleBack}
        className="px-6 py-2.5 rounded-lg text-sm transition-all"
        style={{ backgroundColor: '#7c3aed', color: '#fff', fontWeight: 500 }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
