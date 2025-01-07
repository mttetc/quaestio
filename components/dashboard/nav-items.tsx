import { Mail, BarChart2, Settings, FileText, BookOpen, Search, Database, Unlink, MessageSquare } from "lucide-react";

interface NavItem {
    id: string;
    name: string;
    link: string;
    icon: React.ReactNode;
    description?: string;
    subItems?: NavItem[];
}

export const mainNavItems: NavItem[] = [
    {
        id: "qa",
        name: "Q&A",
        link: "#qa",
        icon: <MessageSquare className="w-4 h-4" />,
        subItems: [
            {
                id: "extract",
                name: "Extract Q&As",
                link: "/dashboard/extract",
                icon: <Search className="w-4 h-4" />,
                description: "Process email conversations",
            },
            {
                id: "qa-library",
                name: "Q&A Library",
                link: "/dashboard/qa",
                icon: <Database className="w-4 h-4" />,
                description: "View and manage Q&As",
            },
            {
                id: "create-qa",
                name: "Create Q&A",
                link: "/dashboard/qa/create",
                icon: <FileText className="w-4 h-4" />,
                description: "Create a new Q&A manually",
            },
        ],
    },
    {
        id: "email",
        name: "Email",
        link: "#email",
        icon: <Mail className="w-4 h-4" />,
        subItems: [
            {
                id: "unsubscribe",
                name: "Unsubscribe",
                link: "/dashboard/subscriptions",
                icon: <Unlink className="w-4 h-4" />,
                description: "Manage email subscriptions",
            },
        ],
    },
    {
        id: "knowledge",
        name: "Knowledge Base",
        link: "#knowledge",
        icon: <BookOpen className="w-4 h-4" />,
        subItems: [
            {
                id: "qa-export",
                name: "Q&A Export",
                link: "/dashboard/knowledge/export",
                icon: <FileText className="w-4 h-4" />,
                description: "Export your Q&As in various formats",
            },
            {
                id: "docs",
                name: "Documentation",
                link: "/dashboard/knowledge/docs",
                icon: <BookOpen className="w-4 h-4" />,
                description: "Build documentation",
            },
        ],
    },
    {
        id: "analytics",
        name: "Reports",
        link: "#analytics",
        icon: <BarChart2 className="w-4 h-4" />,
        subItems: [
            {
                id: "overview",
                name: "Overview",
                link: "/dashboard/insights",
                icon: <BarChart2 className="w-4 h-4" />,
                description: "Usage reports and numbers",
            },
            {
                id: "content-analysis",
                name: "Content Review",
                link: "/dashboard/insights/analysis",
                icon: <FileText className="w-4 h-4" />,
                description: "Missing topics and suggestions",
            },
        ],
    },
    {
        id: "settings",
        name: "Settings",
        link: "/dashboard/settings",
        icon: <Settings className="w-4 h-4" />,
        description: "Manage account and preferences",
    },
];
