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
  const move = (delta: number) => {
    const at = options.findIndex((option) => option.id === active)
    const next = (at + delta + options.length) % options.length
    onChange(options[next].id)
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
            onClick={() => onChange(option.id)}
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
