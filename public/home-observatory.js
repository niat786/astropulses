;(function () {
  // 0. Quick-launch calculator selector on Homepage Hero
  var quickForm = document.getElementById('quick-launch-form')
  var quickSelect = document.getElementById('quick-tool-select')
  if (quickForm && quickSelect) {
    quickSelect.addEventListener('change', function () {
      if (quickSelect.value) {
        quickForm.setAttribute('action', quickSelect.value)
      }
    })
  }

  // 1. Planet Node Inspector on 2D Radix Wheel
  var inspector = document.getElementById('planet-inspector')
  var inspectorName = document.getElementById('inspector-name')
  var inspectorRetro = document.getElementById('inspector-retro')
  var inspectorTropical = document.getElementById('inspector-tropical')
  var inspectorSidereal = document.getElementById('inspector-sidereal')

  function bindPlanetHover() {
    var nodes = document.querySelectorAll('.planet-node')
    nodes.forEach(function (node) {
      node.addEventListener('mouseenter', function () {
        if (!inspector) return
        var planet = node.getAttribute('data-planet') || ''
        var sign = node.getAttribute('data-sign') || ''
        var deg = node.getAttribute('data-deg') || ''
        var house = node.getAttribute('data-house') || ''
        var dignity = node.getAttribute('data-dignity') || ''
        var retro = node.getAttribute('data-retro') || 'Direct'

        inspectorName.textContent = planet
        inspectorRetro.textContent = retro
        inspectorTropical.textContent = 'Tropical: ' + sign + ' (' + deg + ') · ' + house
        inspectorSidereal.textContent = 'Dignity: ' + dignity
        inspector.classList.remove('hidden')
      })
    })

    var svg = document.getElementById('radix-svg')
    if (svg) {
      svg.addEventListener('mouseleave', function () {
        if (inspector) inspector.classList.add('hidden')
      })
    }
  }
  bindPlanetHover()

  // 2. Live Time Scrubber (/api/sky?offsetMinutes=...)
  var scrubber = document.getElementById('sky-scrubber')
  var offsetLabel = document.getElementById('scrubber-offset-label')
  var resetBtn = document.getElementById('scrubber-reset')
  var timestampBadge = document.getElementById('sky-timestamp-badge')
  var debounceTimer = null

  function formatOffset(mins) {
    if (mins === 0) return 'Live Now'
    var sign = mins > 0 ? '+' : '-'
    var abs = Math.abs(mins)
    var h = Math.floor(abs / 60)
    var m = abs % 60
    return sign + h + 'h ' + (m < 10 ? '0' + m : m) + 'm'
  }

  var PLANET_COLORS = {
    Sun: '#ffd166',
    Moon: '#e2e8f0',
    Mercury: '#38bdf8',
    Venus: '#f472b6',
    Mars: '#fb7185',
    Jupiter: '#c084fc',
    Saturn: '#fbbf24',
    Uranus: '#2dd4bf',
    Neptune: '#60a5fa',
    Pluto: '#a78bfa',
    Chiron: '#34d399'
  }

  function updateWheelDOM(data) {
    if (!data || !data.wheel) return
    if (timestampBadge) timestampBadge.textContent = data.timestampReadable
    var ascEl = document.getElementById('wheel-center-asc')
    var mcEl = document.getElementById('wheel-center-mc')
    if (ascEl) ascEl.textContent = data.ascendantFormatted
    if (mcEl) mcEl.textContent = 'Midheaven ' + data.midheavenFormatted

    var aspectsGroup = document.getElementById('wheel-aspects')
    if (aspectsGroup && data.wheel.aspects) {
      aspectsGroup.innerHTML = data.wheel.aspects
        .map(function (c) {
          var w = c.type === 'Conjunction' || c.type === 'Opposition' ? '1.5' : '1.1'
          var dash = c.dash ? ' stroke-dasharray="' + c.dash + '"' : ''
          return (
            '<line x1="' +
            c.x1 +
            '" y1="' +
            c.y1 +
            '" x2="' +
            c.x2 +
            '" y2="' +
            c.y2 +
            '" stroke="' +
            c.color +
            '" stroke-width="' +
            w +
            '"' +
            dash +
            ' stroke-opacity="0.72" />'
          )
        })
        .join('')
    }

    var planetsGroup = document.getElementById('wheel-planets')
    if (planetsGroup && data.planets) {
      planetsGroup.innerHTML = data.planets
        .map(function (p) {
          var retroText = p.retrograde ? 'Retrograde ℞' : 'Direct'
          var color = PLANET_COLORS[p.name] || '#ffd166'
          return (
            '<g class="planet-node cursor-pointer" data-planet="' +
            p.name +
            '" data-sign="' +
            p.sign +
            '" data-deg="' +
            p.degreeFormatted +
            '" data-house="House ' +
            p.house +
            '" data-dignity="' +
            p.dignity +
            '" data-retro="' +
            retroText +
            '">' +
            '<title>' +
            p.name + ' in ' + p.sign + ' ' + p.degreeFormatted + ', house ' + p.house +
            (p.retrograde ? ' (retrograde)' : '') +
            '</title>' +
            '<circle cx="' +
            p.x +
            '" cy="' +
            p.y +
            '" r="12" fill="rgba(7, 11, 22, 0.92)" stroke="' +
            color +
            '" stroke-width="1.5" />' +
            '<text x="' +
            p.x +
            '" y="' +
            p.y +
            '" text-anchor="middle" dominant-baseline="central" fill="' +
            color +
            '" font-size="13" font-weight="700">' +
            p.glyph + '\uFE0E' +
            '</text>' +
            '</g>'
          )
        })
        .join('')
      bindPlanetHover()
    }
  }

  function fetchSkyAtOffset(mins) {
    fetch('/api/sky?offsetMinutes=' + encodeURIComponent(mins))
      .then(function (r) {
        return r.json()
      })
      .then(function (data) {
        updateWheelDOM(data)
      })
      .catch(function () {})
  }

  if (scrubber) {
    scrubber.addEventListener('input', function () {
      var mins = parseInt(scrubber.value, 10) || 0
      if (offsetLabel) offsetLabel.textContent = formatOffset(mins)
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(function () {
        fetchSkyAtOffset(mins)
      }, 60)
    })
  }

  if (resetBtn && scrubber) {
    resetBtn.addEventListener('click', function () {
      scrubber.value = '0'
      if (offsetLabel) offsetLabel.textContent = 'Live Now'
      fetchSkyAtOffset(0)
    })
  }

  // 3. Instant 189-Tool Directory Search & Category Filter (works on / and /tools)
  var searchInput = document.getElementById('tool-search')
  var searchCount = document.getElementById('tool-search-count')
  var catPills = document.querySelectorAll('.cat-pill')
  var toolCards = document.querySelectorAll('.tool-card-item')
  var catSections = document.querySelectorAll('[data-cat-section]')
  var activeCategory = 'all'

  function filterDirectory() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : ''
    var visibleTotal = 0

    toolCards.forEach(function (card) {
      var cat = card.getAttribute('data-category') || ''
      var haystack = card.getAttribute('data-search') || ''
      var matchesCat = activeCategory === 'all' || cat === activeCategory
      var matchesQuery = !query || haystack.indexOf(query) !== -1
      var show = matchesCat && matchesQuery
      card.style.display = show ? '' : 'none'
      if (show) visibleTotal++
    })

    catSections.forEach(function (sec) {
      var secCat = sec.getAttribute('data-cat-section') || ''
      if (activeCategory !== 'all' && secCat !== activeCategory) {
        sec.style.display = 'none'
        return
      }
      var anyVisible = false
      var children = sec.querySelectorAll('.tool-card-item')
      children.forEach(function (child) {
        if (child.style.display !== 'none') anyVisible = true
      })
      sec.style.display = anyVisible ? '' : 'none'
    })

    if (searchCount) {
      searchCount.textContent = String(visibleTotal)
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterDirectory)
  }

  catPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      activeCategory = pill.getAttribute('data-cat-filter') || 'all'
      catPills.forEach(function (p) {
        p.classList.remove('bg-amber-300', 'text-slate-950', 'font-semibold')
        p.classList.add('bg-white/[0.04]', 'text-slate-300')
      })
      pill.classList.remove('bg-white/[0.04]', 'text-slate-300')
      pill.classList.add('bg-amber-300', 'text-slate-950', 'font-semibold')
      filterDirectory()
    })
  })
})()
