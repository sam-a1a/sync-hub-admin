import { haptic } from '../app/haptics'

export interface GroupOption {
  id: string
  label: string
}

/**
 * A connected button group, used here as a tab strip.
 *
 * Connected is m3e's second button-group variant: the buttons sit 2px apart,
 * take equal shares of the available width, keep the group's outer corners
 * fully rounded and tighten only the corners where they meet.
 *
 * Tab semantics rather than m3e's toggle buttons - these select which panel is
 * showing, and `tablist`/`tab`/`tabpanel` is what tells a screen reader that.
 * Arrow keys move between them, which is what the role promises.
 */
export function ButtonGroup({
  label,
  options,
  active,
  onChange,
}: {
  label: string
  options: GroupOption[]
  active: string
  onChange: (id: string) => void
}) {
  /*
   * Moving between one of a series of choices is exactly what the tick is for,
   * and this strip is the place it fires fastest - six tabs, arrow keys held
   * down. Hence the softest effect in the set: at 8ms it stays comfortable
   * when it repeats, which is the whole constraint on this one.
   */
  const select = (id: string) => {
    if (id === active) return
    haptic('tick')
    onChange(id)
  }

  const move = (delta: number) => {
    const at = options.findIndex((option) => option.id === active)
    const next = (at + delta + options.length) % options.length
    select(options[next].id)
  }

  return (
    <div className="md-group" role="tablist" aria-label={label}>
      {options.map((option) => {
        const selected = option.id === active
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            id={`tab-${option.id}`}
            aria-selected={selected}
            aria-controls={`panel-${option.id}`}
            tabIndex={selected ? 0 : -1}
            className="md-group__button"
            onClick={() => select(option.id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault()
                move(1)
              }
              if (event.key === 'ArrowLeft') {
                event.preventDefault()
                move(-1)
              }
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
