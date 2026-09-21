import { NavRail } from '../../components/NavRail'
import { PageTransition } from '../../components/PageTransition'
import { RequestsPage } from '../platform/RequestsPage'
import { OverviewPage } from '../platform/OverviewPage'
import { TenantsPage } from '../platform/TenantsPage'

const PAGES: Record<string, () => React.ReactElement> = {
  '/overview': OverviewPage,
  '/access-requests': RequestsPage,
  '/tenants': TenantsPage,
}

export function AppShell({ pathname }: { pathname: string }) {
  const Page = PAGES[pathname] ?? OverviewPage

  return (
    <div className="shell">
      <NavRail pathname={pathname} />
      <main className="shell__main">
        <div className="shell__content">
          {/* Keyed on the path, so the dissolve runs per destination. */}
          <PageTransition transitionKey={pathname}>
            <Page />
          </PageTransition>
        </div>
      </main>
    </div>
  )
}
