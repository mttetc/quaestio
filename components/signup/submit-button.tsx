import { useFormStatus } from "react-dom"
import { Button } from "../ui/button"

export const SignUpSubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button disabled={pending}>{pending ? "pending..." : "Sign up"}</Button>
    )
}