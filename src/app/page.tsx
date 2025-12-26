"use client";

import { useState } from "react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ScenarioSelector from "@/components/ScenarioSelector";
import AspectRatioSelector, { AspectRatioType } from "@/components/AspectRatioSelector";
import { Sparkles, Settings2, Share2, Download, RefreshCw, Smartphone } from "lucide-react";

export default function Home() {
  const [doctorFile, setDoctorFile] = useState<File | null>(null);
  const [childFile, setChildFile] = useState<File | null>(null);
  const [scenario, setScenario] = useState("Park");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>("1:1");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Now fetching an ARRAY of images
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!doctorFile || !childFile) {
      alert("Lütfen önce hem doktor hem de çocuk fotoğrafını yükleyin!");
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]); // Clear previous

    try {
      // 1. Upload Images to Firebase
      const { uploadImageToFirebase } = await import("@/lib/firebase");

      console.log("Uploading doctor image...");
      const doctorUrl = await uploadImageToFirebase(doctorFile);

      console.log("Uploading child image...");
      const childUrl = await uploadImageToFirebase(childFile);

      // 2. Send URLs and Config to API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorUrl,
          childUrl,
          scenario,
          customPrompt,
          aspectRatio // Send selected ratio
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kart oluşturulamadı.");
      }

      // 3. Set array of images
      setGeneratedImages(data.images || []);
    } catch (error: any) {
      console.error("Generation failed", error);
      alert(`Hata: ${error.message || "Beklenmedik bir sorun oluştu."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 relative overflow-x-hidden selection:bg-blue-200 selection:text-blue-900">
      <div className="mesh-bg" />
      <Header />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 mt-12 mb-20">

        {/* LEFT PANEL: CONFIGURATION */}
        <div className="flex-1 space-y-8 slide-up" style={{ animationDelay: "0.1s" }}>

          <div className="glass-panel p-6 md:p-8 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/30">01</span>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Fotoğrafları Yükle</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <FileUpload label="Doktor Fotoğrafı" id="doctor-upload" onFileSelect={setDoctorFile} />
              <FileUpload label="Çocuk Fotoğrafı" id="child-upload" onFileSelect={setChildFile} />
            </div>
          </div>

          <div className="glass-panel p-6 md:p-8 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-400 text-white text-xs font-bold shadow-lg shadow-purple-500/30">02</span>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Senaryo ve Boyut</h2>
            </div>

            <div className="space-y-6">
              <ScenarioSelector selected={scenario} onSelect={setScenario} />

              <div className="pt-4 border-t border-slate-200/50">
                <AspectRatioSelector selected={aspectRatio} onSelect={setAspectRatio} />
              </div>
            </div>
          </div>

          {/* Advanced Tools Toggle */}
          <div className="flex justify-end px-2">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-med-blue transition-colors bg-white/30 hover:bg-white/60 px-4 py-2 rounded-full border border-transparent hover:border-blue-200 backdrop-blur-sm"
            >
              <Settings2 size={16} className={`transition-transform duration-500 ${isAdvancedOpen ? "rotate-180" : ""}`} />
              {isAdvancedOpen ? "Gelişmiş Ayarları Gizle" : "Gelişmiş Ayarlar (Prompt)"}
            </button>
          </div>

          {isAdvancedOpen && (
            <div className="glass-panel p-6 animate-in slide-up border-l-4 border-l-blue-400">
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Özel Talimatlar</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Örn: Arka planda Türk bayrağı dalgalansın, gökyüzü güneşli olsun, herkes gülsün..."
                className="w-full p-4 rounded-2xl border border-white/60 bg-white/40 focus:bg-white/80 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 text-slate-700 h-32 resize-none shadow-inner text-base"
              />
              <p className="text-xs text-slate-400 mt-2 text-right">Yapay zeka bu notları dikkate alacaktır.</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading || !doctorFile || !childFile}
            className={`
              w-full py-5 rounded-2xl text-xl font-bold tracking-wide shadow-2xl flex items-center justify-center gap-4
              transition-all duration-500 transform relative overflow-hidden group
              ${isLoading
                ? "bg-slate-200 text-slate-400 cursor-wait scale-[0.98]"
                : "btn-primary hover:scale-[1.02] hover:-translate-y-1"
              }
            `}
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />

            {isLoading ? (
              <>
                <RefreshCw className="animate-spin" size={24} />
                <span className="animate-pulse">Sihir Hazırlanıyor (4x)...</span>
              </>
            ) : (
              <>
                <Sparkles className="fill-white/20 animate-pulse" size={24} />
                HAZIRLA VE PAYLAŞ
              </>
            )}
          </button>
        </div>

        {/* RIGHT PANEL: PREVIEW / GALLERY */}
        <div className="flex-1 slide-up h-full sticky top-8" style={{ animationDelay: "0.2s" }}>

          <div className="glass-panel-heavy p-3 md:p-6 min-h-[600px] flex flex-col relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500 opacity-60" />

            <div className="absolute bottom-0 right-0 w-64 h-64 bg-med-blue/5 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />

            <div className="flex items-center justify-between mb-6 px-2 pt-2">
              <div className="flex gap-2 items-center">
                <Smartphone className="text-slate-400 w-5 h-5" />
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sonuçlar</h2>
              </div>
              {generatedImages.length > 0 && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold shadow-sm">{generatedImages.length} Görsel</span>}
            </div>

            <div className="flex-1 bg-slate-100/50 rounded-3xl border border-white/60 p-4 shadow-inner min-h-[500px] overflow-y-auto">

              {generatedImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedImages.map((img, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/50 shadow-lg bg-white aspect-auto animate-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <img src={img} alt={`Result ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                        <button
                          onClick={() => window.open(img, '_blank')}
                          className="p-2 bg-white rounded-full text-slate-800 hover:scale-110 transition-transform shadow-lg"
                          title="İndir / Aç"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md font-bold backdrop-blur-md">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-20" />
                    <div className="relative bg-white w-40 h-40 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-50">
                      <Sparkles size={48} className="text-slate-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-600 mb-2">Sihirli Anı Bekliyor</h3>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                    Soldaki panelden fotoğrafları yükleyin ve bir senaryo seçin. Yapay zeka sizin için 4 farklı sonuç üretecek.
                  </p>
                </div>
              )}
            </div>

            {generatedImages.length > 0 && (
              <div className="mt-4 text-center animate-in slide-up">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-black tracking-[0.2em] text-xs uppercase">Favorinizi Seçin ve İndirin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Signature */}
      <div className="text-center pb-8 opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-xs font-medium text-slate-600">Geliştirildi: <span className="font-bold">Google Gemini & Kie AI</span></p>
      </div>
    </main>
  );
}
