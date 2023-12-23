import { Link } from '@remix-run/react'

import type { Article } from '~/lib/cache'
import { formatNumber } from '~/lib/utils'

export function ArticlesList({
  articles,
  articleQP,
  periodQP,
}: {
  articles: Article[]
  articleQP: string
  periodQP: string
}) {
  return (
    <ul className="flex flex-row space-x-2 space-y-0 md:mt-3 md:flex-col md:space-x-0 md:space-y-2">
      {articles.map((article) => {
        const [reactions, views, comments] = [
          article.public_reactions_count,
          article.page_views_count,
          article.comments_count,
        ].map(formatNumber)

        return (
          <li key={article.id}>
            <Link
              to={`/?article=${article.id}&period=${periodQP}`}
              title={article.title}
              className={`block w-48 flex-shrink-0 rounded-md border p-2 text-left font-medium text-slate-800 shadow transition-colors md:w-full ${
                articleQP === String(article.id)
                  ? 'border-slate-800 bg-slate-800 text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-100'
              }`}
            >
              <p className="truncate text-sm">{article.title}</p>
              <ul className="mt-1 flex space-x-2 text-xs">
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
