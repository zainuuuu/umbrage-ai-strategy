import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Smooth-scroll foundation. No scroll animations live here yet — this just
// wires Lenis to drive GSAP's ticker (the standard Lenis + ScrollTrigger
// pairing), so future ScrollTrigger-based reveals sync correctly with Lenis's
// virtual scroll position instead of the raw (unsmoothed) native scroll.
export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger)

  const lenis = new Lenis()

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  return lenis
}
