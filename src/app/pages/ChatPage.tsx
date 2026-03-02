import { ConversationList } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { TopBar } from '../components/layout/TopBar';

export default function ChatPage() {
  return (
    <div
      className="flex flex-col"
      style={{ backgroundColor: '#0f172a', height: '100vh' }}
    >
      <TopBar title="AI Intelligence" />
      <div className="flex flex-1 min-h-0">
        <ConversationList />
        <div
          className="flex-1 flex flex-col min-h-0"
          style={{ backgroundColor: '#0f172a' }}
        >
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
