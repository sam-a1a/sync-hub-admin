import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { Button } from './Button'
import { Icon, type IconName } from './Icon'

interface DialogProps {
  open: boolean
  onClose: () => void
  headline: string
  description?: string
  icon?: IconName
  children?: ReactNode
  /** Rendered at the end; the confirming action goes last, per M3. */
  actions: ReactNode
}

/**
 * An M3 basic dialog.
 *
 * Built on `<dialog showModal()>` rather than a div with a high z-index, which
 * hands us the top layer, the inert background, focus trapping and Escape
 * without reimplementing any of it. Motion animates the contents; the element
 * itself stays open until the exit finishes, which is why `close()` is called
 * from onExitComplete rather than immediately.
 */
export function Dialog({
  open,
  onClose,
  headline,
  description,
  icon,
  children,
  actions,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (open && !element.open) element.showModal()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="md-dialog"
      // Escape and the backdrop both route through the same close path.
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
    >
      <AnimatePresence onExitComplete={() => ref.current?.close()}>
        {open ? (
          <motion.div
            className="md-dialog__panel"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            {icon ? (
              <span className="md-dialog__icon" aria-hidden="true">
                <Icon name={icon} />
              </span>
            ) : null}
            <h2 className="md-dialog__headline">{headline}</h2>
            {description ? (
              <p className="md-dialog__description">{description}</p>
            ) : null}
            {children ? (
              <div className="md-dialog__body">{children}</div>
            ) : null}
            <div className="md-dialog__actions">{actions}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </dialog>
  )
}

/**
 * The shape every confirm in the portal takes: name the thing in the headline,
 * spell out what changes in the body, and label the button with the verb
 * rather than "OK" - so the consequence is readable without the headline.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  headline,
  description,
  confirmLabel,
  danger = false,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  headline: string
  description: string
  confirmLabel: string
  danger?: boolean
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      headline={headline}
      actions={
        <>
          <Button variant="text" className="md-dialog__action" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={danger ? 'danger' : 'filled'}
            className="md-dialog__action"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p>{description}</p>
    </Dialog>
  )
}
