import type { Article, Historical, Referrers } from '~/lib/cache'

import { ChartsSection } from './charts-section'
import { HeaderSection } from './header-section'
import { PeriodSwitcher } from './period-switcher'
import { SummarySection } from './summary-section'
import { TrafficSection } from './traffic-section'

export function AnalyticsDashboard({
  article,
  historical,
  referrers,
}: {
  article: Article
  historical: Historical
  referrers: Referrers
}) {
  return (
    <>
      <HeaderSection article={article} />
      <PeriodSwitcher />
      <SummarySection historical={historical} />
      <ChartsSection historical={historical} />
      <TrafficSection referrers={referrers} />
    </>
  )
}
