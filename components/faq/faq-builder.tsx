"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Download, Code, FileText, Loader2 } from "lucide-react";
import { CodeBlock } from '@/components/ui/aceternity/code-block';

export function FAQBuilder() {
  const [title, setTitle] = useState('Frequently Asked Questions');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const { toast } = useToast();

  const handleGenerate = async (format: 'html' | 'react') => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/faq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          config: {
            title,
            description,
            styling: {
              theme,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate FAQ');
      }

      const code = await response.text();
      setGeneratedCode(code);

      toast({
        title: "Success",
        description: "FAQ generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate FAQ",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>FAQ Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter FAQ title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter FAQ description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'auto') => setTheme(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => handleGenerate('html')}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              Export as HTML
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleGenerate('react')}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Code className="mr-2 h-4 w-4" />
              )}
              Export as React
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedCode && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Code</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock 
              code={generatedCode}
              language={generatedCode.includes('React') ? 'tsx' : 'html'}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}