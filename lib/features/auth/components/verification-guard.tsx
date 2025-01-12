import { redirect } from "next/navigation";
import { checkEmailVerification } from "../actions/verification";

export default async function VerificationGuard({ children }: { children: React.ReactNode }) {
    const { verified, shouldRedirect } = await checkEmailVerification();

    if (!verified && shouldRedirect) {
        redirect(shouldRedirect);
    }

    return <>{children}</>;
}
