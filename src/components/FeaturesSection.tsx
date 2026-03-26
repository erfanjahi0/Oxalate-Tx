import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Lock, Zap, Image, Database, Palette, Smartphone } from "lucide-react";

const features = [
  { icon: Lock, title: "End-to-End Encrypted", desc: "Every API call runs through a secure edge function. No tokens or payloads are exposed.", color: "hsl(var(--brand-light))" },
  { icon: Zap, title: "6-Step Pipeline", desc: "From image upload to live post verification — the entire pipeline runs in seconds.", color: "hsl(var(--amber-light))" },
  { icon: Image, title: "Premium Creatives", desc: "Upload square images with custom headlines, captions, display URLs, and 18 CTA types.", color: "hsl(var(--violet-light))" },
  { icon: Database, title: "Persistent Storage", desc: "Credentials saved securely in local storage and restored on every visit.", color: "hsl(var(--emerald-light))" },
  { icon: Palette, title: "Premium UI", desc: "Dark theme with ambient animations, glassmorphism, and refined typography.", color: "hsl(var(--brand-light))" },
  { icon: Smartphone, title: "Fully Responsive", desc: "Pixel-perfect on every device with touch-optimized interactions.", color: "hsl(var(--violet-light))" },
];

const FeaturesSection = forwardRef<HTMLElement>((_, ref) => (
  <section ref={ref} className="px-5 py-20 w-full">
    <div className="max-w-[1000px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-[clamp(1.35rem,3vw,2.2rem)] font-bold tracking-tight mb-3 px-2">
          Everything You Need to{" "}
          <br className="sm:hidden" />
          <span className="grad-text">Publish Like a Pro</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-[400px] mx-auto">Built for agencies, power users, and marketers who demand speed and security.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="rounded-xl p-5 transition-colors hover:bg-muted/80 group cursor-default"
            style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
              <f.icon className="w-4 h-4" style={{ color: f.color }} />
            </div>
            <div className="text-sm font-display font-semibold mb-1.5 tracking-tight">{f.title}</div>
            <div className="text-muted-foreground text-xs leading-relaxed">{f.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));

FeaturesSection.displayName = "FeaturesSection";
export default FeaturesSection;
