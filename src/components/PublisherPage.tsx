import { useState, useCallback, useRef, memo } from "react";
import { Building2, RectangleHorizontal, Flag, CloudUpload, PenLine, Heading, Link, Globe, MousePointerClick, Send, X, CheckCircle, AlertTriangle, Lock, Rocket } from "lucide-react";
import TerminalLog, { type LogEntry } from "./TerminalLog";
import CustomSelect from "./CustomSelect";
import { fbApi } from "@/lib/facebook-api";

const CTA_OPTIONS = [
  { value: "NO_BUTTON", label: "No Button" }, { value: "LEARN_MORE", label: "Learn More" },
  { value: "SHOP_NOW", label: "Shop Now" }, { value: "SIGN_UP", label: "Sign Up" },
  { value: "DOWNLOAD", label: "Download" }, { value: "BOOK_TRAVEL", label: "Book Travel" },
  { value: "CONTACT_US", label: "Contact Us" }, { value: "APPLY_NOW", label: "Apply Now" },
  { value: "GET_OFFER", label: "Get Offer" }, { value: "GET_QUOTE", label: "Get Quote" },
  { value: "SUBSCRIBE", label: "Subscribe" }, { value: "WATCH_MORE", label: "Watch More" },
  { value: "SEND_MESSAGE", label: "Send Message" }, { value: "ORDER_NOW", label: "Order Now" },
  { value: "CALL_NOW", label: "Call Now" }, { value: "LIKE_PAGE", label: "Like Page" },
  { value: "OPEN_LINK", label: "Open Link" }, { value: "WHATSAPP_MESSAGE", label: "WhatsApp Message" },
];

interface PublisherPageProps {
  connected: boolean;
  onOpenDrawer: () => void;
  adAccounts: any[];
  pages: any[];
  credentials: { token: string; c_user: string; xs: string } | null;
}

// Memoized card to prevent re-renders
const FormCard = memo(({ children, title, icon: Icon, iconColor }: { children: React.ReactNode; title: string; icon: any; iconColor: string }) => (
  <div className="rounded-xl p-5 mb-3" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
        <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
      </div>
      <span className="text-xs font-display font-semibold tracking-tight">{title}</span>
    </div>
    {children}
  </div>
));
FormCard.displayName = "FormCard";

const PublisherPage = ({ connected, onOpenDrawer, adAccounts, pages, credentials }: PublisherPageProps) => {
  const [selectedAdAccount, setSelectedAdAccount] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [caption, setCaption] = useState("");
  const [headline, setHeadline] = useState("");
  const [destUrl, setDestUrl] = useState("");
  const [dispUrl, setDispUrl] = useState("");
  const [description, setDescription] = useState("");
  const [ctaType, setCtaType] = useState("NO_BUTTON");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imgError, setImgError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = useCallback((type: LogEntry["type"], message: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((prev) => [...prev, { id: ++logIdRef.current, type, message, time }]);
  }, []);

  const getPageToken = useCallback(() => {
    const page = pages.find((p: any) => p.id === selectedPage);
    return page?.access_token || credentials?.token || "";
  }, [pages, selectedPage, credentials]);

  const validateImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setImgError("Invalid file type. Use an image file."); return;
    }
    if (file.size > 30 * 1024 * 1024) { setImgError("File too large. Max 30MB."); return; }
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width !== img.height) { setImgError(`Must be square (1:1). Yours: ${img.width}×${img.height}px.`); return; }
      setImgError("");
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      addLog("success", `Image: ${file.name} (${img.width}×${img.height})`);
    };
    img.onerror = () => setImgError("Could not read the image file.");
    img.src = URL.createObjectURL(file);
  }, [addLog]);

  const removeImage = () => {
    setImageFile(null); setImagePreview(""); setImgError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePublish = async () => {
    if (!connected || !credentials) { addLog("error", "Not connected."); onOpenDrawer(); return; }
    if (!selectedAdAccount) { addLog("error", "Select an Ad Account."); return; }
    if (!selectedPage) { addLog("error", "Select a Facebook Page."); return; }
    if (!imageFile) { addLog("error", "Upload an image."); return; }
    
    if (!headline) { addLog("error", "Headline is required."); return; }
    if (!destUrl) { addLog("error", "Destination URL is required."); return; }

    setPublishing(true);
    setPublishSuccess(false);
    setLogs([]);
    const pageToken = getPageToken();
    const base = { token: credentials.token, c_user: credentials.c_user, xs: credentials.xs };

    try {
      addLog("pending", "Step 1/6 — Uploading image...");
      const d1 = await fbApi({ ...base, action: "upload_image", ad_account_id: selectedAdAccount, page_token: pageToken }, imageFile);
      if (!d1?.success) { addLog("error", `Step 1 FAILED: ${d1?.error || "Unknown"}`); setPublishing(false); return; }
      addLog("success", "Step 1 DONE — Image uploaded");

      addLog("pending", "Step 2/6 — Creating ad creative...");
      const d2 = await fbApi({ ...base, action: "create_creative", ad_account_id: selectedAdAccount, page_id: selectedPage, page_token: pageToken, image_hash: d1.hash, headline, description, caption, destination_url: destUrl, display_url: dispUrl, cta_type: ctaType });
      if (!d2?.success) { addLog("error", `Step 2 FAILED: ${d2?.error || "Unknown"}`); setPublishing(false); return; }
      addLog("success", "Step 2 DONE — Creative created");

      addLog("pending", "Step 3/6 — Waiting for creative...");
      let storyId: string | null = null;
      for (let i = 1; i <= 15; i++) {
        await new Promise((r) => setTimeout(r, 2500));
        const dp = await fbApi({ ...base, action: "poll_creative", creative_id: d2.creative_id, page_token: pageToken });
        if (!dp?.success) { addLog("error", `Step 3 FAILED: ${dp?.error}`); setPublishing(false); return; }
        if (dp.ready) { storyId = dp.story_id; addLog("success", `Step 3 DONE — Ready (attempt ${i})`); break; }
        addLog("info", `Step 3 — Attempt ${i}/15...`);
      }
      if (!storyId) { addLog("error", "Step 3 FAILED: Timeout"); setPublishing(false); return; }

      addLog("pending", "Step 4/6 — Publishing...");
      const d3 = await fbApi({ ...base, action: "publish_post", story_id: storyId, page_token: pageToken });
      if (!d3?.success) { addLog("error", `Step 4 FAILED: ${d3?.error}`); setPublishing(false); return; }
      addLog("success", "Step 4 DONE — Published");

      addLog("pending", "Step 5/6 — Verifying...");
      await new Promise((r) => setTimeout(r, 1500));
      const dv = await fbApi({ ...base, action: "verify_post", post_id: d3.post_id, page_token: pageToken });
      addLog(dv?.success ? "success" : "info", dv?.success ? "Step 5 DONE — Verified ✓" : "Step 5 — Verification inconclusive");

      addLog("complete", "All steps complete — post is live!");
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 4000);
    } catch (e: any) {
      addLog("error", `Network error: ${e.message}`);
    }
    setPublishing(false);
  };

  const adAccountOptions = adAccounts.map((a: any) => ({ value: a.account_id, label: a.name || `act_${a.account_id}` }));
  const pageOptions = pages.map((p: any) => ({ value: p.id, label: p.name || p.id }));

  return (
    <div className="min-h-screen pt-[calc(64px+2rem)] px-4 md:px-6 pb-16">
      <div className="max-w-[720px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-1.5">
            Facebook <span className="grad-text">Publisher</span>
          </h1>
          <p className="text-muted-foreground text-xs">Create and publish ad-quality posts securely</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
            {/* Lock overlay */}
            {!connected && (
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center gap-3 rounded-2xl"
                style={{ background: "hsl(var(--overlay))", backdropFilter: "blur(6px)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-xs font-medium">Connect your account to get started</p>
                <button
                  onClick={onOpenDrawer}
                  className="px-5 py-2 rounded-lg border-none text-primary-foreground text-xs font-semibold cursor-pointer transition-all hover:opacity-90"
                  style={{ background: "var(--grad-primary)" }}
                >
                  Connect Now →
                </button>
              </div>
            )}

          {/* Account Selection */}
          <FormCard icon={Building2} iconColor="hsl(var(--brand-light))" title="Account Selection">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <RectangleHorizontal className="w-3 h-3" style={{ color: "hsl(var(--brand-light))" }} /> Ad Account
                </label>
                <CustomSelect
                  options={adAccountOptions}
                  value={selectedAdAccount}
                  onChange={setSelectedAdAccount}
                  placeholder={adAccounts.length ? "Select account..." : "Connect to load"}
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <Flag className="w-3 h-3" style={{ color: "hsl(var(--violet-light))" }} /> Facebook Page
                </label>
                <CustomSelect
                  options={pageOptions}
                  value={selectedPage}
                  onChange={setSelectedPage}
                  placeholder={pages.length ? "Select page..." : "Connect to load"}
                />
              </div>
            </div>
          </FormCard>

          {/* Image Upload */}
          <FormCard icon={CloudUpload} iconColor="hsl(var(--violet-light))" title="Creative Image">
            {/* Use image/* for faster Android file picker */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && validateImage(e.target.files[0])} />
            <div
              className={`border border-dashed rounded-lg cursor-pointer relative overflow-hidden transition-all ${dragOver ? "border-primary" : imageFile ? "border-emerald/40 border-solid" : "border-border hover:border-muted-foreground/30"}`}
              style={{ background: dragOver ? "hsl(var(--brand-dim))" : imageFile ? "hsl(var(--emerald-dim))" : "hsl(var(--input-bg))" }}
              onClick={() => !imageFile && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && validateImage(e.dataTransfer.files[0]); }}
            >
              {!imageFile ? (
                <div className="py-10 px-6 text-center">
                  <CloudUpload className="w-8 h-8 mx-auto mb-3 text-muted-foreground/40" />
                  <div className="text-xs font-semibold mb-1">Drop image or tap to browse</div>
                  <div className="text-[0.65rem] text-muted-foreground">Square (1:1) · PNG, JPG, WebP · Max 30MB</div>
                </div>
              ) : (
                <div className="p-3">
                  <div className="flex items-center gap-3 rounded-lg p-3" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
                    <img src={imagePreview} alt="preview" className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate mb-0.5">{imageFile.name}</div>
                      <div className="text-[0.65rem] flex items-center gap-1" style={{ color: "hsl(var(--emerald-light))" }}>
                        <CheckCircle className="w-3 h-3" /> Ready
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeImage(); }} className="bg-transparent border-none text-muted-foreground cursor-pointer p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {imgError && (
              <div className="mt-2 p-2.5 rounded-lg text-[0.7rem] flex items-center gap-2" style={{ background: "hsl(var(--destructive) / 0.06)", border: "1px solid hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}>
                <AlertTriangle className="w-3 h-3 shrink-0" /> {imgError}
              </div>
            )}
          </FormCard>

          {/* Post Details */}
          <FormCard icon={PenLine} iconColor="hsl(var(--emerald-light))" title="Post Details">
            <div className="flex flex-col gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <PenLine className="w-3 h-3" style={{ color: "hsl(var(--emerald-light))" }} /> Caption
                  <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-medium normal-case tracking-normal text-muted-foreground" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>Optional</span>
                </label>
                <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write your post caption..." className="premium-input resize-y min-h-[72px]" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <Heading className="w-3 h-3" style={{ color: "hsl(var(--emerald-light))" }} /> Headline <span className="text-destructive">*</span>
                </label>
                <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Eye-catching headline" className="premium-input" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <PenLine className="w-3 h-3" style={{ color: "hsl(var(--emerald-light))" }} /> Description
                  <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-medium normal-case tracking-normal text-muted-foreground" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>Optional</span>
                </label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief website description" className="premium-input" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                    <Link className="w-3 h-3" style={{ color: "hsl(var(--emerald-light))" }} /> Destination URL <span className="text-destructive">*</span>
                  </label>
                  <input type="url" value={destUrl} onChange={(e) => setDestUrl(e.target.value)} placeholder="https://example.com" className="premium-input" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                    <Globe className="w-3 h-3" style={{ color: "hsl(var(--emerald-light))" }} /> Display URL
                    <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-medium normal-case tracking-normal text-muted-foreground" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>Optional</span>
                  </label>
                  <input type="text" value={dispUrl} onChange={(e) => setDispUrl(e.target.value)} placeholder="example.com" className="premium-input" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <MousePointerClick className="w-3 h-3" style={{ color: "hsl(var(--emerald-light))" }} /> CTA Button
                </label>
                <CustomSelect options={CTA_OPTIONS} value={ctaType} onChange={setCtaType} searchable={false} />
              </div>
            </div>
          </FormCard>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full py-3.5 rounded-lg border-none text-primary-foreground font-display font-bold text-sm tracking-tight cursor-pointer flex items-center justify-center gap-2.5 transition-all mb-4 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90"
            style={{
              background: publishSuccess ? "linear-gradient(135deg, hsl(var(--emerald)), hsl(160 65% 38%))" : "var(--grad-primary)",
              boxShadow: publishSuccess ? "0 4px 20px hsl(var(--emerald) / 0.2)" : "0 4px 20px hsl(217 92% 60% / 0.2)",
            }}
          >
            {publishing ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin-slow" />
            ) : publishSuccess ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {publishing ? "Publishing..." : publishSuccess ? "Published!" : "Publish to Facebook"}
          </button>
        </div>

        {/* Terminal */}
        <div className="mt-6">
          <TerminalLog logs={logs} onClear={() => setLogs([])} />
        </div>
      </div>
    </div>
  );
};

export default PublisherPage;
