import { useState } from 'react'
import { Button } from '../../components/Button'
import { Dialog } from '../../components/Dialog'
import { TextField } from '../../components/Field'

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

/**
 * Capitalises the first letter of each word as it is typed.
 *
 * Only the leading letter of a word is touched - the rest is left exactly as
 * entered, so an acronym or a deliberately cased name survives. The
 * replacement is the same length as what it replaces, which is what keeps the
 * caret where the typist left it in a controlled input.
 */
function titleCase(value: string): string {
  return value.replace(
    /(^|\s)(\p{L})/gu,
    (_, before: string, letter: string) => before + letter.toLocaleUpperCase(),
  )
}

/**
 * Opens a tenant and emails an invitation to its founding admin.
 *
 * The address is the tenant's own subdomain, so it is the one field with a
 * shape the operator has to match - hence the only helper line on the form.
 * Everything else is free text the API will echo back.
 */
export function CreateTenantDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')

  const valid =
    name.trim().length > 0 &&
    SLUG.test(address) &&
    adminName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      headline="Create Tenant"
      description="Open a tenant and email an invitation to its founding admin."
      actions={
        <>
          <Button variant="text" className="md-dialog__action" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="filled"
            className="md-dialog__action"
            disabled={!valid}
            onClick={onClose}
          >
            Create Tenant
          </Button>
        </>
      }
    >
      <div className="tenant-form">
        <TextField
          label="Tenant Name"
          value={name}
          onChange={(event) => setName(titleCase(event.target.value))}
          autoComplete="off"
          required
        />
        <TextField
          label="Tenant Address"
          help="Lowercase letters, numbers and single hyphens."
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          autoComplete="off"
          required
        />
        <TextField
          label="Founding Admin Name"
          value={adminName}
          onChange={(event) => setAdminName(titleCase(event.target.value))}
          autoComplete="off"
          required
        />
        <TextField
          label="Founding Admin Email Address"
          type="email"
          value={adminEmail}
          onChange={(event) => setAdminEmail(event.target.value)}
          autoComplete="off"
          required
        />
      </div>
    </Dialog>
  )
}
