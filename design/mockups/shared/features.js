// Every user-facing feature of Paperless-ngx (from docs/usage.md, docs/advanced_usage.md, src/documents/models.py,
// src/paperless/urls.py and the front-end routes). Each id must be reachable in every scenario: the check script
// collects data-f attributes on every route and writes coverage.js. Command-line tools (export/import, index
// rebuild, sanity checker, renamer, retagger) have no UI and stay unchanged.
window.FEATURES = [
	[
		'Far entrare i documenti',
		[
			['upload', 'Caricare dal browser'],
			['dragdrop', 'Trascinare i file nella pagina'],
			['uploadtray', 'Avanzamento dei caricamenti'],
			['consumedir', 'Cartella sorvegliata (scanner)'],
			['mailaccounts', 'Caselle email (IMAP, Gmail/Outlook)'],
			['mailrules', 'Regole email'],
			['processedmail', 'Email elaborate'],
			['barcodes', 'Codici a barre: dividi, ASN, etichette'],
			['collate', 'Fronte/retro'],
			['api', 'API REST e token'],
		],
	],
	[
		'Elaborazione automatica',
		[
			['ocr', 'OCR e PDF d’archivio'],
			['matching', 'Assegnazione automatica (regole)'],
			['duplicates', 'Duplicati'],
			['suggest', 'Suggerimenti (ML/AI)'],
		],
	],
	[
		'Organizzare',
		[
			['tags', 'Etichette, anche annidate'],
			['correspondents', 'Corrispondenti'],
			['doctypes', 'Tipi di documento'],
			['storagepaths', 'Percorsi di archiviazione'],
			['customfields', 'Campi personalizzati'],
			['asn', 'Numero d’archivio (ASN)'],
			['notes', 'Note'],
			['versions', 'Versioni del documento'],
			['history', 'Cronologia modifiche'],
		],
	],
	[
		'Trovare e consultare',
		[
			['globalsearch', 'Ricerca globale'],
			['fulltext', 'Ricerca nel testo completo'],
			['morelike', 'Documenti simili'],
			['filters', 'Filtri (etichette, mittente, tipo, percorso, proprietario)'],
			['datefilter', 'Filtri per data'],
			['fieldquery', 'Ricerca per campi personalizzati'],
			['sort', 'Ordinamento'],
			['viewmodes', 'Viste tabella / schede'],
			['columns', 'Scelta delle colonne'],
			['savedviews', 'Viste salvate'],
			['dashboard', 'Dashboard con widget'],
			['stats', 'Statistiche'],
			['preview', 'Anteprima'],
			['content', 'Testo riconosciuto'],
			['metadata', 'Metadati tecnici'],
			['opendocs', 'Documenti aperti'],
			['hotkeys', 'Scorciatoie da tastiera'],
			['tour', 'Tour guidato'],
		],
	],
	[
		'Lavorare sui documenti',
		[
			['edit', 'Modifica dei dati'],
			['bulkedit', 'Modifica di gruppo'],
			['download', 'Scarica (originale e archivio)'],
			['bulkdownload', 'Scarica più documenti (ZIP)'],
			['email', 'Invia per email'],
			['print', 'Stampa'],
			['pdfeditor', 'Editor PDF: ruota, dividi, elimina pagine'],
			['merge', 'Unisci documenti'],
			['removepwd', 'Rimuovi password'],
			['reprocess', 'Rielabora (OCR)'],
			['delete', 'Elimina'],
			['trash', 'Cestino e ripristino'],
		],
	],
	[
		'Automazioni',
		[
			['workflows', 'Workflow: inneschi e azioni'],
			['runworkflow', 'Esegui un workflow a mano'],
		],
	],
	[
		'Condividere',
		[
			['sharelinks', 'Link di condivisione'],
			['bundles', 'Pacchetti di link'],
		],
	],
	[
		'Account e sicurezza',
		[
			['users', 'Utenti e gruppi'],
			['permissions', 'Permessi del documento'],
			['defaultperms', 'Permessi predefiniti'],
			['profile', 'Profilo, 2FA, token'],
			['logout', 'Esci'],
		],
	],
	['Intelligenza artificiale', [['chat', 'Chat sui documenti']]],
	[
		'Amministrazione',
		[
			['uisettings', 'Impostazioni interfaccia (lingua, tema, date)'],
			['notifications', 'Notifiche'],
			['config', 'Configurazione (OCR, AI, titolo, logo)'],
			['tasks', 'Attività in background'],
			['logs', 'Log'],
			['status', 'Stato del sistema'],
			['updates', 'Controllo aggiornamenti'],
			['django', 'Amministrazione Django'],
			['docs', 'Documentazione'],
		],
	],
]
window.FEATURE_IDS = window.FEATURES.flatMap(([, list]) => list.map(([id]) => id))
