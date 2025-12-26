import React from "react";
import { Stethoscope } from "lucide-react";

export default function Header() {
    return (
        <header className="w-full py-6 flex flex-col items-center justify-center text-center relative z-10 animate-in">
            {/* Dynamic Background Blur */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-md -z-10 border-b border-white/20 shadow-sm" />

            <div className="animate-float p-3 bg-blue-100/50 rounded-2xl mb-4 border border-blue-200/50 backdrop-blur-sm shadow-inner">
                <Stethoscope className="w-10 h-10 text-med-blue" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight font-heading text-glow">
                14 Mart <span className="text-med-blue bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Tıp Bayramı</span>
            </h1>
            <p className="mt-3 text-lg md:text-xl text-slate-600 max-w-lg font-light leading-relaxed">
                Yapay zeka ile size ve sevdiklerinize özel, unutulmaz bir bayram kartpostalı tasarlayın.
            </p>
        </header>
    );
}
