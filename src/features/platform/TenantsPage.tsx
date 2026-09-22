import { useState } from 'react'
import { Button, IconButton } from '../../components/Button'
import { ConfirmDialog } from '../../components/Dialog'
import { Icon } from '../../components/Icon'
import { CreateTenantDialog } from './CreateTenantDialog'
import { PageHeader } from './PageHeader'
import { TENANTS, formatCount, type Tenant } from './data'

function StatusMark({
  tone,
  label,
}: {
  tone: 'active' | 'attention' | 'ended'
  label: string
}) {
  return (
    <span className="status" data-tone={tone}>
      {label}
    </span>
  )
}

/**
 * The platform's tenants.
 *
 * Plans are display-only here - the Platform Portal reads them, it does not
 * sell them - so nothing in this list changes one.
 */
export function TenantsPage() {
  const [creating, setCreating] = useState(false)
  const [statusFor, setStatusFor] = useState<Tenant | null>(null)

  return (
    <section>
      <PageHeader
        title="Tenants"
        description="Manage access and invitations. Plans are display-only."
        actions={
          <Button
            variant="filled"
            className="page-header__action"
            icon="add"
            onClick={() => setCreating(true)}
          >
            Create Tenant
          </Button>
        }
      />

      {TENANTS.length === 0 ? (
        <div className="empty">
          <Icon name="apartment" size={32} />
          <p>No tenants have been opened yet.</p>
        </div>
      ) : (
        <ul className="cards">
          {TENANTS.map((tenant) => (
            <li className="card" key={tenant.id}>
              <div className="card__text">
                <p className="card__title">
                  {tenant.name}
                </p>
                <p className="card__meta">
                  {tenant.plan} plan
                  <span className="card__sep" aria-hidden="true">
                    ·
                  </span>
                  {formatCount(tenant.memberCount)} members
                </p>
                <p className="card__meta card__slug">{tenant.slug}</p>
              </div>

              <div className="card__marks">
                <StatusMark
                  tone={tenant.isActive ? 'active' : 'ended'}
                  label={tenant.isActive ? 'Active' : 'Suspended'}
                />
                <StatusMark
                  tone={tenant.invitePending ? 'attention' : 'active'}
                  label={tenant.invitePending ? 'Pending' : 'Accepted'}
                />
              </div>

              <div className="card__actions">
                {tenant.invitePending ? (
                  <IconButton
                    icon="replay"
                    outlined
                    label={`Resend the invitation for ${tenant.name}`}
                  />
                ) : null}
                <Button
                  variant="outlined"
                  className="card__action"
                  hoverIcon="remove"
                  onClick={() => setStatusFor(tenant)}
                >
                  {tenant.isActive ? 'Suspend' : 'Restore'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <CreateTenantDialog open={creating} onClose={() => setCreating(false)} />

      {/*
        A status change has to explain what it costs before it is confirmed:
        who loses access, and what happens to the tenant's job board.
      */}
      <ConfirmDialog
        open={statusFor !== null}
        onClose={() => setStatusFor(null)}
        onConfirm={() => {}}
        danger={statusFor?.isActive ?? false}
        headline={
          statusFor?.isActive
            ? `Suspend ${statusFor.name}?`
            : `Restore ${statusFor?.name ?? ''}?`
        }
        description={
          statusFor?.isActive
            ? 'Its members lose access and its job board goes offline. Nothing is deleted, and restoring the tenant puts both back.'
            : 'Its members get access again and its job board goes back online.'
        }
        confirmLabel={statusFor?.isActive ? 'Suspend' : 'Restore'}
      />
    </section>
  )
}
