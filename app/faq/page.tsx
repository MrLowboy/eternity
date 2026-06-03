"use client";
import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    category: "About Eternity",
    questions: [
      {
        q: "What is Eternity?",
        a: "Eternity is a service that transforms your photographs, videos, audio recordings, and life story into a beautiful cinematic documentary — a lasting legacy for your family and future generations.",
      },
      {
        q: "Who is Eternity for?",
        a: "Eternity is for anyone who wants to preserve their life story. Whether you want to capture your own journey, create a documentary for a parent or grandparent, or preserve a family history — Eternity is built for you.",
      },
      {
        q: "How does it work?",
        a: "It's three simple steps. First you upload your photos, videos, and memories. Then you answer a thoughtful questionnaire about your life. Finally our AI reads everything and crafts a cinematic documentary script that weaves your story together.",
      },
    ],
  },
  {
    category: "Your memories",
    questions: [
      {
        q: "What types of files can I upload?",
        a: "You can upload photographs, videos, audio recordings, PDFs, and written documents. We accept all common file formats including JPG, PNG, MP4, MOV, MP3, and PDF.",
      },
      {
        q: "Is there a limit to how many photos and videos I can upload?",
        a: "The Legacy and Heritage plans include unlimited uploads. The Essential plan supports up to 100 photos. The more memories you share the richer your documentary will be.",
      },
      {
        q: "Can family and friends contribute their own memories?",
        a: "Yes — this is one of our favorite features. From your dashboard you can copy a unique invite link and share it with family and friends. They can upload their own photos, videos, and written memories without needing to create an account.",
      },
      {
        q: "Can I add more memories after I submit?",
        a: "Yes. You can upload additional photos, videos, and memories at any time. Your documentary can be regenerated to include the new additions.",
      },
    ],
  },
  {
    category: "The documentary",
    questions: [
      {
        q: "What does the documentary actually look like?",
        a: "Our AI reads your life story answers and all your uploaded memories, then crafts a cinematic documentary script — complete with an opening narration, six chapters covering your life, and a closing that ties your story together. The script is written to be read as a narrator would speak it.",
      },
      {
        q: "How long does it take to generate my documentary?",
        a: "The AI typically takes about 60-90 seconds to read your story and write your documentary script. We show you updates as it works so you know it's creating something special.",
      },
      {
        q: "Can I regenerate my documentary if I am not happy with it?",
        a: "Yes. You can regenerate your documentary as many times as you like. Adding more detailed answers to the questionnaire and more photos will improve the result each time.",
      },
      {
        q: "Will my documentary include memories shared by family and friends?",
        a: "Yes. When you generate your documentary our AI weaves together your own story AND the memories contributed by your loved ones into one unified narrative.",
      },
    ],
  },
  {
    category: "Privacy and security",
    questions: [
      {
        q: "Who can see my memories and documentary?",
        a: "Only you. Your memories, questionnaire answers, and documentary are completely private. Family and friends can only access your contribution page through the unique invite link you choose to share.",
      },
      {
        q: "Who owns my photos and memories?",
        a: "You do. Always. Eternity never claims ownership of your content. Your memories belong to you and your family.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payments are processed by Stripe, one of the world's most trusted payment processors. Eternity never sees or stores your credit card information.",
      },
      {
        q: "How long do you keep my memories?",
        a: "Your memories are stored securely for as long as your account is active. We are committed to preserving your legacy for generations to come.",
      },
    ],
  },
  {
    category: "Pricing and refunds",
    questions: [
      {
        q: "How much does Eternity cost?",
        a: "Eternity offers three plans — Essential at $99, Legacy at $199, and Heritage at $399. All plans are one time payments with no subscriptions or hidden fees.",
      },
      {
        q: "What is your refund policy?",
        a: "If you are not satisfied with your Eternity documentary we offer a full refund within 30 days of purchase. Simply contact us and we will make it right.",
      },
      {
        q: "Can I buy Eternity as a gift for someone?",
        a: "Absolutely. Eternity makes a deeply meaningful gift for a parent, grandparent, or loved one. Contact us and we will help you set up a gift purchase.",
      },
    ],
  },
];

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(null);

  function toggle(id) {
    setOpenQuestion(openQuestion === id ? null : id);
  }

  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f5ede0]">
      <nav className="flex items-center justify-between px-10 py-6 border-b border-[#d4aa5a]/20">
        <Link href="/" className="font-serif text-[#d4aa5a] text-xl tracking-widest uppercase">
          E<em>ternity</em>
        </Link>
        <Link href="/login" className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors">
          Sign in
        </Link>
      </nav>

      <section className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-4">Got questions?</p>
        <h1 className="font-serif text-5xl font-light mb-4">
          We have <em className="text-[#e8c87a]">answers</em>
        </h1>
        <p className="text-[#f5ede0]/40 text-sm leading-relaxed mb-16">
          Everything you need to know about preserving your legacy with Eternity.
        </p>

        <div className="flex flex-col gap-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <p className="text-xs tracking-widest uppercase text-[#d4aa5a] mb-6">
                {section.category}
              </p>
              <div className="flex flex-col gap-2">
                {section.questions.map((item, i) => {
                  const id = `${section.category}-${i}`;
                  return (
                    <div
                      key={id}
                      className="border border-[#d4aa5a]/15 rounded-sm overflow-hidden"
                    >
                      <button
                        onClick={() => toggle(id)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-[#d4aa5a]/5 transition-colors"
                      >
                        <span className="font-serif text-base text-[#f5ede0]">{item.q}</span>
                        <span className="text-[#d4aa5a]/40 text-lg ml-4">
                          {openQuestion === id ? "−" : "+"}
                        </span>
                      </button>
                      {openQuestion === id && (
                        <div className="px-6 pb-4 text-sm text-[#f5ede0]/50 leading-relaxed border-t border-[#d4aa5a]/10 pt-4">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center border-t border-[#d4aa5a]/10 pt-12">
          <p className="text-sm text-[#f5ede0]/40 mb-6">Still have questions?</p>
          <Link
            href="/signup"
            className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-opacity"
          >
            Begin your story
          </Link>
        </div>
      </section>

      <footer className="flex items-center justify-between px-10 py-8 border-t border-[#d4aa5a]/10">
        <div className="font-serif text-sm tracking-widest uppercase text-[#d4aa5a]/30">Eternity</div>
        <div className="text-xs text-[#f5ede0]/15 tracking-widest">© 2026 Eternity · All rights reserved</div>
      </footer>
    </main>
  );
}