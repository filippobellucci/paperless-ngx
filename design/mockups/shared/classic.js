// Markup of today's Paperless-ngx front end (app-frame, dashboard, document list, document detail, management and
// administration screens), rebuilt as static HTML. Used by two pages with different CSS and icons:
//   current/  = Paperless as it is today (Bootstrap look, Bootstrap Icons, system font)
//   restyle/  = scenario 1: identical structure, new look (Inter, line icons, new theme)
const S = { sel: new Set(), q: '', mode: 'title-content', sort: 'created', mode2: 'table', tag: '', corr: '', menu: null, tab: 'details' }
const dd = (id, label, items, cls = 'btn btn-outline', f = '') => `<div class="dropdown"><button class="${cls}" data-dd="${id}" ${f}>${label} ${I('down', 12)}</button><div class="menu" id="dd-${id}" hidden>${items}</div></div>`
const mi = (label, f, act = 'fake', extra = '') => `<button class="menu-item" ${f ? F(f) : ''} data-act="${act}" data-w="${U.esc(label.replace(/<[^>]+>/g, '').toLowerCase())}" ${extra}>${label}</button>`
const tagBadge = (n) => {
	const t = U.tag(n)
	return `<span class="badge-tag" style="--t:${t.color}">${U.esc(n)}</span>`
}
const pageHeader = (title, sub = '', right = '') => `<div class="page-header"><div><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div><div class="page-actions">${right}</div></div>`

// ---------- frame ----------
App.frame = (r) => {
	const su = DEMO.me.superuser
	const link = (route, icon, label, f, active) => `<a class="side-link ${active ? 'active' : ''}" href="#/${route}" ${f ? F(f) : ''}>${I(icon)}<span>${label}</span></a>`
	const n = r.name
	document.getElementById('top').innerHTML = `
    <button class="nav-toggle" data-act="toggle-side" aria-label="Menu">${I('menu', 20)}</button>
    <a class="brand" href="#/dashboard"><span class="brand-logo">${I('documents', 18)}</span><span class="brand-name">Paperless-ngx</span></a>
    <div class="gsearch" ${F('globalsearch')}>${I('search')}<input id="gq" placeholder="Cerca" aria-label="Ricerca globale" autocomplete="off"><div class="gresults" id="gres" hidden></div></div>
    <button class="btn btn-top" data-act="upload-dialog" ${F('upload')}>${I('upload')}<span class="hide-sm"> Carica</span></button>
    <div class="dropdown"><button class="btn-icon" data-dd="notif" ${F('notifications')} aria-label="Notifiche">${I('bell', 18)}<span class="dot-badge">2</span></button>
      <div class="menu menu-right" id="dd-notif" hidden><div class="menu-head">Notifiche</div><div class="menu-note">Bolletta luce settembre–ottobre 2026: elaborazione riuscita</div><div class="menu-note">scansione_0042.pdf: duplicato, non importato</div></div></div>
    <div class="dropdown"><button class="btn-icon user" data-dd="user" aria-label="Utente"><span class="avatar" style="background:${DEMO.me.color}">${DEMO.me.initials}</span></button>
      <div class="menu menu-right" id="dd-user" hidden>
        <div class="menu-head">Accesso come ${DEMO.me.name}</div>
        ${mi(`${I('profile')} Il mio profilo`, 'profile', 'profile')}${mi(`${I('gear')} Impostazioni`, 'uisettings', 'go', 'data-href="#/settings/general"')}
        ${mi(`${I('keyboard')} Scorciatoie da tastiera`, 'hotkeys', 'hotkeys')}${mi(`${I('help')} Documentazione`, 'docs')}${mi(`${I('logout')} Esci`, 'logout')}
        <div class="menu-head">Prova come (demo)</div>${App.accountsHtml('menu-item')}
      </div></div>`
	const views = U.views().filter((v) => v.sidebar)
	document.getElementById('side').innerHTML = `
    <div class="side-section">${link('dashboard', 'dashboard', 'Dashboard', 'dashboard', n === 'dashboard')}${link('documents', 'documents', 'Documenti', 'filters', n === 'documents' || n === 'doc')}</div>
    ${views.length ? `<div class="side-title">Viste salvate</div><div class="side-section">${views.map((v) => link(`view/${v.id}`, 'views', v.name, '', n === 'view' && r.args[0] == v.id)).join('')}</div>` : ''}
    ${
			App.state.open.length
				? `<div class="side-title" ${F('opendocs')}>Documenti aperti</div><div class="side-section">${App.state.open
						.map((id) => {
							const x = U.doc(id)
							return x && U.mine(x) ? link(`doc/${id}`, 'file', U.esc(x.title), '', n === 'doc' && r.args[0] == id) : ''
						})
						.join('')}<button class="side-link small" data-act="close-all">${I('x')}<span>Chiudi tutti</span></button></div>`
				: ''
		}
    <div class="side-title">Gestisci</div><div class="side-section">
      ${link('attributes/tags', 'attributes', 'Attributi', 'tags', n === 'attributes')}
      ${link('savedviews', 'views', 'Viste salvate', 'savedviews', n === 'savedviews')}${link('sharelinks', 'link', 'Link condivisi', 'sharelinks', n === 'sharelinks')}
      ${link('workflows', 'workflow', 'Workflow', 'workflows', n === 'workflows')}${link('mail', 'mail', 'Posta', 'mailaccounts', n === 'mail')}${link('trash', 'trash', 'Cestino', 'trash', n === 'trash')}</div>
    ${su ? `<div class="side-title">Amministrazione</div><div class="side-section">${link('settings/general', 'gear', 'Impostazioni', 'uisettings', n === 'settings')}${link('config/general', 'config', 'Configurazione', 'config', n === 'config')}${link('usersgroups', 'users', 'Utenti e gruppi', 'users', n === 'usersgroups')}${link('tasks', 'tasks', 'Attività', 'tasks', n === 'tasks')}${link('logs', 'logs', 'Log', 'logs', n === 'logs')}</div>` : `<div class="side-section">${link('settings/general', 'gear', 'Impostazioni', 'uisettings', n === 'settings')}</div>`}
    <div class="side-foot"><a class="side-link small" href="#" data-act="fake" data-w="aprirebbe la documentazione" ${F('docs')}>${I('help')}<span>Documentazione</span></a>
      <span class="version" ${F('updates')}>Paperless-ngx 2.20 · ${I('info', 12)} aggiornamenti attivi</span></div>`
	document.getElementById('extras').innerHTML = `
    <button class="chat-fab" data-act="chat" ${F('chat')} aria-label="Chat sui documenti">${I('chat', 20)}</button>
    <div class="upload-tray" id="tray" ${F('uploadtray')} hidden></div>`
}

// ---------- dashboard ----------
App.routes.dashboard = () => {
	const docs = U.docs(),
		inbox = U.inbox()
	const widgets = U.views().filter((v) => v.dashboard)
	return `${pageHeader(`Ciao ${DEMO.me.name}, ti diamo il benvenuto`, '', `<button class="btn btn-outline" data-act="fake" data-w="permetterebbe di riordinare i widget trascinandoli" ${F('dashboard')}>${I('grip')} Personalizza</button>`)}
  <div class="dash">
    <div class="dash-main">
      ${widgets
				.map((v) => {
					const list = U.viewDocs(v).slice(0, 5)
					return `<div class="card widget" ${F('savedviews')}><div class="card-head"><h2>${v.name}</h2><a href="#/view/${v.id}" class="link">Mostra tutti</a></div>
        <table class="table compact"><thead><tr><th>Creato</th><th>Titolo</th><th class="hide-sm">Etichette</th></tr></thead><tbody>${list.map((x) => `<tr><td class="nowrap">${U.num(x.created)}</td><td><a href="#/doc/${x.id}">${U.esc(x.title)}</a></td><td class="hide-sm">${x.tags.map(tagBadge).join(' ')}</td></tr>`).join('') || '<tr><td colspan="3" class="muted">Nessun documento</td></tr>'}</tbody></table></div>`
				})
				.join('')}
    </div>
    <div class="dash-side">
      <div class="card widget" ${F('stats')}><div class="card-head"><h2>Statistiche</h2></div>
        <div class="stat-grid"><div><b>${inbox.length}</b><span>Documenti in Inbox</span></div><div><b>${docs.length}</b><span>Documenti totali</span></div><div><b>${(docs.length * 2.3).toFixed(0)}k</b><span>Caratteri</span></div><div><b>${new Set(docs.map((x) => x.mime)).size}</b><span>Tipi di file</span></div></div>
        <div class="filetypes"><i style="flex:${docs.filter((x) => x.mime === 'application/pdf').length}"></i><i style="flex:${docs.filter((x) => x.mime !== 'application/pdf').length}"></i></div><small class="muted">PDF · JPEG</small></div>
      <div class="card widget"><div class="card-head"><h2>Carica nuovi documenti</h2></div>
        <label class="dropbox" ${F('dragdrop')}>${I('upload', 28)}<span>Trascina qui i documenti o <button class="link" data-act="do-upload" ${F('upload')}>sfoglia</button></span></label><div id="dash-upl"></div>
        <p class="muted small" ${F('consumedir')}>Puoi anche salvarli nella cartella sorvegliata o inviarli per email.</p></div>
      <div class="card widget"><div class="card-head"><h2>Primi passi</h2></div><p class="small">Paperless-ngx è pronto. Il tour guidato mostra le parti principali.</p><button class="btn btn-primary" data-act="tour" ${F('tour')}>${I('tour')} Avvia il tour</button></div>
    </div>
  </div>`
}

// ---------- document list ----------
function filtered(base) {
	let list = base || U.docs()
	if (S.q) list = U.search(S.q, list)
	if (S.tag) list = list.filter((x) => x.tags.includes(S.tag))
	if (S.corr) list = list.filter((x) => x.from === S.corr)
	return [...list].sort((a, b) => (S.sort === 'title' ? a.title.localeCompare(b.title) : S.sort === 'added' ? b.added.localeCompare(a.added) : b.created.localeCompare(a.created)))
}
function listView(base, title, viewId) {
	const list = filtered(base)
	const tags = [...new Set(U.docs().flatMap((x) => x.tags))].sort()
	const corrs = [...new Set(U.docs().map((x) => x.from))].sort()
	const none = !S.sel.size
	const modes = [
		['title-content', 'Titolo e contenuto'],
		['title', 'Titolo'],
		['asn', 'ASN'],
		['fields', 'Campi personalizzati'],
		['mime', 'Tipo di file'],
		['fulltext', 'Ricerca avanzata (testo completo)'],
		['morelike', 'Più simili a'],
		['dups', 'Duplicati'],
	]
	return `${pageHeader(title, '', `${dd('views', `${I('views')} Viste`, `${mi('Salva come…', 'savedviews', 'saveview')}${viewId ? mi('Salva vista', 'savedviews') : ''}${mi('Mostra nella dashboard / barra laterale', 'savedviews')}`)}`)}
  <div class="filter-bar">
    <div class="text-filter">${dd('tmode', modes.find((m) => m[0] === S.mode)[1], modes.map(([k, l]) => `<button class="menu-item" data-act="tmode" data-m="${k}" ${k === 'fulltext' ? F('fulltext') : k === 'morelike' ? F('morelike') : k === 'dups' ? F('duplicates') : k === 'asn' ? F('asn') : ''}>${l}</button>`).join(''), 'btn btn-outline btn-sm')}<input id="lq" value="${U.esc(S.q)}" placeholder="Cerca" aria-label="Testo"></div>
    ${dd('ftags', `${I('tag')} Etichette`, tags.map((t) => `<button class="menu-item" data-act="ftag" data-t="${U.esc(t)}">${tagBadge(t)}</button>`).join(''), 'btn btn-outline btn-sm', F('filters'))}
    ${dd('fcorr', `${I('person')} Corrispondente`, corrs.map((c) => `<button class="menu-item" data-act="fcorr" data-c="${U.esc(c)}">${U.esc(c)}</button>`).join(''), 'btn btn-outline btn-sm')}
    ${dd(
			'ftype',
			`${I('hash')} Tipo di documento`,
			DEMO.types
				.filter(U.mine.bind(U))
				.map((t) => mi(t.name))
				.join(''),
			'btn btn-outline btn-sm'
		)}
    ${dd(
			'fpath',
			`${I('folder')} Percorso`,
			DEMO.storagePaths
				.filter(U.mine.bind(U))
				.map((p) => mi(p.name))
				.join(''),
			'btn btn-outline btn-sm'
		)}
    ${dd('ffield', `${I('fields')} Campi personalizzati`, `${mi('Importo maggiore di…', 'fieldquery')}${mi('Scadenza prima di…')}${mi('Pagata = no')}`, 'btn btn-outline btn-sm', F('fieldquery'))}
    ${dd('fdate', `${I('calendar')} Date`, `${mi('Creato: ultimi 7 giorni', 'datefilter')}${mi('Creato: quest’anno')}${mi('Aggiunto: intervallo…')}`, 'btn btn-outline btn-sm', F('datefilter'))}
    ${dd('fperm', `${I('lock')} Permessi`, `${mi('Proprietario: io')}${mi('Condivisi con me')}${mi('Senza proprietario')}`, 'btn btn-outline btn-sm')}
    ${S.q || S.tag || S.corr ? `<button class="btn btn-link btn-sm" data-act="reset">${I('x')} Reimposta filtri</button>` : ''}
  </div>
  <div class="list-bar">
    <div class="bulk ${none ? 'disabled' : ''}" ${F('bulkedit')}>
      <span class="sel-count">${none ? `${list.length} documenti` : `Selezionati ${S.sel.size} di ${list.length}`}</span>
      ${dd('sel', 'Seleziona', `${mi('Seleziona pagina', '', 'selall')}${mi('Seleziona tutto', '', 'selall')}${mi('Nessuno', '', 'selnone')}`, 'btn btn-outline btn-sm')}
      <span class="bulk-tools">${['Etichette', 'Corrispondente', 'Tipo', 'Percorso', 'Campi', 'Permessi'].map((l) => `<button class="btn btn-outline btn-sm" data-act="bulk" data-w="${l.toLowerCase()}" ${none ? 'disabled' : ''}>${l}</button>`).join('')}
      ${dd('bact', 'Azioni', `${mi(`${I('merge')} Unisci`, 'merge')}${mi(`${I('rotate')} Ruota`, 'pdfeditor')}${mi(`${I('reprocess')} Rielabora`, 'reprocess')}${mi(`${I('play')} Esegui workflow`, 'runworkflow')}${mi(`${I('send')} Invia per email`, 'email')}${mi(`${I('link')} Crea pacchetto di link`, 'bundles')}${mi(`${I('trash')} Elimina`, 'delete')}`, 'btn btn-outline btn-sm')}
      ${dd('bdl', `${I('download')} Scarica`, `${mi('Originali (ZIP)', 'bulkdownload')}${mi('Archiviati (ZIP)')}`, 'btn btn-outline btn-sm')}</span>
    </div>
    <div class="list-tools">
      ${dd(
				'sort',
				`${I('sort')} Ordina`,
				[
					['created', 'Data di creazione'],
					['added', 'Data di aggiunta'],
					['title', 'Titolo'],
				]
					.map(([k, l]) => `<button class="menu-item" data-act="sort" data-s="${k}">${l}${S.sort === k ? ' ✓' : ''}</button>`)
					.join(''),
				'btn btn-outline btn-sm',
				F('sort')
			)}
      <div class="btn-group" ${F('viewmodes')}>${[
				['table', 'list'],
				['small', 'grid'],
				['large', 'cards'],
			]
				.map(([m, ic]) => `<button class="btn btn-outline btn-sm ${S.mode2 === m ? 'active' : ''}" data-act="mode2" data-m="${m}" aria-label="${m}">${I(ic)}</button>`)
				.join('')}</div>
      ${dd('cols', `${I('columns')}`, ['Titolo', 'Corrispondente', 'Etichette', 'Tipo', 'Creato', 'Aggiunto', 'ASN', 'Note', 'Proprietario', 'Importo'].map((c) => `<label class="menu-item"><input type="checkbox" checked> ${c}</label>`).join(''), 'btn btn-outline btn-sm', F('columns'))}
    </div>
  </div>
  ${
		!list.length
			? `<div class="empty">Nessun documento corrisponde ai filtri.</div>`
			: S.mode2 === 'table'
				? `<div class="table-wrap"><table class="table docs"><thead><tr><th class="cb"></th><th>ASN</th><th>Corrispondente</th><th>Titolo</th><th class="hide-sm">Tipo</th><th>Creato</th><th class="hide-sm">Importo</th></tr></thead><tbody>
    ${list.map((x) => `<tr class="${S.sel.has(x.id) ? 'selected' : ''}"><td class="cb"><input type="checkbox" data-act="sel" data-id="${x.id}" ${S.sel.has(x.id) ? 'checked' : ''} aria-label="Seleziona"></td><td class="muted">${x.asn ?? ''}</td><td>${U.esc(x.from)}</td><td><a href="#/doc/${x.id}">${U.esc(x.title)}</a> ${x.tags.map(tagBadge).join(' ')}</td><td class="hide-sm">${x.type}</td><td class="nowrap">${U.num(x.created)}</td><td class="hide-sm nowrap">${U.money(x.fields.Importo)}</td></tr>`).join('')}</tbody></table></div>`
				: `<div class="cards-${S.mode2}">${list
						.map(
							(x) => `<div class="doc-card ${S.sel.has(x.id) ? 'selected' : ''}"><a href="#/doc/${x.id}" class="thumb">${U.paper(x)}</a><div class="doc-card-body"><div class="tags">${x.tags.map(tagBadge).join(' ')}</div><a href="#/doc/${x.id}" class="title">${U.esc(x.title)}</a><small class="muted">${U.esc(x.from)} · ${U.num(x.created)}</small>
      <div class="doc-card-actions"><input type="checkbox" data-act="sel" data-id="${x.id}" ${S.sel.has(x.id) ? 'checked' : ''} aria-label="Seleziona"><a class="btn btn-outline btn-sm" href="#/doc/${x.id}">${I('edit')}</a><button class="btn btn-outline btn-sm" data-act="fake" data-w="mostrerebbe l'anteprima">${I('eye')}</button><button class="btn btn-outline btn-sm" data-act="fake" data-w="scaricherebbe il file">${I('download')}</button></div></div></div>`
						)
						.join('')}</div>`
	}`
}
App.routes.documents = () => listView(null, 'Documenti')
App.routes.view = (r) => {
	const v = DEMO.savedViews.find((x) => x.id == r.args[0])
	return v && U.mine(v) ? listView(U.viewDocs(v), v.name, v.id) : listView(null, 'Documenti')
}

// ---------- document detail ----------
App.routes.doc = (r) => {
	const x = U.doc(r.args[0])
	if (!x || !U.mine(x)) return `<div class="empty">${I('lock', 32)}<p>Documento non trovato o senza permesso.</p></div>`
	App.openDoc(x.id)
	const tab = r.args[1] || 'details'
	const tabs = [
		['details', 'Dettagli', 'edit'],
		['content', 'Contenuto', 'content'],
		['metadata', 'Metadati', 'metadata'],
		['notes', `Note ${x.notes.length ? `<span class="count">${x.notes.length}</span>` : ''}`, 'notes'],
		['permissions', 'Permessi', 'permissions'],
		['history', 'Cronologia', 'history'],
		['duplicates', 'Duplicati', 'duplicates'],
	]
	const row = (label, input) => `<div class="form-row"><label>${label}</label><div>${input}</div></div>`
	const body =
		{
			details: `${row('Titolo', `<input value="${U.esc(x.title)}">`)}${row('Numero d’archivio', `<input value="${x.asn ?? ''}" placeholder="ASN" ${F('asn')}>`)}${row('Data di creazione', `<input type="date" value="${x.created}">`)}
      ${row('Corrispondente', `<select ${F('correspondents')}><option>${U.esc(x.from)}</option></select>`)}${row('Tipo di documento', `<select ${F('doctypes')}><option>${x.type}</option></select>`)}
      ${row('Percorso di archiviazione', `<select ${F('storagepaths')}><option>${DEMO.storagePaths.find((p) => p.id === x.path)?.name}</option></select>`)}${row('Etichette', `<div class="tag-input" ${F('tags')}>${x.tags.map(tagBadge).join(' ')}<button class="btn btn-link btn-sm" data-act="fake" data-w="aggiungerebbe un'etichetta">${I('plus')}</button></div>`)}
      ${Object.entries(x.fields)
				.map(([k, v]) => row(k, `<input value="${U.val(v)}" ${F('customfields')}>`))
				.join('')}
      <div class="form-row"><label></label><div>${dd(
				'addfield',
				`${I('fields')} Campi personalizzati`,
				DEMO.customFields
					.filter(U.mine.bind(U))
					.map((c) => mi(c.name))
					.join(''),
				'btn btn-outline btn-sm',
				F('customfields')
			)}
      ${dd('sugg', `${I('sparkle')} Suggerimenti`, `${mi('Etichetta: Casa/Utenze')}${mi('Corrispondente: Enel Energia')}${mi('Data: 12/11/2026')}`, 'btn btn-outline btn-sm', F('suggest'))}</div></div>`,
			content: `<textarea class="content-text" rows="14">${U.esc(x.content.split(' — ').join('\n'))}</textarea>`,
			metadata: `<table class="table compact">${[
				['Data di modifica', U.num(x.added)],
				['Data di aggiunta', U.num(x.added)],
				['Nome file media', `${x.created.slice(0, 4)}/${x.from}/${x.title}.pdf`],
				['Nome file originale', 'scansione.pdf'],
				['Checksum MD5 originale', '9f1c…e21a'],
				['Dimensione originale', '412 KB'],
				['Tipo MIME originale', x.mime],
				['Checksum archivio', '77b0…c3d9'],
				['Dimensione archivio', '388 KB'],
			]
				.map(([k, v]) => `<tr><th>${k}</th><td>${U.esc(v)}</td></tr>`)
				.join('')}</table>`,
			notes: `${x.notes.map((n) => `<div class="note"><p>${U.esc(n.text)}</p><small class="muted">${n.who} · ${U.num(n.when)}</small></div>`).join('') || '<p class="muted">Nessuna nota.</p>'}<textarea rows="3" placeholder="Scrivi una nota" aria-label="Nota"></textarea><button class="btn btn-primary btn-sm" data-act="fake" data-w="aggiungerebbe la nota">Aggiungi nota</button>`,
			permissions: `${row('Proprietario', `<select><option>${U.user(x.owner).name}</option></select>`)}${row('Visualizzazione: utenti', '<input placeholder="Nessuno">')}${row('Visualizzazione: gruppi', '<input placeholder="Nessuno">')}${row('Modifica: utenti', '<input placeholder="Nessuno">')}${row('Modifica: gruppi', '<input placeholder="Nessuno">')}`,
			history: `<ul class="timeline"><li><b>Creato</b> da ${U.user(x.owner).name} · ${U.num(x.added)}</li><li><b>Modificato</b>: etichetta aggiunta · ${U.num(x.added)}</li>${x.versions > 1 ? '<li><b>Nuova versione</b> caricata · 20/01/2026</li>' : ''}</ul>`,
			duplicates: `<p class="muted">Nessun duplicato trovato per questo documento.</p>`,
		}[tab] || ''
	return `<div class="detail-head">
    <h1>${U.esc(x.title)}</h1>
    <div class="detail-tools">
      ${dd(
				'dact',
				`${I('more')} Azioni`,
				`${mi(`${I('download')} Scarica`, 'download')}${mi(`${I('download')} Scarica originale`)}${mi(`${I('printer')} Stampa`, 'print')}${mi(`${I('send')} Invia per email`, 'email')}${mi(`${I('link')} Link di condivisione`, 'sharelinks', 'share')}
        ${mi(`${I('pdf')} Editor PDF`, 'pdfeditor')}${mi(`${I('unlock')} Rimuovi password`, 'removepwd')}${mi(`${I('reprocess')} Rielabora`, 'reprocess')}${mi(`${I('play')} Esegui workflow`, 'runworkflow')}${mi(`${I('versions')} Versioni (${x.versions})`, 'versions')}${mi(`${I('trash')} Elimina`, 'delete')}`,
				'btn btn-outline btn-sm'
			)}
      <a class="btn btn-outline btn-sm" href="#/documents?more=${x.id}" data-act="morelike" data-id="${x.id}" ${F('morelike')}>${I('documents')} Altri simili</a>
      <span class="btn-group"><button class="btn btn-outline btn-sm" data-act="fake" data-w="andrebbe al documento precedente">${I('back')}</button><button class="btn btn-outline btn-sm" data-act="fake" data-w="andrebbe al documento successivo">${I('chevron')}</button></span>
      <a class="btn btn-outline btn-sm" href="#/documents">${I('x')} Chiudi</a>
    </div></div>
  <div class="detail">
    <div class="detail-form card">
      <div class="tabs" role="tablist">${tabs.map(([k, l, f]) => `<a role="tab" class="tab ${tab === k ? 'active' : ''}" href="#/doc/${x.id}/${k}" ${F(f)}>${l}</a>`).join('')}</div>
      <div class="tab-body">${body}</div>
      <div class="form-foot"><button class="btn btn-outline" data-act="fake" data-w="scarterebbe le modifiche">Scarta</button><button class="btn btn-outline" data-act="fake" data-w="salverebbe e passerebbe al successivo">Salva e prossimo</button><button class="btn btn-outline" data-act="fake" data-w="salverebbe e chiuderebbe">Salva e chiudi</button><button class="btn btn-primary" data-act="saved">Salva</button></div>
    </div>
    <div class="detail-preview" ${F('preview')}>${U.paper(x, true)}<p class="muted center small">Pagina 1 di ${x.pages}</p></div>
  </div>`
}

// ---------- management ----------
App.routes.attributes = (r) => {
	const sec = r.args[0] || 'tags'
	const secs = [
		['tags', 'Etichette', 'tag', 'tags'],
		['correspondents', 'Corrispondenti', 'person', 'correspondents'],
		['documenttypes', 'Tipi di documento', 'hash', 'doctypes'],
		['storagepaths', 'Percorsi di archiviazione', 'folder', 'storagepaths'],
		['customfields', 'Campi personalizzati', 'fields', 'customfields'],
	]
	const rows = { tags: DEMO.tags, correspondents: DEMO.correspondents, documenttypes: DEMO.types, storagepaths: DEMO.storagePaths, customfields: DEMO.customFields }[sec].filter(U.mine.bind(U))
	const count = (o) => U.docs().filter((x) => (sec === 'tags' ? x.tags.includes(o.name) : sec === 'correspondents' ? x.from === o.name : sec === 'documenttypes' ? x.type === o.name : sec === 'storagepaths' ? x.path === o.id : o.name in x.fields)).length
	return `${pageHeader('Attributi', '', `<button class="btn btn-primary" data-act="attr-edit" data-n="">${I('plus')} Crea</button>`)}
  <div class="tabs">${secs.map(([k, l, ic, f]) => `<a class="tab ${sec === k ? 'active' : ''}" href="#/attributes/${k}" ${F(f)}>${I(ic)} ${l}</a>`).join('')}</div>
  <div class="filter-bar"><input placeholder="Filtra per nome" aria-label="Filtra"></div>
  <div class="table-wrap"><table class="table"><thead><tr><th>Nome</th>${sec === 'tags' ? '<th>Colore</th>' : ''}<th class="hide-sm">${sec === 'customfields' ? 'Tipo' : sec === 'storagepaths' ? 'Percorso' : 'Assegnazione'}</th><th>Documenti</th><th class="hide-sm">Proprietario</th><th></th></tr></thead><tbody>
  ${rows
		.map(
			(o) => `<tr><td>${sec === 'tags' ? tagBadge(o.name) : U.esc(o.name)}${o.inbox ? ' <span class="muted small">(etichetta Inbox)</span>' : ''}</td>${sec === 'tags' ? `<td><span class="swatch" style="background:${o.color}"></span></td>` : ''}<td class="hide-sm muted">${sec === 'customfields' ? o.type : sec === 'storagepaths' ? `<code>${o.path}</code>` : 'Automatica'}</td><td>${count(o)}</td><td class="hide-sm">${o.owner ? U.user(o.owner).name : '—'}</td>
    <td class="nowrap right"><a class="btn btn-outline btn-sm" href="#/documents">Documenti</a> <button class="btn btn-outline btn-sm" data-act="attr-edit" data-n="${U.esc(o.name)}" ${F('matching')}>Modifica</button> <button class="btn btn-outline btn-sm" data-act="fake" data-w="eliminerebbe ${U.esc(o.name)}">${I('trash')}</button></td></tr>`
		)
		.join('')}</tbody></table></div>`
}
App.routes.savedviews = () =>
	`${pageHeader('Viste salvate')}<div class="table-wrap"><table class="table" ${F('savedviews')}><thead><tr><th>Nome</th><th>In dashboard</th><th>In barra laterale</th><th></th></tr></thead><tbody>${U.views()
		.map((v) => `<tr><td>${v.name}</td><td><input type="checkbox" ${v.dashboard ? 'checked' : ''} aria-label="Dashboard"></td><td><input type="checkbox" ${v.sidebar ? 'checked' : ''} aria-label="Barra laterale"></td><td class="right"><button class="btn btn-outline btn-sm" data-act="fake" data-w="eliminerebbe la vista">${I('trash')}</button></td></tr>`)
		.join('')}</tbody></table></div><div class="form-foot"><button class="btn btn-primary" data-act="saved">Salva</button></div>`
App.routes.sharelinks = () =>
	`${pageHeader('Link condivisi')}<div class="tabs"><span class="tab active" ${F('sharelinks')}>Link</span><span class="tab" ${F('bundles')}>Pacchetti</span></div><div class="table-wrap"><table class="table"><thead><tr><th>Documento</th><th>Scade</th><th>Link</th><th></th></tr></thead><tbody>${
		DEMO.shareLinks
			.filter(U.mine.bind(U))
			.map((s) => `<tr><td>${s.bundle ? `${I('views')} ${s.name}` : U.esc(U.doc(s.doc).title)}</td><td>${U.num(s.expires)}</td><td><code>/share/${s.slug}</code></td><td class="right"><button class="btn btn-outline btn-sm" data-act="fake" data-w="copierebbe il link">Copia</button> <button class="btn btn-outline btn-sm" data-act="fake" data-w="eliminerebbe il link">${I('trash')}</button></td></tr>`)
			.join('') || '<tr><td colspan="4" class="muted">Nessun link.</td></tr>'
	}</tbody></table></div>`
App.routes.workflows = () =>
	`${pageHeader('Workflow', '', `<button class="btn btn-primary" data-act="fake" data-w="aprirebbe l'editor dei workflow" ${F('workflows')}>${I('plus')} Aggiungi workflow</button>`)}<div class="table-wrap"><table class="table"><thead><tr><th>Nome</th><th>Inneschi</th><th class="hide-sm">Azioni</th><th>Attivo</th><th></th></tr></thead><tbody>${
		DEMO.workflows
			.filter(U.mine.bind(U))
			.map((w) => `<tr><td>${w.name}</td><td>${w.trigger}</td><td class="hide-sm muted">${w.actions}</td><td><input type="checkbox" ${w.on ? 'checked' : ''} aria-label="Attivo"></td><td class="right"><button class="btn btn-outline btn-sm" data-act="fake" data-w="aprirebbe il workflow">Modifica</button></td></tr>`)
			.join('') || '<tr><td colspan="5" class="muted">Nessun workflow.</td></tr>'
	}</tbody></table></div><p class="muted small">Inneschi: elaborazione iniziata, documento aggiunto, modificato, programmato, manuale. Azioni: assegna, rimuovi, email, webhook, rimuovi password, cestino, OCR remoto, suggerimenti AI.</p>`
App.routes.mail = () => `${pageHeader('Posta')}<div class="card"><div class="card-head"><h2 ${F('mailaccounts')}>Caselle email</h2><span><button class="btn btn-outline btn-sm" data-act="fake" data-w="collegherebbe un account Gmail">Collega Gmail</button> <button class="btn btn-outline btn-sm" data-act="fake" data-w="collegherebbe un account Outlook">Collega Outlook</button> <button class="btn btn-primary btn-sm" data-act="fake" data-w="aggiungerebbe una casella IMAP">${I('plus')} Aggiungi</button></span></div>
  ${
		DEMO.mailAccounts
			.filter(U.mine.bind(U))
			.map((a) => `<div class="row-line"><b>${a.name}</b><span class="muted">${a.server} · ${a.user}</span><button class="btn btn-outline btn-sm" data-act="fake" data-w="controllerebbe la posta ora">Elabora posta</button></div>`)
			.join('') || '<p class="muted">Nessuna casella per questo account.</p>'
	}</div>
  <div class="card"><div class="card-head"><h2 ${F('mailrules')}>Regole email</h2><button class="btn btn-primary btn-sm" data-act="fake" data-w="aggiungerebbe una regola">${I('plus')} Aggiungi regola</button></div>${
		DEMO.mailRules
			.filter(U.mine.bind(U))
			.map((m) => `<div class="row-line"><b>${m.name}</b><span class="muted">${m.filter} · dopo: ${m.action} · proprietario dalla regola: ${m.assignOwner ? 'sì' : 'no'}</span></div>`)
			.join('') || '<p class="muted">Nessuna regola.</p>'
	}</div>
  <div class="card"><div class="card-head"><h2 ${F('processedmail')}>Email elaborate</h2></div>${
		DEMO.processedMail
			.filter(() => U.mine({ owner: 'societa' }))
			.map((p) => `<div class="row-line"><span>${p.when}</span><b>${p.subject}</b><span class="muted">${p.status}</span></div>`)
			.join('') || '<p class="muted">Nessuna.</p>'
	}</div>`
App.routes.trash = () =>
	`${pageHeader('Cestino', 'I documenti nel cestino vengono eliminati dopo 30 giorni.', `<button class="btn btn-outline" data-act="fake" data-w="svuoterebbe il cestino" ${F('trash')}>Svuota cestino</button>`)}<div class="table-wrap"><table class="table"><thead><tr><th>Titolo</th><th>Eliminato</th><th></th></tr></thead><tbody>${DEMO.trash
		.filter(U.mine.bind(U))
		.map((t) => `<tr><td>${t.title}</td><td>${U.num(t.deleted)}</td><td class="right"><button class="btn btn-outline btn-sm" data-act="fake" data-w="ripristinerebbe il documento">Ripristina</button> <button class="btn btn-outline btn-sm" data-act="fake" data-w="eliminerebbe definitivamente">Elimina</button></td></tr>`)
		.join('')}</tbody></table></div>`

// ---------- administration ----------
App.routes.settings = (r) => {
	const tab = r.args[0] || 'general'
	const row = (l, c) => `<div class="form-row"><label>${l}</label><div>${c}</div></div>`
	const body = {
		general: `<h3>Aspetto</h3>${row('Lingua', '<select><option>Italiano</option><option>English</option></select>')}${row('Formato data', '<select><option>16 nov 2026</option><option>16/11/2026</option></select>')}${row('Barra laterale', '<label><input type="checkbox"> Compatta</label>')}${window.Themes ? row('Tema', Themes.settingsHtml()) : `${row('Tema', '<label><input type="checkbox"> Tema scuro</label> <label><input type="checkbox" checked> Segui il sistema</label>')}${row('Colore del tema', '<input type="color" value="#17541f" aria-label="Colore">')}`}
      <h3>Ricerca globale</h3>${row('Ricerca completa porta a', '<select><option>Ricerca titolo e contenuto</option><option>Ricerca avanzata</option></select>')}
      <h3 ${F('updates')}>Controllo aggiornamenti</h3>${row('', '<label><input type="checkbox" checked> Controlla se ci sono aggiornamenti</label>')}
      <h3>Documenti</h3>${row('Elementi per pagina', '<select><option>50</option><option>100</option></select>')}${row('Zoom predefinito', '<select><option>Adatta alla larghezza</option></select>')}${row('Suggerimenti', '<select><option>Entrambi</option><option>Solo ML</option><option>Solo AI</option></select>')}
      <div class="btn-row"><button class="btn btn-outline" data-act="tour" ${F('tour')}>Avvia tour</button><button class="btn btn-outline" data-act="status" ${F('status')}>Stato del sistema</button>${DEMO.me.superuser ? `<button class="btn btn-outline" data-act="fake" data-w="aprirebbe l'amministrazione Django" ${F('django')}>Apri amministrazione Django</button>` : ''}</div>`,
		permissions: `<h3 ${F('defaultperms')}>Permessi predefiniti</h3>${row('Proprietario predefinito', `<select><option>${DEMO.me.name}</option><option>Nessuno</option></select>`)}<p class="muted small">Gli oggetti senza proprietario possono essere visti e modificati da tutti gli utenti.</p>${row('Visualizzazione: utenti', '<input>')}${row('Visualizzazione: gruppi', '<input>')}${row('Modifica: utenti', '<input>')}${row('Modifica: gruppi', '<input>')}`,
		notifications: `<h3 ${F('notifications')}>Notifiche</h3>${row('Elaborazione documenti', '<label><input type="checkbox" checked> Mostra notifiche al termine</label>')}${row('', '<label><input type="checkbox" checked> Mostra notifiche in caso di errore</label>')}${row('', '<label><input type="checkbox"> Nascondi i successi nella dashboard</label>')}`,
	}[tab]
	return `${pageHeader('Impostazioni')}<div class="tabs">${[
		['general', 'Generale'],
		['permissions', 'Permessi'],
		['notifications', 'Notifiche'],
	]
		.map(([k, l]) => `<a class="tab ${tab === k ? 'active' : ''}" href="#/settings/${k}">${l}</a>`)
		.join('')}</div><div class="card settings-body" ${F('uisettings')}>${body}</div><div class="form-foot"><button class="btn btn-outline">Annulla</button><button class="btn btn-primary" data-act="saved">Salva</button></div>`
}
App.routes.config = (r) => {
	const tab = r.args[0] || 'general'
	const row = (l, c, h = '') => `<div class="form-row"><label>${l}${h ? `<small>${h}</small>` : ''}</label><div>${c}</div></div>`
	const body = {
		general: `${row('Titolo dell’app', '<input placeholder="Paperless-ngx">')}${row('Logo dell’app', '<input type="file" aria-label="Logo">')}<h3 ${F('consumedir')}>Dal file di configurazione (sola lettura)</h3>${row('Cartella sorvegliata', '<code>/usr/src/paperless/consume</code>', 'PAPERLESS_CONSUMPTION_DIR')}${row('Fronte/retro', '<code>attivo, sottocartella “double-sided”</code>', 'PAPERLESS_CONSUMER_ENABLE_COLLATE_DOUBLE_SIDED')}`,
		ocr: `${row('Lingua OCR', '<input value="ita+eng">')}${row('Modalità', '<select><option>skip</option><option>redo</option><option>force</option></select>')}${row('Tipo di output', '<select><option>pdfa</option></select>')}${row('Pulizia', '<select><option>clean</option></select>')}${row('Raddrizza', '<input type="checkbox" checked>')}`,
		barcode: `${row('Abilita codici a barre', '<input type="checkbox" checked>')}${row('Stringa di separazione', '<input value="PATCHT">')}${row('Codici ASN', '<input type="checkbox" checked>')}${row('Codici a etichetta', '<input type="checkbox">')}<p class="muted small" ${F('collate')}>Fronte/retro: impostato nel file di configurazione (vedi Generale).</p>`,
		ai: `${row('Abilita AI', '<input type="checkbox">')}${row('Backend', '<select><option>ollama</option><option>openai</option></select>')}${row('Modello', '<input value="llama3">')}`,
	}[tab]
	return `${pageHeader('Configurazione', 'Le impostazioni qui sostituiscono quelle del file di configurazione.')}<div class="tabs">${[
		['general', 'Generale', 'config'],
		['ocr', 'OCR', 'ocr'],
		['barcode', 'Codici a barre', 'barcodes'],
		['ai', 'AI', ''],
	]
		.map(([k, l, f]) => `<a class="tab ${tab === k ? 'active' : ''}" href="#/config/${k}" ${f ? F(f) : ''}>${l}</a>`)
		.join('')}</div><div class="card settings-body">${body}</div><div class="form-foot"><button class="btn btn-primary" data-act="saved">Salva</button></div>`
}
App.routes.usersgroups = () => `${pageHeader('Utenti e gruppi')}<div class="card"><div class="card-head"><h2 ${F('users')}>Utenti</h2><button class="btn btn-primary btn-sm" data-act="fake" data-w="creerebbe un utente">${I('plus')} Aggiungi utente</button></div>${DEMO.users.map((u) => `<div class="row-line"><span class="avatar" style="background:${u.color}">${u.initials}</span><b>${u.full}</b><span class="muted">${u.kind}${u.superuser ? ' · superuser' : ''}</span><button class="btn btn-outline btn-sm" data-act="fake" data-w="modificherebbe l'utente">Modifica</button></div>`).join('')}</div><div class="card"><div class="card-head"><h2>Gruppi</h2><button class="btn btn-primary btn-sm" data-act="fake" data-w="creerebbe un gruppo">${I('plus')} Aggiungi gruppo</button></div><p class="muted">Nessun gruppo: gli account non condividono documenti.</p></div>`
App.routes.tasks = () =>
	`${pageHeader('Attività', '', `<button class="btn btn-outline" data-act="fake" data-w="segnerebbe tutto come letto" ${F('tasks')}>Ignora tutte</button>`)}<div class="tabs"><span class="tab active">Tutte</span><span class="tab">In coda</span><span class="tab">Riuscite</span><span class="tab">Fallite</span></div><div class="table-wrap"><table class="table"><thead><tr><th>Nome</th><th>Creata</th><th>Stato</th><th></th></tr></thead><tbody>${DEMO.tasks
		.filter(U.mine.bind(U))
		.map((t) => `<tr><td>${t.name}</td><td class="nowrap">${t.when}</td><td>${t.status}</td><td class="right"><button class="btn btn-outline btn-sm" data-act="fake" data-w="ignorerebbe l'attività">Ignora</button></td></tr>`)
		.join('')}</tbody></table></div>`
App.routes.logs = () => `${pageHeader('Log')}<div class="tabs"><span class="tab active" ${F('logs')}>paperless</span><span class="tab">mail</span><span class="tab">celery</span></div><pre class="logs">${DEMO.logs.join('\n')}</pre>`

// ---------- interactions ----------
App.after = () => {
	const lq = document.getElementById('lq')
	if (lq)
		lq.addEventListener('input', () => {
			S.q = lq.value
			const p = lq.selectionStart
			App.render()
			const n = document.getElementById('lq')
			n.focus()
			n.setSelectionRange(p, p)
		})
	const gq = document.getElementById('gq')
	gq?.addEventListener('input', () => {
		const res = document.getElementById('gres')
		const q = gq.value.trim()
		if (!q) {
			res.hidden = true
			return
		}
		const docs = U.search(q).slice(0, 5)
		const tags = DEMO.tags.filter((t) => U.mine(t) && t.name.toLowerCase().includes(q.toLowerCase())).slice(0, 3)
		res.innerHTML = `<div class="menu-head">Documenti</div>${docs.map((x) => `<a class="menu-item" href="#/doc/${x.id}">${I('file')} ${U.hl(x.title, q)}</a>`).join('') || '<div class="menu-note">Nessun documento</div>'}${tags.length ? `<div class="menu-head">Etichette</div>${tags.map((t) => `<a class="menu-item" href="#/attributes/tags">${tagBadge(t.name)}</a>`).join('')}` : ''}<a class="menu-item" href="#/documents" data-act="fullsearch">Ricerca completa “${U.esc(q)}”</a>`
		res.hidden = false
	})
}
App.uploaded = () => {
	const tray = document.getElementById('tray')
	if (tray) {
		tray.hidden = false
		tray.innerHTML = `<b>Caricamenti</b><div class="row-line">${I('check')} scansione_2026-11-16.pdf — completato <a href="#/doc/301">Apri</a></div><button class="btn btn-link btn-sm" data-act="close-tray">Chiudi</button>`
	}
}
document.addEventListener('click', (e) => {
	const ddb = e.target.closest('[data-dd]')
	document.querySelectorAll('.menu:not([hidden])').forEach((m) => {
		if (!ddb || m.id !== `dd-${ddb.dataset.dd}`) m.hidden = true
	})
	if (ddb) {
		const m = document.getElementById(`dd-${ddb.dataset.dd}`)
		m.hidden = !m.hidden
		e.preventDefault()
		return
	}
	if (!e.target.closest('.gsearch')) {
		const g = document.getElementById('gres')
		if (g) g.hidden = true
	}
	const t = e.target.closest('[data-act]')
	if (!t) return
	const a = t.dataset.act
	if (a === 'sel') {
		const id = Number(t.dataset.id)
		t.checked ? S.sel.add(id) : S.sel.delete(id)
		return App.render()
	}
	e.preventDefault()
	switch (a) {
		case 'as':
			return App.switchUser(t.dataset.u)
		case 'go':
			location.hash = t.dataset.href
			return
		case 'toggle-side':
			document.body.classList.toggle('side-open')
			return
		case 'tmode':
			S.mode = t.dataset.m
			return App.render()
		case 'ftag':
			S.tag = t.dataset.t
			return App.render()
		case 'fcorr':
			S.corr = t.dataset.c
			return App.render()
		case 'reset':
			S.q = S.tag = S.corr = ''
			return App.render()
		case 'sort':
			S.sort = t.dataset.s
			return App.render()
		case 'mode2':
			S.mode2 = t.dataset.m
			return App.render()
		case 'selall':
			filtered().forEach((x) => S.sel.add(x.id))
			return App.render()
		case 'selnone':
			S.sel.clear()
			return App.render()
		case 'bulk':
			return App.sheet(`<h2>Modifica ${t.dataset.w}</h2><p>Applica a ${S.sel.size} documenti selezionati.</p><input placeholder="Scegli…" aria-label="Valore"><div class="btn-row"><button class="btn btn-outline" data-act="close">Annulla</button><button class="btn btn-primary" data-act="fake" data-w="applicherebbe la modifica a ${S.sel.size} documenti">Applica</button></div>`)
		case 'morelike':
			S.q = U.doc(t.dataset.id).from
			S.mode = 'morelike'
			location.hash = '#/documents'
			return
		case 'close-all':
			App.state.open = []
			return App.render()
		case 'close':
			return App.closeSheet()
		case 'close-tray':
			document.getElementById('tray').hidden = true
			return
		case 'saved':
			return App.toast('Salvato (demo)')
		case 'saveview':
			return App.sheet(`<h2>Salva vista</h2><div class="form-row"><label>Nome</label><div><input value="La mia vista"></div></div><label><input type="checkbox"> Mostra nella barra laterale</label><br><label><input type="checkbox"> Mostra nella dashboard</label><div class="btn-row"><button class="btn btn-outline" data-act="close">Annulla</button><button class="btn btn-primary" data-act="fake" data-w="salverebbe la vista">Salva</button></div>`)
		case 'share':
			return App.sheet(`<h2>Link di condivisione</h2><p class="muted">Crea un link pubblico al documento.</p><div class="form-row"><label>Scadenza</label><div><select><option>7 giorni</option><option>30 giorni</option><option>Mai</option></select></div></div><div class="btn-row"><button class="btn btn-outline" data-act="close">Chiudi</button><button class="btn btn-primary" data-act="fake" data-w="creerebbe e copierebbe il link">Crea</button></div>`)
		case 'attr-edit':
			return App.sheet(`<h2>${t.dataset.n ? `Modifica ${U.esc(t.dataset.n)}` : 'Crea nuovo'}</h2><div class="form-row"><label>Nome</label><div><input value="${U.esc(t.dataset.n)}"></div></div><div class="form-row"><label>Algoritmo di assegnazione</label><div><select><option>Automatico</option><option>Qualsiasi parola</option><option>Tutte le parole</option><option>Corrispondenza esatta</option><option>Espressione regolare</option><option>Parola approssimativa</option><option>Nessuno</option></select></div></div><div class="form-row"><label>Corrispondenza</label><div><input></div></div><div class="form-row"><label>Permessi</label><div><select><option>Proprietario: ${DEMO.me.name}</option></select></div></div><div class="btn-row"><button class="btn btn-outline" data-act="close">Annulla</button><button class="btn btn-primary" data-act="fake" data-w="salverebbe">Salva</button></div>`)
		case 'upload-dialog':
			return App.sheet(`<h2>Carica documenti</h2><label class="dropbox">${I('upload', 28)}<span>Trascina qui i file o <button class="link" data-act="do-upload">sfoglia</button></span></label><div id="dlg-upl"></div>`)
		case 'do-upload':
			return App.upload(document.getElementById('dlg-upl') ? 'dlg-upl' : 'dash-upl')
		case 'profile':
			return App.sheet(`<h2>Il mio profilo</h2><div class="form-row"><label>Email</label><div><input value="${DEMO.me.id}@…"></div></div><div class="form-row"><label>Password</label><div><button class="btn btn-outline btn-sm" data-act="fake" data-w="cambierebbe la password">Cambia</button></div></div><div class="form-row"><label>Verifica in due passaggi</label><div><button class="btn btn-outline btn-sm" data-act="fake" data-w="attiverebbe la 2FA">Attiva</button></div></div><div class="form-row" ${F('api')}><label>Token API</label><div><code>••••••••a91f</code> <button class="btn btn-outline btn-sm" data-act="fake" data-w="rigenererebbe il token">Rigenera</button></div></div><div class="form-row"><label>Account collegati</label><div class="muted">Nessuno (OIDC disponibile)</div></div><div class="btn-row"><button class="btn btn-primary" data-act="close">Chiudi</button></div>`)
		case 'hotkeys':
			return App.sheet(
				`<h2>Scorciatoie da tastiera</h2><table class="table compact">${[
					['/', 'Ricerca globale'],
					['Ctrl + S', 'Salva documento'],
					['Esc', 'Chiudi'],
					['←  →', 'Documento precedente / successivo'],
					['Ctrl + Alt + d', 'Dashboard'],
					['Ctrl + Alt + l', 'Documenti'],
				]
					.map(([k, v]) => `<tr><th><kbd>${k}</kbd></th><td>${v}</td></tr>`)
					.join('')}</table>`
			)
		case 'status':
			return App.sheet(
				`<h2>Stato del sistema</h2><table class="table compact">${[
					['Versione', '2.20'],
					['Database', 'SQLite · OK'],
					['Coda (Redis)', 'OK'],
					['Indice di ricerca', 'OK · aggiornato 08:12'],
					['Classificatore', 'OK · addestrato 03:00'],
					['Archivio media', '1,2 GB liberi 88 GB'],
				]
					.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
					.join('')}</table>`
			)
		case 'tour':
			return App.sheet(`<h2>Tour guidato</h2><p>Passo 1 di 8 — La dashboard mostra le viste salvate e le statistiche.</p><div class="btn-row"><button class="btn btn-outline" data-act="close">Chiudi</button><button class="btn btn-primary" data-act="fake" data-w="andrebbe al passo successivo">Avanti</button></div>`)
		case 'chat':
			return App.sheet(`<h2>${I('chat')} Chat sui documenti</h2><p class="muted small">Risponde usando solo i documenti che puoi vedere.</p><div id="chatlog"></div><form id="chatf" class="chat-form"><input id="chatq" placeholder="Fai una domanda" value="${DEMO.me.id === 'societa' ? 'Quanto IMU nel 2026?' : 'Quando scade la polizza?'}" aria-label="Domanda"><button class="btn btn-primary">Invia</button></form>`, 'right')
		case 'fullsearch':
			S.q = document.getElementById('gq').value
			S.mode = 'fulltext'
			location.hash = '#/documents'
			return
		case 'fake':
			return App.fake(t.dataset.w)
	}
})
document.addEventListener('submit', (e) => {
	if (e.target.id === 'chatf') {
		e.preventDefault()
		const q = document.getElementById('chatq').value
		const a = App.chatAnswer(q)
		document.getElementById('chatlog').innerHTML += `<div class="chat-q">${U.esc(q)}</div><div class="chat-a">${a.text}<div>${a.src.map((id) => `<a class="badge-tag" style="--t:#6b6f76" href="#/doc/${id}">${U.esc(U.doc(id).title)}</a>`).join(' ')}</div></div>`
	}
})
window.CHECK_ROUTES = ['#/dashboard', '#/doc/7', '#/doc/7/notes', '#/documents', '#/view/1', '#/attributes/tags', '#/attributes/correspondents', '#/attributes/customfields', '#/savedviews', '#/sharelinks', '#/workflows', '#/mail', '#/trash', '#/settings/general', '#/settings/permissions', '#/settings/notifications', '#/config/general', '#/config/ocr', '#/config/barcode', '#/usersgroups', '#/tasks', '#/logs']
window.CHECK_ACTIONS = [
	['#/dashboard', '[data-dd=user]'],
	['#/dashboard', '#dd-user [data-act=profile]'],
]
