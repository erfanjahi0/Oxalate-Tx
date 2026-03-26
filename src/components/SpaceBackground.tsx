const SpaceBackground = () => {
  return (
    <div className="noise-overlay">
      {/* Subtle ambient blobs */}
      <div className="fixed rounded-full pointer-events-none z-0 w-[600px] h-[600px] -top-[200px] -left-[150px] blur-[120px] opacity-50" style={{ background: "hsl(var(--brand-dim))", animation: "nebula-drift 30s ease-in-out infinite alternate" }} />
      <div className="fixed rounded-full pointer-events-none z-0 w-[500px] h-[500px] -bottom-[150px] -right-[100px] blur-[120px] opacity-40" style={{ background: "hsl(var(--violet-dim))", animation: "nebula-drift 35s ease-in-out infinite alternate-reverse" }} />
      <div className="fixed inset-0 z-0 pointer-events-none mesh-bg opacity-40" />
    </div>
  );
};

export default SpaceBackground;
