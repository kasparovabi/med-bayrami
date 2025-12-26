import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
    label: string;
    onFileSelect: (file: File | null) => void;
    id: string;
}

export default function FileUpload({ label, onFileSelect, id }: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onFileSelect(file);
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onFileSelect(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="flex flex-col gap-3 w-full group">
            <span className="font-semibold text-slate-700 ml-1 text-sm uppercase tracking-wider opacity-80 group-hover:text-med-blue transition-colors">{label}</span>
            <div
                onClick={() => inputRef.current?.click()}
                className={`
          relative cursor-pointer 
          h-64 w-full rounded-3xl 
          border-2 border-dashed transition-all duration-500 ease-out
          flex flex-col items-center justify-center 
          overflow-hidden
          ${preview
                        ? "border-transparent shadow-2xl ring-4 ring-white/50 scale-[1.02]"
                        : "border-gray-300 hover:border-blue-400 bg-white/40 hover:bg-white/60 hover:shadow-lg"
                    }
        `}
            >
                <input
                    type="file"
                    id={id}
                    ref={inputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                        <button
                            onClick={clearFile}
                            className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-red-500/80 transition-all border border-white/30 shadow-lg transform hover:rotate-90 hover:scale-110 z-10"
                        >
                            <X size={20} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center transform translate-y-2 group-hover:translate-y-0 duration-300">
                            <span className="text-xs font-bold tracking-widest uppercase">Değiştir</span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-gray-400 group-hover:text-med-blue transition-colors transform group-hover:-translate-y-2 duration-300">
                        <div className="p-5 rounded-full bg-white/50 shadow-sm ring-1 ring-gray-100 group-hover:shadow-xl group-hover:ring-blue-200 transition-all duration-300">
                            <Upload size={36} className="text-current" />
                        </div>
                        <span className="text-sm font-medium tracking-wide">Fotoğraf Seç veya Sürükle</span>
                    </div>
                )}
            </div>
        </div>
    );
}
