"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Globe, Loader2 } from "lucide-react";
import { ContentAnalysis } from '@/lib/features/analytics/core/content-comparison';
import { ContentGapsDisplay } from '@/components/analysis/content-gaps-display';

export function WebsiteAnalyzer() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analysis/website-comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze website');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Content Analysis</CardTitle>
          <CardDescription>
            Compare your Q&As with website content to identify gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalysis} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter website URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <Button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {analysis && <ContentGapsDisplay analysis={analysis} />}
    </div>
  );
}