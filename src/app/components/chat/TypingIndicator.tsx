export function TypingIndicator() {
  return (
    <div className="flex justify-start px-4 py-2">
      <div
        className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{ backgroundColor: '#1e293b' }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: '#64748b',
              animation: 'bounce 1.2s infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
          }
        `}</style>
      </div>
    </div>
  );
}
