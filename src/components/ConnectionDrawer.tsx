import { useState, useEffect } from "react";
import { X, Info, Plug, Trash2, Shield, Key, Cookie } from "lucide-react";

interface ConnectionDrawerProps {
  open: boolean;
  onClose: () => void;
  connected: boolean;
  onConnect: (token: string, cUser: string, xs: string) => void;
  onDisconnect: () => void;
  loading: boolean;
  error: string;
  savedCreds: { t: string; c: string; x: string } | null;
}

const ConnectionDrawer = ({ open, onClose, connected, onConnect, onDisconnect, loading, error, savedCreds }: ConnectionDrawerProps) => {
  const [token, setToken] = useState(savedCreds?.t || "");
  const [cUser, setCUser] = useState(savedCreds?.c || "");
  const [xs, setXs] = useState(savedCreds?.x || "");

  useEffect(() => {
    if (savedCreds) {
      setToken(prev => prev || savedCreds.t);
      setCUser(prev => prev || savedCreds.c);
      setXs(prev => prev || savedCreds.x);
    }
  }, [savedCreds]);

  const handleConnect = () => {
    if (!token.trim() || !cUser.trim() || !xs.trim()) return;
    onConnect(token.trim(), cUser.trim(), xs.trim());
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[200] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "hsl(var(--overlay))", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full z-[201] flex flex-col overflow-hidden transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "hsl(var(--surface-elevated))", borderLeft: "1px solid hsl(var(--border))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 shrink-0" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
          <div>
            <div className="font-display font-bold text-base flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: "hsl(var(--brand-light))" }} /> Connect Account
            </div>
            <div className="text-[0.65rem] text-muted-foreground mt-0.5">Secure connection to Meta Graph API</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted transition-colors bg-transparent border border-border">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {savedCreds && (
            <div className="p-3 rounded-lg text-[0.7rem] flex items-center gap-2 animate-log-in" style={{ background: "hsl(var(--emerald-dim))", border: "1px solid hsl(160 65% 48% / 0.1)", color: "hsl(var(--emerald-light))" }}>
              <CheckIcon /> Credentials restored from previous session
            </div>
          )}

          <div className="p-3 rounded-lg text-[0.7rem] text-muted-foreground leading-relaxed flex items-start gap-2.5" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "hsl(var(--brand-light))" }} />
            <span>Credentials are processed server-side through a secure edge function. They never leave your browser except in encrypted API calls.</span>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                <Key className="w-3 h-3" style={{ color: "hsl(var(--brand-light))" }} /> Access Token <span className="text-destructive">*</span>
              </label>
              <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="EAAG..." className="premium-input font-mono" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                <Cookie className="w-3 h-3" style={{ color: "hsl(var(--violet-light))" }} /> c_user Cookie <span className="text-destructive">*</span>
              </label>
              <input type="text" value={cUser} onChange={(e) => setCUser(e.target.value)} placeholder="100xxxxxxxxxxxxx" className="premium-input font-mono" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                <Cookie className="w-3 h-3" style={{ color: "hsl(var(--emerald-light))" }} /> xs Cookie <span className="text-destructive">*</span>
              </label>
              <input type="text" value={xs} onChange={(e) => setXs(e.target.value)} placeholder="xxxxx..." className="premium-input font-mono" />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg text-[0.7rem] flex items-center gap-2" style={{ background: "hsl(var(--destructive) / 0.06)", border: "1px solid hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}>
              <X className="w-3 h-3 shrink-0" /> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 flex flex-col gap-2.5 shrink-0" style={{ borderTop: "1px solid hsl(var(--border))" }}>
          <button
            onClick={handleConnect}
            disabled={loading || !token.trim() || !cUser.trim() || !xs.trim()}
            className="w-full py-3 rounded-lg border-none text-primary-foreground text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90"
            style={{
              background: connected ? "linear-gradient(135deg, hsl(var(--emerald)), hsl(160 65% 38%))" : "var(--grad-primary)",
            }}
          >
            {loading ? <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin-slow" /> : <Plug className="w-3.5 h-3.5" />}
            {loading ? "Connecting..." : connected ? "Connected ✓" : "Connect Account"}
          </button>
          {connected && (
            <button
              onClick={onDisconnect}
              className="w-full py-2 rounded-lg border text-[0.7rem] font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-colors hover:bg-destructive/10 bg-transparent"
              style={{ borderColor: "hsl(var(--destructive) / 0.15)", color: "hsl(var(--destructive))" }}
            >
              <Trash2 className="w-3 h-3" /> Disconnect & Clear
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" /></svg>
);

export default ConnectionDrawer;
