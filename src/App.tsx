import { isPortalPath } from './app/navigation'
import { usePathname } from './app/router'
import { LoginScreen } from './features/auth/LoginScreen'
import { AppShell } from './features/shell/AppShell'

function App() {
  const pathname = usePathname()

  return isPortalPath(pathname) ? (
    <AppShell pathname={pathname} />
  ) : (
    <LoginScreen />
  )
}

export default App
