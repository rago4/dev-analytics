import { Link } from '@remix-run/react'

import type { Article } from '~/lib/cache'
import { useFilters } from '~/lib/hooks'
import { formatNumber } from '~/lib/utils'

export function ArticlesList({ articles }: { articles: Article[] }) {
  const { params, search } = useFilters()

  return (
    <ul className="flex flex-row space-x-2 space-y-0 md:mt-3 md:flex-col md:space-x-0 md:space-y-2">
      {articles.map((article) => {
        const active = params.articleQP === String(article.id)
        const [reactions, views, comments] = [
          article.public_reactions_count,
          article.page_views_count,
          article.comments_count,
        ].map(formatNumber)

        return (
          <li key={article.id}>
            <Link
              to={`/?${search({ article: String(article.id) })}`}
              title={article.title}
              className={`block w-48 flex-shrink-0 rounded-md border p-2 text-left font-medium shadow transition-colors md:w-full ${
                active
                  ? 'border-slate-800 bg-slate-800'
                  : 'border-slate-200 bg-white hover:bg-slate-100'
              }`}
            >
              <p
                className={`truncate text-sm ${
                  active ? 'text-white' : 'text-slate-800'
                }`}
              >
                {article.title}
              </p>
              <ul
                className={`mt-1 flex space-x-2 text-xs ${
                  active ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <li>{`❤️ ${reactions}`}</li>
                <li>{`👀 ${views}`}</li>
                <li>{`💬 ${comments}`}</li>
              </ul>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
