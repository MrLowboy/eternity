"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const loadingMessages = [
  "Reading your life story...",
  "Gathering memories from loved ones...",
  "Finding the moments that matter most...",
  "Weaving your narrative together...",
  "Crafting your opening chapter...",
  "Bringing your story to life...",
  "Adding the final touches...",
  "Almost ready...",
];

export default function Generate() {
  const [generating, setGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [script, setScript] = useState("");
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!generating) return;
    let index = 0;
    setLoadingMessage(loadingMessages[0]);
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 8000);
    return () => clearInterval(interval);
  }, [generating]);

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    setScript("");
    setAudioUrl("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("questionnaire")
      .select("answers")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      setError("Please complete the questionnaire first.");
      setGenerating(false);
      return;
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: data.answers, userId: user.id }),
    });

    const result = await response.json();

    if (result.error) {
      setError(result.error);
    } else {
      setScript(result.script);
    }

    setGenerating(false);
  }

  async function handleGenerateNarration() {
    setGeneratingAudio(true);
    setError("");

    const response = await fetch("/api/narration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script }),
    });

    const result = await response.json();

    if (result.error) {
      setError(result.error);
    } else {
      const audioBlob = new Blob(
        [Uint8Array.from(atob(result.audio), (c) => c.charCodeAt(0))],
        { type: result.contentType }
      );
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    }

    setGeneratingAudio(false);
  }

  function renderScript() {
    if (!script) return null;
    return (
      <div className="mt-8">
        <div className="border border-[#d4aa5a]/20 rounded-sm p-8 mb-6">
          <p className="text-xs tracking-widest uppercase text-[#d4aa5a] mb-6">
            Your Documentary Script
          </p>
          <div className="font-serif text-lg leading-relaxed text-[#f5ede0]/80 whitespace-pre-wrap">
            {script}
          </div>
        </div>

        <div className="border border-[#d4aa5a]/20 rounded-sm p-6 mb-6 bg-[#d4aa5a]/5">
          <p className="text-xs tracking-widest uppercase text-[#d4aa5a] mb-2">
            Step 2 - Generate narration
          </p>
          <p className="text-sm text-[#f5ede0]/40 mb-4">
            Convert your script into a cinematic voiceover using AI.
          </p>
 <button
            onClick={handleGenerateNarration}
            disabled={generatingAudio}
            className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-6 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {generatingAudio ? "Generating..." : "Generate narration"}
          </button>
          {audioUrl && (
            <div className="mt-4">
              <p className="text-xs text-[#d4aa5a]/60 mb-3">Your narration is ready:</p>
              <audio controls src={audioUrl} className="w-full mb-3" />
              
                href={audioUrl}
                download="eternity-narration.mp3"
                className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
              >
                Download narration
              </a>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleGenerate}
            className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
          >
            Regenerate script
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f5ede0]">
      <nav className="flex items-center justify-between px-10 py-6 border-b border-[#d4aa5a]/20">
        <div className="font-serif text-[#d4aa5a] text-xl tracking-widest uppercase">
          Eternity
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
        >
          Back to dashboard
        </button>
      </nav>

      <section className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-3">Step 03</p>
        <h1 className="font-serif text-5xl font-light mb-2">
          Your <em className="text-[#e8c87a]">documentary</em>
        </h1>
        <p className="text-[#f5ede0]/40 text-sm leading-relaxed mb-12">
          Claude will read your life story and craft a cinematic documentary script just for you.
        </p>

        {!script && !generating && (
          <button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-opacity"
          >
            Generate my documentary
          </button>
        )}

        {generating && (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="w-12 h-12 border border-[#d4aa5a]/30 border-t-[#d4aa5a] rounded-full animate-spin"></div>
            <p className="font-serif text-xl font-light text-[#f5ede0]/60 italic animate-pulse">
              {loadingMessage}
            </p>
            <p className="text-xs text-[#f5ede0]/20 tracking-widest uppercase">
              This takes about a minute
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-400/80 text-sm mt-6">{error}</p>
        )}

        {renderScript()}
      </section>
    </main>
  );
}