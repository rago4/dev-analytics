import { json, type LoaderFunctionArgs } from '@remix-run/node'

import { userPrefs } from '~/cookies.server'

type ArticleApi = {
  id: number
  title: string
  published_at: string
  url: string
  comments_count: number
  public_reactions_count: number
  page_views_count: number
}

export type Article = ReturnType<typeof transformArticle>

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookie = (await userPrefs.parse(request.headers.get('Cookie'))) || {}
  let articles: Article[] = []
  if (!cookie.apiKey) {
    return json(articles)
  }
  const data = await fetch('https://dev.to/api/articles/me/published', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'api-key': cookie.apiKey,
    },
  }).then((res) => res.json() as Promise<ArticleApi[]>)
  articles = data.map(transformArticle)
  return json(articles)
}

function transformArticle(data: ArticleApi) {
  return {
    id: data.id,
    title: data.title,
    published_at: data.published_at,
    url: data.url,
    comments_count: data.comments_count,
    public_reactions_count: data.public_reactions_count,
    page_views_count: data.page_views_count,
  }
}
