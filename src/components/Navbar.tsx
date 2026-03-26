import { useState } from "react";
import { Zap, Settings, Home, LogOut, LogIn } from "lucide-react";

interface NavbarProps {
  connected: boolean;
  userName: string;
  onConnect: () => void;
  onNavigate: (page: "home" | "app") => void;
  currentPage: "home" | "app";
  onSignOut?: () => void;
  userEmail?: string;
  onLogin?: () => void;
  isLoggedIn: boolean;
}

const Navbar = ({ connected, userName, onConnect, onNavigate, currentPage, onSignOut, userEmail, onLogin, isLoggedIn }: NavbarProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
    <nav
      className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center px-4 md:px-6"
      style={{
        background: "hsl(var(--nav-bg))",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        borderBottom: "1px solid hsl(var(--glass-border))",
      }}
    >
      <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-md)" }}
          >
            <Zap className="w-4 h-4 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            XTool<span className="text-primary">.</span>FB
          </span>
          <span
            className="text-[0.5rem] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase"
            style={{ background: "hsl(var(--brand-dim))", color: "hsl(var(--brand-light))", border: "1px solid hsl(217 92% 60% / 0.12)" }}
          >
            PRO
          </span>
        </button>

        <div className="flex items-center gap-2">
          {/* Connection status - only show when logged in and on app */}
          {isLoggedIn && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
              <div className="relative flex items-center">
                <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald" : "bg-destructive"}`} />
                {connected && <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald" style={{ animation: "ring-pulse 2s ease-out infinite" }} />}
              </div>
              <span className="text-muted-foreground">{connected ? userName : "Offline"}</span>
            </div>
          )}

          {currentPage === "home" ? (
            <div className="flex items-center gap-1.5">
              {isLoggedIn ? (
                <button
                  onClick={() => onNavigate("app")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:opacity-90 text-primary-foreground border-none"
                  style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-sm)" }}
                >
                  <Zap className="w-3.5 h-3.5" /> Launch
                </button>
              ) : (
                <button
                  onClick={onLogin}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:opacity-90 text-primary-foreground border-none"
                  style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-sm)" }}
                >
                  <LogIn className="w-3.5 h-3.5" /> Login
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigate("home")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors hover:bg-muted border border-border bg-transparent text-muted-foreground"
              >
                <Home className="w-3.5 h-3.5" /> Home
              </button>
              <button
                onClick={onConnect}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:opacity-90 text-primary-foreground border-none"
                style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-sm)" }}
              >
                <Settings className="w-3.5 h-3.5" /> {connected ? "Settings" : "Connect"}
              </button>
            </div>
          )}

          {/* Sign Out */}
          {onSignOut && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors hover:bg-destructive/10 border border-border bg-transparent text-muted-foreground"
              title={userEmail || "Sign out"}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </nav>

    {/* Logout Confirmation Modal */}
    {showLogoutConfirm && (
      <>
        <div
          className="fixed inset-0 z-[300] transition-opacity"
          style={{ background: "hsl(var(--overlay))", backdropFilter: "blur(4px)" }}
          onClick={() => setShowLogoutConfirm(false)}
        />
        <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
          <div
            className="w-full max-w-[340px] rounded-2xl p-6 flex flex-col items-center gap-4"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "hsl(var(--destructive) / 0.1)" }}
            >
              <LogOut className="w-5 h-5" style={{ color: "hsl(var(--destructive))" }} />
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-sm text-foreground">Sign Out?</h3>
              <p className="text-[0.7rem] text-muted-foreground mt-1">Are you sure you want to sign out of your account?</p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors hover:bg-muted border border-border bg-transparent text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); onSignOut(); }}
                className="flex-1 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:opacity-90 border-none text-destructive-foreground"
                style={{ background: "hsl(var(--destructive))" }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
};

export default Navbar;
