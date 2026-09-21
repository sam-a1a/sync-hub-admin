import { useState } from 'react'
import { IconButton } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { PageHeader } from './PageHeader'
import { StatsDialog } from './StatsDialog'
import { PLATFORM_COUNTS, formatCount } from './data'

const HERO_KEY = 'candidates'

/**
 * The Platform admin's home: how big the platform is, and nothing else.
 *
 * Candidates is the count that actually moves, so it takes a card of its own
 * and the other three sit beside it as rows. The hierarchy is carried by size
 * rather than by ornament, which is what keeps four numbers from reading as
 * four equally urgent things.
 *
 * Read-only by design - these indicate scale, they are not a dashboard to work
 * from, so nothing here is a link or opens anything.
 */
export function OverviewPage() {
  const [stats, setStats] = useState(false)
  const hero = PLATFORM_COUNTS.find((count) => count.key === HERO_KEY)
  const rest = PLATFORM_COUNTS.filter((count) => count.key !== HERO_KEY)

  return (
    <section>
      <PageHeader
        title="Platform overview"
        description="Tenants, candidates, jobs and applications across SYNC Hub."
      />

      <div className="overview">
        {hero ? (
          <div className="overview__hero">
            <span className="overview__hero-icon" aria-hidden="true">
              <Icon name={hero.icon} />
            </span>
            <span className="overview__hero-label">{hero.label}</span>
            <span className="overview__hero-value">
              {formatCount(hero.value)}
            </span>
          </div>
        ) : null}

        <ul className="overview__rows">
          {rest.map((count) => (
            <li className="overview__row" key={count.key}>
              <span className="overview__row-icon" aria-hidden="true">
                <Icon name={count.icon} size={22} />
              </span>
              <span className="overview__row-label">{count.label}</span>
              <span className="overview__row-value">
                {formatCount(count.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="overview__soon">
        <span className="overview__soon-icon" aria-hidden="true">
          <Icon name="data_usage" size={36} />
        </span>
        <div className="overview__soon-text">
          <p className="overview__soon-title">
            Statistics &amp; reports are coming soon.
          </p>
          <p className="overview__soon-note">
            Placement rates, time-to-hire and tenant activity will land here.
          </p>
        </div>

        <IconButton
          icon="info"
          outlined
          label="Preview statistics and reports"
          onClick={() => setStats(true)}
        />
      </div>

      <StatsDialog open={stats} onClose={() => setStats(false)} />
    </section>
  )
}
