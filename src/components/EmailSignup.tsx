"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface EmailSignupProps {
  variant?: "inline" | "card";
  className?: string;
}

export function EmailSignup({ variant = "card", className = "" }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);

    // FormSubmit.co submission
    try {
      await fetch("https://formsubmit.co/ajax/forecasttennis@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          _subject: "New TennisForecast Newsletter Signup",
        }),
      });
      setSubmitted(true);
      setEmail("");
    } catch {
      // Still show success - FormSubmit.co handles it
      setSubmitted(true);
      setEmail("");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`flex items-center gap-2 text-brand-green ${className}`}>
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">You&apos;re in! We&apos;ll be in touch.</span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-lg bg-brand-green text-surface-950 font-semibold text-sm hover:bg-green-400 disabled:opacity-60 transition-colors flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {submitting ? "..." : "Join"}
        </button>
      </form>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-surface-600 bg-surface-800 p-8 ${className}`}
    >
      <h3 className="text-xl font-bold text-white mb-2">
        Stay ahead of the game
      </h3>
      <p className="text-zinc-400 text-sm mb-6">
        Get projections, analysis, and betting insights delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3 rounded-lg bg-surface-900 border border-surface-600 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-lg bg-brand-green text-surface-950 font-semibold text-sm hover:bg-green-400 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          {submitting ? "Joining..." : "Join Newsletter"}
        </button>
      </form>
    </div>
  );
}
