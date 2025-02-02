"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Mail, Lock, Key, Loader2 } from "lucide-react";

export const GMAIL_STEPS = [
    {
        title: "Enable IMAP",
        description: "First, enable IMAP access in your Gmail settings",
        link: "https://mail.google.com/mail/u/0/#settings/fwdandpop",
        buttonText: "Open Gmail Settings",
        icon: Mail,
    },
    {
        title: "Enable 2-Step Verification",
        description: "Set up 2-Step Verification for your Google Account",
        link: "https://myaccount.google.com/security",
        buttonText: "Security Settings",
        icon: Lock,
    },
    {
        title: "Generate App Password",
        description: "Create an App Password specifically for Quaestio",
        link: "https://myaccount.google.com/apppasswords",
        buttonText: "App Passwords",
        icon: Key,
    },
] as const;

interface EmailSetupProps {
    onSubmit: (email: string, appPassword: string) => Promise<void>;
    onStepComplete?: (step: number) => void;
    onSuccess?: () => void;
    showStepIndicators?: boolean;
    className?: string;
}

export function EmailSetupCore({
    onSubmit,
    onStepComplete,
    onSuccess,
    showStepIndicators = false,
    className = "",
}: EmailSetupProps) {
    const [currentStep, setCurrentStep] = React.useState(1);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [appPassword, setAppPassword] = React.useState("");
    const step = GMAIL_STEPS[currentStep - 1];

    const handleNext = async () => {
        if (currentStep === GMAIL_STEPS.length) {
            setIsSubmitting(true);
            try {
                await onSubmit(email, appPassword);
                onSuccess?.();
            } catch (error) {
                console.error("Failed to submit:", error);
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        setCurrentStep((prev) => {
            const next = prev + 1;
            onStepComplete?.(next);
            return next;
        });
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="space-y-4">
                {showStepIndicators && (
                    <div className="flex justify-between mb-8">
                        {GMAIL_STEPS.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 flex-1 mx-1 rounded-full ${
                                    index + 1 <= currentStep ? "bg-primary" : "bg-muted"
                                }`}
                            />
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <step.icon className="h-5 w-5" />
                    <h3 className="font-medium">
                        {showStepIndicators && `Step ${currentStep}: `}
                        {step.title}
                    </h3>
                </div>

                <p className="text-sm text-muted-foreground">{step.description}</p>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.open(step.link, "_blank")}
                    className="w-full"
                >
                    {step.buttonText}
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Button>

                {currentStep === GMAIL_STEPS.length && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Gmail Address"
                                required
                                pattern="[a-z0-9._%+-]+@gmail\.com$"
                                title="Please enter a valid Gmail address"
                                autoComplete="off"
                            />
                            <Input
                                value={appPassword}
                                onChange={(e) => setAppPassword(e.target.value)}
                                type="password"
                                placeholder="App Password"
                                required
                                minLength={16}
                                maxLength={16}
                                pattern="[A-Za-z0-9]{16}"
                                title="App password must be exactly 16 characters"
                                autoComplete="new-password"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={
                        isSubmitting ||
                        (currentStep === GMAIL_STEPS.length &&
                            (!email.match(/[a-z0-9._%+-]+@gmail\.com$/) || !appPassword.match(/[A-Za-z0-9]{16}/)))
                    }
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                        </>
                    ) : currentStep === GMAIL_STEPS.length ? (
                        "Connect Gmail"
                    ) : (
                        "Next"
                    )}
                </Button>
            </div>
        </div>
    );
}
