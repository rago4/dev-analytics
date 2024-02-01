import { type ClassValue, clsx } from 'clsx'
import localforage from 'localforage'
import { twMerge } from 'tailwind-merge'

export async function cache<T>({
  key,
  maxAge,
  getFreshValue,
}: {
  key: string
  maxAge: number
  getFreshValue: () => Promise<T>
}) {
  const cached = await localforage.getItem<{ data: T; expires: number }>(key)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }
  const data = await getFreshValue()
  await localforage.setItem(key, { data, expires: Date.now() + maxAge })
  return data
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number) {
  return value.toLocaleString('en-US')
}

export function prepareQP(value: string | null, allowed?: string[]) {
  const trimmed = String(value || '').trim()
  if (!allowed || !allowed.length) return trimmed
  return allowed.includes(trimmed) ? trimmed : allowed[0]
}
