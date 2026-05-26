"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Success! Check your email to confirm your account.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0d0b08] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-serif text-[#d4aa5a] text-2xl tracking-widest uppercase mb-2">
            E<em>ternity</em>
          </div>
          <p className="text-[#f5ede0]/40 text-sm tracking-widest uppercase">
            Create your account
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#d4aa5a]/6 border border-[#d4aa5a]/25 rounded-sm px-4 py-3 text-sm text-[#f5ede0] placeholder-[#f5ede0]/25 outline-none focus:border-[#d4aa5a]/60"
          />
          <button
            onClick={handleSignup}
            disabled={loading}
            className="bg-gradient-to-r from-[#d4aa5a] to-[#c49040] text-[#0d0b08] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create your account →"}
          </button>

          {message && (
            <p className="text-center text-sm text-[#d4aa5a]/80 mt-2">{message}</p>
          )}

          <p className="text-center text-xs text-[#f5ede0]/30 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#d4aa5a]/60 hover:text-[#d4aa5a]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}