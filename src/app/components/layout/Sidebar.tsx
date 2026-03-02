import { NavLink, useNavigate } from 'react-router';
import {
  BarChart3,
  BrainCircuit,
  Bell,
  Plug,
  Home,
  LogOut,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { useUserStore, type Role } from '../../stores/useUserStore';
import { cn } from '../../lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <BarChart3 size={16} />,
    roles: ['owner', 'manager'],
  },
  {
    label: 'AI Intelligence',
    path: '/chat',
    icon: <BrainCircuit size={16} />,
    roles: ['owner', 'manager'],
  },
  {
    label: 'Alerts',
    path: '/alerts',
    icon: <Bell size={16} />,
    roles: ['owner', 'manager'],
  },
  {
    label: 'Operations',
    path: '/staff',
    icon: <Home size={16} />,
    roles: ['staff'],
  },
  {
    label: 'Integrations',
    path: '/integrations',
    icon: <Plug size={16} />,
    roles: ['owner'],
  },
];

export function Sidebar() {
  const { role, email, hotelName, logout } = useUserStore();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r"
      style={{ backgroundColor: '#0a1628', borderColor: '#1e293b' }}
    >
      {/* Hotel Brand */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#1e293b' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#7c3aed' }}
          >
            <Building2 size={14} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm truncate" style={{ color: '#f1f5f9', fontWeight: 600 }}>
              {hotelName}
            </p>
            <p className="text-xs" style={{ color: '#64748b' }}>
              Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p
          className="px-2 pb-2 text-xs uppercase tracking-widest"
          style={{ color: '#475569', fontWeight: 500 }}
        >
          Navigation
        </p>
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group',
                isActive ? 'text-white' : 'hover:text-slate-200'
              )
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#1e293b' : 'transparent',
              color: isActive ? '#e2e8f0' : '#94a3b8',
            })}
          >
            {({ isActive }) => (
              <>
                <span
                  style={{ color: isActive ? '#a78bfa' : '#64748b' }}
                  className="transition-colors"
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={12} style={{ color: '#64748b' }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t" style={{ borderColor: '#1e293b' }}>
        <div className="px-2 py-1 mb-3 rounded-lg" style={{ backgroundColor: '#1e293b' }}>
          <p className="text-xs truncate" style={{ color: '#94a3b8' }}>
            {email}
          </p>
          <p className="text-xs capitalize" style={{ color: '#64748b' }}>
            {role}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-slate-800"
          style={{ color: '#64748b' }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
