import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f5ede0] font-sans">

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-[#d4aa5a]/20">
        <div className="font-serif text-[#d4aa5a] text-xl tracking-widest uppercase">
          E<em>ternity</em>
        </div>
        <div className="flex gap-8 text-xs tracking-widest uppercase text-[#d4aa5a]/60">
          <a href="#how" className="hover:text-[#d4aa5a] transition-colors">How it works</a>
          <Link href="/pricing" className="hover:text-[#d4aa5a] transition-colors">Pricing</Link>
          <Link href="/faq" className="hover:text-[#d4aa5a] transition-colors">FAQ</Link>
          <a href="#waitlist" className="hover:text-[#d4aa5a] transition-colors">Join waitlist</a>
          <Link href="/login" className="hover:text-[#d4aa5a] transition-colors text-[#d4aa5a]">Sign in</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-40">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-6">Your life, preserved forever</p>
        <h1 className="font-serif text-6xl md:text-8xl font-light leading-tight mb-6">
          Leave your mark<br />on <em className="text-[#e8c87a]">eternity</em>
        </h1>
        <p className="text-[#f5ede0]/50 text-lg font-light max-w-md mb-10 leading-relaxed">
          Transform your photographs, videos, voices, and stories into a documentary that lives beyond you — a gift to every generation that follows.
        </p>
        <div className="flex gap-4 items-center">
          <Link href="/signup" className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-opacity">
            Begin your story →
          </Link>
          <Link href="/pricing" className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors">
            See pricing
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-2xl mx-auto px-6 py-20 border-t border-[#d4aa5a]/10">
        <p className="text-xs tracking-[0.35em] uppercase text-[#d4aa5a]/45 mb-10">How it works</p>
        {[
          { num: "01", title: "Upload your memories", desc: "Photographs, home videos, audio recordings, letters, diary entries — every artifact of your life, in one place." },
          { num: "02", title: "Tell us your story", desc: "Answer a thoughtful questionnaire about your life, values, relationships, and the moments that shaped you." },
          { num: "03", title: "AI weaves the narrative", desc: "Our AI studies your memories and crafts a cinematic documentary narrated in your own voice." },
          { num: "04", title: "Share with generations", desc: "A private, permanent link — yours to share with family, and theirs to share with grandchildren they haven't yet met." },
        ].map((step) => (
          <div key={step.num} className="grid grid-cols-[48px_1fr] gap-5 py-6 border-b border-[#d4aa5a]/10 last:border-none">
            <div className="font-serif text-4xl font-light text-[#d4aa5a]/20">{step.num}</div>
            <div>
              <div className="font-serif text-xl text-[#f5ede0] mb-1">{step.title}</div>
              <div className="text-sm font-light text-[#f5ede0]/40 leading-relaxed">{step.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="bg-[#d4aa5a]/5 border-y border-[#d4aa5a]/12 py-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-serif text-3xl font-light text-[#f5ede0] mb-2">Join the waitlist</h2>
          <p className="text-xs tracking-widest text-[#f5ede0]/35 mb-8 uppercase">Be among the first to preserve your legacy</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60"
            />
            <button className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-5 py-3 rounded-sm hover:opacity-85 transition-opacity whitespace-nowrap">
              Reserve my place
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between px-10 py-8">
        <div className="font-serif text-sm tracking-widest uppercase text-[#d4aa5a]/30">Eternity</div>
        <div className="flex gap-6 text-xs tracking-widest uppercase text-[#f5ede0]/20">
          <Link href="/pricing" className="hover:text-[#d4aa5a]/40 transition-colors">Pricing</Link>
          <Link href="/faq" className="hover:text-[#d4aa5a]/40 transition-colors">FAQ</Link>
          <Link href="/login" className="hover:text-[#d4aa5a]/40 transition-colors">Sign in</Link>
          <Link href="/signup" className="hover:text-[#d4aa5a]/40 transition-colors">Sign up</Link>
        </div>
        <div className="text-xs text-[#f5ede0]/15 tracking-widest">© 2026 Eternity · All rights reserved</div>
      </footer>

    </main>
  );
}