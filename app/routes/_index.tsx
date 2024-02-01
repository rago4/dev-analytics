import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useLoaderData, useRouteError } from '@remix-run/react'

import { ArticlesList } from '~/components/articles-list'
import { SettingsDialog } from '~/components/settings-dialog'
import { userPrefs } from '~/cookies.server'
import { cache } from '~/lib/utils'

import type { Article } from './articles[.json]'

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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const apiKey = String(formData.get('api-key') || '').trim()
  if (apiKey.length !== 24) {
    return json({ error: 'API key must be 24 characters long' })
  }
  const cookie = (await userPrefs.parse(request.headers.get('Cookie'))) || {}
  cookie.apiKey = apiKey
  return json(
    { error: '' },
    {
      headers: {
        'Set-Cookie': await userPrefs.serialize(cookie),
      },
    }
  )
}

export const clientLoader = async () => {
  const { auth } = await fetch('./auth.json').then(
    (res) => res.json() as Promise<{ auth: boolean }>
  )
  let articles: Article[] = []
  if (auth) {
    articles = await cache<Article[]>({
      key: 'articles',
      maxAge: 1000 * 60 * 30,
      getFreshValue: () => fetch('./articles.json').then((res) => res.json()),
    })
  }
  return { auth, articles }
}

export default function Index() {
  const actionData = useActionData<typeof action>()
  const loaderData = useLoaderData<typeof clientLoader>()
  return (
    <>
      <div className="grid grid-cols-12">
        <aside className="col-span-3 border-r border-slate-200 p-5">
          <h2 className="text-xl font-bold">Articles</h2>
          <ArticlesList articles={loaderData.articles} />
        </aside>
        <main className="col-span-9 p-5">
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500">
              Select an article to see the analytics data
            </p>
          </div>
        </main>
      </div>
      <footer className="border-t border-slate-200 px-5 py-4">
        <nav>
          <ul className="flex justify-end space-x-2 text-sm">
            <li>
              <SettingsDialog
                error={actionData?.error || ''}
                initialOpen={!loaderData.auth}
              />
            </li>
            {footerMenu.map((item) => (
              <li key={item.label}>
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
        </nav>
      </footer>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)
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

const footerMenu = [
  {
    label: 'About',
    href: 'https://dev.to/rgolawski/what-ive-learned-by-building-dev-analytics-dashboard-4foa',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/rago4/dev-analytics',
  },
]
