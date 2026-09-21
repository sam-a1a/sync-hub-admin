import { useState } from 'react'
import { Button } from '../../components/Button'
import { ButtonGroup } from '../../components/ButtonGroup'
import { Dialog } from '../../components/Dialog'
import { formatCount } from './data'

/*
 * Mock figures. Shaped like what the reporting endpoint will return, so the
 * charts can be pointed at real data without the markup changing.
 */

const APPLICATIONS = [
  { label: 'Apr', value: 210 },
  { label: 'May', value: 340 },
  { label: 'Jun', value: 290 },
  { label: 'Jul', value: 410 },
  { label: 'Aug', value: 520 },
  { label: 'Sep', value: 480, current: true },
]

const REACH = [
  { label: 'Ages 18–24', value: 87 },
  { label: 'Ages 25–34', value: 81 },
  { label: 'Ages 35–44', value: 65 },
  { label: 'Ages 45–54', value: 62 },
  { label: 'Ages 55–64', value: 52 },
]

const FUNNEL = [
  { label: 'Profile started', value: 98 },
  { label: 'Profile complete', value: 87 },
  { label: 'First application', value: 80 },
  { label: 'Shortlisted', value: 41 },
]

const QUALITY = [
  { label: 'Complete', value: 98 },
  { label: 'Verified', value: 99 },
  { label: 'Skilled', value: 96 },
  { label: 'Available', value: 92 },
  { label: 'Local', value: 99 },
  { label: 'Responsive', value: 90 },
]

/** Days from sign-up to a candidate's first application. */
const TIME_TO_APPLY = [
  { label: 'Apr', platform: 6.2, best: 4.4 },
  { label: 'May', platform: 5.4, best: 4.1 },
  { label: 'Jun', platform: 4.8, best: 3.6 },
  { label: 'Jul', platform: 4.1, best: 3.1 },
  { label: 'Aug', platform: 3.6, best: 2.7 },
  { label: 'Sep', platform: 3.2, best: 2.4 },
]

const SERIES = [
  { key: 'platform' as const, name: 'Platform', tone: 'a' },
  { key: 'best' as const, name: 'Best tenant', tone: 'b' },
]

const COMPARE = [
  { label: 'Awareness', platform: 54, best: 71 },
  { label: 'Consideration', platform: 46, best: 63 },
  { label: 'Application', platform: 43, best: 58 },
  { label: 'Interview', platform: 28, best: 44 },
  { label: 'Placement', platform: 19, best: 31 },
]

const TABS = [
  { id: 'applications', label: 'Applications' },
  { id: 'reach', label: 'Reach' },
  { id: 'funnel', label: 'Funnel' },
  { id: 'quality', label: 'Quality' },
  { id: 'speed', label: 'Speed' },
  { id: 'compare', label: 'Compare' },
]

type Style = React.CSSProperties

/**
 * Vertical columns, fully rounded, growing from the baseline.
 *
 * One hue for the series: the bars encode magnitude, and a second hue would be
 * colour carrying no information. The open month is marked by a tonal step -
 * a lightness difference, readable without colour vision - not a second hue.
 */
function Columns() {
  const max = Math.max(...APPLICATIONS.map((month) => month.value))

  return (
    <div className="chart">
      <div className="chart__cols">
        {APPLICATIONS.map((month) => (
          <div className="chart__col" key={month.label}>
            <span className="chart__col-value">{formatCount(month.value)}</span>
            <div className="chart__col-track">
              <div
                className="chart__col-bar"
                data-current={month.current || undefined}
                style={{ '--h': `${(month.value / max) * 100}%` } as Style}
              >
                <span className="chart__col-name">{month.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="chart__note">
        Applications received per month. Hover a column. September is still open.
      </p>
    </div>
  )
}

/** Horizontal bars, each ending in a value pill and an arrow cap. */
function Reach() {
  return (
    <div className="chart">
      <ul className="chart__reach">
        {REACH.map((band) => (
          <li className="reach" key={band.label}>
            <div className="reach__track" style={{ '--w': `${band.value}%` } as Style}>
              <div className="reach__bar">
                <span className="reach__name">{band.label}</span>
              </div>
              <span className="reach__cap">
                <span className="reach__value">{band.value}%</span>
                <span className="reach__tip" aria-hidden="true" />
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="chart__note">
        Share of candidates in each age band who applied this quarter.
      </p>
    </div>
  )
}

/** Thin rules with the value carried in a pill that sits where it lands. */
function Funnel() {
  return (
    <div className="chart">
      <ul className="chart__funnel">
        {FUNNEL.map((step) => (
          <li className="thin" key={step.label}>
            <div className="thin__head">
              <span className="thin__name">{step.label}</span>
            </div>
            <div className="thin__track">
              {[25, 50, 75].map((tick) => (
                <span
                  className="thin__tick"
                  key={tick}
                  style={{ '--x': `${tick}%` } as Style}
                  aria-hidden="true"
                />
              ))}
              <span
                className="thin__fill"
                style={{ '--w': `${step.value}%` } as Style}
              />
              <span
                className="thin__badge"
                style={{ '--x': `${step.value}%` } as Style}
              >
                {step.value}%
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="chart__scale" aria-hidden="true">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

/** A circle riding on top of a rounded column. */
function Quality() {
  return (
    <div className="chart">
      <div className="chart__pops">
        {QUALITY.map((attr) => (
          <div className="pop" key={attr.label}>
            <span className="pop__circle" style={{ '--v': attr.value } as Style}>
              {attr.value}%
            </span>
            <div className="pop__track">
              <div
                className="pop__col"
                style={{ '--h': `${attr.value - 55}%` } as Style}
              >
                <span className="pop__name">{attr.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="chart__note">
        Share of candidate profiles meeting each screening attribute.
      </p>
    </div>
  )
}

/**
 * Two lines over time, drawn on mount.
 *
 * The series colours are NOT the M3 roles. `primary` against `tertiary`
 * measures ΔE 7.6 for normal vision and 3.2 under deuteranopia - far under the
 * floor where two series can be told apart - because M3's tertiary is a
 * deliberate near-neighbour hue, not a categorical partner. The pair below was
 * validated instead: ΔE 17.3 normal, 13.3 protan, 22.0 tritan.
 */
function Line() {
  const w = 620
  const h = 250
  const pad = { top: 34, right: 28, bottom: 40, left: 40 }
  const max = 7

  const x = (i: number) =>
    pad.left + (i * (w - pad.left - pad.right)) / (TIME_TO_APPLY.length - 1)
  const y = (v: number) => pad.top + (1 - v / max) * (h - pad.top - pad.bottom)

  return (
    <div className="chart">
      {/* Two series, so a legend is always present - identity is never
          colour alone. Each point is direct-labelled as well. */}
      <ul className="legend">
        {SERIES.map((series) => (
          <li className="legend__item" key={series.key} data-tone={series.tone}>
            {series.name}
          </li>
        ))}
      </ul>

      <svg
        className="chart__line"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Days to a candidate's first application, April to September. Platform falls from 6.2 to 3.2; the best tenant from 4.4 to 2.4."
      >
        {[0, 2, 4, 6].map((tick) => (
          <g key={tick}>
            <line
              className="chart__grid"
              x1={pad.left}
              x2={w - pad.right}
              y1={y(tick)}
              y2={y(tick)}
            />
            <text className="chart__tick" x={pad.left - 10} y={y(tick) + 4}>
              {tick}
            </text>
          </g>
        ))}

        {SERIES.map((series, s) => {
          const path = TIME_TO_APPLY.map(
            (point, i) =>
              `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(point[series.key])}`,
          ).join(' ')
          return (
            <g key={series.key} data-tone={series.tone}>
              <path
                className="chart__stroke"
                d={path}
                style={{ '--i': s } as Style}
              />
              {TIME_TO_APPLY.map((point, i) => (
                <g key={point.label} style={{ '--i': i + s } as Style}>
                  <circle
                    className="chart__node"
                    cx={x(i)}
                    cy={y(point[series.key])}
                    r={7}
                  />
                  <rect
                    className="chart__bubble"
                    x={x(i) - 17}
                    y={y(point[series.key]) - (s === 0 ? 34 : -14)}
                    width={34}
                    height={20}
                    rx={10}
                  />
                  <text
                    className="chart__bubble-text"
                    x={x(i)}
                    y={y(point[series.key]) - (s === 0 ? 20 : -28)}
                  >
                    {point[series.key]}
                  </text>
                </g>
              ))}
            </g>
          )
        })}

        {TIME_TO_APPLY.map((point, i) => (
          <text className="chart__axis" key={point.label} x={x(i)} y={h - 10}>
            {point.label}
          </text>
        ))}
      </svg>
      <p className="chart__note">
        Days from sign-up to a candidate&rsquo;s first application.
      </p>
    </div>
  )
}

/**
 * Two measures per row, same hue.
 *
 * The columns are told apart by their headings and their position, not by
 * colour - which is what lets one hue carry both without asking anyone to
 * distinguish two similar teals.
 */
function Compare() {
  return (
    <div className="chart">
      <div className="versus">
        <span className="versus__head versus__head--label" />
        <span className="versus__head">Platform</span>
        <span className="versus__head">Best tenant</span>

        {COMPARE.map((step, i) => (
          <div className="versus__row" key={step.label} style={{ '--i': i } as Style}>
            <span className="versus__label">{step.label}</span>
            <span className="versus__cell">
              <span className="versus__value">{step.platform}%</span>
              <span
                className="versus__bar"
                style={{ '--w': `${step.platform}%` } as Style}
              />
            </span>
            <span className="versus__cell">
              <span className="versus__value">{step.best}%</span>
              <span
                className="versus__bar versus__bar--best"
                style={{ '--w': `${step.best}%` } as Style}
              />
            </span>
          </div>
        ))}
      </div>
      <p className="chart__note">
        Candidates reaching each stage, platform-wide against the strongest
        tenant.
      </p>
    </div>
  )
}

const PANELS: Record<string, () => React.ReactElement> = {
  applications: Columns,
  reach: Reach,
  funnel: Funnel,
  quality: Quality,
  speed: Line,
  compare: Compare,
}

export function StatsDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [tab, setTab] = useState('applications')
  const Panel = PANELS[tab]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      headline="Platform statistics"
      description="A preview of the reporting that is coming. Figures are illustrative."
      actions={
        <Button variant="filled" className="md-dialog__action" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="stats">
        <ButtonGroup
          label="Statistic"
          options={TABS}
          active={tab}
          onChange={setTab}
        />

        {/*
          The wrapper is NOT keyed, so its height transitions from the old
          panel's to the new one's. Only the inner layer is keyed, which
          remounts it and replays the entry animation on every change.
        */}
        <div
          className="stats__panel"
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
        >
          <div className="stats__layer" key={tab}>
            <Panel />
          </div>
        </div>
      </div>
    </Dialog>
  )
}
