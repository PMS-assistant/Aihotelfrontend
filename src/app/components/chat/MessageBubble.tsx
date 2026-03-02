import { formatTime } from '../../lib/utils';
import type { Message } from '../../stores/useChatStore';

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;
  let tableHeaderParsed = false;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-2 space-y-0.5 ml-1">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const [header, , ...body] = tableRows;
      elements.push(
        <div key={`tbl-${elements.length}`} className="my-3 overflow-x-auto">
          <table className="text-xs w-full border-collapse">
            <thead>
              <tr>
                {header?.map((cell, ci) => (
                  <th
                    key={ci}
                    className="text-left py-1.5 px-2 border-b"
                    style={{ color: '#94a3b8', borderColor: '#334155', fontWeight: 500 }}
                  >
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="py-1.5 px-2 border-b"
                      style={{ color: '#cbd5e1', borderColor: '#1e3a5f' }}
                    >
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
      tableHeaderParsed = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.startsWith('|')) {
      flushList();
      inTable = true;
      const cells = line.split('|').filter((_, ci) => ci > 0 && ci < line.split('|').length - 1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Separator line (---|---|...)
    if (/^[\s|:-]+$/.test(line) && line.includes('-')) continue;

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="mt-4 mb-1 text-sm" style={{ color: '#e2e8f0', fontWeight: 600 }}>
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="mt-4 mb-1 text-sm" style={{ color: '#f1f5f9', fontWeight: 600 }}>
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
      flushList();
      elements.push(
        <p key={i} className="mt-3 mb-1 text-sm" style={{ color: '#f1f5f9', fontWeight: 600 }}>
          {line.slice(2, -2)}
        </p>
      );
      continue;
    }

    // Bullet points
    if (line.startsWith('- ')) {
      listItems.push(
        <li key={i} className="flex gap-2 text-sm" style={{ color: '#cbd5e1' }}>
          <span style={{ color: '#7c3aed', marginTop: '2px' }}>·</span>
          <span>{renderInline(line.slice(2))}</span>
        </li>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\.\s/)?.[1];
      listItems.push(
        <li key={i} className="flex gap-2 text-sm" style={{ color: '#cbd5e1' }}>
          <span style={{ color: '#7c3aed', fontWeight: 500, minWidth: '1rem' }}>{num}.</span>
          <span>{renderInline(line.replace(/^\d+\.\s/, ''))}</span>
        </li>
      );
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      flushList();
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={i} className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  flushTable();

  return elements;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: '#f1f5f9', fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-1.5">
        <div className="max-w-[75%]">
          <div
            className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm"
            style={{ backgroundColor: '#312e81', color: '#e0e7ff' }}
          >
            {message.content}
          </div>
          <p className="text-right mt-1 text-xs" style={{ color: '#475569' }}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-4 py-1.5">
      <div className="max-w-[80%]">
        <div
          className="flex items-center gap-2 mb-2"
        >
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-xs"
            style={{ backgroundColor: '#7c3aed', color: '#fff', fontWeight: 700 }}
          >
            M
          </div>
          <span className="text-xs" style={{ color: '#64748b', fontWeight: 500 }}>
            Meridian AI
          </span>
        </div>
        <div
          className="px-4 py-3 rounded-2xl rounded-tl-sm"
          style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
        >
          <div className="space-y-1">{renderMarkdown(message.content)}</div>
        </div>
        <p className="mt-1 text-xs" style={{ color: '#475569' }}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
