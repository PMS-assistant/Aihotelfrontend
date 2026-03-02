import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { useChatStore, type Conversation } from '../../stores/useChatStore';
import { useUserStore } from '../../stores/useUserStore';
import { formatRelativeTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function ConversationList() {
  const { conversations, activeConversationId, createConversation, setActiveConversation, deleteConversation } =
    useChatStore();
  const { hotelId } = useUserStore();

  const handleNew = () => {
    createConversation(hotelId);
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 border-r h-full"
      style={{ backgroundColor: '#0a1628', borderColor: '#1e293b' }}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b flex items-center justify-between" style={{ borderColor: '#1e293b' }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: '#475569', fontWeight: 500 }}>
          Conversations
        </p>
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors hover:bg-slate-700"
          style={{ backgroundColor: '#1e293b', color: '#94a3b8' }}
        >
          <Plus size={12} />
          New
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 && (
          <div className="px-4 py-8 text-center">
            <MessageSquare size={20} className="mx-auto mb-2" style={{ color: '#334155' }} />
            <p className="text-xs" style={{ color: '#475569' }}>
              No conversations yet
            </p>
          </div>
        )}
        {conversations.map((conv: Conversation) => (
          <div
            key={conv.id}
            onClick={() => setActiveConversation(conv.id)}
            className={cn(
              'group flex items-start gap-2 px-4 py-3 cursor-pointer transition-colors',
              activeConversationId === conv.id ? 'bg-slate-800' : 'hover:bg-slate-800/50'
            )}
          >
            <MessageSquare
              size={14}
              className="mt-0.5 shrink-0"
              style={{ color: activeConversationId === conv.id ? '#a78bfa' : '#475569' }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-xs truncate"
                style={{
                  color: activeConversationId === conv.id ? '#e2e8f0' : '#94a3b8',
                  fontWeight: activeConversationId === conv.id ? 500 : 400,
                }}
              >
                {conv.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                {formatRelativeTime(conv.createdAt)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteConversation(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity hover:text-red-400"
              style={{ color: '#475569' }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
