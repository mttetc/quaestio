// This page is automatically static because it has no dynamic features
import { LandingPage } from "../components/landing/landing-page";

export const dynamic = "force-static";

export default function RootPage() {
    return <LandingPage />;
}
