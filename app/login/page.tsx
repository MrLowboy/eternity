"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
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

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f5ede0]">
      
      {/* Nav */}
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

      {/* Welcome */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-3">Welcome back</p>
        <h1 className="font-serif text-5xl font-light mb-2">
          Your <em className="text-[#e8c87a]">story</em> awaits
        </h1>
        <p className="text-[#f5ede0]/40 text-sm leading-relaxed mb-12">
          Begin building your documentary by uploading your memories and telling us your story.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-4">
          
          <div className="border border-[#d4aa5a]/15 rounded-sm p-6 hover:border-[#d4aa5a]/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="font-serif text-3xl text-[#d4aa5a]/20">01</div>
              <div>
                <div className="font-serif text-lg text-[#f5ede0] mb-1">Upload your memories</div>
                <div className="text-xs text-[#f5ede0]/40">Photos, videos, audio recordings, and writings</div>
              </div>
              <div className="ml-auto text-[#d4aa5a]/30 text-xl">→</div>
            </div>
          </div>

          <div className="border border-[#d4aa5a]/15 rounded-sm p-6 hover:border-[#d4aa5a]/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="font-serif text-3xl text-[#d4aa5a]/20">02</div>
              <div>
                <div className="font-serif text-lg text-[#f5ede0] mb-1">Tell us your story</div>
                <div className="text-xs text-[#f5ede0]/40">Answer questions about your life and memories</div>
              </div>
              <div className="ml-auto text-[#d4aa5a]/30 text-xl">→</div>
            </div>
          </div>

          <div className="border border-[#d4aa5a]/15 rounded-sm p-6 hover:border-[#d4aa5a]/40 transition-colors cursor-pointer opacity-50">
            <div className="flex items-center gap-4">
              <div className="font-serif text-3xl text-[#d4aa5a]/20">03</div>
              <div>
                <div className="font-serif text-lg text-[#f5ede0] mb-1">Generate your documentary</div>
                <div className="text-xs text-[#f5ede0]/40">Complete steps 1 and 2 to unlock</div>
              </div>
              <div className="ml-auto text-[#d4aa5a]/30 text-xl">🔒</div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}