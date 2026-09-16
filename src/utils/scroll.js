const NAV_OFFSET = 84

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

export function animateScroll(toY, duration = 720) {
  const fromY = window.scrollY
  const distance = toY - fromY
  if (Math.abs(distance) < 2) return
  const start = performance.now()

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration)
    window.scrollTo(0, fromY + distance * easeInOutCubic(t))
    if (t < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

export function scrollToSection(id) {
  if (!id || id === 'home') {
    animateScroll(0)
    return
  }

  const section = document.getElementById(id)
  if (!section) return

  const heading = section.querySelector('h2') || section
  const top = heading.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  animateScroll(Math.max(0, top))
}
