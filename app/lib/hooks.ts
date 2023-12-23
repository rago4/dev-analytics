import { useMatches } from '@remix-run/react'
import type { RefObject } from 'react'
import { useEffect } from 'react'

export function useClickAway<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: VoidFunction
) {
  useEffect(() => {
    function handler(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, callback])
}

export function useFilters() {
  const [, dashboards] = useMatches()

  const params = dashboards?.data as {
    articleQP: string
    chartTabQP: string
    periodQP: string
  }

  function search(values: {
    article?: string
    chart_tab?: string
    period?: string
  }) {
    return new URLSearchParams({
      article: values.article || params.articleQP,
      chart_tab: values.chart_tab || params.chartTabQP,
      period: values.period || params.periodQP,
    }).toString()
  }

  return { params, search }
}
