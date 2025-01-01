import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function ExtractButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting...
                </>
            ) : (
                "Extract Q&As"
            )}
        </Button>
    );
} 