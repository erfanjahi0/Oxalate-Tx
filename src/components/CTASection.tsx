import { motion } from "framer-motion";
import { Rocket, ArrowRight } from "lucide-react";

const CTASection = ({ onLaunch }: { onLaunch: () => void }) => (
  <section className="px-5 py-16 pb-24 text-center relative z-[1]">
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-[480px] mx-auto">
      <h2 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-bold tracking-tight mb-4">
        Ready to <span className="grad-text-secondary">Go Live?</span>
      </h2>
      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">Connect your Facebook account and publish your first professional post in under a minute.</p>
      <button
        onClick={onLaunch}
        className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border-none text-primary-foreground font-semibold text-sm cursor-pointer transition-all hover:opacity-90"
        style={{ background: "var(--grad-primary)", boxShadow: "0 4px 24px hsl(217 92% 60% / 0.25)" }}
      >
        <Rocket className="w-4 h-4" /> Open Publisher
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </motion.div>
  </section>
);

export default CTASection;
