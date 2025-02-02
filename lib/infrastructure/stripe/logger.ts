import type Stripe from "stripe";

type LogLevel = "info" | "warn" | "error";

interface StripeLogEntry {
    level: LogLevel;
    event?: string;
    customerId?: string;
    error?: any;
    metadata?: Record<string, any>;
    timestamp: Date;
}

let logs: StripeLogEntry[] = [];

const createLogEntry = (level: LogLevel, data: Omit<StripeLogEntry, "level" | "timestamp">): StripeLogEntry => ({
    level,
    ...data,
    timestamp: new Date(),
});

const log = (level: LogLevel, data: Omit<StripeLogEntry, "level" | "timestamp">) => {
    const logEntry = createLogEntry(level, data);
    logs = [...logs, logEntry];

    // Log to console for development
    if (process.env.NODE_ENV === "development") {
        console.log(JSON.stringify(logEntry, null, 2));
    }

    // In production, you might want to send logs to a logging service
    if (process.env.NODE_ENV === "production") {
        // TODO: Implement production logging
        // e.g., send to logging service like DataDog, New Relic, etc.
    }
};

export const logWebhookEvent = (event: Stripe.Event) => {
    log("info", {
        event: event.type,
        customerId: typeof event.data.object === "object" ? (event.data.object as any).customer : undefined,
        metadata: {
            eventId: event.id,
            apiVersion: event.api_version,
        },
    });
};

export const logWebhookError = (error: any, eventType?: string, customerId?: string) => {
    log("error", {
        event: eventType,
        customerId,
        error,
        metadata: {
            errorMessage: error.message,
            errorStack: error.stack,
        },
    });
};

export const getLogs = (): readonly StripeLogEntry[] => Object.freeze([...logs]);

export const clearLogs = () => {
    logs = [];
};
