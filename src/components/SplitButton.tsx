import { Icon, type IconName } from './Icon'

/**
 * A split button: one primary action, with a second one attached.
 *
 * Two real buttons in a single surface, not a button with a menu hanging off
 * it - the trailing half acts immediately rather than opening anything. They
 * are separated by a hairline gap and meet on tightened corners, so the pair
 * reads as one control while each half still shows its own press and hover.
 *
 * The trailing icon grows under the pointer rather than being swapped for a
 * larger glyph. Two different glyphs cannot interpolate, so trading them can
 * only ever be a crossfade - and a crossfade between two x shapes reads as a
 * flicker. Scaling one is a single continuous movement.
 */
export function SplitButton({
  label,
  trailingIcon,
  trailingLabel,
  onAction,
  onTrailing,
}: {
  label: string
  trailingIcon: IconName
  trailingLabel: string
  onAction: () => void
  onTrailing: () => void
}) {
  return (
    <div className="split-button">
      <button type="button" className="split-button__leading" onClick={onAction}>
        {label}
      </button>
      <button
        type="button"
        className="split-button__trailing"
        aria-label={trailingLabel}
        title={trailingLabel}
        onClick={onTrailing}
      >
        <Icon name={trailingIcon} size={20} />
      </button>
    </div>
  )
}
