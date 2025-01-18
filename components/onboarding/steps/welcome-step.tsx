import { Mail, Brain, Zap } from "lucide-react";

export function WelcomeStep() {
    return (
        <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Welcome to Quaestio!</h2>
            <p className="text-muted-foreground">
                Let&apos;s get you set up to extract Q&As from your email conversations.
            </p>

            <div className="grid gap-4">
                <div className="flex items-center gap-4">
                    <Mail className="h-8 w-8 text-primary" />
                    <div className="text-left">
                        <h3 className="font-semibold">Connect Your Email</h3>
                        <p className="text-sm text-muted-foreground">
                            Link your Gmail account to start processing emails
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Brain className="h-8 w-8 text-primary" />
                    <div className="text-left">
                        <h3 className="font-semibold">AI-Powered Extraction</h3>
                        <p className="text-sm text-muted-foreground">
                            Our AI automatically identifies and extracts Q&As
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Zap className="h-8 w-8 text-primary" />
                    <div className="text-left">
                        <h3 className="font-semibold">Instant Insights</h3>
                        <p className="text-sm text-muted-foreground">
                            Get valuable insights from your email conversations
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
