import { QAExtractionResult } from '@/lib/email/types';
import { ExportOptions } from '../types';

export function generateReact(data: QAExtractionResult[], options: ExportOptions): string {
  // Group QAs by category
  const groupedQAs = data.reduce((acc, qa) => {
    const category = qa.metadata.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(qa);
    return acc;
  }, {} as Record<string, QAExtractionResult[]>);

  return `import { useState } from 'react';

interface QAItem {
  question: string;
  answer: string;
  tags: string[];
  confidence: number;
}

function QAAccordionItem({ item }: { item: QAItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg mb-4">
      <button
        className="w-full px-4 py-2 text-left font-semibold flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1">{item.question}</span>
        <span className="text-sm text-gray-500 mr-2">
          {(item.confidence * 100).toFixed(0)}%
        </span>
        <svg
          className={\`w-4 h-4 transform \${isOpen ? 'rotate-180' : ''}\`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-2 border-t">
          <p>{item.answer}</p>
          {item.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {item.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function QAList() {
  const data = ${JSON.stringify(groupedQAs, null, 2)};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Q&A Knowledge Base</h1>
      
      {Object.entries(data).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <div className="space-y-4">
            {items.map((item, i) => (
              <QAAccordionItem
                key={i}
                item={{
                  question: item.question,
                  answer: item.answer,
                  tags: item.tags,
                  confidence: item.confidence
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}`;
}

export const getReactFilename = () => 'QAList.tsx';
export const getReactMimeType = () => 'text/plain'; 