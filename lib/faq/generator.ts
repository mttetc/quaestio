import { QAExtractionResult } from '../email/types';
import { FAQConfig, FAQSection } from './types';
import { clusterSimilarQuestions } from '../ai/question-clustering';

export function generateFAQFromQA(
  qas: QAExtractionResult[],
  config: Partial<FAQConfig> = {}
): FAQConfig {
  // Group QAs by category/tags
  const groupedQAs = qas.reduce((acc, qa) => {
    const category = qa.metadata.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(qa);
    return acc;
  }, {} as Record<string, QAExtractionResult[]>);

  // Create sections for each category
  const sections: FAQSection[] = Object.entries(groupedQAs).map(([category, items]) => {
    // Cluster similar questions within each category
    const clusters = clusterSimilarQuestions(items);

    return {
      title: category,
      items: clusters.map(cluster => ({
        question: cluster.mainQuestion,
        answer: items.find(qa => qa.question === cluster.mainQuestion)?.answer || '',
        category,
        tags: items.find(qa => qa.question === cluster.mainQuestion)?.tags || [],
        metadata: {
          lastUpdated: new Date(),
          views: 0,
          helpful: 0,
        },
      })),
    };
  });

  return {
    title: config.title || 'Frequently Asked Questions',
    description: config.description,
    sections: sections.sort((a, b) => b.items.length - a.items.length),
    styling: config.styling || {
      theme: 'light',
    },
  };
}