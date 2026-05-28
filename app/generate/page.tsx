"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Generate() {
  const [generating, setGenerating] = useState(false);
  const [script, setScript] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    setScript("");

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
      body: JSON.stringify({ answers: data.answers }),
    });

    const result = await response.json();

    if (result.error) {
      setError(result.error);
    } else {
      setScript(result.script);
    }

    setGenerating(false);
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

        {!script && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {generating ? "Writing your story..." : "Generate my documentary →"}
          </button>
        )}

        {error && (
          <p className="text-red-400/80 text-sm mt-6">{error}</p>
        )}

        {script && (
          <div className="mt-8">
            <div className="border border-[#d4aa5a]/20 rounded-sm p-8">
              <p className="text-xs tracking-widest uppercase text-[#d4aa5a] mb-6">
                Your Documentary Script
              </p>
              <div className="font-serif text-lg leading-relaxed text-[#f5ede0]/80 whitespace-pre-wrap">
                {script}
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleGenerate}
                className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}