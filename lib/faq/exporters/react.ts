import { generateFAQCategoryKey, generateFAQItemKey } from '@/lib/utils/key-generation';
import { FAQConfig, FAQItem } from '../types';

export function generateFAQComponent(config: FAQConfig): string {
  return `
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

function FAQAccordionItem({ item }: { item: FAQItem }) {
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
        </div>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h2 className="mb-8 text-center text-3xl font-bold">
        ${config.title}
      </h2>
      ${config.sections
        .map(
          (section) => `
        <div key={generateFAQCategoryKey('${section.title}')} className="mb-8">
          <h3 className="mb-4 text-xl font-semibold">${section.title}</h3>
          ${section.description ? `<p className="mb-4 text-gray-600">${section.description}</p>` : ''}
          <div className="space-y-4">
            ${section.items
              .map(
                (item) => `
              <FAQAccordionItem 
                key={generateFAQItemKey('${item.question}')} 
                item={{
                  question: ${JSON.stringify(item.question)},
                  answer: ${JSON.stringify(item.answer)}
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