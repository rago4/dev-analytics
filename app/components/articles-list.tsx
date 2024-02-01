import { useSearchParams } from '@remix-run/react'

import { cn, formatNumber, prepareQP } from '~/lib/utils'
import type { Article } from '~/routes/articles[.json]'

export function ArticlesList({ articles }: { articles: Article[] }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const articleIdQP = prepareQP(searchParams.get('article_id'))
  return (
    <ul className="flex flex-row space-x-2 space-y-0 md:mt-3 md:flex-col md:space-x-0 md:space-y-2">
      {articles.map((article) => {
        const active = String(article.id) === articleIdQP
        const [reactions, views, comments] = [
          article.public_reactions_count,
          article.page_views_count,
          article.comments_count,
        ].map(formatNumber)
        return (
          <li key={article.id}>
            <button
              title={article.title}
              className={cn(
                'block w-48 flex-shrink-0 rounded-md border p-2 text-left font-medium shadow transition-colors md:w-full',
                active
                  ? 'border-slate-800 bg-slate-800'
                  : 'border-slate-200 bg-white hover:bg-slate-100'
              )}
              onClick={() => {
                setSearchParams((prev) => {
                  prev.set('article_id', String(article.id))
                  return prev
                })
              }}
            >
              <p
                className={cn(
                  'truncate text-sm',
                  active ? 'text-white' : 'text-slate-800'
                )}
              >
                {article.title}
              </p>
              <ul
                className={cn(
                  'mt-1 flex space-x-2 text-xs',
                  active ? 'text-slate-400' : 'text-slate-500'
                )}
              >
                <li>{`❤️ ${reactions}`}</li>
                <li>{`👀 ${views}`}</li>
                <li>{`💬 ${comments}`}</li>
              </ul>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
