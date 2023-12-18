import { useMemo, useState } from 'react'
import type { TooltipProps } from 'recharts'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

import type { Historical } from '~/lib/cache'
import { formatDate, formatNumber } from '~/lib/utils'

const tabs = ['Readers', 'Reactions', 'Comments']

const colors = {
  amber: '#f59e0b',
  slate300: '#cbd5e1',
  slate600: '#475569',
  violet: '#8b5cf6',
  rose: '#f43f5e',
  sky: '#0ea5e9',
  teal: '#14b8a6',
}

function sec2min(seconds: number) {
  return Math.round(seconds / 60)
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md border border-slate-200 bg-white text-sm shadow">
      <div className="border-b border-slate-200 px-4 py-2">
        <p className="font-medium text-slate-800">
          {formatDate(new Date(label))}
        </p>
      </div>
      <ul className="space-y-0.5 px-4 py-2">
        {payload.map((item) => (
          <li key={item.name} className="flex items-center">
            <span
              className="block h-3 w-3 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: item.color }}
            />
            <p className="ml-2 mr-3 text-slate-500">{item.dataKey}</p>
            <p className="ml-auto font-medium text-slate-800">
              {formatNumber(Number(item.value))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CustomLineChart({
  data,
  lines,
}: {
  data: { date: string }[]
  lines: { key: string; color: string }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid vertical={false} stroke={colors.slate300} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tick={{ fontSize: 12, fill: colors.slate600 }}
          tickFormatter={(value) => formatDate(new Date(value))}
          tickLine={false}
          padding={{ left: 18, right: 18 }}
        />
        <YAxis
          axisLine={false}
          tick={{ fontSize: 12, fill: colors.slate600 }}
          tickLine={false}
          tickFormatter={(value) => formatNumber(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4.75 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function ChartsSection({ historical }: { historical: Historical }) {
  const [tab, setTab] = useState(tabs[0])

  const data = useMemo(() => {
    if (tab === tabs[0]) {
      return Object.keys(historical).map((date) => ({
        date,
        Total: historical[date].page_views.total,
        'Avg. read time (min)': sec2min(
          historical[date].page_views.average_read_time_in_seconds
        ),
        'Total read time (min)': sec2min(
          historical[date].page_views.total_read_time_in_seconds
        ),
      }))
    }
    if (tab === tabs[1]) {
      return Object.keys(historical).map((date) => ({
        date,
        Total: historical[date].reactions.total,
        Likes: historical[date].reactions.like,
        Unicorns: historical[date].reactions.unicorn,
        Bookmarks: historical[date].reactions.readinglist,
      }))
    }
    if (tab === tabs[2]) {
      return Object.keys(historical).map((date) => ({
        date,
        Comments: historical[date].comments.total,
      }))
    }
    return []
  }, [historical, tab])

  const lines = useMemo(() => {
    if (tab === tabs[0]) {
      return [
        { key: 'Total', color: colors.violet },
        { key: 'Avg. read time (min)', color: colors.amber },
        { key: 'Total read time (min)', color: colors.rose },
      ]
    }
    if (tab === tabs[1]) {
      return [
        { key: 'Total', color: colors.teal },
        { key: 'Likes', color: colors.rose },
        { key: 'Unicorns', color: colors.violet },
        { key: 'Bookmarks', color: colors.sky },
      ]
    }
    if (tab === tabs[2]) {
      return [{ key: 'Comments', color: colors.teal }]
    }
    return []
  }, [tab])

  return (
    <section className="mt-3.5 rounded-md border border-slate-200 p-4 shadow">
      <ul className="mb-6 flex w-min rounded-md bg-slate-100 p-1 text-sm font-medium">
        {tabs.map((label) => (
          <li key={label}>
            <button
              className={`w-24 rounded-md p-1.5 transition-colors ${
                tab === label
                  ? 'bg-white text-slate-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-600'
              }`}
              onClick={() => setTab(label)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
      <CustomLineChart data={data} lines={lines} />
    </section>
  )
}