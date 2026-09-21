import { DESTINATIONS } from '../../app/navigation'
import { NavRail } from '../../components/NavRail'
import { PageTransition } from '../../components/PageTransition'
import { TopAppBar } from '../../components/TopAppBar'
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

  /* The bar's label and the screen's name are the same string by definition -
     there is no second list to keep in step with the first. */
  const title =
    DESTINATIONS.find((destination) => destination.path === pathname)?.label ??
    'Overview'

  return (
    <div className="shell">
      {/* Compact only; hidden by its own stylesheet on a wide window. */}
      <TopAppBar title={title} />
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
