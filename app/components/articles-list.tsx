import { Link } from '@remix-run/react'

import type { Article } from '~/lib/cache'

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
      {articles.map((article) => (
        <li key={article.id}>
          <Link
            to={`/?article=${article.id}&period=${periodQP}`}
            title={article.title}
            className={`block w-40 flex-shrink-0 truncate rounded-md border p-2 text-left text-sm font-medium text-slate-800 shadow transition-colors md:w-full ${
              articleQP === String(article.id)
                ? 'border-slate-800 bg-slate-800 text-white'
                : 'border-slate-200 bg-white hover:bg-slate-100'
            }`}
          >
            {article.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
