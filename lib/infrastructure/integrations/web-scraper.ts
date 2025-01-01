import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import * as cheerio from 'cheerio';

export interface WebPage {
  url: string;
  title: string;
  content: string;
  headings: string[];
  links: string[];
  chunks: Document[];
}

export async function scrapeWebsite(url: string): Promise<WebPage> {
  // Use CheerioWebBaseLoader for initial loading
  const loader = new CheerioWebBaseLoader(url);
  
  // Load and get initial documents
  const docs = await loader.load();
  
  // Get the raw HTML for metadata extraction
  const $ = (await loader.scrape()).$ as cheerio.Root;
  
  // Remove non-content elements
  $('script, style, nav, header, footer, [role="navigation"]').remove();
  
  // Extract headings with their hierarchy
  const headings = $('h1, h2, h3')
    .map((_, el) => $(el).text().trim())
    .get();

  // Extract meaningful links (excluding navigation, social, etc)
  const links = $('article a, main a, .content a')
    .map((_, el) => $(el).attr('href'))
    .get()
    .filter((href): href is string => 
      href !== undefined && 
      !href.startsWith('#') && 
      !href.includes('twitter.com') && 
      !href.includes('facebook.com')
    );

  // Split content into smaller chunks for better processing
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const chunks = await splitter.splitDocuments(docs);

  // Get the cleaned content after removing non-content elements
  const content = $('body').text().replace(/\s+/g, ' ').trim();

  return {
    url,
    title: $('title').text(),
    content,
    headings,
    links,
    chunks,
  };
} 