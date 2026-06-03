"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    setUploading(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    for (const file of selectedFiles) {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("Memories")
        .upload(filePath, file);
      if (error) {
        setMessage(`Error uploading ${file.name}: ${error.message}`);
        setUploading(false);
        return;
      }
    }

    setMessage(`Successfully uploaded ${selectedFiles.length} file(s)!`);
    setUploading(false);
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
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-3">Step 01</p>
        <h1 className="font-serif text-5xl font-light mb-2">
          Upload your memories
        </h1>
        <p className="text-[#f5ede0]/40 text-sm leading-relaxed mb-12">
          Add your photographs, videos, audio recordings, and writings. The more you share, the richer your documentary will be.
        </p>

        <div className="border border-dashed border-[#d4aa5a]/30 rounded-sm p-12 text-center hover:border-[#d4aa5a]/60 transition-colors">
          <div className="font-serif text-4xl text-[#d4aa5a]/20 mb-4">+</div>
          <p className="text-sm text-[#f5ede0]/40 mb-6">
            Drop your files here or click to browse
          </p>
          <label className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-opacity cursor-pointer">
            {uploading ? "Uploading..." : "Choose files"}
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-[#f5ede0]/20 mt-4">
            Photos, videos, audio, PDFs, and documents accepted
          </p>
        </div>

        {message && (
          <p className="text-center text-sm text-[#d4aa5a]/80 mt-6">{message}</p>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => router.push("/questionnaire")}
            className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
          >
            Continue to questionnaire
          </button>
        </div>
      </section>
    </main>
  );
}