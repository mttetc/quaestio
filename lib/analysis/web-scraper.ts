import { load } from 'cheerio';

export interface WebPage {
  url: string;
  title: string;
  content: string;
  headings: string[];
  links: string[];
}

export async function scrapeWebsite(url: string): Promise<WebPage> {
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  // Remove script tags, style tags, and comments
  $('script').remove();
  $('style').remove();
  $('comments').remove();

  const content = $('body')
    .text()
    .replace(/\s+/g, ' ')
    .trim();

  const headings = $('h1, h2, h3')
    .map((_, el) => $(el).text().trim())
    .get();

  const links = $('a')
    .map((_, el) => $(el).attr('href'))
    .get()
    .filter(href => href && !href.startsWith('#'));

  return {
    url,
    title: $('title').text(),
    content,
    headings,
    links,
  };
}