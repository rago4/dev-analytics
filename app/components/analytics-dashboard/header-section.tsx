import type { Article } from '~/lib/cache'
import { formatDate } from '~/lib/utils'

export function HeaderSection({ article }: { article: Article }) {
  return (
    <div className="flex items-start justify-between space-x-2">
      <div>
        <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
          {article.title}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {`Published at ${formatDate(new Date(article.published_at))}`}
        </p>
      </div>
      <a
        href={`https://dev.to/${article.user.username}/${article.slug}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium shadow transition-colors hover:bg-slate-100"
      >
        View
      </a>
    </div>
  )
}
