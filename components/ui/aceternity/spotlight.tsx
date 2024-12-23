"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const Spotlight = ({
  className,
  fill = "white",
}: {
  className?: string;
  fill?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const updatePosition = (event: MouseEvent) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();

    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    div.addEventListener("mousemove", updatePosition);
    div.addEventListener("mouseenter", () => setOpacity(1));
    div.addEventListener("mouseleave", () => setOpacity(0));

    return () => {
      div.removeEventListener("mousemove", updatePosition);
      div.removeEventListener("mouseenter", () => setOpacity(1));
      div.removeEventListener("mouseleave", () => setOpacity(0));
    };
  }, []);

  return (
    <div
      ref={divRef}
      className={cn(
        "h-full w-full relative overflow-hidden bg-black",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${fill}, transparent 40%)`,
        }}
      />
    </div>
  );
};