"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Pricing() {
  const [loading, setLoading] = useState("");
  const router = useRouter();

  async function handleCheckout(price: number, plan: string) {
    setLoading(plan);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/signup");
      return;
    }

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, email: user.email, price, plan }),
    });

    const { url, error } = await response.json();

    if (error) {
      alert("Something went wrong. Please try again.");
      setLoading("");
      return;
    }

    window.location.href = url;
  }

  const plans = [
    {
      name: "Essential",
      price: 99,
      description: "Perfect for preserving your personal story",
      features: [
        "Upload up to 100 photos",
        "Life story questionnaire",
        "AI documentary script",
        "Private shareable link",
      ],
      highlight: false,
    },
    {
      name: "Legacy",
      price: 199,
      description: "The complete life documentary experience",
      features: [
        "Unlimited photo and video uploads",
        "Life story questionnaire",
        "AI documentary script",
        "Private shareable link",
        "Family sharing up to 10 members",
        "Preserved forever",
      ],
      highlight: true,
    },
    {
      name: "Heritage",
      price: 399,
      description: "For families who want the ultimate legacy",
      features: [
        "Everything in Legacy",
        "Up to 3 family documentaries",
        "Priority processing",
        "Dedicated support",
        "Physical USB delivery",
      ],
      highlight: false,
    },
  ];

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

      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4aa5a] mb-4">Simple pricing</p>
        <h1 className="font-serif text-5xl font-light mb-4">
          Choose your <em className="text-[#e8c87a]">legacy</em>
        </h1>
        <p className="text-[#f5ede0]/40 text-sm leading-relaxed mb-16 max-w-md mx-auto">
          Pay once and preserve your life story forever. No subscriptions, no hidden fees.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-sm p-8 text-left ${
                plan.highlight
                  ? "border-[#d4aa5a]/60 bg-[#d4aa5a]/5"
                  : "border-[#d4aa5a]/20"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs tracking-widest uppercase text-[#d4aa5a] mb-4">
                  Most popular
                </div>
              )}
              <div className="font-serif text-xl text-[#f5ede0] mb-1">{plan.name}</div>
              <div className="text-xs text-[#f5ede0]/40 mb-6">{plan.description}</div>
              <div className="font-serif text-5xl font-light text-[#e8c87a] mb-1">
                ${plan.price}
              </div>
              <div className="text-xs tracking-widest uppercase text-[#f5ede0]/30 mb-8">
                One time payment
              </div>

              <div className="flex flex-col gap-3 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-[#f5ede0]/60">
                    <div className="text-[#d4aa5a] mt-0.5">✦</div>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCheckout(plan.price * 100, plan.name)}
                disabled={loading === plan.name}
                className={`w-full text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-sm transition-opacity disabled:opacity-50 ${
                  plan.highlight
                    ? "bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] hover:opacity-90"
                    : "border border-[#d4aa5a]/40 text-[#d4aa5a] hover:bg-[#d4aa5a]/10"
                }`}
              >
                {loading === plan.name ? "Loading..." : "Begin your story →"}
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#f5ede0]/20 mt-10">
          Secure payment powered by Stripe · All plans include lifetime access
        </p>
      </section>
    </main>
  );
}