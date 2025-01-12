"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { generateQuestionKey, generateGapKey, generateRecommendationKey } from "@/lib/utils/key-generation";
import { ContentAnalysis, ContentGap } from "@/lib/features/analytics/schemas/content";

interface ContentGapsDisplayProps {
    analysis: ContentAnalysis;
}

function GapCard({ gap }: { gap: ContentGap }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{gap.topic}</span>
                    <Badge variant={gap.relevance > 0.7 ? "destructive" : "secondary"}>
                        {gap.frequency} occurrences
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Relevance</span>
                        <span>{Math.round(gap.relevance * 100)}%</span>
                    </div>
                    <Progress value={gap.relevance * 100} />
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{gap.suggestedContent}</p>
                    <div className="flex flex-wrap gap-2">
                        {gap.relatedQuestions.map((question) => (
                            <Badge key={generateQuestionKey(question)} variant="outline">
                                {question}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function ContentGapsDisplay({ analysis }: ContentGapsDisplayProps) {
    const coveragePercentage = Math.round(analysis.coverage * 100);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {coveragePercentage >= 80 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : coveragePercentage >= 50 ? (
                            <Info className="h-5 w-5 text-yellow-500" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                        Content Coverage: {coveragePercentage}%
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={coveragePercentage} className="h-2" />
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {analysis.gaps.map((gap) => (
                    <GapCard key={generateGapKey(gap.topic, gap.frequency)} gap={gap} />
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {analysis.recommendations.map((recommendation) => (
                            <li key={generateRecommendationKey(recommendation)} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{recommendation}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
