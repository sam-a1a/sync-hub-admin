import { useEffect, useState, type FormEvent } from 'react'
import { asset } from '../../app/base'
import { haptic } from '../../app/haptics'
import { navigate, usePathname } from '../../app/router'
import { Button } from '../../components/Button'
import { PasswordField, TextField } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Reveal } from '../../components/Reveal'
import { Swap } from '../../components/Swap'

/**
 * Sign-in and password reset for the Platform Portal.
 *
 * Three phases on one screen, and nothing between them is a navigation: the
 * rows that do not belong to a phase collapse, the labels that change crossfade
 * in place, and the URL is rewritten underneath. Sign-in and reset each have
 * their own history entry, so a link can be shared and Back behaves; `sent` is
 * a state of the reset panel rather than a fourth address, so Back from it
 * returns to the form it came from.
 *
 * Static for now: there is no API wired up, so signing in cannot be checked and
 * simply opens the portal, and a reset request always reports itself sent -
 * which is what the real endpoint does anyway, since telling a caller whether
 * an address exists is an account-enumeration hole.
 */

type Phase = 'login' | 'reset' | 'sent'

const PATHS: Record<'login' | 'reset', string> = {
  login: '/',
  reset: '/forgot-password',
}

const COPY = {
  login: {
    heading: 'Sign in',
    action: 'Continue',
    pending: 'Signing in…',
  },
  reset: {
    heading: 'Password Reset',
    action: 'Reset Password',
    pending: 'Sending the link…',
  },
} as const

/* Deliberately loose: the server is the only thing that knows whether an
   address is real, and a stricter pattern only ever rejects ones that work. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function phaseFromPath(pathname: string): Phase {
  return pathname === PATHS.reset ? 'reset' : 'login'
}

export function LoginScreen() {
  const pathname = usePathname()
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)

  /*
   * `sent` is a state of the reset panel rather than an address of its own, so
   * it is dropped whenever the URL moves - including on Back, which should
   * land on the form the confirmation came from rather than on the
   * confirmation again.
   */
  useEffect(() => {
    setSent(false)
  }, [pathname])

  const phase: Phase = sent ? 'sent' : phaseFromPath(pathname)
  const resetting = phase !== 'login'

  /*
   * Validity drives the submit button and nothing else. There is no inline
   * "enter your email" to read: the field is empty, which already says that,
   * and the button being dead says the form is not ready.
   */
  const valid = EMAIL.test(email) && (resetting || password.length > 0)

  const toggle = () => {
    /* Swapping between sign-in and reset is a move between two choices on one
       screen, not a commitment - so a tick, the same as a destination. */
    haptic('tick')
    navigate(PATHS[phase === 'login' ? 'reset' : 'login'])
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (pending || sent) return

    /*
     * The only genuine failure in the build, and so the only reject: Enter
     * pressed in a field while the form is not valid. The button itself is
     * disabled, so a tap cannot reach here - a keyboard can.
     */
    if (!valid) {
      haptic('reject')
      return
    }

    haptic('press')
    setPending(true)
    window.setTimeout(() => {
      setPending(false)
      /* A form that went through. There is no API to fail against yet, so
         this is a confirm every time; when one lands, the failure arm is a
         reject and nothing else about this changes. */
      haptic('confirm')
      if (phase === 'reset') {
        setSent(true)
        return
      }
      navigate('/overview')
    }, 900)
  }

  return (
    <main className="login">
      <section className="login__form-pane">
        <div className="login__column">
          <header className="login__brand">
            <img className="login__brand-mark" src={asset('logo.png')} alt="" />
            <span className="login__brand-name">SYNC Hub</span>
          </header>

          <div className="login__intro">
            <h1>
              <Swap
                className="md-swap--start"
                active={resetting ? 'reset' : 'login'}
                options={{
                  login: COPY.login.heading,
                  reset: COPY.reset.heading,
                }}
              />
            </h1>

            {/*
              Stacked rather than crossfaded: these three differ in height, and
              a crossfade would have to hold a box as tall as the tallest of
              them at all times, leaving a gap under the one-line ones.
            */}
            <div className="login__subtitles">
              <Reveal open={phase === 'login'}>
                <p className="login__subtitle">Operate the SYNC Hub platform.</p>
              </Reveal>
              <Reveal open={phase === 'reset'}>
                <p className="login__subtitle">
                  Kindly, provide your SYNC email
                </p>
              </Reveal>
              <Reveal open={sent}>
                <p className="login__subtitle">
                  If the email you provided exists, you will receive the
                  password reset instructions.
                </p>
                <p className="login__subtitle login__spam">
                  Check your spam folder as well.
                </p>
              </Reveal>
            </div>
          </div>

          <form className="login__form" onSubmit={submit} noValidate>
            <Reveal className="login__field" open={!sent}>
              <TextField
                label="Email Address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Reveal>

            <Reveal className="login__field" open={phase === 'login'}>
              <PasswordField
                label="Password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Reveal>

            <Reveal open={!sent}>
              <Button
                type="submit"
                variant="filled"
                className="login__submit"
                disabled={!valid || pending}
              >
                <Swap
                  active={`${pending ? 'pending-' : ''}${resetting ? 'reset' : 'login'}`}
                  options={{
                    login: COPY.login.action,
                    reset: COPY.reset.action,
                    'pending-login': COPY.login.pending,
                    'pending-reset': COPY.reset.pending,
                  }}
                />
              </Button>
            </Reveal>

            {/*
              The toggle rides a grid track rather than sitting in the flex
              flow, so it can travel from centred to start-aligned once the
              confirmation is showing.
            */}
            <div
              className="login__toggle-row"
              data-align={sent ? 'start' : undefined}
            >
              <Button
                variant="filled"
                className="login__toggle"
                aria-pressed={resetting}
                onClick={toggle}
              >
                <Swap
                  active={resetting ? 'reset' : 'login'}
                  options={{
                    login: <Icon name="password" />,
                    reset: <Icon name="arrow_back_ios_new" />,
                  }}
                />
                <Swap
                  active={resetting ? 'reset' : 'login'}
                  options={{
                    login: 'Forgot your Password?',
                    reset: 'Back to Login',
                  }}
                />
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Decorative: the form column already names the product in text. */}
      <aside className="login__brand-pane" aria-hidden="true">
        <img className="login__brand-pane-mark" src={asset('logo.png')} alt="" />
      </aside>
    </main>
  )
}
