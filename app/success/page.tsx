import Link from "next/link";

export default function Success() {
  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f5ede0] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="font-serif text-[#d4aa5a] text-2xl tracking-widest uppercase mb-8">
          E<em>ternity</em>
        </div>
        
        <div className="text-[#d4aa5a] text-5xl mb-6">✦</div>
        
        <h1 className="font-serif text-4xl font-light mb-4">
          Welcome to <em className="text-[#e8c87a]">Eternity</em>
        </h1>
        
        <p className="text-[#f5ede0]/40 text-sm leading-relaxed mb-10">
          Your payment was successful. You can now begin building your documentary. Upload your memories, tell us your story, and let AI craft your legacy.
        </p>

        <Link
          href="/dashboard"
          className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-opacity"
        >
          Begin your story →
        </Link>
      </div>
    </main>
  );
}