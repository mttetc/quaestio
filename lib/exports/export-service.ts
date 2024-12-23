import { generateCSV, getCSVFilename, getCSVMimeType } from './exporters/csv';
import { generateHTML, getHTMLFilename, getHTMLMimeType } from './exporters/html';
import { generateReact, getReactFilename, getReactMimeType } from './exporters/react';
import { ExportOptions, ExportResult } from './types';

const exporters = {
  html: {
    generate: generateHTML,
    getFilename: getHTMLFilename,
    getMimeType: getHTMLMimeType,
  },
  react: {
    generate: generateReact,
    getFilename: getReactFilename,
    getMimeType: getReactMimeType,
  },
  csv: {
    generate: generateCSV,
    getFilename: getCSVFilename,
    getMimeType: getCSVMimeType,
  },
} as const;

export const generateExport = async (
  data: any,
  options: ExportOptions
): Promise<ExportResult> => {
  const exporter = exporters[options.format];
  
  if (!exporter) {
    throw new Error(`Unsupported export format: ${options.format}`);
  }

  return {
    content: exporter.generate(data, options),
    filename: exporter.getFilename(),
    mimeType: exporter.getMimeType(),
  };
};