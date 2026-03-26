import { motion } from "framer-motion";
import { Rocket, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onLaunch: () => void;
  onExplore: () => void;
}

const ease = [0.25, 1, 0.5, 1] as const;

const HeroSection = ({ onLaunch, onExplore }: HeroSectionProps) => {
  return (
    <section className="min-h-[calc(100svh-64px)] flex flex-col items-center justify-center text-center px-5 py-20 relative overflow-hidden">
      {/* Badge */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[0.65rem] font-semibold tracking-wider uppercase mb-8"
          style={{ background: "hsl(var(--brand-dim))", color: "hsl(var(--brand-light))", border: "1px solid hsl(217 92% 60% / 0.12)" }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Encrypted · Secure · Professional
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease }}
        className="font-display font-extrabold text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08] tracking-[-0.035em] mb-5 max-w-[720px]"
      >
        Publish{" "}
        <span className="grad-text">Premium</span>
        <br />
        Facebook Content
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16, ease }}
        className="text-muted-foreground text-[clamp(0.875rem,1.8vw,1.05rem)] max-w-[480px] leading-relaxed mb-10 px-4"
      >
        The ultimate tool for publishing ad-quality page posts with custom creatives, CTA buttons, and secure API calls.
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.24, ease }}
        className="flex gap-3 flex-wrap justify-center"
      >
        <button
          onClick={onLaunch}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg border-none text-primary-foreground font-semibold text-sm cursor-pointer transition-all hover:opacity-90"
          style={{ background: "var(--grad-primary)", boxShadow: "0 4px 24px hsl(217 92% 60% / 0.25)" }}
        >
          <Rocket className="w-4 h-4" /> Launch App
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={onExplore}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm cursor-pointer transition-colors hover:bg-muted text-foreground bg-transparent border border-border"
        >
          <Sparkles className="w-4 h-4 text-violet-light" /> Explore Features
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
