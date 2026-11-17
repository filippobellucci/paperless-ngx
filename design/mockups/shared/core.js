// Shared helpers for the four mock-ups. Each scenario adds its own screens on top.
// Every control that stands for a Paperless feature carries data-f="<feature id>" (see features.js);
// scripts/check-features.mjs walks every route of every scenario and proves that none is missing.
window.U = {
	months: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
	date(s, short) {
		if (!s) return ''
		const [y, m, dd] = s.split('-').map(Number)
		return short ? `${dd} ${this.months[m - 1].slice(0, 3)} ${y}` : `${dd} ${this.months[m - 1]} ${y}`
	},
	num(s) {
		return s ? s.split('-').reverse().join('/') : ''
	},
	money(n) {
		return n == null ? '' : '€ ' + n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	},
	val(v) {
		return typeof v === 'number' ? this.money(v) : v === true ? 'Sì' : v === false ? 'No' : /^\d{4}-\d{2}-\d{2}$/.test(v) ? this.num(v) : this.esc(v)
	},
	daysTo(s) {
		return Math.round((new Date(s) - new Date(DEMO.today)) / 86400000)
	},
	esc(s) {
		return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
	},
	tag(name) {
		return DEMO.tags.find((t) => t.name === name) || { name, color: '#888' }
	},
	doc(id) {
		return DEMO.documents.find((x) => x.id === Number(id))
	},
	user(id) {
		return DEMO.users.find((u) => u.id === id)
	},
	// Ownership rule of Paperless: a superuser sees everything, everyone else what they own (no shared groups here).
	mine(x) {
		return DEMO.me.superuser || x.owner === DEMO.me.id || x.owner == null
	},
	docs() {
		return DEMO.documents.filter((x) => this.mine(x))
	},
	inbox() {
		return this.docs().filter((x) => x.inbox)
	},
	views() {
		return DEMO.savedViews.filter((v) => this.mine(v))
	},
	viewDocs(v) {
		return this.docs()
			.filter(v.rule)
			.sort((a, b) => b.added.localeCompare(a.added))
	},
	search(q, list = this.docs()) {
		const words = q.toLowerCase().split(/\s+/).filter(Boolean)
		return list.filter((x) => {
			const hay = `${x.title} ${x.from} ${x.type} ${x.content} ${x.tags.join(' ')} ${x.asn ?? ''}`.toLowerCase()
			return words.every((w) => hay.includes(w))
		})
	},
	hl(text, q) {
		let s = this.esc(text)
		;(q || '')
			.split(/\s+/)
			.filter((w) => w.length > 1)
			.forEach((w) => {
				s = s.replace(new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>')
			})
		return s
	},
	// A fake scanned page. Pure HTML/CSS, no images.
	paper(x, big) {
		const t = this.tag(x.tags.find((n) => n !== 'Inbox') || 'Inbox')
		const lines = x.content.split(' — ')
		return `<div class="paper${big ? ' paper-big' : ''}" aria-hidden="true">
      <div class="paper-head"><span class="paper-logo" style="background:${t.color}"></span><b>${this.esc(x.from)}</b></div>
      <div class="paper-addr">${x.owner === 'societa' ? 'Saffi Patrimoni s.s.' : 'Marco R.'}<br>Via Saffi 14<br>40131 Bologna</div>
      <div class="paper-title">${this.esc(x.type)}</div>
      ${lines.map((l) => `<div class="paper-line">${this.esc(l)}</div>`).join('')}
      <div class="paper-bars"><i></i><i></i><i style="width:60%"></i><i></i><i style="width:40%"></i></div>
      ${x.fields.Importo != null ? `<div class="paper-total">Totale ${this.money(x.fields.Importo)}</div>` : ''}
    </div>`
	},
}
// Icon from the page's icon set (icons-bootstrap.js or icons-line.js).
window.I = (name, size = 16, cls = '') => {
	const set = window.ICONSET,
		body = set.paths[name] || set.paths.file
	return set.kind === 'fill' ? `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="${set.viewBox}" fill="currentColor" aria-hidden="true">${body}</svg>` : `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="${set.viewBox}" fill="none" stroke="currentColor" stroke-width="var(--ico-stroke, 1.8)" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${body}"/></svg>`
}
// Marks a feature on an element: <button ${F('download')}>.
window.F = (id) => `data-f="${id}"`

const paperStyle = document.createElement('style')
paperStyle.textContent = `.paper{background:#fff;color:#333;border-radius:3px;box-shadow:0 1px 3px rgba(0,0,0,.18);padding:10%;aspect-ratio:1/1.414;overflow:hidden;font:7px/1.4 Georgia,serif;position:relative;max-width:100%}
.paper-big{font-size:12px;max-width:600px;margin:0 auto}
.paper-head{display:flex;align-items:center;gap:.6em;font:700 1.25em system-ui,sans-serif;margin-bottom:1.2em}
.paper-logo{width:1.6em;height:1.6em;border-radius:.3em;display:inline-block;flex:none}
.paper-addr{margin-left:55%;margin-bottom:1.6em;color:#555}
.paper-title{font:700 1.4em system-ui,sans-serif;margin-bottom:.8em;text-transform:uppercase;letter-spacing:.04em}
.paper-line{margin-bottom:.35em}
.paper-bars i{display:block;height:.55em;background:#e6e6e6;margin:.7em 0;border-radius:2px}
.paper-total{position:absolute;right:10%;bottom:8%;font:700 1.3em system-ui,sans-serif;border-top:2px solid #333;padding-top:.3em;background:#fff}
.paper:not(.paper-big) .paper-total{position:static;text-align:right;margin-top:.8em}
mark{background:#fff1a8;color:inherit;border-radius:2px}
[hidden]{display:none!important}
a:has(.paper){text-decoration:none}`
document.head.appendChild(paperStyle)

// ---------- app shell shared by the scenarios ----------
window.App = {
	routes: {},
	state: { open: [] },
	route() {
		const [path, qs] = location.hash.slice(1).split('?')
		const parts = (path || '').split('/').filter(Boolean)
		return { name: parts[0] || this.home, args: parts.slice(1), params: new URLSearchParams(qs || '') }
	},
	render() {
		const r = this.route()
		const view = this.routes[r.name] || this.routes[this.home]
		this.frame?.(r)
		document.getElementById('view').innerHTML = view(r)
		this.after?.(r)
	},
	toast(text) {
		let el = document.getElementById('toast')
		if (!el) {
			el = document.createElement('div')
			el.id = 'toast'
			el.className = 'toast'
			el.setAttribute('role', 'status')
			document.body.appendChild(el)
		}
		el.textContent = text
		el.classList.add('show')
		clearTimeout(this.toastT)
		this.toastT = setTimeout(() => el.classList.remove('show'), 2600)
	},
	fake(what) {
		this.closeSheet()
		this.toast(`Demo — ${what}`)
	},
	sheet(html, cls = '') {
		let s = document.getElementById('sheet')
		if (!s) {
			s = document.createElement('div')
			s.id = 'sheet'
			document.body.appendChild(s)
			s.addEventListener('click', (e) => {
				if (e.target === s) this.closeSheet()
			})
		}
		s.className = `sheet ${cls}`
		s.innerHTML = `<div class="sheet-box" role="dialog">${html}</div>`
		s.hidden = false
	},
	closeSheet() {
		const s = document.getElementById('sheet')
		if (s) s.hidden = true
	},
	switchUser(id) {
		DEMO.me = U.user(id)
		this.state.open = []
		this.closeSheet()
		this.toast(`Ora sei: ${DEMO.me.name} (${DEMO.me.kind})`)
		location.hash = `#/${this.home}`
		this.render()
	},
	accountsHtml(itemCls = 'item') {
		return DEMO.users.map((u) => `<button class="${itemCls}" data-act="as" data-u="${u.id}"><span class="avatar" style="background:${u.color}">${u.initials}</span><span>${u.name}<small>${u.kind}</small></span>${u === DEMO.me ? I('check') : ''}</button>`).join('')
	},
	openDoc(id) {
		if (!this.state.open.includes(id)) this.state.open = [id, ...this.state.open].slice(0, 5)
	},
	// Simulated upload: progress, OCR, then a new document in the inbox of the current account.
	upload(boxId) {
		const box = document.getElementById(boxId)
		if (!box) return
		box.innerHTML = `<div class="upl"><b>scansione_2026-11-16.pdf</b><div class="bar"><i id="upbar"></i></div><small id="uptext">Caricamento…</small></div>`
		let n = 0
		const t = setInterval(() => {
			n += 20
			const b = document.getElementById('upbar')
			if (!b) return clearInterval(t)
			b.style.width = Math.min(n, 100) + '%'
			document.getElementById('uptext').textContent = n < 60 ? 'Caricamento…' : n < 100 ? 'OCR e lettura del testo…' : 'Fatto: aggiunto con l’etichetta Inbox'
			if (n >= 100) {
				clearInterval(t)
				const owner = DEMO.me.superuser ? 'marco' : DEMO.me.id
				if (!U.doc(301)) DEMO.documents.push({ ...U.doc(25), id: 301, owner, title: owner === 'societa' ? 'Preventivo tetto casale — secondo fornitore' : 'Garanzia aspirapolvere Dyson', from: owner === 'societa' ? 'Coperture Reno' : 'Dyson', type: owner === 'societa' ? 'Preventivo' : 'Garanzia', tags: ['Inbox'], inbox: true, created: '2026-11-16', added: '2026-11-16', asn: null, fields: {}, notes: [], content: 'Documento caricato ora' })
				this.uploaded?.()
			}
		}, 300)
	},
	chatAnswer(q) {
		const l = q.toLowerCase(),
			docs = U.docs()
		if (l.includes('imu') && docs.some((x) => x.owner === 'societa')) return { text: `Nel 2026 l'IMU di Via Mazzini è ${U.money(2480)}: acconto di ${U.money(1240)} pagato il 16 giugno, saldo di ${U.money(1240)} da pagare entro il 16 dicembre.`, src: [215, 202] }
		if (l.includes('polizza') || l.includes('assicura')) return docs.some((x) => x.id === 7) ? { text: 'La polizza RC auto della Panda scade il 1 marzo 2027.', src: [7] } : { text: 'Non trovo polizze tra i documenti che puoi vedere.', src: [] }
		const hits = U.search(q.split(' ').slice(-1)[0]).slice(0, 3)
		return { text: hits.length ? `Ho trovato ${hits.length} documenti utili; il più recente è “${hits[0].title}”.` : 'Non trovo documenti su questo tra quelli che puoi vedere.', src: hits.map((x) => x.id) }
	},
	start(home) {
		this.home = home
		addEventListener('hashchange', () => {
			this.closeSheet()
			scrollTo(0, 0)
			this.render()
		})
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') this.closeSheet()
		})
		// Drag files anywhere: the drop zone overlay.
		let dz
		addEventListener('dragover', (e) => {
			e.preventDefault()
			if (!dz) {
				dz = document.createElement('div')
				dz.className = 'dropzone'
				dz.setAttribute('data-f', 'dragdrop')
				dz.innerHTML = `<div>${I('upload', 40)}<b>Rilascia per caricare</b></div>`
				document.body.appendChild(dz)
			}
			dz.hidden = false
		})
		addEventListener('dragleave', (e) => {
			if (dz && !e.relatedTarget) dz.hidden = true
		})
		addEventListener('drop', (e) => {
			e.preventDefault()
			if (dz) dz.hidden = true
			this.toast('Demo — caricherebbe i file rilasciati')
		})
		this.render()
	},
}
