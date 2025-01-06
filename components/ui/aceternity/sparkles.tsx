"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const SparklesCore = ({
    background,
    minSize,
    maxSize,
    particleDensity,
    className,
    particleColor,
    particleOffsetTop,
    particleOffsetBottom,
    particleOffsetHorizontal,
    speed,
}: {
    background?: string;
    minSize?: number;
    maxSize?: number;
    particleDensity?: number;
    className?: string;
    particleColor?: string;
    particleOffsetTop?: number;
    particleOffsetBottom?: number;
    particleOffsetHorizontal?: number;
    speed?: number;
}) => {
    const [particles, setParticles] = useState<Array<any>>([]);

    useEffect(() => {
        const particleCount = Math.floor(window.innerWidth / (particleDensity || 10));
        const newParticles = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = {
                id: i,
                size: Math.random() * ((maxSize || 3) - (minSize || 1)) + (minSize || 1),
                x: Math.random() * 100,
                y: Math.random() * 100,
                duration: Math.random() * 3 + 2,
            };
            newParticles.push(particle);
        }

        setParticles(newParticles);
    }, [maxSize, minSize, particleDensity]);

    return (
        <div
            className={cn(
                "h-full w-full absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]",
                className
            )}
            style={{
                background: background || "transparent",
            }}
        >
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full pointer-events-none animate-sparkle"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        background: particleColor || "#fff",
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animation: `sparkle ${particle.duration}s linear infinite`,
                        animationDelay: `${Math.random() * -particle.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};
