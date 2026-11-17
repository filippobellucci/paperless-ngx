// Demo data for the mini-site: one Paperless instance with three accounts.
//  - marco: personal account, sees only his own documents
//  - societa: company account (Saffi Patrimoni s.s.), sees only its own documents, has the mail account attached
//  - admin: maintenance superuser, sees everything and the administration screens
// Hand-written: no local instance with real data was available.
window.DEMO = (() => {
	const users = [
		{ id: 'marco', name: 'Marco', full: 'Marco R.', initials: 'MR', kind: 'Personale', superuser: false, color: '#2f6f8f' },
		{ id: 'societa', name: 'Saffi Patrimoni', full: 'Saffi Patrimoni s.s.', initials: 'SP', kind: 'Aziendale', superuser: false, color: '#3d4a9c' },
		{ id: 'admin', name: 'Manutenzione', full: 'admin', initials: 'AD', kind: 'Superuser (manutenzione)', superuser: true, color: '#6b6f76' },
	]
	// Attributes: each one has an owner, like in Paperless.
	const tags = [
		{ id: 1, name: 'Inbox', color: '#17541f', inbox: true, owner: null, docs: 0 },
		{ id: 2, name: 'Casa', color: '#c9813a', owner: 'marco' },
		{ id: 3, name: 'Casa/Utenze', color: '#d99a52', owner: 'marco', parent: 2 },
		{ id: 4, name: 'Auto', color: '#3b6ea5', owner: 'marco' },
		{ id: 5, name: 'Salute', color: '#c24d5c', owner: 'marco' },
		{ id: 6, name: 'Garanzia', color: '#8a6b4f', owner: 'marco' },
		{ id: 7, name: 'Tasse', color: '#4f8a5b', owner: 'marco' },
		{ id: 11, name: 'Via Mazzini', color: '#a0522d', owner: 'societa' },
		{ id: 12, name: 'Casale', color: '#6f7d2f', owner: 'societa' },
		{ id: 13, name: 'Fisco', color: '#2c4c9c', owner: 'societa' },
		{ id: 14, name: 'Fornitori', color: '#8c4a6a', owner: 'societa' },
		{ id: 15, name: 'Banca', color: '#2f7d6d', owner: 'societa' },
	]
	const types = [
		['Bolletta', 'marco'],
		['Fattura', 'marco'],
		['Ricevuta', 'marco'],
		['Referto', 'marco'],
		['Polizza', 'marco'],
		['Contratto', 'marco'],
		['Dichiarazione', 'marco'],
		['Busta paga', 'marco'],
		['Garanzia', 'marco'],
		['Fattura passiva', 'societa'],
		['Modello F24', 'societa'],
		['Atto', 'societa'],
		['Visura', 'societa'],
		['Contratto di locazione', 'societa'],
		['Estratto conto', 'societa'],
		['Preventivo', 'societa'],
	].map(([name, owner], i) => ({ id: i + 1, name, owner }))
	const storagePaths = [
		{ id: 1, name: 'Personale per anno', path: 'Marco/{{ created_year }}/{{ correspondent }}/{{ title }}', owner: 'marco' },
		{ id: 2, name: 'Società per immobile', path: 'Societa/{{ created_year }}/{{ tag_list }}/{{ title }}', owner: 'societa' },
	]
	const customFields = [
		{ id: 1, name: 'Importo', type: 'Importo (monetario)', owner: null },
		{ id: 2, name: 'Scadenza', type: 'Data', owner: null },
		{ id: 3, name: 'Pagata', type: 'Sì/No', owner: null },
		{ id: 4, name: 'Immobile', type: 'Selezione', owner: 'societa', options: ['Via Mazzini 22', 'Casale Monteveglio'] },
		{ id: 5, name: 'Partita IVA fornitore', type: 'Testo', owner: 'societa' },
	]
	const d = (id, owner, title, created, added, from, type, tags, extra = {}) => ({
		id,
		owner,
		title,
		created,
		added,
		from,
		type,
		tags,
		inbox: tags.includes('Inbox'),
		asn: null,
		pages: 1,
		mime: 'application/pdf',
		path: owner === 'societa' ? 2 : 1,
		fields: {},
		notes: [],
		versions: 1,
		content: '',
		...extra,
	})
	const documents = [
		// ---- Marco (personal)
		d(101, 'marco', 'Bolletta luce settembre–ottobre 2026', '2026-11-12', '2026-11-14', 'Enel Energia', 'Bolletta', ['Inbox', 'Casa/Utenze'], { pages: 4, fields: { Importo: 87.4, Scadenza: '2026-12-02', Pagata: false }, content: 'Fattura n. 004512987 — Periodo 01/09/2026–31/10/2026 — Consumo 412 kWh — Totale da pagare € 87,40 entro il 02/12/2026' }),
		d(103, 'marco', 'Scontrino lavatrice Bosch', '2026-11-08', '2026-11-13', 'MediaWorld', 'Ricevuta', ['Inbox', 'Garanzia'], { fields: { Importo: 549 }, mime: 'image/jpeg', content: 'MediaWorld Bologna — Lavatrice Bosch WGG244A9IT — € 549,00 — Garanzia 2 anni' }),
		d(104, 'marco', 'Avviso TARI 2026', '2026-11-05', '2026-11-12', 'Comune di Bologna', 'Bolletta', ['Inbox', 'Casa', 'Tasse'], { pages: 2, fields: { Importo: 214, Scadenza: '2026-12-16', Pagata: false }, content: 'Tassa sui rifiuti 2026 — Utenza domestica — prima rata € 107,00 entro il 16/12/2026' }),
		d(1, 'marco', 'Bolletta gas luglio–agosto 2026', '2026-09-08', '2026-09-10', 'Hera Comm', 'Bolletta', ['Casa/Utenze'], { pages: 4, asn: 151, fields: { Importo: 42.15, Pagata: true }, content: 'Consumo 38 Smc — Totale € 42,15 — Addebito SEPA' }),
		d(3, 'marco', 'Fattura internet fibra ottobre 2026', '2026-10-01', '2026-10-02', 'TIM', 'Fattura', ['Casa/Utenze'], { pages: 2, fields: { Importo: 29.9, Pagata: true } }),
		d(4, 'marco', 'Mutuo — piano di ammortamento 2026', '2026-01-15', '2026-01-20', 'Intesa Sanpaolo', 'Contratto', ['Casa'], { pages: 6, asn: 112, versions: 2, content: 'Mutuo ipotecario n. 0123/456 — rata mensile € 640,00 — tasso fisso 2,9%', notes: [{ who: 'Marco', when: '2026-01-20', text: 'Rinegoziato a gennaio: rata da 690 a 640 €.' }] }),
		d(6, 'marco', 'Manutenzione caldaia 2026', '2026-10-14', '2026-10-15', 'Termoidraulica Rossi', 'Fattura', ['Casa'], { fields: { Importo: 110, Pagata: true }, content: 'Controllo fumi e pulizia caldaia — prossimo controllo ottobre 2027' }),
		d(7, 'marco', 'Polizza RC auto Panda 2026–2027', '2026-03-01', '2026-03-02', 'UnipolSai', 'Polizza', ['Auto'], { pages: 8, asn: 87, fields: { Importo: 412, Scadenza: '2027-03-01', Pagata: true }, content: 'Targa GF 123 AB — Fiat Panda — scadenza 01/03/2027', notes: [{ who: 'Marco', when: '2026-03-02', text: 'Chiedere preventivo anche ad Allianz prima del rinnovo.' }] }),
		d(9, 'marco', 'Tagliando 60.000 km', '2026-05-22', '2026-05-23', 'Officina Bertoni', 'Fattura', ['Auto'], { pages: 2, fields: { Importo: 285, Pagata: true } }),
		d(30, 'marco', 'Multa divieto di sosta', '2026-10-21', '2026-10-24', 'Polizia Locale Bologna', 'Ricevuta', ['Auto'], { fields: { Importo: 42, Scadenza: '2026-11-20', Pagata: false }, content: 'Verbale n. 77812/V — riduzione 30% se pagato entro 5 giorni' }),
		d(12, 'marco', 'Visita oculistica', '2026-02-17', '2026-02-18', 'Studio Oculistico Ferri', 'Referto', ['Salute'], { fields: { Importo: 120, Pagata: true }, content: 'Miopia OD -1,75 OS -2,00 — controllo tra 12 mesi' }),
		d(15, 'marco', 'Dichiarazione 730/2026', '2026-06-12', '2026-06-15', 'CAF ACLI', 'Dichiarazione', ['Tasse'], { pages: 14, asn: 140, content: 'Modello 730/2026 — rimborso € 412,00 in busta paga di luglio' }),
		d(21, 'marco', 'Busta paga ottobre 2026', '2026-10-27', '2026-10-28', 'Studio Tecnico Alfa', 'Busta paga', [], { pages: 2, fields: { Importo: 2140.55 } }),
		d(25, 'marco', 'Garanzia frigorifero Samsung', '2024-12-20', '2024-12-21', 'Unieuro', 'Garanzia', ['Garanzia'], { fields: { Importo: 899, Scadenza: '2026-12-20' }, content: 'Garanzia legale 24 mesi — scadenza 20/12/2026' }),
		// ---- Saffi Patrimoni s.s. (company)
		d(201, 'societa', 'Fattura commercialista 3° trimestre 2026', '2026-11-09', '2026-11-12', 'Studio Neri Commercialisti', 'Fattura passiva', ['Inbox', 'Fornitori'], { fields: { Importo: 610, Scadenza: '2026-11-30', Pagata: false, 'Partita IVA fornitore': '02841230379' }, content: 'Fattura n. 2026/418 — Tenuta contabilità 3° trimestre — Imponibile € 500,00 — IVA 22% € 110,00' }),
		d(202, 'societa', 'F24 saldo IMU 2026 — Via Mazzini', '2026-11-11', '2026-11-12', 'Studio Neri Commercialisti', 'Modello F24', ['Inbox', 'Fisco', 'Via Mazzini'], { pages: 2, fields: { Importo: 1240, Scadenza: '2026-12-16', Pagata: false, Immobile: 'Via Mazzini 22' }, content: 'Saldo IMU 2026 — Immobile Via Mazzini 22 — Codice tributo 3918 — Scadenza 16/12/2026' }),
		d(211, 'societa', 'Atto costitutivo Saffi Patrimoni s.s.', '2019-04-10', '2023-11-02', 'Notaio Lanzi', 'Atto', [], { pages: 18, asn: 1, content: 'Società semplice — gestione del patrimonio immobiliare dei soci' }),
		d(212, 'societa', 'Visura camerale 2026', '2026-02-03', '2026-02-03', 'Camera di Commercio di Bologna', 'Visura', [], { pages: 3 }),
		d(214, 'societa', 'Modello Redditi SP 2026', '2026-09-30', '2026-10-01', 'Studio Neri Commercialisti', 'Atto', ['Fisco'], { pages: 22, asn: 9, content: 'Dichiarazione dei redditi società di persone — redditi fondiari Via Mazzini' }),
		d(215, 'societa', 'F24 acconto IMU 2026 — Via Mazzini', '2026-06-16', '2026-06-16', 'Agenzia delle Entrate', 'Modello F24', ['Fisco', 'Via Mazzini'], { fields: { Importo: 1240, Pagata: true, Immobile: 'Via Mazzini 22' } }),
		d(216, 'societa', 'Contratto di locazione Via Mazzini 22', '2026-03-01', '2026-03-03', 'Conti Elena', 'Contratto di locazione', ['Via Mazzini'], { pages: 12, asn: 2, fields: { Scadenza: '2030-02-28', Immobile: 'Via Mazzini 22' }, content: 'Locazione 4+4 — canone mensile € 950,00 — deposito cauzionale € 2.850,00', notes: [{ who: 'Saffi Patrimoni', when: '2026-03-03', text: 'Registrato il 20/03, ricevuta collegata.' }] }),
		d(218, 'societa', 'Rogito acquisto Via Mazzini 22', '2021-06-15', '2023-11-02', 'Notaio Lanzi', 'Atto', ['Via Mazzini'], { pages: 32, asn: 4, fields: { Immobile: 'Via Mazzini 22' } }),
		d(221, 'societa', 'Preventivo ristrutturazione casale', '2026-09-12', '2026-09-14', 'Edilizia Colli Bolognesi', 'Preventivo', ['Casale', 'Fornitori'], { pages: 6, fields: { Importo: 184000, Immobile: 'Casale Monteveglio' }, content: 'Rifacimento tetto e consolidamento — impianti — 6 camere con bagno' }),
		d(223, 'societa', 'Estratto conto ottobre 2026', '2026-11-02', '2026-11-03', 'Banca di Bologna', 'Estratto conto', ['Banca'], { pages: 2 }),
		d(225, 'societa', 'Fattura idraulico Via Mazzini', '2026-08-19', '2026-08-20', 'Termoidraulica Rossi', 'Fattura passiva', ['Fornitori', 'Via Mazzini'], { fields: { Importo: 230, Pagata: true, Immobile: 'Via Mazzini 22' } }),
	]
	for (const x of documents) if (!x.content) x.content = `${x.type} — ${x.from} — ${x.title}`
	const correspondents = [...new Set(documents.map((x) => `${x.owner}|${x.from}`))].map((k, i) => {
		const [owner, name] = k.split('|')
		return { id: i + 1, name, owner }
	})
	const savedViews = [
		{ id: 1, owner: 'marco', name: 'Da pagare', dashboard: true, sidebar: true, rule: (x) => x.fields.Pagata === false },
		{ id: 2, owner: 'marco', name: 'Garanzie', dashboard: false, sidebar: true, rule: (x) => x.tags.includes('Garanzia') },
		{ id: 3, owner: 'marco', name: 'Aggiunti di recente', dashboard: true, sidebar: false, rule: () => true },
		{ id: 4, owner: 'societa', name: 'Fatture da pagare', dashboard: true, sidebar: true, rule: (x) => x.fields.Pagata === false },
		{ id: 5, owner: 'societa', name: 'Via Mazzini', dashboard: true, sidebar: true, rule: (x) => x.tags.includes('Via Mazzini') },
		{ id: 6, owner: 'societa', name: 'Fisco 2026', dashboard: false, sidebar: true, rule: (x) => x.tags.includes('Fisco') && x.created.startsWith('2026') },
	]
	const workflows = [
		{ id: 1, owner: 'societa', name: 'Email società → Fornitori', trigger: 'Documento aggiunto (da email)', actions: 'Proprietario: Saffi Patrimoni · etichetta Fornitori · tipo Fattura passiva', on: true },
		{ id: 2, owner: 'societa', name: 'Promemoria F24', trigger: 'Programmato: 7 giorni prima di “Scadenza”', actions: 'Invia email a societa@…', on: true },
		{ id: 3, owner: 'marco', name: 'Scanner di casa → Marco', trigger: 'Elaborazione iniziata (cartella scansioni/marco)', actions: 'Proprietario: Marco · etichetta Inbox', on: true },
	]
	const mailAccounts = [{ id: 1, owner: 'societa', name: 'Posta della società', server: 'imap.pec.it', user: 'societa@…', oauth: false }]
	const mailRules = [{ id: 1, owner: 'societa', name: 'Allegati PDF in arrivo', account: 1, filter: 'Allegati .pdf, cartella INBOX', action: 'Segna come letto', assignOwner: true }]
	const processedMail = [
		{ when: '2026-11-12 08:10', subject: 'Fattura 2026/418', from: 'studio@neri…', status: 'Elaborata' },
		{ when: '2026-11-12 08:10', subject: 'F24 saldo IMU', from: 'studio@neri…', status: 'Elaborata' },
	]
	const shareLinks = [
		{ doc: 216, owner: 'societa', expires: '2026-11-30', slug: 'k3Pq9x', bundle: false },
		{ doc: null, owner: 'societa', expires: '2026-12-15', slug: 'Fis26', bundle: true, name: 'Fisco 2026 per il commercialista' },
	]
	const tasks = [
		{ when: '2026-11-14 08:12', name: 'Bolletta luce settembre–ottobre 2026.pdf', status: 'Riuscita', owner: 'marco' },
		{ when: '2026-11-12 08:11', name: 'Fattura_2026_418.pdf', status: 'Riuscita', owner: 'societa' },
		{ when: '2026-11-12 08:11', name: 'F24_saldo_IMU.pdf', status: 'Riuscita', owner: 'societa' },
		{ when: '2026-11-11 19:02', name: 'scansione_0042.pdf', status: 'Fallita: file già presente (duplicato)', owner: 'marco' },
	]
	const logs = ['[2026-11-14 08:12:03] INFO  paperless.consumer  Document 101 consumed', '[2026-11-12 08:11:40] INFO  paperless.mail      2 attachments from rule "Allegati PDF in arrivo"', '[2026-11-11 19:02:11] WARN  paperless.consumer  Not consuming scansione_0042.pdf: duplicate of 9']
	const trash = [
		{ title: 'Volantino supermercato', owner: 'marco', deleted: '2026-11-12' },
		{ title: 'Preventivo tetto (vecchio)', owner: 'societa', deleted: '2026-10-30' },
	]
	const groups = [{ name: 'Nessun gruppo condiviso', note: 'Gli account non condividono nulla: ognuno vede solo ciò che possiede.' }]
	return { users, tags, types, storagePaths, customFields, documents, correspondents, savedViews, workflows, mailAccounts, mailRules, processedMail, shareLinks, tasks, logs, trash, groups, today: '2026-11-16', me: users[0] }
})()
