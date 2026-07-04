export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[400px] animate-fade-in rounded-lg border border-border-subtle bg-surface-glass p-8 shadow-panel backdrop-blur-glass">
        <div className="mb-7 flex flex-col items-center gap-3 text-center">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-accent">
            <span className="absolute h-5 w-px rotate-[35deg] bg-accent" style={{ top: -6, right: 8 }} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
