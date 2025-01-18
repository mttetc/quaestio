import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";

interface TrendBadgeProps {
  trend: "up" | "down" | "stable";
}

export function TrendBadge({ trend }: TrendBadgeProps) {
  const variants = {
    up: {
      color: "text-green-500",
      icon: ArrowUpIcon,
      text: "Increasing",
    },
    down: {
      color: "text-red-500",
      icon: ArrowDownIcon,
      text: "Decreasing",
    },
    stable: {
      color: "text-yellow-500",
      icon: MinusIcon,
      text: "Stable",
    },
  };

  const { color, icon: Icon, text } = variants[trend];

  return (
    <Badge variant="outline" className={color}>
      <Icon className="h-4 w-4 mr-1" />
      {text}
    </Badge>
  );
}