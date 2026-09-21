import type { IconName } from '../components/Icon'

export interface Destination {
  path: string
  label: string
  icon: IconName
}

/**
 * The Platform Portal's three destinations, in the order the rail shows them.
 *
 * One icon per destination, not two: the FILL axis draws both the outlined and
 * the filled form, so selection animates the axis instead of swapping assets.
 */
export const DESTINATIONS: Destination[] = [
  { path: '/overview', label: 'Overview', icon: 'dashboard' },
  { path: '/access-requests', label: 'Requests', icon: 'check_box' },
  { path: '/tenants', label: 'Tenants', icon: 'group' },
]

export function isPortalPath(pathname: string): boolean {
  return DESTINATIONS.some((destination) => destination.path === pathname)
}
