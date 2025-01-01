import { DateRange } from "react-day-picker";
import { extractQAs } from "@/services/qa/actions";

export interface FormState {
    emailId: string;
    dateRange: DateRange;
    status?: {
        error?: string;
        success?: boolean;
        count?: number;
        failureReasons?: string[];
        failedEmails?: number;
    };
}

export const initialState: FormState = {
    emailId: "",
    dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
    },
};

export async function formAction(prevState: FormState, formData: FormData): Promise<FormState> {
    "use server";

    const emailId = formData.get("emailId") as string;
    const dateRange = formData.get("dateRange") as string;
    const range = dateRange ? JSON.parse(dateRange) as DateRange : prevState.dateRange;

    const result = await extractQAs(formData);

    return {
        emailId: emailId || prevState.emailId,
        dateRange: range,
        status: result.error ? { error: result.error } : { success: true, count: result.count },
    };
} 