import type { CacheEntry } from '@epic-web/cachified'
import { cachified } from '@epic-web/cachified'
import { createHash } from 'crypto'
import { LRUCache } from 'lru-cache'

export type Article = {
  id: number
  title: string
  published_at: string
  slug: string
  user: { username: string }
}

export type Historical = {
  [date: string]: {
    comments: {
      total: number
    }
    follows: {
      total: number
    }
    page_views: {
      total: number
      average_read_time_in_seconds: number
      total_read_time_in_seconds: number
    }
    reactions: {
      total: number
      like: number
      unicorn: number
      readinglist: number
    }
  }
}

export type Referrers = {
  domains: { domain: string | null; count: number }[]
}

const HOUR_IN_SECONDS = 3_600_000

function hash(text: string) {
  return createHash('md5').update(text).digest('hex')
}

function fetcher<T>(endpoint: string, token: string) {
  return fetch('https://dev.to/api/' + endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'api-key': token,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json() as T
  })
}

const lru = new LRUCache<string, CacheEntry>({ max: 1000 })

export function getArticles(token: string) {
  return cachified({
    key: hash(`articles-${token}`),
    cache: lru,
    getFreshValue: () => fetcher<Article[]>('articles/me/published', token),
    ttl: HOUR_IN_SECONDS,
  })
}

export function getHistorical({
  token,
  article_id,
  start,
}: {
  token: string
  article_id: string
  start: string
}) {
  const endpoint = `analytics/historical?start=${start}&article_id=${article_id}`
  return cachified({
    key: hash(`${endpoint}-${token}`),
    cache: lru,
    getFreshValue: () => fetcher<Historical>(endpoint, token),
    ttl: HOUR_IN_SECONDS,
  })
}

export function getReferrers({
  token,
  article_id,
  start,
}: {
  token: string
  article_id: string
  start: string
}) {
  const endpoint = `analytics/referrers?start=${start}&article_id=${article_id}`
  return cachified({
    key: hash(`${endpoint}-${token}`),
    cache: lru,
    getFreshValue: () => fetcher<Referrers>(endpoint, token),
    ttl: HOUR_IN_SECONDS,
  })
}
