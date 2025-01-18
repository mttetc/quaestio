import { ReactNode } from "react";

export interface BaseComponentProps {
    children?: ReactNode;
    className?: string;
}

export interface ViewProps extends BaseComponentProps {
    // Add any common view props here
}

export interface PageProps extends BaseComponentProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string>;
}
