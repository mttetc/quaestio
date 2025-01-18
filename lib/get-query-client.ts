import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Constants for query client configuration
const STALE_TIME = 60 * 1000; // 1 minute
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: STALE_TIME,
                gcTime: CACHE_TIME,
                networkMode: "offlineFirst",
                refetchOnWindowFocus: false,
                retry: MAX_RETRIES,
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
            },
            mutations: {
                retry: 1,
                networkMode: "offlineFirst",
                onError: (error: Error, variables, context) => {
                    console.error("Mutation error:", { error, variables, context });
                    if (!isServer) {
                        toast({
                            title: "Error",
                            description: error.message || "An error occurred. Please try again.",
                            variant: "destructive",
                        });
                    }
                },
            },
            dehydrate: {
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) || query.state.status === "pending",
            },
        },
    });
}

// Create a single instance for the server
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    if (isServer) {
        // Always make a new client on the server
        return makeQueryClient();
    }
    
    if (!browserQueryClient) {
        // Create a new client on the client if one doesn't exist
        browserQueryClient = makeQueryClient();
    }
    
    return browserQueryClient;
}
