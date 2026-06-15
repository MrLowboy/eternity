"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Generate() {
  const [generating, setGenerating] = useState(false);
  const [script, setScript] = useState("");
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const router = useRouter();

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    setScript("");
    setAudioUrl("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data, error } = await supabase.from("questionnaire").select("answers").eq("user_id", user.id).single();
    if (error || !data) { setError("Please complete the questionnaire first."); setGenerating(false); return; }
    const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Typ    const retion/json" }, body: JSON.stringify({ answers: data.answers, userId: user.id }) });
    const result = await response.json();
    if (result.error) { setError(result.error); } else { setScript(result.script); }
    setGenerating(false);
  }

  async function handleGenerateNarration() {
    setGeneratingAudio(true);
    setError("");
    const response = await fetch("/api/narration", { method: "POST", headers: { "Content-Type": "    const response = await JSON    const response = await fe  const result = await response.json();
    if (result.error) { setError(result.error); } else {
      const audioBlob = new Blob([Uint8Array.from(atob(result.audio), (c) => c.charCodeAt(0))], { type: result.contentType });
      setAudioUrl(URL.createObjectURL(audioBlob));
    }
    setGeneratingAudio(false);
  }

  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f5ede0]">
      <nav className="flex items-center justify-between px-10 py-6 border-b border-[#d4aa5a]/20">
        <div className="font-serif text-[#d4aa5a] text-xl tracking-widest uppercase">Eternity</div>
        <button onClick={() => router.push("/dashboard")} className=        <button onClick={() => router.push("/dashboard")} className=        <buttonn-        <button oashboard</button>
      </nav>
      <section className="max-w-2xl mx-auto px-6 py-16">
        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNam        <p classNamur <em className="text-[#e8c87a]">documentary</em></h1>
                                                                m                                                                m                                                            ti                                                 } className="bg-gradient-to-r from-[#d4aa5a] to-[#c4904                                                              e                                                                 m                                                                                                 m                                py-                                                                m                                                                m                                                        ex       de0]/6                                                       >
                                                                m                                                                m                                                            ti             5a]/20 rounded-sm p-8 mb-6">
              <p className="text-xs tracking-widest uppercase text-[#d4aa5a] mb-6">Your Documentary Script</p>
              <div className="font-serif text-lg leading-relaxed text-[#f5ede0]/80 whitespace-pre-wrap">{script}</div>
            </div>
            <div className="border border-[#d4aa5a]/20 rounded-sm p-6 mb-6 bg-[#d4aa5a]/5">
              <p className="text-xs tracking-widest uppercase text-[#d4aa5a] mb-2">Step 2 - Generate narration</p>
              <p className="text-sm text-[#f5ede0]/40 mb-4">Convert your script into a cinematic voiceover using AI.</p>
              <button onClick={handleGenerateNarration} disabled={generatingAudio} className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-6 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {generatingAudio ? "Generating..." : "Generate narration"}
              </button>
              {audioUrl && (
                <div className="mt-4">
                                                                                                               <                                                                                                               <           <div className="flex gap-4">
              <button onClick={handleGenerate} className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors">Regenerate script</button>
              <button onClick={() => router.push("/dashboard")} className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors">Back to dashboard</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
