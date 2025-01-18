"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can log the error to an error reporting service here
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <h2 className="text-xl font-semibold">Something went wrong</h2>
                    <p className="text-muted-foreground text-center max-w-md">
                        {this.state.error?.message || "An unexpected error occurred"}
                    </p>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                // Reset any React Query errors
                                useQueryErrorResetBoundary().reset();
                            }}
                        >
                            Try again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            Reload page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}