export default function ScriptNewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      {/* Progress */}
      <main>{children}</main>
    </div>
  );
}