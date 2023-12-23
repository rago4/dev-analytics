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
import { useFilters } from '~/lib/hooks'
import { fallback, periodStart, prepareQP } from '~/lib/utils'

export const meta: MetaFunction = () => {
  return [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
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
  const chartTabQP = fallback(
    prepareQP(url.searchParams.get('chart_tab')),
    ['readers', 'reactions', 'comments'],
    'readers'
  )
  const periodQP = fallback(
    prepareQP(url.searchParams.get('period')),
    ['week', 'month', 'year', 'total'],
    'week'
  )
  const currentArticle = articles.find(({ id }) => String(id) === articleQP)

  if (cookie.apiKey && articleQP && periodQP) {
    const start =
      periodQP === 'total'
        ? currentArticle?.published_at.substring(0, 10) || ''
        : periodStart(periodQP)
    const responses = await Promise.all([
      getHistorical({
        token: cookie.apiKey,
        article_id: articleQP,
        start,
      }),
      getReferrers({
        token: cookie.apiKey,
        article_id: articleQP,
        start,
      }),
    ])
    historical = responses[0]
    referrers = responses[1]
  }

  return json({
    articles,
    articleQP,
    chartTabQP,
    currentArticle,
    historical,
    periodQP,
    referrers,
  })
}

export default function Dashboard() {
  const loaderData = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const { search } = useFilters()

  return (
    <>
      <div className="grid grid-cols-12 md:h-[calc(100svh-53px)]">
        <aside className="col-span-12 overflow-auto border-b border-r-0 border-slate-200 p-5 md:col-span-3 md:h-full md:border-b-0 md:border-r">
          <h2 className="hidden text-xl font-bold text-slate-800 md:block">
            Articles
          </h2>
          <ArticlesList articles={loaderData.articles} />
        </aside>
        <main className="col-span-12 h-full overflow-y-auto p-5 md:col-span-9">
          {navigation.state === 'loading' ? (
            <LoadingSkeleton />
          ) : loaderData.currentArticle ? (
            <AnalyticsDashboard
              article={loaderData.currentArticle}
              historical={loaderData.historical}
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
            <Link to={`/settings?${search({})}`} className="hover:underline">
              Settings
            </Link>
          </li>
          {[
            {
              href: 'https://dev.to/rgolawski/what-ive-learned-by-building-dev-analytics-dashboard-4foa',
              label: 'About',
            },
            {
              href: 'https://github.com/rago4/dev-analytics',
              label: 'GitHub',
            },
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

export function ErrorBoundary() {
  return (
    <main className="container mx-auto px-5 py-8 md:py-16">
      <h2 className="text-xl font-bold text-slate-800">
        Sorry, there seems to be an error 🔥
      </h2>
      <p className="mt-3 rounded-md bg-red-100 px-5 py-4 font-mono text-sm leading-relaxed text-red-600">
        If you are seeing this panel, it is likely because you have used an
        invalid API key. To resolve the issue, you can try removing the
        "user-prefs" cookie and try again using a valid API key. If the error
        persists, it could indicate issues with the API, so it is recommended to
        try again later.
      </p>
    </main>
  )
}
