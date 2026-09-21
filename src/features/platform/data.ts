import type { IconName } from '../../components/Icon'

/**
 * Stand-in data.
 *
 * Shaped like the API's `PlatformOverviewView`, `AccessRequestView` and
 * `PlatformTenantView` so the screens can be wired to real queries later
 * without the markup changing.
 */

export interface PlatformCount {
  key: string
  label: string
  value: number
  icon: IconName
}

export const PLATFORM_COUNTS: PlatformCount[] = [
  { key: 'tenants', label: 'Tenants', value: 2, icon: 'group' },
  { key: 'candidates', label: 'Candidates', value: 3948, icon: 'person' },
  { key: 'jobs', label: 'Jobs', value: 4, icon: 'work' },
  { key: 'applications', label: 'Applications', value: 0, icon: 'description' },
]

export interface AccessRequest {
  id: string
  company: string
  fullName: string
  email: string
  askedOn: string
}

export const ACCESS_REQUESTS: AccessRequest[] = [
  {
    id: 'req-1',
    company: 'Northern Relief Collective',
    fullName: 'Rania Haddad',
    email: 'rania@northernrelief.org',
    askedOn: '2026-08-14',
  },
  {
    id: 'req-2',
    company: 'Orontes Water Initiative',
    fullName: 'Karim Suleiman',
    email: 'k.suleiman@orontes-water.org',
    askedOn: '2026-08-29',
  },
  {
    id: 'req-3',
    company: 'Aleppo Skills Foundation',
    fullName: 'Layla Mansour',
    email: 'layla.mansour@aleppo-skills.org',
    askedOn: '2026-09-06',
  },
]

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: string
  memberCount: number
  isActive: boolean
  invitePending: boolean
}

export const TENANTS: Tenant[] = [
  {
    id: 'ten-1',
    name: 'Syrian Relief Network',
    slug: 'syrian-relief-network',
    plan: 'Standard',
    memberCount: 14,
    isActive: true,
    invitePending: false,
  },
  {
    id: 'ten-2',
    name: 'Damascus Health Alliance',
    slug: 'damascus-health-alliance',
    plan: 'Trial',
    memberCount: 3,
    isActive: true,
    invitePending: true,
  },
]

const askedOnFormat = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function askedOn(date: string): string {
  return askedOnFormat.format(new Date(date))
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat().format(value)
}
