import { asset } from '../app/base'
import { navigate } from '../app/router'
import { useTheme } from '../theme/useTheme'
import { UtilityButton } from './UtilityButton'

/**
 * The compact top app bar.
 *
 * Only exists on a narrow window, and only because the bottom bar gave up its
 * labels. Once the destinations are icons alone, anything else sharing that
 * row reads as a fourth destination - so theme and sign-out come up here, and
 * the bar below carries nothing but the three places you can go.
 *
 * It also takes over the page title, which is why PageHeader hides its own
 * heading at this width: the name of the screen is already on screen, and
 * printing it twice wastes the only scarce thing a phone has.
 */
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
