import { useNavigate } from 'react-router';
import { useUserStore } from '../stores/useUserStore';
import { useChatStore } from '../stores/useChatStore';
import {
  MessageSquare, BarChart3, Building2, Settings,
  ArrowRight, Sparkles, Clock, TrendingUp,
} from 'lucide-react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const QUICK_ACTIONS = [
  {
    icon: MessageSquare,
    label: 'Ask Vzir',
    desc: 'Chat with your AI assistant',
    path: '/chat',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.20)',
  },
  {
    icon: BarChart3,
    label: 'Dashboard',
    desc: 'KPIs, revenue & forecasts',
    path: '/dashboard',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.20)',
  },
  {
    icon: Building2,
    label: 'Operations',
    desc: 'Rooms, arrivals & departures',
    path: '/operations',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.20)',
  },
  {
    icon: Settings,
    label: 'Settings',
    desc: 'Account & integrations',
    path: '/settings',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.20)',
  },
];

const SUGGESTED_PROMPTS = [
  { icon: TrendingUp,    text: 'Show me this week\'s revenue breakdown',           color: '#7C3AED' },
  { icon: Building2,     text: 'Which rooms need cleaning right now?',              color: '#0EA5E9' },
  { icon: Clock,         text: 'Who are today\'s arrivals and departures?',         color: '#10B981' },
  { icon: Sparkles,      text: 'What should I focus on today?',                    color: '#F59E0B' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { hotelName, email } = useUserStore();
  const { createConversation, setActiveConversation } = useChatStore();

  const handlePrompt = (text: string) => {
    const id = createConversation(useUserStore.getState().hotelId);
    setActiveConversation(id);
    // Store prompt to pre-fill in chat
    sessionStorage.setItem('vzir-prefill', text);
    navigate('/chat');
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--vzir-bg)' }}>
      <div className="max-w-3xl mx-auto px-6 py-12 pb-16">

        {/* Greeting */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: 'var(--vzir-primary)', color: '#fff' }}
            >
              V
            </div>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--vzir-primary)' }}>
              Vzir
            </span>
          </div>
          <h1
            className="text-3xl font-light mt-3 mb-1"
            style={{ color: 'var(--vzir-text)', letterSpacing: '-0.02em' }}
          >
            {getGreeting()},
          </h1>
          <h2
            className="text-3xl font-semibold"
            style={{ color: 'var(--vzir-text)', letterSpacing: '-0.02em' }}
          >
            {hotelName || 'Your Hotel'}
          </h2>
          <p className="text-sm mt-2" style={{ color: 'var(--vzir-text-2)' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="rounded-2xl p-4 border text-left transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.border;
                  e.currentTarget.style.backgroundColor = action.bg;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--vzir-border)';
                  e.currentTarget.style.backgroundColor = 'var(--vzir-surface)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: action.bg, border: `1px solid ${action.border}` }}
                >
                  <Icon size={16} style={{ color: action.color }} />
                </div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--vzir-text)' }}>
                  {action.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--vzir-text-3)' }}>
                  {action.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Suggested prompts */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--vzir-border)' }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: 'var(--vzir-primary)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>
                Suggested questions
              </p>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--vzir-border)' }}>
            {SUGGESTED_PROMPTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <button
                  key={i}
                  onClick={() => handlePrompt(p.text)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all group"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--vzir-surface-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${p.color}12` }}
                  >
                    <Icon size={13} style={{ color: p.color }} />
                  </div>
                  <span className="text-sm flex-1" style={{ color: 'var(--vzir-text-2)' }}>
                    {p.text}
                  </span>
                  <ArrowRight
                    size={13}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--vzir-text-3)' }}
                  />
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
