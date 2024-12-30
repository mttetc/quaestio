import { QAExtractionResult } from '@/lib/core/email/types';

interface QAExportConfig {
  title: string;
  description?: string;
  qas: QAExtractionResult[];
}

export function generateHTML(config: QAExportConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <style>
    :root {
      color-scheme: light dark;
    }
    body {
      font-family: system-ui, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.5;
    }
    .qa-item {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    .qa-question {
      padding: 1rem;
      margin: 0;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .qa-answer {
      padding: 1rem;
      margin: 0;
      border-top: 1px solid #e5e7eb;
      display: none;
    }
    .qa-item[open] .qa-answer {
      display: block;
    }
    .tags {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .tag {
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
    }
    .metadata {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .importance {
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
    }
    .importance.high {
      background: #fee2e2;
      color: #b91c1c;
    }
    .importance.medium {
      background: #fef3c7;
      color: #b45309;
    }
    .importance.low {
      background: #dcfce7;
      color: #15803d;
    }
    .confidence {
      color: #6b7280;
      font-size: 0.75rem;
    }
  </style>
</head>
<body>
  <h1>${config.title}</h1>
  ${config.description ? `<p>${config.description}</p>` : ''}
  
  ${config.qas.map(qa => `
    <details class="qa-item">
      <summary class="qa-question">
        <div>
          ${qa.question}
          <div class="tags">
            ${qa.tags.map(tag => `
              <span class="tag">${tag}</span>
            `).join('')}
          </div>
        </div>
        <div class="metadata">
          <span class="importance ${qa.importance}">${qa.importance}</span>
          <span class="confidence">${qa.confidence}%</span>
        </div>
      </summary>
      <div class="qa-answer">
        <p>${qa.answer}</p>
      </div>
    </details>
  `).join('')}

  <script>
    document.querySelectorAll('.qa-item').forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          const question = item.querySelector('.qa-question').textContent.trim();
          // Track views/analytics here if needed
        }
      });
    });
  </script>
</body>
</html>`;
} 