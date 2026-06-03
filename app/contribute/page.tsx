"use client";
import { useState, Suspense } from "react";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";

interface FileItem {
  name: string;
  size: number;
  type: string;
}

function ContributeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [memory1, setMemory1] = useState("");
  const [memory2, setMemory2] = useState("");
  const [memory3, setMemory3] = useState("");
  const [memory4, setMemory4] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("id");

  async function handleSubmit() {
    if (!name || !memory1) {
      alert("Please enter your name and at least one memory.");
      return;
    }
    setUploading(true);

    for (const file of files as any[]) {
      const filePath = `${ownerId}/contributions/${Date.now()}-${file.name}`;
      await supabase.storage.from("Memories").upload(filePath, file);
    }

    const message = [
      memory1 ? `Favorite memory: ${memory1}` : "",
      memory2 ? `How we met or how I know them: ${memory2}` : "",
      memory3 ? `What I will always remember: ${memory3}` : "",
      memory4 ? `What they taught me: ${memory4}` : "",
    ].filter(Boolean).join("\n\n");

    await supabase.from("contributions").insert({
      owner_id: ownerId,
      contributor_name: name,
      contributor_email: email,
      message,
    });

    setUploading(false);
    setDone(true);
  }

  if (!ownerId) {
    return (
      <div className="text-center text-[#f5ede0]/40 py-20">
        Invalid contribution link.
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center py-20">
        <div className="text-[#d4aa5a] text-5xl mb-6">✦</div>
        <h2 className="font-serif text-3xl font-light text-[#f5ede0] mb-4">
          Thank you for contributing
        </h2>
        <p className="text-[#f5ede0]/40 text-sm max-w-md mx-auto leading-relaxed">
          Your memories and photos have been added to their documentary. This is a beautiful gift that will be treasured for generations.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-3">You've been invited</p>
      <h1 className="font-serif text-5xl font-light mb-2">
        Share your <em className="text-[#e8c87a]">memories</em>
      </h1>
      <p className="text-[#f5ede0]/40 text-sm leading-relaxed mb-12">
        You've been invited to contribute to someone's Eternity documentary. The more you share the richer and more meaningful their life story will be.
      </p>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#d4aa5a]/60 mb-2">Your name <span className="text-red-400">*</span></p>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60"
            />
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#d4aa5a]/60 mb-2">Your email (optional)</p>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60"
            />
          </div>
        </div>

        <div className="border-t border-[#d4aa5a]/10 pt-8">
          <p className="text-xs tracking-widest uppercase text-[#d4aa5a] mb-6">Your memories</p>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-[#f5ede0]/70 mb-2">Share a favorite memory <span className="text-red-400">*</span></p>
              <textarea
                placeholder="Tell us about a moment you will never forget..."
                value={memory1}
                onChange={(e) => setMemory1(e.target.value)}
                rows={4}
                className="w-full bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60 resize-none"
              />
            </div>
            <div>
              <p className="text-sm text-[#f5ede0]/70 mb-2">How do you know this person?</p>
              <textarea
                placeholder="How did you meet? What is your relationship?..."
                value={memory2}
                onChange={(e) => setMemory2(e.target.value)}
                rows={4}
                className="w-full bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60 resize-none"
              />
            </div>
            <div>
              <p className="text-sm text-[#f5ede0]/70 mb-2">What will you always remember about them?</p>
              <textarea
                placeholder="Their laugh, their wisdom, their kindness..."
                value={memory3}
                onChange={(e) => setMemory3(e.target.value)}
                rows={4}
                className="w-full bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60 resize-none"
              />
            </div>
            <div>
              <p className="text-sm text-[#f5ede0]/70 mb-2">What did they teach you?</p>
              <textarea
                placeholder="A lesson, a value, something they showed you about life..."
                value={memory4}
                onChange={(e) => setMemory4(e.target.value)}
                rows={4}
                className="w-full bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60 resize-none"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-widest uppercase text-[#d4aa5a]/60 mb-2">Upload photos or videos (optional)</p>
          <label className="flex items-center justify-center border border-dashed border-[#d4aa5a]/30 rounded-sm p-8 cursor-pointer hover:border-[#d4aa5a]/60 transition-colors">
            <div className="text-center">
              <div className="font-serif text-3xl text-[#d4aa5a]/20 mb-2">+</div>
              <p className="text-xs text-[#f5ede0]/40">
                {files.length > 0 ? `${files.length} file(s) selected` : "Click to add photos or videos"}
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={(e) => setFiles(Array.from(e.target.files || []) as any[])}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {uploading ? "Submitting..." : "Submit my memories"}
        </button>

        <p className="text-xs text-[#f5ede0]/20 text-center">
          Fields marked with * are required
        </p>
      </div>
    </div>
  );
}

export default function Contribute() {
  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f5ede0]">
      <nav className="flex items-center justify-between px-10 py-6 border-b border-[#d4aa5a]/20">
        <div className="font-serif text-[#d4aa5a] text-xl tracking-widest uppercase">
          E<em>ternity</em>
        </div>
      </nav>
      <Suspense fallback={<div className="text-center py-20 text-[#f5ede0]/40">Loading...</div>}>
        <ContributeForm />
      </Suspense>
    </main>
  );
}