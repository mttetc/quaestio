import { generateFAQCategoryKey, generateFAQItemKey } from '@/lib/utils/key-generation';
import { QAExtractionResult } from '@/lib/email/types';

interface ExportConfig {
  title: string;
  description?: string;
  qas: QAExtractionResult[];
}

export function generateReactComponent(config: ExportConfig): string {
  // Group QAs by category
  const qasByCategory = config.qas.reduce<Record<string, QAExtractionResult[]>>((acc, qa) => {
    const category = qa.metadata.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(qa);
    return acc;
  }, {});

  return `
import { useState } from 'react';

interface QAItem {
  question: string;
  answer: string;
  tags: string[];
}

function QAAccordionItem({ item }: { item: QAItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-medium">{item.question}</span>
        <span className={isOpen ? 'rotate-180 transform' : ''}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="pb-4">
          <p className="text-gray-600">{item.answer}</p>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {item.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
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
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h2 className="mb-8 text-center text-3xl font-bold">
        ${config.title}
      </h2>
      ${config.description ? `<p className="mb-8 text-center text-gray-600">${config.description}</p>` : ''}
      ${Object.entries(qasByCategory)
        .map(
          ([category, items]) => `
        <div key={generateFAQCategoryKey('${category}')} className="mb-8">
          <h3 className="mb-4 text-xl font-semibold">${category}</h3>
          <div className="space-y-4">
            ${items
              .map(
                (item) => `
              <QAAccordionItem 
                key={generateFAQItemKey('${item.question}')} 
                item={{
                  question: ${JSON.stringify(item.question)},
                  answer: ${JSON.stringify(item.answer)},
                  tags: ${JSON.stringify(item.tags)}
                }} 
              />
            `
              )
              .join('')}
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  );
}
`;
}

export const getReactFilename = () => 'QAList.tsx';
export const getReactMimeType = () => 'text/plain'; 