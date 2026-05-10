export default function PortalLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-lg bg-muted" />
        <div className="h-4 w-48 rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border bg-card p-4">
            <div className="h-3 w-20 rounded bg-muted mb-3" />
            <div className="h-7 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-48 rounded-xl border bg-card" />
      <div className="h-48 rounded-xl border bg-card" />
    </div>
  );
}
