"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    }
    getUser();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function copyInviteLink() {
    const link = `${window.location.origin}/contribute?id=${user.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f5ede0]">
      <nav className="flex items-center justify-between px-10 py-6 border-b border-[#d4aa5a]/20">
        <div className="font-serif text-[#d4aa5a] text-xl tracking-widest uppercase">
          E<em>ternity</em>
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
        >
          Sign out
        </button>
      </nav>

      <section className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-3">Welcome back</p>
        <h1 className="font-serif text-5xl font-light mb-2">
          Your story awaits
        </h1>
        <p className="text-[#f5ede0]/40 text-sm leading-relaxed mb-12">
          Begin building your documentary by uploading your memories and telling us your story.
        </p>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <div
            onClick={() => router.push("/upload")}
            className="border border-[#d4aa5a]/15 rounded-sm p-6 hover:border-[#d4aa5a]/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="font-serif text-3xl text-[#d4aa5a]/20">01</div>
              <div>
                <div className="font-serif text-lg text-[#f5ede0] mb-1">Upload your memories</div>
                <div className="text-xs text-[#f5ede0]/40">Photos, videos, audio recordings, and writings</div>
              </div>
              <div className="ml-auto text-[#d4aa5a]/30 text-xl">→</div>
            </div>
          </div>

          <div
            onClick={() => router.push("/questionnaire")}
            className="border border-[#d4aa5a]/15 rounded-sm p-6 hover:border-[#d4aa5a]/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="font-serif text-3xl text-[#d4aa5a]/20">02</div>
              <div>
                <div className="font-serif text-lg text-[#f5ede0] mb-1">Tell us your story</div>
                <div className="text-xs text-[#f5ede0]/40">Answer questions about your life and memories</div>
              </div>
              <div className="ml-auto text-[#d4aa5a]/30 text-xl">→</div>
            </div>
          </div>

          <div
            onClick={() => router.push("/generate")}
            className="border border-[#d4aa5a]/15 rounded-sm p-6 hover:border-[#d4aa5a]/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="font-serif text-3xl text-[#d4aa5a]/20">03</div>
              <div>
                <div className="font-serif text-lg text-[#f5ede0] mb-1">Generate your documentary</div>
                <div className="text-xs text-[#f5ede0]/40">Let AI craft your cinematic life story</div>
              </div>
              <div className="ml-auto text-[#d4aa5a]/30 text-xl">→</div>
            </div>
          </div>
        </div>

        {/* Invite section */}
        <div className="border border-[#d4aa5a]/20 rounded-sm p-6 bg-[#d4aa5a]/5">
          <div className="font-serif text-lg text-[#f5ede0] mb-1">Invite family and friends</div>
          <div className="text-xs text-[#f5ede0]/40 mb-4">
            Share this link so loved ones can upload their photos and memories to your documentary.
          </div>
          <button
            onClick={copyInviteLink}
            className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-6 py-3 rounded-sm hover:opacity-90 transition-opacity"
          >
            {copied ? "Link copied! ✦" : "Copy invite link →"}
          </button>
        </div>
      </section>
    </main>
  );
}