import type { Article, Historical, Referrers } from '~/lib/cache'

import { ChartsSection } from './charts-section'
import { HeaderSection } from './header-section'
import { PeriodSwitcher } from './period-switcher'
import { SummarySection } from './summary-section'
import { TrafficSection } from './traffic-section'

export function AnalyticsDashboard({
  article,
  historical,
  periodQP,
  referrers,
}: {
  article: Article
  historical: Historical
  periodQP: string
  referrers: Referrers
}) {
  return (
    <>
      <HeaderSection article={article} />
      <PeriodSwitcher articleId={article.id} periodQP={periodQP} />
      <SummarySection historical={historical} />
      <ChartsSection historical={historical} />
      <TrafficSection referrers={referrers} />
    </>
  )
}
