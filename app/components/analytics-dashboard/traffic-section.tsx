import type { Referrers } from '~/lib/cache'
import { formatNumber } from '~/lib/utils'

export function TrafficSection({ referrers }: { referrers: Referrers }) {
  const { domains } = referrers
  const max = Math.max(...domains.map((item) => item.count))

  return (
    <section className="mt-3.5 rounded-md border border-slate-200 p-4 shadow">
      <h2 className="text-xl font-bold text-slate-800">
        Traffic Source Summary
      </h2>
      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
          <p>Source</p>
          <p>Views</p>
        </div>
        <div className="flex justify-between">
          <div className="relative w-full space-y-1.5 text-sm text-slate-700">
            {domains.map((item) => {
              const source = item.domain || 'Other sources'
              return (
                <div
                  key={`bar-${source}`}
                  style={{ width: `${Math.max(1, (item.count / max) * 100)}%` }}
                  className="h-9 rounded bg-blue-600/25 leading-9"
                >
                  <p className="absolute left-2 truncate">{source}</p>
                </div>
              )
            })}
          </div>
          <div className="ml-4 w-min space-y-1.5 text-right text-sm text-slate-800 md:ml-6">
            {domains.map((item) => (
              <p key={`count-${item.domain}`} className="h-9 leading-9">
                {formatNumber(item.count)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
