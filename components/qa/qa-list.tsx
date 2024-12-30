"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { QAExtractionResult } from '@/lib/email/types';
import { generateTagKey } from '@/lib/utils/key-generation';

interface QAListProps {
  selectable?: boolean;
  selectedIds?: string[];
  name?: string;
}

export function QAList({ selectable = false, selectedIds = [], name }: QAListProps) {
  const [selectedIdsState, setSelectedIdsState] = useState<string[]>(selectedIds);

  const { data: qas, isLoading } = useQuery({
    queryKey: ['qas'],
    queryFn: async () => {
      const response = await fetch('/api/qa');
      if (!response.ok) throw new Error('Failed to fetch Q&As');
      return response.json();
    },
  });

  const handleSelect = (id: string) => {
    const newSelectedIds = selectedIdsState.includes(id)
      ? selectedIdsState.filter(selectedId => selectedId !== id)
      : [...selectedIdsState, id];
    
    setSelectedIdsState(newSelectedIds);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {selectable && (
        <input 
          type="hidden" 
          name={name} 
          value={JSON.stringify(selectedIdsState)} 
        />
      )}
      {qas?.map((qa: QAExtractionResult) => (
        <Card key={qa.emailId} className="relative">
          {selectable && (
            <div className="absolute top-4 left-4">
              <Checkbox
                checked={selectedIdsState.includes(qa.emailId)}
                onCheckedChange={() => handleSelect(qa.emailId)}
              />
            </div>
          )}
          <CardContent className={`pt-6 ${selectable ? 'pl-12' : ''}`}>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{qa.question}</h3>
                <p className="mt-2 text-muted-foreground">{qa.answer}</p>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{new Date(qa.metadata.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{qa.metadata.category || 'Uncategorized'}</span>
                <span>•</span>
                <span>{qa.confidence}% confidence</span>
              </div>

              {qa.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {qa.tags.map((tag) => (
                    <Badge key={generateTagKey(tag)} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}