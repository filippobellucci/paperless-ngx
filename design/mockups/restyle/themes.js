// Scenario 1 — theme presets (Settings → General → Appearance).
// A theme is a full set of design tokens (colours for light and dark, fonts, corner radii); the mode
// (system / light / dark) and the optional accent colour are independent of it, as in Paperless today.
// The choice is kept in this browser only (localStorage); the real app would store it in the user's UI settings.
;(() => {
	const THEMES = {
		refined: {
			name: 'Rifinito',
			note: 'Inter · verde pino · angoli morbidi',
			font: '"Inter", system-ui, sans-serif',
			head: '"Inter", system-ui, sans-serif',
			radius: [12, 8, 10, 999],
			light: { bg: '#f6f7f6', side: '#f6f7f6', surface: '#ffffff', fg: '#17201b', muted: '#5f6b65', line: '#e3e7e4', primary: '#1d6b45', onPrimary: '#ffffff', top: '#ffffff', onTop: '#17201b' },
			dark: { bg: '#0f1412', side: '#0f1412', surface: '#171d1a', fg: '#e5ebe7', muted: '#98a59e', line: '#26302b', primary: '#4cc28a', onPrimary: '#0b1a12', top: '#121916', onTop: '#e5ebe7' },
		},
		classic: {
			name: 'Classico',
			note: 'Il look di Paperless di oggi',
			font: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
			head: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
			radius: [6, 4, 6, 6],
			light: { bg: '#ffffff', side: '#f4f6f5', surface: '#ffffff', fg: '#212529', muted: '#6c757d', line: '#ced4da', primary: '#17541f', onPrimary: '#ffffff', top: '#17541f', onTop: '#ffffff' },
			dark: { bg: '#161618', side: '#1e1e20', surface: '#1e1e20', fg: '#abb2bf', muted: '#7d8590', line: '#3a3d42', primary: '#2e8a3c', onPrimary: '#ffffff', top: '#0f3a15', onTop: '#e6e6e6' },
		},
		slate: {
			name: 'Ardesia',
			note: 'Plus Jakarta Sans · blu petrolio · barra scura',
			font: '"Plus Jakarta Sans", system-ui, sans-serif',
			head: '"Plus Jakarta Sans", system-ui, sans-serif',
			radius: [10, 6, 8, 8],
			light: { bg: '#f3f5f8', side: '#f3f5f8', surface: '#ffffff', fg: '#142033', muted: '#5a6577', line: '#dfe4ec', primary: '#0e6e8c', onPrimary: '#ffffff', top: '#142033', onTop: '#e8edf5' },
			dark: { bg: '#0d131c', side: '#0d131c', surface: '#151d29', fg: '#e3e9f2', muted: '#8f9bad', line: '#243041', primary: '#4fb3d3', onPrimary: '#06202a', top: '#0a0f16', onTop: '#e3e9f2' },
		},
		paper: {
			name: 'Carta',
			note: 'Fraunces + Instrument Sans · toni caldi',
			font: '"Instrument Sans", system-ui, sans-serif',
			head: '"Fraunces", Georgia, serif',
			radius: [6, 4, 6, 6],
			light: { bg: '#f5f1e8', side: '#f5f1e8', surface: '#fffdf8', fg: '#2a241c', muted: '#6f6556', line: '#e6dece', primary: '#a8481f', onPrimary: '#ffffff', top: '#f5f1e8', onTop: '#2a241c' },
			dark: { bg: '#1a1714', side: '#1a1714', surface: '#23201b', fg: '#ece4d6', muted: '#a59985', line: '#3a342b', primary: '#e08a5f', onPrimary: '#24150c', top: '#1a1714', onTop: '#ece4d6' },
		},
		contrast: {
			name: 'Alto contrasto',
			note: 'Testo più grande, bordi netti',
			font: '"Inter", system-ui, sans-serif',
			head: '"Inter", system-ui, sans-serif',
			radius: [8, 6, 8, 8],
			fs: '15.5px',
			light: { bg: '#ffffff', side: '#ffffff', surface: '#ffffff', fg: '#000000', muted: '#3b3b3b', line: '#6b6b6b', primary: '#0039a6', onPrimary: '#ffffff', top: '#000000', onTop: '#ffffff' },
			dark: { bg: '#000000', side: '#000000', surface: '#0d0d0d', fg: '#ffffff', muted: '#d0d0d0', line: '#9a9a9a', primary: '#8ab4ff', onPrimary: '#000000', top: '#000000', onTop: '#ffffff' },
		},
	}
	const KEY = 'pngx-mock-theme'
	const read = () => {
		try {
			return JSON.parse(localStorage.getItem(KEY)) || {}
		} catch {
			return {}
		}
	}
	const state = Object.assign({ theme: 'refined', mode: 'auto', accent: '' }, read())
	const media = matchMedia('(prefers-color-scheme: dark)')
	const isDark = () => state.mode === 'dark' || (state.mode === 'auto' && media.matches)

	function apply() {
		const t = THEMES[state.theme] || THEMES.refined
		const dark = isDark()
		const c = t[dark ? 'dark' : 'light']
		const primary = state.accent || c.primary
		const onPrimary = state.accent ? (luma(state.accent) > 0.6 ? '#111111' : '#ffffff') : c.onPrimary
		const v = {
			'--bg': c.bg,
			'--bg-side': c.side,
			'--surface': c.surface,
			'--fg': c.fg,
			'--muted': c.muted,
			'--line': c.line,
			'--primary': primary,
			'--primary-fg': onPrimary,
			'--primary-hover': `color-mix(in srgb, ${primary} 84%, ${dark ? '#fff' : '#000'})`,
			'--primary-soft': `color-mix(in srgb, ${primary} ${dark ? 22 : 13}%, ${c.surface})`,
			'--top-bg': c.top,
			'--top-fg': c.onTop,
			'--field': dark ? c.bg : c.surface,
			'--font': t.font,
			'--font-head': t.head,
			'--fs': t.fs || '14.5px',
			'--radius': `${t.radius[0]}px`,
			'--radius-sm': `${t.radius[1]}px`,
			'--r-ctl': `${t.radius[2]}px`,
			'--pill': `${t.radius[3]}px`,
		}
		const root = document.documentElement
		for (const [k, val] of Object.entries(v)) root.style.setProperty(k, val)
		root.style.colorScheme = dark ? 'dark' : 'light'
		root.dataset.skin = state.theme
		root.dataset.mode = dark ? 'dark' : 'light'
	}
	function luma(hex) {
		const n = parseInt(hex.slice(1), 16)
		return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
	}
	function save() {
		try {
			localStorage.setItem(KEY, JSON.stringify(state))
		} catch {}
	}
	function set(patch) {
		Object.assign(state, patch)
		save()
		apply()
		const box = document.getElementById('theme-picker')
		if (box) box.outerHTML = settingsHtml()
	}

	function swatch(id) {
		const t = THEMES[id]
		const c = t[isDark() ? 'dark' : 'light']
		return `<span class="th-prev" style="background:${c.bg};border-color:${c.line};border-radius:${Math.min(t.radius[0], 10)}px">
      <i style="background:${c.top};border-bottom:1px solid ${c.line}"></i>
      <span style="background:${c.surface};border-color:${c.line};border-radius:${t.radius[1]}px"><b style="background:${c.fg}"></b><b style="background:${c.muted}"></b><em style="background:${c.primary};border-radius:${t.radius[3]}px"></em></span>
      <strong style="font-family:${t.head};color:${c.fg}">Aa</strong></span>`
	}
	function settingsHtml() {
		const modes = [
			['auto', 'Come il sistema'],
			['light', 'Chiaro'],
			['dark', 'Scuro'],
		]
		return `<div id="theme-picker" class="theme-picker">
      <div class="th-grid" role="radiogroup" aria-label="Tema">${Object.entries(THEMES)
				.map(([id, t]) => `<button type="button" role="radio" aria-checked="${state.theme === id}" class="th-card ${state.theme === id ? 'on' : ''}" data-theme-id="${id}">${swatch(id)}<span class="th-name">${t.name}</span><span class="th-note">${t.note}</span></button>`)
				.join('')}</div>
      <div class="th-line"><span class="th-lab">Modalità</span><div class="btn-group" role="radiogroup" aria-label="Modalità">${modes.map(([m, l]) => `<button type="button" class="btn btn-sm ${state.mode === m ? 'active' : ''}" data-theme-mode="${m}">${l}</button>`).join('')}</div></div>
      <div class="th-line"><span class="th-lab">Colore principale</span><input type="color" value="${state.accent || (THEMES[state.theme] || THEMES.refined)[isDark() ? 'dark' : 'light'].primary}" aria-label="Colore principale" data-theme-accent> <button type="button" class="btn btn-sm" data-theme-reset ${state.accent ? '' : 'disabled'}>Usa quello del tema</button></div>
      <label class="th-check"><input type="checkbox" checked> Inverti le miniature in modalità scura</label>
      <p class="muted small">Il tema si applica subito e vale solo per il tuo account.</p></div>`
	}

	document.addEventListener('click', (e) => {
		const card = e.target.closest('[data-theme-id]')
		if (card) return set({ theme: card.dataset.themeId })
		const mode = e.target.closest('[data-theme-mode]')
		if (mode) return set({ mode: mode.dataset.themeMode })
		if (e.target.closest('[data-theme-reset]')) set({ accent: '' })
	})
	document.addEventListener('change', (e) => {
		if (e.target.matches('[data-theme-accent]')) set({ accent: e.target.value })
	})
	media.addEventListener('change', () => state.mode === 'auto' && set({}))
	apply()
	window.Themes = { list: THEMES, state, set, settingsHtml }
})()
