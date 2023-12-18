import { Link } from '@remix-run/react'

export function PeriodSwitcher({
  articleId,
  periodQP,
}: {
  articleId: number
  periodQP: string
}) {
  return (
    <ul className="mt-4 flex space-x-1.5">
      {['week', 'month', 'year'].map((period) => {
        return (
          <li key={period}>
            <Link
              to={`/?article=${articleId}&period=${period}`}
              className={`block w-min rounded-md border px-3 py-1 text-sm font-medium capitalize text-slate-800 shadow transition-colors ${
                period === periodQP
                  ? 'border-slate-800 bg-slate-800 text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-100'
              }`}
            >
              {period}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
