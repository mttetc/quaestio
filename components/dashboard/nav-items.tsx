import { 
  Mail, 
  BarChart2, 
  Settings, 
  FileText,
  BookOpen,
  Search,
  Database
} from 'lucide-react';

export const mainNavItems = [
  {
    name: "Email Q&A",
    link: "#email",
    icon: <Mail className="w-4 h-4" />,
    subItems: [
      {
        name: "Extract Q&As",
        link: "/dashboard/extract",
        icon: <Search className="w-4 h-4" />,
        description: "Process email conversations"
      },
      {
        name: "Q&A Library",
        link: "/dashboard/qa",
        icon: <Database className="w-4 h-4" />,
        description: "View and manage Q&As"
      }
    ]
  },
  {
    name: "Knowledge Base",
    link: "#knowledge",
    icon: <BookOpen className="w-4 h-4" />,
    subItems: [
      {
        name: "FAQ Builder",
        link: "/dashboard/knowledge/faq",
        icon: <FileText className="w-4 h-4" />,
        description: "Create FAQ pages"
      },
      {
        name: "Documentation",
        link: "/dashboard/knowledge/docs",
        icon: <BookOpen className="w-4 h-4" />,
        description: "Build documentation"
      }
    ]
  },
  {
    name: "Analytics",
    link: "#analytics",
    icon: <BarChart2 className="w-4 h-4" />,
    subItems: [
      {
        name: "Overview",
        link: "/dashboard/insights",
        icon: <BarChart2 className="w-4 h-4" />,
        description: "Key metrics and trends"
      },
      {
        name: "Content Analysis",
        link: "/dashboard/insights/analysis",
        icon: <FileText className="w-4 h-4" />,
        description: "Content gaps and improvements"
      }
    ]
  },
  {
    name: "Settings",
    link: "/dashboard/settings",
    icon: <Settings className="w-4 h-4" />,
    description: "Manage account and preferences"
  }
];