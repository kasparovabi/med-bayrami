import React from "react";
import { TreePine, Gift, Sun, Rocket, HeartPulse, GraduationCap, Wand2 } from "lucide-react";

interface ScenarioSelectorProps {
    selected: string;
    onSelect: (scenario: string) => void;
}

const scenarios = [
    { id: "Park", label: "Doğa Yürüyüşü", icon: TreePine, desc: "Sakin ve yeşil bir doğa ortamı." },
    { id: "Hospital", label: "Minik Doktor", icon: HeartPulse, desc: "Klinikte sevimli bir an." },
    { id: "Superhero", label: "Süper Kahraman", icon: Rocket, desc: "Pelerinli kurtarıcılar iş başında!" },
    { id: "School", label: "Tıp Fakültesi", icon: GraduationCap, desc: "Geleceğin doktoru ders çalışıyor." },
    { id: "Birthday", label: "Kutlama", icon: Gift, desc: "Balonlar ve konfetilerle şenlik." },
    { id: "Beach", label: "Sahil Keyfi", icon: Sun, desc: "Güneş, kum ve deniz kenarı." },
    { id: "Space", label: "Uzay Macerası", icon: Rocket, desc: "Yıldızların arasında bir yolculuk." },
    { id: "Fantasy", label: "Sihirli Dünya", icon: Wand2, desc: "Masalsı bir atmosfer." },
];

export default function ScenarioSelector({ selected, onSelect }: ScenarioSelectorProps) {
    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pl-1">
                <Wand2 className="w-6 h-6 text-med-blue animate-pulse" />
                <span className="text-glow">Konsept Seçimi</span>
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {scenarios.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => onSelect(s.id)}
                        className={`
              scenario-card relative p-4 rounded-3xl flex flex-col items-center text-center gap-3
              border transition-all duration-300 group overflow-hidden
              ${selected === s.id
                                ? "selected bg-blue-50/90 border-blue-400 ring-2 ring-blue-200 ring-offset-2"
                                : "bg-white/40 border-white/60 hover:bg-white/80 hover:border-blue-200"
                            }
            `}
                    >
                        {/* Soft Glow Background for Selected Item */}
                        {selected === s.id && <div className="absolute inset-0 bg-blue-400/10 blur-xl pointer-events-none" />}

                        <div className={`
              p-4 rounded-2xl transition-all duration-500 relative z-10
              ${selected === s.id
                                ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg scale-110 rotate-3"
                                : "bg-white text-slate-400 group-hover:text-med-blue group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-md"
                            }
            `}>
                            <s.icon size={28} strokeWidth={1.5} />
                        </div>
                        <div className="relative z-10">
                            <span className={`block font-bold text-sm tracking-wide ${selected === s.id ? "text-blue-800" : "text-slate-600 group-hover:text-slate-800"}`}>
                                {s.label}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-1 line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity font-medium">
                                {s.desc}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
