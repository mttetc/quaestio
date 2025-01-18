"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function AnimatedTooltip({
    items,
}: {
    items: {
        id: number;
        name: string;
        designation: string;
        image: string;
    }[];
}) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="flex gap-2">
            {items.map((item, idx) => (
                <div
                    key={item.id}
                    className="relative group"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                                style={{ translateX: "-50%" }}
                                className="absolute -top-16 left-1/2 flex flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
                            >
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 border-solid border-t-black border-t-8 border-x-transparent border-x-8 border-b-0" />
                                <p className="text-white font-bold">{item.name}</p>
                                <p className="text-white text-xs">{item.designation}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover !m-0 !p-0 h-14 w-14 rounded-full border-2 group-hover:scale-105 duration-200"
                    />
                </div>
            ))}
        </div>
    );
}
