"use client"

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { State, signup } from "./actions";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { SignUpSubmitButton } from "./submit-button";

const initState = { status: "INIT" } satisfies State;

export const SignUpForm = () => {
  const [state, action] = useFormState<State, FormData>(signup, initState);
  const { toast } = useToast()

  useEffect(() => {
    if (state.status !== "AUTH_ERROR") return;
    toast({
        title: state.error.code,
        description: "prout"
    })
  },[state, toast]);

    return (
        <form action={action}> 
            <div>
                <Label>Email</Label>
                <Input placeholder="Email" name="email" />
                {state.status === "FORM_ERROR" && <div>{state.errors?.email}</div>}
            </div>
            <div>
                <Label>First name</Label>
                <Input placeholder="Firstname" name="firstname" />
                {state.status === "FORM_ERROR" && <div>{state.errors?.firstname}</div>}
            </div>
            <div>
                <Label>Last name</Label>
                <Input placeholder="Lastname" name="lastname" />
                {state.status === "FORM_ERROR" && <div>{state.errors?.lastname}</div>}
            </div>
            <div>
                <Label>Password</Label>
                <Input type="password" placeholder="Password" name="password" />
                {state.status === "FORM_ERROR" && <div>{state.errors?.password}</div>}
            </div>
            <SignUpSubmitButton />
        </form>
    );
};