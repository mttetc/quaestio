"use client";

import { QAList } from "@/components/qa/qa-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateDocs } from "@/lib/features/docs/actions/docs";
import { Book, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

interface DocsState {
  error?: string;
  success?: boolean;
  preview?: string;
  title: string;
  description: string;
  selectedQAs: string[];
}

function GenerateButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Book className="mr-2 h-4 w-4" />
          Generate Documentation
        </>
      )}
    </Button>
  );
}

export function DocumentationBuilder() {
  const { toast } = useToast();
  const [state, formAction] = useActionState<DocsState, FormData>(generateDocs, {
    error: undefined,
    success: false,
    title: "",
    description: "",
    selectedQAs: [],
    preview: undefined
  });

  if (state?.error) {
    toast({
      title: "Error",
      description: state.error,
      variant: "destructive",
    });
  } else if (state?.success) {
    toast({
      title: "Success",
      description: "Documentation generated successfully",
    });
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Documentation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter documentation title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter documentation description"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="source">
          <TabsList>
            <TabsTrigger value="source">Source Q&As</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="source">
            <QAList 
              selectable 
              name="selectedQAs"
              selectedIds={state?.selectedQAs}
            />
            <div className="mt-4">
              <GenerateButton />
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <Card>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <h1>{state?.title || 'Documentation Title'}</h1>
                  {state?.description && <p>{state.description}</p>}
                  {state?.preview && (
                    <div dangerouslySetInnerHTML={{ __html: state.preview }} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}