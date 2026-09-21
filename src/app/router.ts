import { useEffect, useState } from 'react'
import { href, toAppPath } from './base'

/**
 * The whole router.
 *
 * Three destinations and two auth screens do not need a routing library, and
 * pulling one in would drag its data-loading model along with it - which this
 * build has nothing to load into. When the API lands and routes start needing
 * loaders and guards, replace this file rather than growing it.
 *
 * `pushState` does not fire `popstate` - that event is for the user moving
 * through history, not for the app moving itself. Dispatching one anyway gives
 * every listener a single thing to watch, whether the change came from a rail
 * click or from the Back button.
 *
 * Callers pass root-relative paths and get root-relative paths back; the mount
 * point is folded in and out here, so `/overview` means the same thing whether
 * the app is served from the root or from a repository subpath.
 */

export function navigate(to: string): void {
  const target = href(to)
  if (target === window.location.pathname) return
  window.history.pushState(null, '', target)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function usePathname(): string {
  const [pathname, setPathname] = useState(() =>
    toAppPath(window.location.pathname),
  )

  useEffect(() => {
    const sync = () => setPathname(toAppPath(window.location.pathname))
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  return pathname
}
