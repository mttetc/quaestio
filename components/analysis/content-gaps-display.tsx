"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { generateQuestionKey, generateGapKey, generateRecommendationKey } from "@/lib/utils/key-generation";
import { ContentAnalysis, ContentGap } from "@/lib/features/analytics/schemas/content";
import { motion } from "framer-motion";

interface ContentGapsDisplayProps {
    analysis: ContentAnalysis;
}

const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

function GapCard({ gap, index }: { gap: ContentGap; index: number }) {
    return (
        <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, delay: index * 0.1 }}
        >
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
        </motion.div>
    );
}

export function ContentGapsDisplay({ analysis }: ContentGapsDisplayProps) {
    const coveragePercentage = Math.round(analysis.coverage * 100);

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
            >
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
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
                {analysis.gaps.map((gap, index) => (
                    <GapCard 
                        key={generateGapKey(gap.topic, gap.frequency)} 
                        gap={gap} 
                        index={index}
                    />
                ))}
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {analysis.recommendations.map((recommendation, index) => (
                                <motion.li
                                    key={generateRecommendationKey(recommendation)}
                                    className="flex items-start gap-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <span className="text-primary">•</span>
                                    <span>{recommendation}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
