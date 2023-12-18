import type { Historical } from '~/lib/cache'
import { formatNumber } from '~/lib/utils'

export function SummarySection({ historical }: { historical: Historical }) {
  const summary = Object.keys(historical).reduce(
    (acc, date) => ({
      readers: acc.readers + historical[date].page_views.total,
      reactions: acc.reactions + historical[date].reactions.total,
      comments: acc.comments + historical[date].comments.total,
      followers: acc.followers + historical[date].follows.total,
    }),
    { readers: 0, reactions: 0, comments: 0, followers: 0 }
  )

  return (
    <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
      {Object.keys(summary).map((key) => (
        <div
          key={key}
          className="rounded-md border border-slate-200 p-4 shadow"
        >
          <p className="text-sm capitalize text-slate-600">{key}</p>
          <p className="mt-0.5 text-xl font-semibold text-slate-800 md:text-3xl">
            {formatNumber(summary[key as keyof typeof summary])}
          </p>
        </div>
      ))}
    </section>
  )
}
