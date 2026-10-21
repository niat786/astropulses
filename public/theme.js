;(function () {
  var KEY = 'astropulses-theme'

  function preferred() {
    try {
      var stored = localStorage.getItem(KEY)
      if (stored === 'light' || stored === 'dark') return stored
    } catch (_) {}
    try {
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
    } catch (_) {}
    return 'dark'
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(KEY, theme)
    } catch (_) {}
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode')
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false')
    })
  }

  function toggle() {
    var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
    apply(next)
  }

  apply(preferred())

  document.addEventListener('click', function (event) {
    var target = event.target
    if (!(target instanceof Element)) return

    var btn = target.closest('[data-theme-toggle]')
    if (btn) {
      event.preventDefault()
      toggle()
      return
    }

    var menuBtn = target.closest('[data-mobile-menu-toggle]')
    if (menuBtn) {
      event.preventDefault()
      var panel = document.getElementById('mobile-nav-drawer')
      if (!panel) return
      var isHidden = panel.classList.contains('hidden')
      panel.classList.toggle('hidden', !isHidden)
      menuBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false')
      return
    }

    var navLink = target.closest('#mobile-nav-drawer a')
    if (navLink) {
      var drawer = document.getElementById('mobile-nav-drawer')
      var toggleEl = document.querySelector('[data-mobile-menu-toggle]')
      if (drawer) drawer.classList.add('hidden')
      if (toggleEl) toggleEl.setAttribute('aria-expanded', 'false')
    }
  })

  window.__astropulsesTheme = { apply: apply, toggle: toggle, preferred: preferred }
})()
