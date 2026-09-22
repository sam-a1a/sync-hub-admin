import { asset } from '../app/base'
import { navigate } from '../app/router'
import { useTheme } from '../theme/useTheme'
import { UtilityButton } from './UtilityButton'

/** Compact page title and utilities; navigation lives in the bottom bar. */
export function TopAppBar({ title }: { title: string }) {
  const { resolvedTheme, setMode } = useTheme()
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <header className="top-bar">
      {/* Decorative: the heading beside it already names the screen. */}
      <img className="top-bar__logo" src={asset('logo.png')} alt="" />

      <h1 className="top-bar__title">{title}</h1>

      <UtilityButton
        icon={nextTheme === 'dark' ? 'dark_mode' : 'light_mode'}
        label={`Switch to ${nextTheme} theme`}
        onClick={() => setMode(nextTheme)}
      />

      <UtilityButton
        icon="logout"
        label="Sign out"
        className="utility-button--logout"
        onClick={() => navigate('/')}
      />
    </header>
  )
}
