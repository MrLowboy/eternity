"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const chapters = [
  {
    title: "Early Life",
    questions: [
      "Where were you born and what was your childhood like?",
      "What are your earliest and most vivid memories?",
      "What is a moment from your childhood you have never forgotten?",
      "If you could visit one year from your past, which year would you choose and why?",
    ],
  },
  {
    title: "Family & Relationships",
    questions: [
      "Tell us about your parents and siblings.",
      "What do you admire most about your mother?",
      "What lesson did your parents teach you that you still live by?",
      "What is a family tradition you never want to lose?",
      "Who shaped your character more than anyone else?",
      "What is the kindest thing someone ever did for you?",
    ],
  },
  {
    title: "Love",
    questions: [
      "Tell us about the great loves of your life.",
      "How did you meet your partner or spouse?",
      "What does love mean to you?",
    ],
  },
  {
    title: "Career & Purpose",
    questions: [
      "What work have you done in your life and what drove you?",
      "What did you want to be when you grew up?",
      "What is a risk you took that changed your life?",
      "When did you feel most proud of yourself?",
    ],
  },
  {
    title: "Life Lessons",
    questions: [
      "What do you think are the keys to a successful life?",
      "What advice would you give your younger self?",
      "What has surprised you most about getting older?",
    ],
  },
  {
    title: "Legacy",
    questions: [
      "What do you want to be remembered for?",
      "What message do you want to leave for future generations?",
      "What makes your life story unique?",
      "What are you most grateful for?",
    ],
  },
];

export default function Questionnaire() {
  const [chapter, setChapter] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  function handleAnswer(question: string, value: string) {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("questionnaire")
      .upsert({ user_id: user.id, answers: JSON.stringify(answers) });

    if (error) {
      setMessage("Error saving: " + error.message);
    } else {
      setMessage("Your answers have been saved!");
    }
    setSaving(false);
  }

  const currentChapter = chapters[chapter];

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
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-3">
          Step 02 · Chapter {chapter + 1} of {chapters.length}
        </p>
        <h1 className="font-serif text-5xl font-light mb-2">
          {currentChapter.title}
        </h1>
        <p className="text-[#f5ede0]/40 text-sm leading-relaxed mb-12">
          Answer as much or as little as you like. Every detail helps tell your story.
        </p>

        <div className="flex flex-col gap-8">
          {currentChapter.questions.map((question, i) => (
            <div key={i}>
              <p className="text-sm text-[#f5ede0]/70 mb-3">{question}</p>
              <textarea
                value={answers[question] || ""}
                onChange={(e) => handleAnswer(question, e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60 resize-none"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-12">
          <button
            onClick={() => setChapter((c) => Math.max(0, c - 1))}
            disabled={chapter === 0}
            className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors disabled:opacity-20"
          >
            Previous
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
          >
            {saving ? "Saving..." : message ? message : "Save answers"}
          </button>

          {chapter < chapters.length - 1 ? (
            <button
              onClick={() => setChapter((c) => c + 1)}
              className="text-xs tracking-widest uppercase text-[#d4aa5a]/50 hover:text-[#d4aa5a] transition-colors"
            >
              Next chapter
            </button>
          ) : (
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-6 py-3 rounded-sm hover:opacity-90 transition-opacity"
            >
              Complete
            </button>
          )}
        </div>
      </section>
    </main>
  );
}