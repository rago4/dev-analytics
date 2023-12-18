import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, Outlet, useLoaderData, useNavigation } from '@remix-run/react'

import { AnalyticsDashboard } from '~/components/analytics-dashboard'
import { ArticlesList } from '~/components/articles-list'
import { EmptyPanel } from '~/components/empty-panel'
import { LoadingSkeleton } from '~/components/loading-skeleton'
import { userPrefs } from '~/cookies.server'
import type { Article, Historical, Referrers } from '~/lib/cache'
import { getArticles, getHistorical, getReferrers } from '~/lib/cache'
import { fallback, periodStart, prepareQP } from '~/lib/utils'

export const meta: MetaFunction = () => {
  return [
    { title: 'DEV Analytics' },
    {
      name: 'description',
      content: 'Discover your DEV Community analytics data with our dashboard.',
    },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  const url = new URL(request.url)

  if (!cookie.apiKey && url.pathname !== '/settings') {
    return redirect('/settings')
  }

  let articles: Article[] = []
  let historical: Historical = {}
  let referrers: Referrers = { domains: [] }

  if (cookie.apiKey) {
    articles = await getArticles(cookie.apiKey)
  }

  const articleQP = fallback(
    prepareQP(url.searchParams.get('article')),
    articles.map(({ id }) => String(id)),
    ''
  )
  const periodQP = fallback(
    prepareQP(url.searchParams.get('period')),
    ['wekk', 'month', 'year'],
    'week'
  )

  if (cookie.apiKey && articleQP && periodQP) {
    const start = periodStart(periodQP)
    historical = await getHistorical({
      token: cookie.apiKey,
      article_id: articleQP,
      start,
    })
    referrers = await getReferrers({
      token: cookie.apiKey,
      article_id: articleQP,
      start,
    })
  }

  return json({ articles, articleQP, historical, periodQP, referrers })
}

export default function Dashboard() {
  const loaderData = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  const article = loaderData.articles.find(
    ({ id }) => loaderData.articleQP === String(id)
  )
  const search = new URLSearchParams({
    article: loaderData.articleQP,
    period: loaderData.periodQP,
  }).toString()

  return (
    <>
      <div className="grid grid-cols-12 md:h-[calc(100svh-53px)]">
        <aside className="col-span-12 overflow-auto border-b border-r-0 border-slate-200 p-5 md:col-span-3 md:h-full md:border-b-0 md:border-r">
          <h2 className="hidden text-xl font-bold text-slate-800 md:block">
            Articles
          </h2>
          <ArticlesList
            articles={loaderData.articles}
            articleQP={loaderData.articleQP}
            periodQP={loaderData.periodQP}
          />
        </aside>
        <main className="col-span-12 h-full overflow-y-auto p-5 md:col-span-9">
          {navigation.state === 'loading' ? (
            <LoadingSkeleton />
          ) : article ? (
            <AnalyticsDashboard
              article={article}
              historical={loaderData.historical}
              periodQP={loaderData.periodQP}
              referrers={loaderData.referrers}
            />
          ) : (
            <EmptyPanel />
          )}
        </main>
      </div>
      <footer className="border-t border-slate-200 px-5 py-4">
        <ul className="flex justify-end space-x-3 text-sm text-slate-800">
          <li>
            <Link to={`/settings?${search}`} className="hover:underline">
              Settings
            </Link>
          </li>
          {[
            { href: 'https://dev.to/rgolawski', label: 'About' },
            { href: 'https://github.com/rago4/dev-analytics', label: 'GitHub' },
          ].map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
      <Outlet />
    </>
  )
}
