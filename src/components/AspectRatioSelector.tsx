import React from "react";
import { Monitor, Smartphone, Square } from "lucide-react";

export type AspectRatioType = "1:1" | "16:9" | "9:16";

interface AspectRatioSelectorProps {
    selected: AspectRatioType;
    onSelect: (ratio: AspectRatioType) => void;
}

const ratios: { id: AspectRatioType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "1:1", label: "Kare", icon: <Square />, desc: "Instagram" },
    { id: "16:9", label: "Yatay", icon: <Monitor />, desc: "Youtube / PC" },
    { id: "9:16", label: "Dikey", icon: <Smartphone />, desc: "Story / Reels" },
];

export default function AspectRatioSelector({ selected, onSelect }: AspectRatioSelectorProps) {
    return (
        <div className="w-full">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider pl-1">Boyut Seçimi</h3>
            <div className="flex gap-4">
                {ratios.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => onSelect(r.id)}
                        className={`
              flex-1 relative p-3 rounded-2xl flex flex-col items-center gap-2
              border transition-all duration-300 group
              ${selected === r.id
                                ? "bg-blue-50 border-blue-400 ring-2 ring-blue-200"
                                : "bg-white/40 border-white/60 hover:bg-white/70 hover:border-blue-200"
                            }
            `}
                    >
                        <div className={`
              p-2 rounded-lg transition-colors duration-300
              ${selected === r.id ? "bg-blue-500 text-white shadow-md" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-blue-500"}
            `}>
                            {React.cloneElement(r.icon as React.ReactElement, { size: 20 })}
                        </div>

                        <div className="text-center">
                            <span className={`block text-xs font-bold ${selected === r.id ? "text-blue-800" : "text-slate-600"}`}>
                                {r.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{r.desc}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
