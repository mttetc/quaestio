import { QAExtractionResult } from '@/lib/core/email/types';

interface QAExportConfig {
  title: string;
  description?: string;
  qas: QAExtractionResult[];
}

export function generateReactCode(config: QAExportConfig): string {
  return `
import { useState } from 'react';

interface QAItem {
  question: string;
  answer: string;
  tags: string[];
  importance: 'high' | 'medium' | 'low';
  confidence: number;
}

function QAAccordionItem({ item }: { item: QAItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <div>
          <span className="font-medium">{item.question}</span>
          <div className="mt-1 flex gap-2">
            {item.tags.map(tag => (
              <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={\`px-2 py-0.5 text-xs rounded-full \${
            item.importance === 'high' 
              ? 'bg-red-100 text-red-700'
              : item.importance === 'medium'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }\`}>
            {item.importance}
          </span>
          <span className="text-gray-400">{item.confidence}%</span>
          <span className={isOpen ? 'rotate-180 transform' : ''}>▼</span>
        </div>
      </button>
      {isOpen && (
        <div className="pb-4">
          <p className="text-gray-600">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export function QAList() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h2 className="mb-8 text-center text-3xl font-bold">
        ${config.title}
      </h2>
      ${config.description ? `<p className="mb-8 text-center text-gray-600">${config.description}</p>` : ''}
      <div className="space-y-4">
        ${config.qas.map(qa => `
          <QAAccordionItem
            key="${qa.id}"
            item={{
              question: ${JSON.stringify(qa.question)},
              answer: ${JSON.stringify(qa.answer)},
              tags: ${JSON.stringify(qa.tags)},
              importance: ${JSON.stringify(qa.importance)},
              confidence: ${qa.confidence}
            }}
          />
        `).join('')}
      </div>
    </div>
  );
}
`;
} 