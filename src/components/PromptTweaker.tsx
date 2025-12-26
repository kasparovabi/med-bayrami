"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface PromptTweakerProps {
    customPrompt: string;
    setCustomPrompt: (prompt: string) => void;
}

export const PromptTweaker: React.FC<PromptTweakerProps> = ({
    customPrompt,
    setCustomPrompt,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2 text-med-blue">
                    <Sparkles size={18} />
                    <span className="font-semibold text-sm">Advanced: Custom Prompt Tool</span>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4 pt-0 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">
                                Modify the instructions sent to the AI. Variables like [scenario] will be handled by the system, but you can add specific details here.
                            </p>
                            <textarea
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                className="w-full h-24 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-blue/20 focus:border-med-blue outline-none resize-none font-mono text-gray-700"
                                placeholder="e.g., Make the background very colorful, ensure the lighting is warm..."
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
