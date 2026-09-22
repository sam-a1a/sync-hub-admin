import { asset } from '../app/base'
import { haptic } from '../app/haptics'
import { navigate } from '../app/router'
import { DESTINATIONS } from '../app/navigation'
import { Icon } from './Icon'
import { useTheme } from '../theme/useTheme'
import { UtilityButton } from './UtilityButton'

/**
 * The navigation rail.
 *
 * A column beside the page on a wide window, a bar along the bottom on a
 * narrow one - the same markup either way, because the difference is entirely
 * in how the list flows. See components/nav-rail.css.
 *
 * Destinations are links, so middle-click, copy-link and the browser's own
 * affordances keep working; the click is intercepted only to stay on the page.
 */
export function NavRail({ pathname }: { pathname: string }) {
  const { resolvedTheme, setMode } = useTheme()
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <nav className="nav-rail" aria-label="Platform Portal">
      {/* Decorative: the page title already names the product. */}
      <img className="nav-rail__logo" src={asset('logo.png')} alt="" />

      <ul className="nav-rail__group">
        {DESTINATIONS.map((destination) => {
          const active = destination.path === pathname
          return (
            <li key={destination.path}>
              <a
                className="nav-rail__item"
                href={destination.path}
                aria-current={active ? 'page' : undefined}
                title={destination.label}
                aria-label={destination.label}
                onClick={(event) => {
                  event.preventDefault()
                  /*
                   * Silent when you tap the destination you are already on.
                   * Nothing moved, so nothing should be felt - a buzz for a
                   * no-op is exactly the gratuitous kind the guidance warns
                   * about, and this is the most-tapped control in the app.
                   */
                  if (active) return
                  haptic('tick')
                  navigate(destination.path)
                }}
              >
                <span className="nav-rail__indicator" aria-hidden="true" />
                <span className="nav-rail__icon">
                  <Icon name={destination.icon} />
                </span>
                <span className="nav-rail__label">{destination.label}</span>
              </a>
            </li>
          )
        })}
      </ul>

      {/*
        Wide only. On a narrow window these move into the top bar, to keep navigation
        destinations separate from theme and account controls.
      */}
      <div className="nav-rail__bottom">
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
      </div>
    </nav>
  )
}
