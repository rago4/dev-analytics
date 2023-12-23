export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-8 w-96 rounded bg-slate-200" />
          <div className="mt-2 h-5 w-40 rounded bg-slate-200" />
        </div>
        <div className="h-10 w-16 rounded-md bg-slate-200" />
      </div>
      <div className="mt-4 h-8 w-64 rounded bg-slate-200" />
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="h-28 rounded-md bg-slate-200" />
        <div className="h-28 rounded-md bg-slate-200" />
        <div className="h-28 rounded-md bg-slate-200" />
        <div className="h-28 rounded-md bg-slate-200" />
      </div>
      <div className="mt-3 h-52 w-full rounded-md bg-slate-200" />
      <div className="mt-3 h-52 w-full rounded-md bg-slate-200" />
    </div>
  )
}
