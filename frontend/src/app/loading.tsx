export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col justify-center">
      <div className="max-w-2xl">
        <div className="h-4 w-24 bg-muted mb-4 animate-pulse" />
        <div className="h-12 w-full bg-muted mb-8 animate-pulse" />
        <div className="space-y-4">
          <div className="h-20 w-full bg-muted animate-pulse border border-border" />
          <div className="h-20 w-full bg-muted animate-pulse border border-border" />
          <div className="h-20 w-3/4 bg-muted animate-pulse border border-border" />
        </div>
      </div>
    </div>
  );
}
