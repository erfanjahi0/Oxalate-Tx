import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Zap, LogIn, AlertCircle, ArrowLeft } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
  onBack?: () => void;
}

const LoginPage = ({ onLogin, onBack }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "hsl(var(--background))" }}>
      <div
        className="w-full max-w-[380px] rounded-2xl p-8 flex flex-col items-center gap-6"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="self-start flex items-center gap-1.5 text-[0.7rem] text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" /> Back to home
          </button>
        )}

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-md)" }}
          >
            <Zap className="w-6 h-6 text-primary-foreground" fill="currentColor" />
          </div>
          <div className="text-center">
            <h1 className="font-display font-bold text-xl text-foreground">
              XTool<span className="text-primary">.</span>FB
            </h1>
            <p className="text-[0.7rem] text-muted-foreground mt-1">Sign in to access the dashboard</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
          <div>
            <label className="text-[0.65rem] font-semibold text-muted-foreground mb-1.5 block uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="premium-input"
              required
            />
          </div>
          <div>
            <label className="text-[0.65rem] font-semibold text-muted-foreground mb-1.5 block uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="premium-input"
              required
            />
          </div>

          {error && (
            <div
              className="p-2.5 rounded-lg text-[0.7rem] flex items-center gap-2"
              style={{
                background: "hsl(var(--destructive) / 0.06)",
                border: "1px solid hsl(var(--destructive) / 0.1)",
                color: "hsl(var(--destructive))",
              }}
            >
              <AlertCircle className="w-3 h-3 shrink-0" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full py-3 rounded-lg border-none text-primary-foreground text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90 mt-2"
            style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-sm)" }}
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin-slow" />
            ) : (
              <LogIn className="w-3.5 h-3.5" />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-[0.6rem] text-muted-foreground text-center">
          Contact administrator for account access
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
