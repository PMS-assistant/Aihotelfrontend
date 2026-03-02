import { useState, useRef, type KeyboardEvent } from 'react';
import { Send, ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="px-4 py-4 border-t" style={{ borderColor: '#1e293b' }}>
      <div
        className="flex items-end gap-3 rounded-xl px-4 py-3 border"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask about revenue, demand, cancellations, forecast…"
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-sm placeholder:text-slate-600 leading-relaxed disabled:opacity-50"
          style={{ color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
          style={{
            backgroundColor: value.trim() && !disabled ? '#7c3aed' : '#334155',
          }}
        >
          <ArrowUp size={14} className="text-white" />
        </button>
      </div>
      <p className="mt-2 text-center text-xs" style={{ color: '#334155' }}>
        Meridian explains insights from Guestline data. Not a substitute for human judgement.
      </p>
    </div>
  );
}
