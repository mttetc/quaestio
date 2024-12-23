import { FAQConfig } from '../types';

export function generateReactFAQ(config: FAQConfig): string {
  return `import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  tags: string[];
}

interface FAQSection {
  title: string;
  description?: string;
  items: FAQItem[];
}

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg mb-4">
      <button
        className="w-full px-4 py-2 text-left font-semibold flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.question}
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

export function FAQ() {
  const config: FAQConfig = ${JSON.stringify(config, null, 2)};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{config.title}</h1>
      {config.description && (
        <p className="text-gray-600 mb-8">{config.description}</p>
      )}

      {config.sections.map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          {section.description && (
            <p className="text-gray-600 mb-4">{section.description}</p>
          )}
          <div className="space-y-4">
            {section.items.map((item, j) => (
              <FAQAccordionItem key={j} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}