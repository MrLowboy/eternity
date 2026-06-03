"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Contributions() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchContributions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("contributions")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      setContributions(data || []);
      setLoading(false);
    }
    fetchContributions();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f5ede0]">
      <nav className="flex items-center justify-between px-10 py-6 border-b border-[#d4aa5a]/20">
        <div className="font-serif text-[#d4aa5a] text-xl tracking-widest uppercase">
          E<em>ternity</em>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
        >
          Back to dashboard
        </button>
      </nav>

      <section className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-3">From your loved ones</p>
        <h1 className="font-serif text-5xl font-light mb-2">
          Memories <em className="text-[#e8c87a]">shared</em>
        </h1>
        <p className="text-[#f5ede0]/40 text-sm leading-relaxed mb-12">
          These are the memories, stories, and tributes your family and friends have contributed to your documentary.
        </p>

        {loading && (
          <p className="text-[#f5ede0]/30 text-sm">Loading memories...</p>
        )}

        {!loading && contributions.length === 0 && (
          <div className="border border-dashed border-[#d4aa5a]/20 rounded-sm p-12 text-center">
            <div className="font-serif text-4xl text-[#d4aa5a]/20 mb-4">✦</div>
            <p className="text-sm text-[#f5ede0]/40 mb-6">
              No contributions yet. Share your invite link with family and friends.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
            >
              Go back to dashboard →
            </button>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {contributions.map((c) => (
            <div key={c.id} className="border border-[#d4aa5a]/15 rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-serif text-lg text-[#f5ede0]">{c.contributor_name}</div>
                <div className="text-xs text-[#f5ede0]/25">
                  {new Date(c.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
              {c.contributor_email && (
                <div className="text-xs text-[#d4aa5a]/40 mb-3">{c.contributor_email}</div>
              )}
              <div className="text-sm text-[#f5ede0]/60 leading-relaxed whitespace-pre-wrap">
                {c.message}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}