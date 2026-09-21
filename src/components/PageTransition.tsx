import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * A cross-dissolve between peer destinations.
 *
 * `AnimatePresence` in its default sync mode keeps the outgoing page mounted
 * while the incoming one animates in, so the two overlap. That overlap is the
 * point: `mode="wait"` fades the old page out and only then brings the new one
 * in, leaving a moment where neither is on screen - and that gap reads as a
 * blink however short the fade.
 *
 * The stacking is CSS (components/page-transition.css) rather than absolute
 * positioning, so the container still takes its height from the content and
 * the page does not collapse mid-transition.
 *
 * Opacity and a short rise, nothing scales. The expressive effects spring: it
 * is critically damped, and an overshooting opacity would drive past 1 and
 * flat-spot at the end of the fade.
 *
 * Deliberately not the View Transitions API, unlike the theme switch - a view
 * transition swaps the live DOM for static snapshots for its whole duration,
 * which would freeze the rail's indicator and icon fill mid-animation.
 */
export function PageTransition({
  transitionKey,
  children,
}: {
  transitionKey: string
  children: ReactNode
}) {
  return (
    <div className="page-transition">
      {/* initial={false}: no fade on first paint, only on navigation. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={transitionKey}
          className="page-transition__layer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{
            duration: 0.35,
            ease: [0.34, 0.8, 0.34, 1],
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
