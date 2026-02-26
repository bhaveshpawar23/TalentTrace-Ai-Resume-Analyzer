
"use client";

import React from "react";
import { Sparkles, Zap, Shield, Target, Briefcase } from "lucide-react";

const tips = [
  { icon: Sparkles, text: "Always quantify your achievements with data." },
  { icon: Zap, text: "Tailor your resume for every job application." },
  { icon: Shield, text: "Ensure your formatting is ATS-friendly." },
  { icon: Target, text: "Focus on keywords found in the job description." },
  { icon: Briefcase, text: "Highlight relevant projects for your niche." },
  { icon: Sparkles, text: "Keep your contact information up to date." },
];

export function Footer() {
  return (
    <footer className="w-full bg-white border-t overflow-hidden py-4">
      <div className="relative flex">
        <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
          {[...tips, ...tips].map((tip, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <tip.icon className="h-4 w-4 text-primary" />
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TalentTrace AI. Empowering careers with intelligence.
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </footer>
  );
}
