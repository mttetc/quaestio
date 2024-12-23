import { FAQConfig } from '../types';

export function generateHTML(config: FAQConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <style>
    :root {
      color-scheme: ${config.styling?.theme === 'auto' ? 'light dark' : config.styling?.theme};
      --accent: ${config.styling?.accentColor || '#0066cc'};
    }
    body {
      font-family: ${config.styling?.fontFamily || 'system-ui'}, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.5;
    }
    .faq-section {
      margin-bottom: 2rem;
    }
    .faq-item {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    .faq-question {
      padding: 1rem;
      margin: 0;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .faq-answer {
      padding: 1rem;
      margin: 0;
      border-top: 1px solid #e5e7eb;
      display: none;
    }
    .faq-item[open] .faq-answer {
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
  </style>
</head>
<body>
  <h1>${config.title}</h1>
  ${config.description ? `<p>${config.description}</p>` : ''}
  
  ${config.sections.map(section => `
    <div class="faq-section">
      <h2>${section.title}</h2>
      ${section.description ? `<p>${section.description}</p>` : ''}
      
      ${section.items.map(item => `
        <details class="faq-item">
          <summary class="faq-question">
            ${item.question}
          </summary>
          <div class="faq-answer">
            <p>${item.answer}</p>
            ${item.tags.length > 0 ? `
              <div class="tags">
                ${item.tags.map(tag => `
                  <span class="tag">${tag}</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </details>
      `).join('')}
    </div>
  `).join('')}

  <script>
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          const question = item.querySelector('.faq-question').textContent.trim();
          // Track views/analytics here if needed
        }
      });
    });
  </script>
</body>
</html>`;
}

export const getHTMLFilename = () => 'faq.html';
export const getHTMLMimeType = () => 'text/html';