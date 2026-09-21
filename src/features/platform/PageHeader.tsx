import type { ReactNode } from 'react'

/**
 * The title block every screen opens with. The actions slot sits beside the
 * title on a wide window and wraps under it when there is no room, rather than
 * squeezing the description into a column too narrow to read.
 */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <header className="page-header">
      <div className="page-header__text">
        <h1>{title}</h1>
        <p className="page-header__description">{description}</p>
      </div>
      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </header>
  )
}
