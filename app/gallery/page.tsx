"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

interface FileItem {
  name: string;
  url: string;
  source: string;
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
}

export default function Gallery() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  useEffect(() => {
    async function fetchFiles() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: ownFiles } = await supabase.storage
        .from("Memories")
        .list(user.id, {
          sortBy: { column: "created_at", order: "desc" },
        });

      const { data: contribFiles } = await supabase.storage
        .from("Memories")
        .list(`${user.id}/contributions`, {
          sortBy: { column: "created_at", order: "desc" },
        });

      const allFiles: FileItem[] = [];

      if (ownFiles) {
        for (const file of ownFiles) {
          if (file.name === "contributions") continue;
          const { data: urlData } = supabase.storage
            .from("Memories")
            .getPublicUrl(`${user.id}/${file.name}`);
          allFiles.push({
            name: file.name,
            url: urlData.publicUrl,
            source: "mine",
            isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name),
            isVideo: /\.(mp4|mov|avi|webm)$/i.test(file.name),
            isAudio: /\.(mp3|wav|m4a|aac)$/i.test(file.name),
          });
        }
      }

      if (contribFiles) {
        for (const file of contribFiles) {
          const { data: urlData } = supabase.storage
            .from("Memories")
            .getPublicUrl(`${user.id}/contributions/${file.name}`);
          allFiles.push({
            name: file.name,
            url: urlData.publicUrl,
            source: "family",
            isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name),
            isVideo: /\.(mp4|mov|avi|webm)$/i.test(file.name),
            isAudio: /\.(mp3|wav|m4a|aac)$/i.test(file.name),
          });
        }
      }

      setFiles(allFiles);
      setLoading(false);
    }
    fetchFiles();
  }, [router]);

  const tabs = [
    { id: "all", label: "All memories" },
    { id: "mine", label: "My uploads" },
    { id: "family", label: "Family and friends" },
  ];

  const filtered = activeTab === "all"
    ? files
    : files.filter((f) => f.source === activeTab);

  const images = filtered.filter((f) => f.isImage);
  const videos = filtered.filter((f) => f.isVideo);
  const audio = filtered.filter((f) => f.isAudio);
  const docs = filtered.filter((f) => !f.isImage && !f.isVideo && !f.isAudio);

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

      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-3">Your memories</p>
        <h1 className="font-serif text-5xl font-light mb-8">
          Your <em className="text-[#e8c87a]">gallery</em>
        </h1>

        <div className="flex gap-1 mb-10 border-b border-[#d4aa5a]/15">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-xs tracking-widest uppercase transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-[#d4aa5a] text-[#d4aa5a]"
                  : "text-[#f5ede0]/30 hover:text-[#f5ede0]/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-[#f5ede0]/30 text-sm">Loading your memories...</p>
        )}

        {!loading && filtered.length === 0 && (
          <div className="border border-dashed border-[#d4aa5a]/20 rounded-sm p-12 text-center">
            <div className="font-serif text-4xl text-[#d4aa5a]/20 mb-4">✦</div>
            <p className="text-sm text-[#f5ede0]/40 mb-6">
              {activeTab === "family"
                ? "No family contributions yet. Share your invite link with loved ones."
                : "No memories uploaded yet."}
            </p>
            {activeTab !== "family" && (
              <button
                onClick={() => router.push("/upload")}
                className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-6 py-3 rounded-sm"
              >
                Upload memories
              </button>
            )}
          </div>
        )}

        {images.length > 0 && (
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-[#d4aa5a]/60 mb-6">
              Photos ({images.length})
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((file) => (
                <div key={file.name} className="relative aspect-square rounded-sm overflow-hidden border border-[#d4aa5a]/10">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {activeTab === "all" && file.source === "family" && (
                    <div className="absolute top-2 right-2 bg-[#d4aa5a]/80 text-[#0d0b08] text-xs px-2 py-1 rounded-sm">
                      Family
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-[#d4aa5a]/60 mb-6">
              Videos ({videos.length})
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((file) => (
                <div key={file.name} className="rounded-sm overflow-hidden border border-[#d4aa5a]/10">
                  <video src={file.url} controls className="w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {audio.length > 0 && (
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-[#d4aa5a]/60 mb-6">
              Audio recordings ({audio.length})
            </p>
            <div className="flex flex-col gap-3">
              {audio.map((file) => (
                <div key={file.name} className="border border-[#d4aa5a]/15 rounded-sm p-4">
                  <p className="text-xs text-[#f5ede0]/40 mb-2">{file.name}</p>
                  <audio src={file.url} controls className="w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {docs.length > 0 && (
          <div className="mb-12">
            <p className="text-xs tracking-widest uppercase text-[#d4aa5a]/60 mb-6">Documents</p>
            <div className="flex flex-col gap-3">
              {docs.map((file) => (
                <div key={file.name} className="border border-[#d4aa5a]/15 rounded-sm p-4 flex items-center gap-3">
                  <div className="text-[#d4aa5a]">✦</div>
                  <div className="text-sm text-[#f5ede0]/60">{file.name}</div>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-[#d4aa5a]/40 hover:text-[#d4aa5a]">
                    Open
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => router.push("/upload")}
            className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
          >
            Upload more memories
          </button>
        </div>
      </section>
    </main>
  );
}