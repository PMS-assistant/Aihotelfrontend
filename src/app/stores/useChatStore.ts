import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateAIResponse } from '../lib/aiResponses';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  hotelId: string;
  createdAt: string;
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isTyping: boolean;
  createConversation: (hotelId: string) => string;
  setActiveConversation: (id: string) => void;
  sendMessage: (content: string, hotelId: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  clearAll: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isTyping: false,

      createConversation: (hotelId) => {
        const id = `conv_${Date.now()}`;
        const newConv: Conversation = {
          id,
          title: 'New conversation',
          hotelId,
          createdAt: new Date().toISOString(),
          messages: [],
        };
        set((state) => ({
          conversations: [newConv, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      sendMessage: async (content, hotelId) => {
        const state = get();
        let convId = state.activeConversationId;

        if (!convId) {
          convId = get().createConversation(hotelId);
        }

        const userMessage: Message = {
          id: `msg_${Date.now()}`,
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };

        set((s) => ({
          conversations: s.conversations.map((conv) =>
            conv.id === convId
              ? {
                  ...conv,
                  title:
                    conv.messages.length === 0
                      ? content.slice(0, 48) + (content.length > 48 ? '…' : '')
                      : conv.title,
                  messages: [...conv.messages, userMessage],
                }
              : conv
          ),
          isTyping: true,
        }));

        const delay = 1400 + Math.random() * 1000;
        await new Promise((r) => setTimeout(r, delay));

        const aiContent = generateAIResponse(content);
        const assistantMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          content: aiContent,
          timestamp: new Date().toISOString(),
        };

        set((s) => ({
          conversations: s.conversations.map((conv) =>
            conv.id === convId
              ? { ...conv, messages: [...conv.messages, assistantMessage] }
              : conv
          ),
          isTyping: false,
        }));
      },

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        })),

      clearAll: () => set({ conversations: [], activeConversationId: null }),
    }),
    { name: 'meridian-chat-store' }
  )
);
