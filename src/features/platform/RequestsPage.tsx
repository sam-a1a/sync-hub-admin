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
 * Identity and contact details lead each record; the date and decisions form
 * a separate footer on compact screens so actions never squeeze the text.
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
        description="Review access requests, oldest first. Accept to create a tenant."
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
                <p className="card__title">{request.company}</p>
                <p className="card__contact">{request.fullName}</p>
                <p className="card__meta">{request.email}</p>
              </div>
              <div className="card__footer">
                <time className="card__date" dateTime={request.askedOn}>
                  {askedOn(request.askedOn)}
                </time>
                <SplitButton
                  label="Accept"
                  trailingIcon="close_small"
                  trailingLabel={`Dismiss the request from ${request.company}`}
                  onAction={() => setDecision({ request, kind: 'accept' })}
                  onTrailing={() => setDecision({ request, kind: 'dismiss' })}
                />
              </div>
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
