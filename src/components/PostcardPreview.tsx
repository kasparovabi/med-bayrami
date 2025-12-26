"use client";

import React from "react";
import Image from "next/image";
import { Download, RefreshCw, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface PostcardPreviewProps {
    isLoading: boolean;
    imageUrl: string | null;
    onRegenerate: () => void;
}

export const PostcardPreview: React.FC<PostcardPreviewProps> = ({
    isLoading,
    imageUrl,
    onRegenerate,
}) => {
    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = "med-bayrami-postcard.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!imageUrl && !isLoading) {
        return (
            <div className="h-full min-h-[400px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                <div className="text-center text-gray-400">
                    <p className="font-display text-lg mb-2">Your postcard will appear here</p>
                    <p className="text-sm">Upload photos and select a scenario to start!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full min-h-[400px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
            <div className="flex-1 relative bg-gray-100 flex items-center justify-center p-4">
                {/* Loading State or Image */}
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-med-blue/30 border-t-med-blue rounded-full animate-spin" />
                        <p className="text-med-blue font-medium animate-pulse">Designing your postcard...</p>
                    </div>
                ) : imageUrl ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full h-full max-h-[600px] shadow-lg rounded-lg overflow-hidden"
                    >
                        {/* Note: In a real app with external URLs, we need to configure next.config.js or use standard img */}
                        {/* Using standard img for now since base64 or blob URLs don't need next/image domain config */}
                        <img
                            src={imageUrl}
                            alt="Generated Postcard"
                            className="w-full h-full object-contain bg-white"
                        />
                    </motion.div>
                ) : null}
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
                <button
                    onClick={onRegenerate}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-gray-600 hover:text-med-blue transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                    <span className="font-medium">Regenerate</span>
                </button>

                <div className="flex gap-2">
                    <button
                        disabled={!imageUrl || isLoading}
                        className="p-2 text-gray-400 hover:text-med-blue bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Share2 size={20} />
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!imageUrl || isLoading}
                        className="flex items-center gap-2 bg-med-blue text-white px-4 py-2 rounded-lg hover:bg-med-blue/90 shadow-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={20} />
                        <span className="font-medium">Save Postcard</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
