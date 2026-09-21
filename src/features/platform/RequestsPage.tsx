import { useState } from 'react'
import { ConfirmDialog } from '../../components/Dialog'
import { Icon } from '../../components/Icon'
import { SplitButton } from '../../components/SplitButton'
import { PageHeader } from './PageHeader'
import { ACCESS_REQUESTS, askedOn, type AccessRequest } from './data'

type Decision = { request: AccessRequest; kind: 'accept' | 'dismiss' }

/**
 * The companies asking to be let onto SYNC Hub, oldest first.
 *
 * A list of cards rather than a table. There are four facts per request and
 * two decisions, which is a shape a row of columns makes harder to read than
 * it needs to be: the company and who asked belong together on one line, and
 * how to reach them and when they asked belong together on the next.
 *
 * Both decisions empty the queue and neither can be taken back from here, so
 * both confirm first.
 */
export function RequestsPage() {
  const [decision, setDecision] = useState<Decision | null>(null)
  const accepting = decision?.kind === 'accept'

  return (
    <section>
      <PageHeader
        title="Requests"
        description="Companies asking to be let onto SYNC Hub, oldest first. Accept one to open a tenant, or dismiss it."
      />

      {ACCESS_REQUESTS.length === 0 ? (
        <div className="empty">
          <Icon name="inbox" size={32} />
          <p>Nobody is waiting for access.</p>
        </div>
      ) : (
        <ul className="cards">
          {ACCESS_REQUESTS.map((request) => (
            <li className="card" key={request.id}>
              <div className="card__text">
                <p className="card__title">
                  {request.company}
                  <span className="card__sep" aria-hidden="true">
                    ·
                  </span>
                  <span className="card__title-soft">{request.fullName}</span>
                </p>
                <p className="card__meta">
                  {request.email}
                  <span className="card__sep" aria-hidden="true">
                    ·
                  </span>
                  {askedOn(request.askedOn)}
                </p>
              </div>

              <SplitButton
                label="Accept"
                trailingIcon="close_small"
                trailingLabel={`Dismiss the request from ${request.company}`}
                onAction={() => setDecision({ request, kind: 'accept' })}
                onTrailing={() => setDecision({ request, kind: 'dismiss' })}
              />
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={decision !== null}
        onClose={() => setDecision(null)}
        onConfirm={() => {}}
        danger={decision?.kind === 'dismiss'}
        headline={
          accepting
            ? `Accept ${decision?.request.company}?`
            : `Dismiss ${decision?.request.company ?? ''}?`
        }
        description={
          accepting
            ? `A tenant is opened from this request and an invitation is emailed to ${decision?.request.fullName}. The request leaves the queue.`
            : 'The request leaves the queue and nothing is emailed. The company can ask again.'
        }
        confirmLabel={accepting ? 'Accept' : 'Dismiss'}
      />
    </section>
  )
}
