/* ═══════════════════════════════════════════════
   DATA & STATE
═══════════════════════════════════════════════ */
const CREDS = [
  { nick: 'admin',  pwd: 'Admin2026!', nome: 'Paolo Admin', ruolo: 'Super Admin' },
  { nick: 'mrossi', pwd: 'Test1234!',  nome: 'Marco Rossi', ruolo: 'Amministratore' },
];

let currentUser = null;

let users = [
  { id:1, nome:'Admin',  cognome:'Sistema', nick:'admin',    email:'admin@platform.it',   ruolo:'Super Admin',    status:'active',   lastLogin:'Oggi, 09:14', aziende:[] },
  { id:2, nome:'Marco',  cognome:'Rossi',   nick:'mrossi',   email:'m.rossi@platform.it', ruolo:'Amministratore', status:'active',   lastLogin:'Ieri, 16:42', aziende:[] },
  { id:3, nome:'Lucia',  cognome:'Verdi',   nick:'lverdi',   email:'l.verdi@platform.it', ruolo:'Operatore',      status:'active',   lastLogin:'01 Mar',      aziende:[] },
  { id:4, nome:'Paolo',  cognome:'Neri',    nick:'pneri',    email:'p.neri@platform.it',  ruolo:'Viewer',         status:'inactive', lastLogin:'—',           aziende:[] },
];
let editingId = null, nextUserId = 5;

const takers = [
  { id:1, name:'Marco Bianchi',  email:'m.bianchi@acme.it',     azienda:'Acme S.r.l.',       ruolo:'AI Manager',      invito:'non-inviato', dataInvio:'—',      completato:false, band:null,       tscore:null },
  { id:2, name:'Sara Colombo',   email:'s.colombo@acme.it',     azienda:'Acme S.r.l.',       ruolo:'Data Analyst',    invito:'inviato',     dataInvio:'03 Mar', completato:true,  band:'Ready',    tscore:63   },
  { id:3, name:'Luca Ferrari',   email:'l.ferrari@acme.it',     azienda:'Acme S.r.l.',       ruolo:'Sviluppatore',    invito:'inviato',     dataInvio:'02 Mar', completato:true,  band:'Leader',   tscore:78   },
  { id:4, name:'Elena Ricci',    email:'e.ricci@acme.it',       azienda:'Acme S.r.l.',       ruolo:'AI Manager',      invito:'non-inviato', dataInvio:'—',      completato:false, band:null,       tscore:null },
  { id:5, name:'Giorgio Russo',  email:'g.russo@betagroup.it',  azienda:'Beta Group S.p.A.', ruolo:'Product Manager', invito:'inviato',     dataInvio:'01 Mar', completato:true,  band:'Emerging', tscore:50   },
  { id:6, name:'Chiara Marino',  email:'c.marino@betagroup.it', azienda:'Beta Group S.p.A.', ruolo:'Data Analyst',    invito:'non-inviato', dataInvio:'—',      completato:false, band:null,       tscore:null },
  { id:7, name:'Andrea Costa',   email:'a.costa@gamma.it',      azienda:'Gamma Consulting',  ruolo:'AI Manager',      invito:'inviato',     dataInvio:'28 Feb', completato:true,  band:'Explorer', tscore:38   },
];

const aziende = [
  { id:1, name:'Acme S.r.l.',          settore:'Tecnologia',  ref:'g.rossi@acme.it'           },
  { id:2, name:'Beta Group S.p.A.',    settore:'Manifattura', ref:'m.bianchi@betagroup.it'    },
  { id:3, name:'Gamma Consulting',     settore:'Consulenza',  ref:'l.verdi@gamma.it'          },
  { id:4, name:'Delta Finance S.r.l.', settore:'Finanza',     ref:'c.blu@deltafinance.it'     },
];

const demoTakers = [
  { name:'Marco Bianchi', email:'m.bianchi@acme.it', role:'AI Manager',  status:'completato', pct:78, band:'Leader' },
  { name:'Sara Colombo',  email:'s.colombo@acme.it', role:'Data Analyst',status:'completato', pct:63, band:'Ready'  },
  { name:'Luca Ferrari',  email:'l.ferrari@acme.it', role:'Sviluppatore',status:'in-attesa',  pct:0,  band:null     },
  { name:'Elena Ricci',   email:'e.ricci@acme.it',   role:'AI Manager',  status:'in-corso',   pct:45, band:null     },
];

const QUESTIONS = [
  { dim:'Apertura Mentale',  text:'Mi entusiasma sperimentare nuove soluzioni basate su AI nel mio lavoro.' },
  { dim:'Apertura Mentale',  text:'Sono curioso di esplorare applicazioni AI anche al di fuori del mio ambito professionale.' },
  { dim:'Coscienziosità',    text:'Quando integro nuovi strumenti digitali nel mio lavoro, lo faccio in modo pianificato e strutturato.' },
  { dim:'Coscienziosità',    text:'Mi impegno a completare le attività che richiedono l\'apprendimento di nuove tecnologie.' },
  { dim:'Estroversione',     text:'Mi piace condividere con i colleghi le esperienze d\'uso di nuovi strumenti AI.' },
  { dim:'Estroversione',     text:'Prendo volentieri l\'iniziativa per proporre l\'adozione di soluzioni innovative nel mio team.' },
  { dim:'Amicalità',         text:'Collaboro facilmente con altri per valutare e adottare strumenti AI nel mio contesto lavorativo.' },
  { dim:'Amicalità',         text:'Considero il feedback dei colleghi un elemento utile per migliorare l\'uso delle tecnologie AI.' },
  { dim:'Stabilità Emotiva', text:'Di fronte a errori o risultati inaspettati dell\'AI, mantengo la calma e cerco soluzioni.' },
  { dim:'AI Readiness',      text:'Mi sento pronto a integrare strumenti AI nelle mie attività quotidiane con limitata supervisione esterna.' },
];
const SCALE = ['Per niente','Poco','Abbastanza','Molto','Moltissimo'];
const TAKER = { name:'Marco Bianchi', first:'Marco', company:'Acme S.r.l.', email:'m.bianchi@acme.it' };

let privacyAccepted = false;
let currentQ = 0;
let answers = new Array(QUESTIONS.length).fill(null);

let sessCurrent = 1;
let sessSelectedAzienda = null;
let sessTestTakers = [];
const sessSteps = [
  { title:'Seleziona / Crea Azienda', desc:'Scegli un\'azienda dall\'elenco o registrane una nuova per avviare la sessione.' },
  { title:'Elenco Test Taker',        desc:'Aggiungi i partecipanti che riceveranno il link al test.' },
  { title:'Invio Test',               desc:'Scegli la modalità di invio e personalizza il messaggio di invito.' },
  { title:'Stato Esecuzione Test',    desc:'Monitora l\'avanzamento dei test inviati.' },
  { title:'Invia Report',             desc:'Genera e invia il report PDF ai partecipanti che hanno completato il test.' },
];

const reportStatus = {};
let selInv = new Set();
let selRep = new Set();


/* ═══════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════ */
function showMainTopbar(section) {
  document.getElementById('main-topbar').style.display = 'flex';
  document.getElementById('taker-topbar').style.display = 'none';
  document.getElementById('topbar-section-label').textContent = section;
}
function showTakerTopbar(withProgress) {
  document.getElementById('main-topbar').style.display = 'none';
  document.getElementById('taker-topbar').style.display = 'flex';
  document.getElementById('topbar-progress-tt').style.display = withProgress ? 'flex' : 'none';
}
function hideTopbars() {
  document.getElementById('main-topbar').style.display = 'none';
  document.getElementById('taker-topbar').style.display = 'none';
}


/* ═══════════════════════════════════════════════
   SCREEN ROUTING
═══════════════════════════════════════════════ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}
function goToDashboard() {
  showScreen('screen-dashboard');
  showMainTopbar('Dashboard');
}
function goToUsers() {
  showScreen('screen-users');
  showMainTopbar('Gestione utenti');
  renderUsers(users);
}
function goToConfig() {
  showScreen('screen-config');
  showMainTopbar('Configurazioni');
  showConfigSub('menu');
}
function goToSession() {
  showScreen('screen-session');
  showMainTopbar('Nuova sessione');
  goSessStep(1);
  renderAziende(aziende);
}
function goToTakerView() {
  showScreen('screen-taker');
  showTakerTopbar(false);
  document.getElementById('taker-name').textContent = TAKER.name;
  document.getElementById('company-name').textContent = TAKER.company;
  document.getElementById('topbar-company-tt').textContent = TAKER.company;
  privacyAccepted = false;
  document.getElementById('privacy-check').classList.remove('checked');
  document.getElementById('btn-start').disabled = true;
  answers = new Array(QUESTIONS.length).fill(null);
}
function showAdminLogin() {
  showScreen('screen-login');
  hideTopbars();
}


/* ═══════════════════════════════════════════════
   LOGIN / LOGOUT
═══════════════════════════════════════════════ */
function checkLoginForm() {
  const n = document.getElementById('login-nick').value.trim();
  const p = document.getElementById('login-pwd').value;
  document.getElementById('btn-login').disabled = !(n && p);
}
function doLogin() {
  const nick = document.getElementById('login-nick').value.trim();
  const pwd  = document.getElementById('login-pwd').value;
  const cred = CREDS.find(c => c.nick === nick && c.pwd === pwd);
  if (!cred) {
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('login-pwd').value = '';
    checkLoginForm();
    return;
  }
  document.getElementById('login-error').style.display = 'none';
  currentUser = cred;
  document.getElementById('topbar-nick').textContent = cred.nome;
  document.getElementById('topbar-role').textContent = cred.ruolo;
  document.getElementById('dash-name').textContent = cred.nome.split(' ')[0];
  goToDashboard();
}
function doLogout() {
  currentUser = null;
  document.getElementById('login-nick').value = '';
  document.getElementById('login-pwd').value  = '';
  document.getElementById('btn-login').disabled = true;
  showScreen('screen-login');
  hideTopbars();
}


/* ═══════════════════════════════════════════════
   USERS TABLE
═══════════════════════════════════════════════ */
const roleCls    = { 'Super Admin':'role-superadmin','Amministratore':'role-admin','Operatore':'role-viewer','Viewer':'role-readonly' };
const statusCls  = { active:'active', inactive:'inactive' };
const statusLbl  = { active:'Attivo', inactive:'Inattivo' };

function renderUsers(list) {
  document.getElementById('users-tbody').innerHTML = list.map(u => `
    <tr>
      <td><div class="td-name">${u.nome} ${u.cognome}</div><div class="td-email">${u.email}</div></td>
      <td style="font-size:13px;color:var(--mid);font-family:monospace">${u.nick}</td>
      <td><span class="role-pill ${roleCls[u.ruolo]||'role-readonly'}">${u.ruolo}</span></td>
      <td><span class="status-dot ${statusCls[u.status]||'inactive'}">${statusLbl[u.status]||u.status}</span></td>
      <td style="font-size:12px;color:var(--light)">${u.lastLogin}</td>
      <td><div class="row-actions">
        <button class="btn btn-secondary btn-sm" onclick="openEditModal(${u.id})">Modifica</button>
        ${u.status==='active'
          ? `<button class="btn btn-secondary btn-sm" onclick="toggleStatus(${u.id})" style="color:var(--light)">Disabilita</button>`
          : `<button class="btn btn-secondary btn-sm" onclick="toggleStatus(${u.id})" style="color:var(--green)">Abilita</button>`}
      </div></td>
    </tr>`).join('') ||
    `<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--light);font-size:13px">Nessun utente trovato</td></tr>`;
}
function filterUsers(q) {
  const role = document.getElementById('filter-role').value;
  renderUsers(users.filter(u =>
    (!q    || (u.nome+' '+u.cognome+' '+u.nick).toLowerCase().includes(q.toLowerCase())) &&
    (!role || u.ruolo === role)
  ));
}
function toggleStatus(id) {
  const u = users.find(x => x.id===id);
  if (!u) return;
  u.status = u.status==='active' ? 'inactive' : 'active';
  filterUsers('');
  showToast(`Utente ${u.status==='active'?'abilitato':'disabilitato'}: ${u.nick}`);
}
function openModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Nuovo utente';
  document.getElementById('modal-sub').textContent   = 'Compila i campi per creare un nuovo account.';
  document.getElementById('btn-delete-user').style.display = 'none';
  ['m-nome','m-cognome','m-nick','m-email','m-pwd'].forEach(id => document.getElementById(id).value='');
  document.getElementById('m-role').value   = 'Amministratore';
  document.getElementById('m-status').value = 'active';
  document.getElementById('modal-overlay').classList.add('open');
}
function openEditModal(id) {
  const u = users.find(x=>x.id===id);
  if (!u) return;
  editingId = id;
  document.getElementById('modal-title').textContent = `Modifica — ${u.nick}`;
  document.getElementById('modal-sub').textContent   = 'Aggiorna i dati dell\'utente.';
  document.getElementById('btn-delete-user').style.display = u.ruolo==='Super Admin' ? 'none' : 'inline-block';
  document.getElementById('m-nome').value    = u.nome;
  document.getElementById('m-cognome').value = u.cognome;
  document.getElementById('m-nick').value    = u.nick;
  document.getElementById('m-email').value   = u.email;
  document.getElementById('m-pwd').value     = '';
  document.getElementById('m-role').value    = u.ruolo;
  document.getElementById('m-status').value  = u.status;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }
function closeModalOutside(e) { if (e.target===document.getElementById('modal-overlay')) closeModal(); }
function saveUser() {
  const nome    = document.getElementById('m-nome').value.trim();
  const cognome = document.getElementById('m-cognome').value.trim();
  const nick    = document.getElementById('m-nick').value.trim().toLowerCase().replace(/\s+/g,'');
  const email   = document.getElementById('m-email').value.trim();
  const ruolo   = document.getElementById('m-role').value;
  const status  = document.getElementById('m-status').value;
  if (!nome || !cognome || !nick || !email) { showToast('Compila tutti i campi obbligatori'); return; }
  if (editingId) {
    const u = users.find(x=>x.id===editingId);
    Object.assign(u, { nome, cognome, nick, email, ruolo, status });
    showToast(`Utente aggiornato: ${nick}`);
  } else {
    users.push({ id:nextUserId++, nome, cognome, nick, email, ruolo, status, lastLogin:'—', aziende:[] });
    showToast(`Utente creato: ${nick}`);
  }
  closeModal();
  filterUsers('');
}
function deleteUser() {
  const u = users.find(x=>x.id===editingId);
  if (!u) return;
  if (!confirm(`Eliminare l'utente "${u.nick}"?`)) return;
  users = users.filter(x=>x.id!==editingId);
  closeModal(); filterUsers('');
  showToast(`Utente eliminato: ${u.nick}`);
}


/* ═══════════════════════════════════════════════
   CONFIGURAZIONI
═══════════════════════════════════════════════ */
function showConfigSub(sub) {
  ['config-menu','config-email','config-inviti','config-report','config-incontri'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('config-'+sub).style.display = 'block';
  if (sub==='inviti')   initInviti();
  if (sub==='report')   initReport();
  if (sub==='email')    updateEmailPreview();
  if (sub==='incontri') initIncontri();
}
function updateEmailPreview() {
  const body = document.getElementById('email-body')?.value || '';
  const preview = body
    .replace(/{{nome}}/g,        'Marco')
    .replace(/{{cognome}}/g,     'Bianchi')
    .replace(/{{azienda}}/g,     'Acme S.r.l.')
    .replace(/{{link}}/g,        'https://assessment.app/t/abc123')
    .replace(/{{data_limite}}/g, '12 marzo 2026')
    .replace(/{{ruolo}}/g,       'AI Manager');
  const el = document.getElementById('email-preview-body');
  if (el) el.textContent = preview;
}
function insertToken(token) {
  const ta = document.getElementById('email-body');
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd;
  ta.value = ta.value.slice(0,s) + token + ta.value.slice(e);
  ta.selectionStart = ta.selectionEnd = s + token.length;
  ta.focus();
  updateEmailPreview();
}

// ── Inviti ──
function initInviti() {
  selInv = new Set();
  renderInviti(takers);
}
function filterTableInv() {
  const az = document.getElementById('filter-az-inv').value;
  const st = document.getElementById('filter-stato-inv').value;
  const q  = document.getElementById('search-inv').value.toLowerCase();
  renderInviti(takers.filter(t =>
    (!az || t.azienda===az) && (!st || t.invito===st) &&
    (!q  || t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q))
  ));
}
function renderInviti(list) {
  document.getElementById('inv-tbody').innerHTML = list.map(t => {
    const checked = selInv.has(t.id);
    const stEl = t.invito==='inviato'
      ? '<span class="badge badge-sent">Inviato</span>'
      : '<span class="badge badge-wait">Non inviato</span>';
    return `<tr>
      <td><div class="cb-wrap ${checked?'checked':''}" id="cb-inv-${t.id}" onclick="toggleInv(${t.id})"></div></td>
      <td><div class="td-name">${t.name}</div><div class="td-email">${t.email}</div></td>
      <td style="font-size:13px;color:var(--mid)">${t.azienda}</td>
      <td style="font-size:13px;color:var(--mid)">${t.ruolo}</td>
      <td>${stEl}</td>
      <td style="font-size:12px;color:var(--light)">${t.dataInvio}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--light);font-size:13px">Nessun partecipante trovato</td></tr>`;
  updateInvCount();
}
function toggleInv(id) {
  selInv.has(id) ? selInv.delete(id) : selInv.add(id);
  document.getElementById('cb-inv-'+id)?.classList.toggle('checked', selInv.has(id));
  updateInvCount();
}
function toggleAllInv() {
  const all = takers.every(t => selInv.has(t.id));
  takers.forEach(t => all ? selInv.delete(t.id) : selInv.add(t.id));
  filterTableInv();
}
function updateInvCount() {
  const n = selInv.size;
  document.getElementById('inv-count').textContent = n;
  document.getElementById('inv-none').style.display = n ? 'none' : 'inline';
  document.getElementById('btn-send-inv').disabled = n===0;
  const allSel = takers.length>0 && takers.every(t => selInv.has(t.id));
  document.getElementById('cb-all-inv')?.classList.toggle('checked', allSel);
  const lbl = document.getElementById('sel-all-inv-label');
  if (lbl) lbl.textContent = allSel ? 'Deseleziona tutti' : 'Seleziona tutti';
}
function sendInviti() {
  const cnt = selInv.size;
  selInv.forEach(id => { const t = takers.find(x=>x.id===id); if(t) t.invito='inviato'; });
  selInv.clear();
  filterTableInv();
  document.getElementById('inv-sent-note').style.display = 'inline';
  showToast(`Inviti inviati a ${cnt} partecipanti`);
  setTimeout(()=> document.getElementById('inv-sent-note').style.display='none', 4000);
}

// ── Report ──
function initReport() {
  selRep = new Set();
  renderReport(takers.filter(t => t.completato));
}
function filterTableRep() {
  const az   = document.getElementById('filter-az-rep').value;
  const band = document.getElementById('filter-band-rep').value;
  const q    = document.getElementById('search-rep').value.toLowerCase();
  renderReport(takers.filter(t =>
    t.completato &&
    (!az   || t.azienda===az) &&
    (!band || t.band===band) &&
    (!q    || t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q))
  ));
}
const bandCls = { Leader:'band-leader', Ready:'band-ready', Emerging:'band-emerging', Explorer:'band-explorer' };
function renderReport(list) {
  document.getElementById('rep-tbody').innerHTML = list.map(t => {
    const checked = selRep.has(t.id);
    const sent    = reportStatus[t.id]==='inviato';
    const stEl    = sent ? '<span class="badge badge-ok">Report inviato</span>' : '<span class="badge badge-wait">Da inviare</span>';
    const bandEl  = t.band ? `<span class="band ${bandCls[t.band]||''}">${t.band}</span>` : '—';
    return `<tr>
      <td><div class="cb-wrap ${checked?'checked':''}" id="cb-rep-${t.id}" onclick="toggleRep(${t.id})"></div></td>
      <td><div class="td-name">${t.name}</div><div class="td-email">${t.email}</div></td>
      <td style="font-size:13px;color:var(--mid)">${t.azienda}</td>
      <td>${bandEl}</td>
      <td style="font-size:13px;color:var(--mid)">${t.tscore??'—'}</td>
      <td>${stEl}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--light);font-size:13px">Nessun test completato trovato</td></tr>`;
  updateRepCount();
}
function toggleRep(id) {
  selRep.has(id) ? selRep.delete(id) : selRep.add(id);
  document.getElementById('cb-rep-'+id)?.classList.toggle('checked', selRep.has(id));
  updateRepCount();
}
function toggleAllRep() {
  const completati = takers.filter(t=>t.completato);
  const all = completati.length>0 && completati.every(t => selRep.has(t.id));
  completati.forEach(t => all ? selRep.delete(t.id) : selRep.add(t.id));
  filterTableRep();
}
function updateRepCount() {
  const n = selRep.size;
  document.getElementById('rep-count').textContent = n;
  document.getElementById('rep-none').style.display = n ? 'none' : 'inline';
  document.getElementById('btn-send-rep').disabled = n===0;
  const completati = takers.filter(t=>t.completato);
  const allSel = completati.length>0 && completati.every(t => selRep.has(t.id));
  document.getElementById('cb-all-rep')?.classList.toggle('checked', allSel);
  const lbl = document.getElementById('sel-all-rep-label');
  if (lbl) lbl.textContent = allSel ? 'Deseleziona tutti' : 'Seleziona tutti i completati';
}
function sendReport() {
  const sent = selRep.size;
  selRep.forEach(id => { reportStatus[id] = 'inviato'; });
  selRep.clear();
  filterTableRep();
  document.getElementById('rep-sent-note').style.display = 'inline';
  showToast(`Report inviati a ${sent} partecipant${sent===1?'e':'i'}`);
  setTimeout(()=> document.getElementById('rep-sent-note').style.display='none', 4000);
}


/* ═══════════════════════════════════════════════
   SESSIONE WIZARD
═══════════════════════════════════════════════ */
function goSessStep(n) { if (n <= sessCurrent) setSessStep(n); }
function setSessStep(n) {
  sessCurrent = n;
  document.querySelectorAll('[id^="sess-panel-"]').forEach(p => p.classList.remove('visible'));
  document.getElementById('sess-panel-'+n)?.classList.add('visible');
  document.querySelectorAll('#sess-step-progress .step-node').forEach(node => {
    const s = parseInt(node.dataset.step);
    node.classList.remove('active','done');
    if (s < n) node.classList.add('done');
    else if (s===n) node.classList.add('active');
  });
  document.querySelectorAll('#sess-step-progress .step-dash').forEach((d,i) => d.classList.toggle('done', i<n-1));
  document.getElementById('sess-step-title').textContent = sessSteps[n-1].title;
  document.getElementById('sess-step-desc').textContent  = sessSteps[n-1].desc;
  document.getElementById('sess-btn-back').style.display = n>1 ? 'inline-block' : 'none';
  document.getElementById('sess-btn-next').style.display = n===5 ? 'none' : 'inline-block';
  document.getElementById('sess-btn-skip').style.display = n===5 ? 'none' : 'inline-block';
  if (n===4) renderSessStep4();
  if (n===5) renderSessStep5();
  window.scrollTo({ top:0, behavior:'smooth' });
}
function nextSessStep() { if (sessCurrent<5) setSessStep(sessCurrent+1); }
function prevSessStep()  { if (sessCurrent>1) setSessStep(sessCurrent-1); }

function renderAziende(list) {
  const el = document.getElementById('az-rows');
  if (!list.length) { el.innerHTML='<div style="padding:16px;text-align:center;color:var(--light);font-size:13px">Nessuna azienda trovata</div>'; return; }
  el.innerHTML = list.map(a => `
    <div onclick="selectAzienda(${a.id})" id="az-row-${a.id}"
      style="display:grid;grid-template-columns:24px 1fr 130px 1fr;align-items:center;padding:11px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .1s"
      onmouseover="this.style.background='var(--bg)'"
      onmouseout="this.style.background='${sessSelectedAzienda===a.id?'var(--bg)':'white'}'">
      <span id="az-check-${a.id}" style="color:var(--black);font-size:13px">${sessSelectedAzienda===a.id?'✓':''}</span>
      <span style="font-size:13px;font-weight:${sessSelectedAzienda===a.id?'500':'400'};color:var(--black)">${a.name}</span>
      <span style="font-size:12px;color:var(--light)">${a.settore}</span>
      <span style="font-size:12px;color:var(--light)">${a.ref}</span>
    </div>`).join('');
}
function selectAzienda(id) {
  sessSelectedAzienda = id;
  const az = aziende.find(a => a.id===id);
  document.getElementById('az-selected-name').textContent = az.name;
  document.getElementById('az-name-s4').textContent       = az.name;
  sessTestTakers = demoTakers.map(t => ({...t}));
  renderSessTakers();
  renderAziende(aziende);
}
function filterAziende(q) {
  renderAziende(aziende.filter(a =>
    a.name.toLowerCase().includes(q.toLowerCase()) || a.settore.toLowerCase().includes(q.toLowerCase())
  ));
}
function addTestTaker() {
  const name  = document.getElementById('tt-name').value.trim();
  const email = document.getElementById('tt-email').value.trim();
  const role  = document.getElementById('tt-role').value;
  if (!name || !email) return;
  sessTestTakers.push({ name, email, role, status:'non-inviato', pct:0, band:null });
  document.getElementById('tt-name').value = '';
  document.getElementById('tt-email').value = '';
  document.getElementById('tt-role').value = '';
  renderSessTakers();
}
function removeSessTaker(i) { sessTestTakers.splice(i,1); renderSessTakers(); }
function renderSessTakers() {
  const list  = document.getElementById('tt-list');
  const empty = document.getElementById('tt-empty');
  if (!sessTestTakers.length) { list.innerHTML=''; empty.style.display='block'; return; }
  empty.style.display = 'none';
  list.innerHTML = sessTestTakers.map((t,i) => `
    <div style="display:grid;grid-template-columns:1fr 1fr 140px 40px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--border)">
      <span style="font-size:13px;font-weight:500;color:var(--black)">${t.name}</span>
      <span style="font-size:12px;color:var(--light)">${t.email}</span>
      <span style="font-size:12px;color:var(--mid)">${t.role||'—'}</span>
      <span onclick="removeSessTaker(${i})" style="font-size:16px;color:var(--light);cursor:pointer;text-align:center"
        onmouseover="this.style.color='var(--black)'" onmouseout="this.style.color='var(--light)'">×</span>
    </div>`).join('');
}
function renderSessStep4() {
  const completed = sessTestTakers.filter(t => t.status==='completato').length;
  const pending   = sessTestTakers.filter(t => t.status==='in-attesa'||t.status==='non-inviato'||t.status==='in-corso').length;
  document.getElementById('s4-completed').textContent = completed;
  document.getElementById('s4-pending').textContent   = pending;
  const list  = document.getElementById('s4-list');
  const empty = document.getElementById('s4-empty');
  if (!sessTestTakers.length) { list.innerHTML=''; empty.style.display='block'; return; }
  empty.style.display = 'none';
  const sLabel = { completato:'Completato','in-corso':'In corso','in-attesa':'In attesa','non-inviato':'Non inviato',scaduto:'Scaduto' };
  const sColor = { completato:'#27ae60','in-corso':'#e67e22','in-attesa':'#999','non-inviato':'#ccc',scaduto:'#c0392b' };
  list.innerHTML = sessTestTakers.map((t,i) => `
    <div style="display:grid;grid-template-columns:1fr 140px 120px 80px;align-items:center;padding:11px 16px;border-bottom:1px solid var(--border)">
      <div><div style="font-size:13px;font-weight:500;color:var(--black)">${t.name}</div><div style="font-size:11px;color:var(--light)">${t.email}</div></div>
      <span style="font-size:12px;color:${sColor[t.status]};font-weight:500">${sLabel[t.status]||t.status}</span>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden">
          <div style="width:${t.pct}%;height:100%;background:var(--black);border-radius:2px"></div>
        </div>
        <span style="font-size:11px;color:var(--light);width:28px;text-align:right">${t.pct?t.pct+'%':'—'}</span>
      </div>
      ${(t.status==='in-attesa'||t.status==='non-inviato')
        ? `<button style="font-family:var(--font);font-size:11px;padding:4px 10px;border:1px solid var(--border);border-radius:3px;background:white;cursor:pointer;color:var(--mid)">Sollecita</button>`
        : '<span style="font-size:11px;color:var(--light)">—</span>'}
    </div>`).join('');
}
function renderSessStep5() {
  const completed = sessTestTakers.filter(t => t.status==='completato');
  const list  = document.getElementById('s5-list');
  const empty = document.getElementById('s5-empty');
  const btn   = document.getElementById('btn-send-report-sess');
  if (!completed.length) { list.innerHTML=''; empty.style.display='block'; btn.style.display='none'; return; }
  empty.style.display='none'; btn.style.display='inline-block';
  const bStyles = { Leader:'background:#111;color:#fff',Ready:'background:#eee;color:#111',Emerging:'background:#f4f4f4;color:#777',Explorer:'background:#fff;color:#bbb;border:1px solid #ddd' };
  list.innerHTML = completed.map((t,i) => `
    <div style="display:grid;grid-template-columns:32px 1fr 100px 80px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--border)">
      <input type="checkbox" checked id="s5-cb-${i}" style="cursor:pointer;width:14px;height:14px;accent-color:#111">
      <div><div style="font-size:13px;font-weight:500;color:var(--black)">${t.name}</div><div style="font-size:11px;color:var(--light)">${t.email}</div></div>
      <span style="font-size:11px;font-weight:500;padding:3px 9px;border-radius:3px;display:inline-block;${bStyles[t.band]||''}">${t.band||'—'}</span>
      <span id="s5-status-${i}" style="font-size:11px;color:var(--light)">PDF pronto</span>
    </div>`).join('');
}
function sendReportsSess() {
  const completed = sessTestTakers.filter(t => t.status==='completato');
  completed.forEach((_,i) => {
    const cb = document.getElementById('s5-cb-'+i);
    const st = document.getElementById('s5-status-'+i);
    if (cb?.checked && st) { st.textContent='✓ Inviato'; st.style.color='#27ae60'; cb.disabled=true; }
  });
  const btn = document.getElementById('btn-send-report-sess');
  btn.textContent='✓ Report inviati'; btn.style.background='#444'; btn.disabled=true;
  showToast('Report inviati con successo');
}


/* ═══════════════════════════════════════════════
   TEST TAKER FLOW
═══════════════════════════════════════════════ */
function togglePrivacy() {
  privacyAccepted = !privacyAccepted;
  document.getElementById('privacy-check').classList.toggle('checked', privacyAccepted);
  document.getElementById('btn-start').disabled = !privacyAccepted;
}
function startTest() {
  showScreen('screen-taker-q');
  showTakerTopbar(true);
  buildStepBar();
  renderQ(0);
}
function buildStepBar() {
  document.getElementById('step-bar').innerHTML = QUESTIONS.map((_,i) =>
    `<div class="q-step-node ${i===0?'active':''}" id="snode-${i}">${i+1}</div>` +
    (i < QUESTIONS.length-1 ? `<div class="q-step-dash" id="sdash-${i}"></div>` : '')
  ).join('');
}
function updateStepBar(q) {
  QUESTIONS.forEach((_,i) => {
    const node = document.getElementById('snode-'+i);
    node.classList.remove('active','done');
    if (i < q) node.classList.add('done');
    else if (i===q) node.classList.add('active');
    if (i < QUESTIONS.length-1)
      document.getElementById('sdash-'+i).classList.toggle('done', i<q);
  });
}
function renderQ(idx) {
  currentQ = idx;
  const q = QUESTIONS[idx];
  document.getElementById('q-dimension').textContent = q.dim;
  document.getElementById('q-text').textContent      = q.text;
  document.getElementById('scale-wrap').innerHTML = SCALE.map((label,v) =>
    `<button class="scale-btn ${answers[idx]===v?'selected':''}" onclick="selectAnswer(${v})" title="${label}">
      <span class="scale-num">${v+1}</span>
      <span class="scale-word">${label}</span>
    </button>`).join('');
  document.getElementById('btn-prev').style.visibility   = idx>0 ? 'visible' : 'hidden';
  document.getElementById('btn-next-q').disabled          = answers[idx]===null;
  document.getElementById('btn-next-q').textContent       = idx===QUESTIONS.length-1 ? 'Invia risposte' : 'Avanti';
  const done = answers.filter(a => a!==null).length;
  const pct  = Math.round(done/QUESTIONS.length*100);
  document.getElementById('progress-fill').style.width      = pct+'%';
  document.getElementById('progress-label').textContent     = `${done} / ${QUESTIONS.length}`;
  updateStepBar(idx);
  const body = document.getElementById('q-body');
  body.classList.remove('fade-in'); void body.offsetWidth; body.classList.add('fade-in');
}
function selectAnswer(val) {
  answers[currentQ] = val;
  document.querySelectorAll('.scale-btn').forEach((btn,i) => btn.classList.toggle('selected', i===val));
  document.getElementById('btn-next-q').disabled = false;
  const done = answers.filter(a => a!==null).length;
  document.getElementById('progress-fill').style.width  = Math.round(done/QUESTIONS.length*100)+'%';
  document.getElementById('progress-label').textContent = `${done} / ${QUESTIONS.length}`;
}
function nextQ()  { currentQ < QUESTIONS.length-1 ? renderQ(currentQ+1) : endTest(); }
function prevQ()  { if (currentQ>0) renderQ(currentQ-1); }
function skipQ()  { currentQ < QUESTIONS.length-1 ? renderQ(currentQ+1) : endTest(); }
function endTest() {
  showScreen('screen-taker-end');
  showTakerTopbar(false);
  const now = new Date();
  const fmt = now.toLocaleDateString('it-IT',{day:'2-digit',month:'long',year:'numeric'})
            + ' alle ' + now.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
  document.getElementById('end-name').textContent     = TAKER.first;
  document.getElementById('end-fullname').textContent = TAKER.name;
  document.getElementById('end-company').textContent  = TAKER.company;
  document.getElementById('end-date').textContent     = fmt;
}


/* ═══════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════ */
function togglePwd(fieldId, btn) {
  const f = document.getElementById(fieldId);
  const show = f.type==='password';
  f.type = show ? 'text' : 'password';
  btn.textContent = show ? 'Nascondi' : 'Mostra';
}
function toggleRadio(el, group) {
  document.querySelectorAll(`[onclick*="'${group}'"]`).forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}


/* ═══════════════════════════════════════════════
   VISTA AZIENDALE — Scatter Big Five × AI Readiness
═══════════════════════════════════════════════ */

// Extended dataset with Big Five scores (0-10) and AI Readiness (0-10)
const scatterData = [
  { name:'Marco Bianchi',  azienda:'Acme S.r.l.',       band:'Leader',   O:8.2, C:7.5, E:6.8, A:7.1, N:8.0, ai:7.8 },
  { name:'Sara Colombo',   azienda:'Acme S.r.l.',       band:'Ready',    O:6.5, C:6.8, E:7.2, A:6.9, N:6.3, ai:6.3 },
  { name:'Luca Ferrari',   azienda:'Acme S.r.l.',       band:'Leader',   O:7.9, C:8.1, E:5.5, A:7.4, N:7.5, ai:7.2 },
  { name:'Elena Ricci',    azienda:'Acme S.r.l.',       band:'Emerging', O:5.2, C:5.8, E:6.1, A:6.0, N:5.5, ai:5.0 },
  { name:'Giorgio Russo',  azienda:'Beta Group S.p.A.', band:'Emerging', O:5.8, C:5.1, E:6.5, A:5.5, N:5.0, ai:5.0 },
  { name:'Chiara Marino',  azienda:'Beta Group S.p.A.', band:'Ready',    O:6.9, C:6.2, E:5.8, A:7.2, N:6.8, ai:6.1 },
  { name:'Andrea Costa',   azienda:'Gamma Consulting',  band:'Explorer', O:3.8, C:4.2, E:4.5, A:4.8, N:3.5, ai:3.8 },
  { name:'Filippo Bruno',  azienda:'Beta Group S.p.A.', band:'Leader',   O:8.5, C:7.8, E:8.0, A:7.6, N:8.2, ai:8.1 },
  { name:'Marta Greco',    azienda:'Gamma Consulting',  band:'Ready',    O:6.1, C:6.5, E:5.9, A:6.3, N:6.0, ai:6.2 },
  { name:'Roberto Fini',   azienda:'Acme S.r.l.',       band:'Explorer', O:3.5, C:4.0, E:3.8, A:4.2, N:3.0, ai:3.5 },
];

const bandColors = {
  Leader:   '#111111',
  Ready:    '#555555',
  Emerging: '#2196F3',
  Explorer: '#90CAF9',
};

let currentDim = 'O';
const dimKeys = { O:'O', C:'C', E:'E', A:'A', N:'N' };
const dimLabels = {
  O: 'Apertura Mentale (%)',
  C: 'Coscienziosità (%)',
  E: 'Estroversione (%)',
  A: 'Amicalità (%)',
  N: 'Stabilità Emotiva (%)',
};

function goToVistaAziendale() {
  showScreen('screen-vista-aziendale');
  showMainTopbar('Vista Aziendale');
  renderScatter();
}

function setDimension(dim) {
  currentDim = dim;
  document.querySelectorAll('.va-dim-btn').forEach((btn, i) => {
    const dims = ['O','C','E','A','N'];
    btn.classList.toggle('active', dims[i] === dim);
  });
  renderScatter();
}

function renderScatter() {
  const filterAz = document.getElementById('va-filter-azienda')?.value || '';
  let data = filterAz ? scatterData.filter(d => d.azienda === filterAz) : scatterData;

  const canvas = document.getElementById('va-scatter');
  if (!canvas) return;
  const noData = document.getElementById('va-no-data');

  if (!data.length) {
    canvas.style.display = 'none';
    noData.style.display = 'block';
    renderStatistiche(data);
    return;
  }
  canvas.style.display = 'block';
  noData.style.display = 'none';

  // Set canvas pixel dimensions
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const W = rect.width || 700;
  const H = 420;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const PAD = { top: 24, right: 24, bottom: 52, left: 56 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  // Background quadrants
  const midX = PAD.left + plotW / 2;
  const midY = PAD.top  + plotH / 2;

  const quadColors = ['#f9f9f9','#f4f4f4','#f4f4f4','#f0f0f0'];
  [[0,0],[1,0],[0,1],[1,1]].forEach(([qx,qy], i) => {
    ctx.fillStyle = quadColors[i];
    ctx.fillRect(PAD.left + qx*(plotW/2), PAD.top + qy*(plotH/2), plotW/2, plotH/2);
  });

  // Grid lines
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let v = 0; v <= 10; v += 2) {
    const x = PAD.left + (v/10)*plotW;
    const y = PAD.top  + (1 - v/10)*plotH;
    ctx.beginPath(); ctx.moveTo(x, PAD.top);    ctx.lineTo(x, PAD.top+plotH);    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PAD.left, y);   ctx.lineTo(PAD.left+plotW, y);   ctx.stroke();
  }

  // Axis lines
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(midX, PAD.top); ctx.lineTo(midX, PAD.top+plotH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(PAD.left, midY); ctx.lineTo(PAD.left+plotW, midY); ctx.stroke();

  // Quadrant labels
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#bbb';
  const ql = [
    ['Alta AI · Bassa '+dimLabels[currentDim].split(' ')[0], PAD.left+8, PAD.top+16],
    ['Alta AI · Alta '+dimLabels[currentDim].split(' ')[0],  midX + plotW/2 - 4, PAD.top+16, true],
    ['Bassa AI · Bassa '+dimLabels[currentDim].split(' ')[0], PAD.left+8, midY+plotH/2-8],
    ['Bassa AI · Alta '+dimLabels[currentDim].split(' ')[0],  midX + plotW/2 - 4, midY+plotH/2-8, true],
  ];
  ql.forEach(([label, x, y, right]) => {
    ctx.textAlign = right ? 'right' : 'left';
    ctx.fillText(label, x, y);
  });

  // Axis tick labels
  ctx.fillStyle = '#999';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  for (let v = 0; v <= 10; v += 2) {
    const x = PAD.left + (v/10)*plotW;
    ctx.fillText(v, x, PAD.top + plotH + 18);
  }
  ctx.textAlign = 'right';
  for (let v = 0; v <= 10; v += 2) {
    const y = PAD.top + (1 - v/10)*plotH;
    ctx.fillText(v, PAD.left - 8, y + 4);
  }

  // Axis labels
  ctx.fillStyle = '#888';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(dimLabels[currentDim], PAD.left + plotW/2, H - 8);
  ctx.save();
  ctx.translate(14, PAD.top + plotH/2);
  ctx.rotate(-Math.PI/2);
  ctx.fillText('AI Readiness (punteggio)', 0, 0);
  ctx.restore();

  // Points
  const radius = 8;
  data.forEach(d => {
    const xVal = d[currentDim];
    const yVal = d.ai;
    const cx = PAD.left + (xVal/10)*plotW;
    const cy = PAD.top  + (1 - yVal/10)*plotH;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI*2);
    ctx.fillStyle = bandColors[d.band] || '#999';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Store data + canvas params for tooltip
  canvas._scatterMeta = { data, PAD, plotW, plotH, W, H, radius, currentDim };

  // Tooltip interaction
  canvas.onmousemove = function(e) {
    const bb = canvas.getBoundingClientRect();
    const mx = e.clientX - bb.left;
    const my = e.clientY - bb.top;
    const { data, PAD, plotW, plotH, radius, currentDim } = canvas._scatterMeta;
    const tooltip = document.getElementById('va-tooltip');
    let found = null;
    data.forEach(d => {
      const cx = PAD.left + (d[currentDim]/10)*plotW;
      const cy = PAD.top  + (1 - d.ai/10)*plotH;
      if (Math.hypot(mx-cx, my-cy) < radius + 4) found = { d, cx, cy };
    });
    if (found) {
      const { d, cx, cy } = found;
      tooltip.innerHTML = `
        <div style="font-weight:600;color:var(--black);margin-bottom:4px">${d.name}</div>
        <div style="color:var(--light);font-size:11px;margin-bottom:6px">${d.azienda}</div>
        <div style="display:flex;justify-content:space-between;gap:16px">
          <span>${dimLabels[currentDim].split(' ')[0]}</span><strong>${d[currentDim]}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;gap:16px">
          <span>AI Readiness</span><strong>${d.ai}</strong>
        </div>
        <div style="margin-top:6px"><span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:600;background:${bandColors[d.band]};color:${d.band==='Explorer'||d.band==='Emerging'?'#333':'white'}">${d.band}</span></div>`;
      tooltip.style.display = 'block';
      let tx = cx + 14;
      if (tx + 180 > W) tx = cx - 180;
      tooltip.style.left = tx + 'px';
      tooltip.style.top  = (cy - 20) + 'px';
      canvas.style.cursor = 'pointer';
    } else {
      tooltip.style.display = 'none';
      canvas.style.cursor = 'default';
    }
  };
  canvas.onmouseleave = function() {
    document.getElementById('va-tooltip').style.display = 'none';
  };

  renderStatistiche(data);
}

function renderStatistiche(data) {
  const cards = document.getElementById('va-stats-cards');
  const bandBars = document.getElementById('va-band-bars');
  if (!cards) return;

  const completed = data.filter(d => d.band);
  if (!completed.length) {
    cards.innerHTML = '<span style="font-size:13px;color:var(--light)">Nessun dato disponibile</span>';
    bandBars.innerHTML = '';
    return;
  }

  const avgAI = (completed.reduce((s,d) => s+d.ai, 0) / completed.length).toFixed(1);
  const avgDim = (completed.reduce((s,d) => s+d[currentDim], 0) / completed.length).toFixed(1);
  const bands = ['Leader','Ready','Emerging','Explorer'];
  const bandCount = Object.fromEntries(bands.map(b => [b, completed.filter(d => d.band===b).length]));
  const topBand = bands.reduce((a,b) => bandCount[a]>=bandCount[b]?a:b);

  cards.innerHTML = `
    <div class="va-stat-card"><div class="stat-num">${completed.length}</div><div class="stat-label">Partecipanti con dati</div></div>
    <div class="va-stat-card"><div class="stat-num">${avgAI}</div><div class="stat-label">AI Readiness medio</div></div>
    <div class="va-stat-card"><div class="stat-num">${avgDim}</div><div class="stat-label">${dimLabels[currentDim].split(' ')[0]} medio</div></div>
    <div class="va-stat-card"><div class="stat-num">${topBand}</div><div class="stat-label">Band prevalente</div></div>
  `;

  bandBars.innerHTML = bands.map(b => {
    const pct = completed.length ? Math.round(bandCount[b]/completed.length*100) : 0;
    return `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <span style="width:80px;font-size:12px;color:var(--mid);font-weight:500">${b}</span>
        <div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:${bandColors[b]};border-radius:4px;transition:width .4s"></div>
        </div>
        <span style="width:32px;text-align:right;font-size:12px;color:var(--light)">${bandCount[b]}</span>
      </div>`;
  }).join('');
}

function toggleStatistiche() {
  const body  = document.getElementById('va-stats-body');
  const arrow = document.getElementById('va-stats-arrow');
  const open  = body.style.display !== 'none';
  body.style.display  = open ? 'none' : 'block';
  arrow.style.transform = open ? 'rotate(-90deg)' : 'rotate(0deg)';
}

/* ═══════════════════════════════════════════════
   INCONTRI DI RESTITUZIONE
═══════════════════════════════════════════════ */

// Stato
let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();
let calSelectedDate = null;
let calSelectedSlot = null;
let incSelectedTaker = null;
let scheduledIncontri = [];

const MONTHS_IT = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
                   'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const DAYS_SHORT = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'];

// Orari disponibili di default
const DEFAULT_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30',
                       '14:00','14:30','15:00','15:30','16:00','16:30','17:00'];

function initIncontri() {
  calSelectedDate = null;
  calSelectedSlot = null;
  incSelectedTaker = null;
  renderCalendar();
  filterIncontriTakers();
  renderScheduledIncontri();
  updateBookingSummary();
  updateIncEmailPreview();
  document.getElementById('cal-slots-wrap').style.display = 'none';
  document.getElementById('booking-summary').style.display = 'none';
  document.getElementById('btn-send-incontro').disabled = true;
}

// ── Calendario ──
function renderCalendar() {
  document.getElementById('cal-month-label').textContent =
    MONTHS_IT[calMonth] + ' ' + calYear;

  const grid = document.getElementById('cal-grid');
  const today = new Date();
  const firstDay = new Date(calYear, calMonth, 1);
  // Lunedì = 0 in IT
  let startDow = firstDay.getDay(); // 0=dom,1=lun,...
  startDow = (startDow === 0) ? 6 : startDow - 1;

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  let html = '';

  // Celle vuote di offset
  for (let i = 0; i < startDow; i++) html += '<div class="cal-cell cal-empty"></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dateObj  = new Date(calYear, calMonth, d);
    const isPast   = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday  = dateObj.toDateString() === today.toDateString();
    const isSel    = dateStr === calSelectedDate;
    const hasBook  = scheduledIncontri.some(i => i.date === dateStr);
    const dow      = dateObj.getDay();
    const isWeekend = (dow === 0 || dow === 6);

    let cls = 'cal-cell';
    if (isPast)    cls += ' cal-past';
    if (isToday)   cls += ' cal-today';
    if (isSel)     cls += ' cal-selected';
    if (isWeekend) cls += ' cal-weekend';
    if (hasBook)   cls += ' cal-has-booking';

    const clickable = !isPast ? `onclick="selectCalDate('${dateStr}', ${d})"` : '';
    html += `<div class="${cls}" ${clickable}>
      ${d}
      ${hasBook ? '<span class="cal-dot"></span>' : ''}
    </div>`;
  }
  grid.innerHTML = html;
}

function selectCalDate(dateStr, day) {
  calSelectedDate = dateStr;
  calSelectedSlot = null;
  renderCalendar();

  const dateObj = new Date(calYear, calMonth, day);
  const label = dateObj.toLocaleDateString('it-IT', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  document.getElementById('cal-slot-date-label').textContent = label;
  document.getElementById('cal-slots-wrap').style.display = 'block';
  renderTimeSlots();
  updateBookingSummary();
  updateIncEmailPreview();
}

function calPrev() {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  calSelectedDate = null; calSelectedSlot = null;
  renderCalendar();
  document.getElementById('cal-slots-wrap').style.display = 'none';
}
function calNext() {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  calSelectedDate = null; calSelectedSlot = null;
  renderCalendar();
  document.getElementById('cal-slots-wrap').style.display = 'none';
}

function renderTimeSlots() {
  const booked = scheduledIncontri
    .filter(i => i.date === calSelectedDate)
    .map(i => i.time);

  document.getElementById('time-slots').innerHTML = DEFAULT_SLOTS.map(slot => {
    const isBooked = booked.includes(slot);
    const isSel    = slot === calSelectedSlot;
    let cls = 'time-slot';
    if (isBooked) cls += ' time-slot-booked';
    if (isSel)    cls += ' time-slot-selected';
    const click = isBooked ? '' : `onclick="selectSlot('${slot}')"`;
    return `<div class="${cls}" ${click}>${slot}${isBooked ? ' <span style="font-size:10px;opacity:.6">prenotato</span>' : ''}</div>`;
  }).join('');
}

function selectSlot(slot) {
  calSelectedSlot = slot;
  renderTimeSlots();
  updateBookingSummary();
  updateIncEmailPreview();
  checkIncontroReady();
}

// ── Taker list ──
function filterIncontriTakers() {
  const az  = document.getElementById('inc-filter-az').value;
  const q   = document.getElementById('inc-search').value.toLowerCase();
  const list = takers.filter(t =>
    t.completato &&
    (!az || t.azienda === az) &&
    (!q  || t.name.toLowerCase().includes(q))
  );
  const tbody = document.getElementById('inc-taker-list');
  tbody.innerHTML = list.map(t => {
    const isSel = incSelectedTaker && incSelectedTaker.id === t.id;
    const hasBook = scheduledIncontri.some(i => i.takerId === t.id);
    return `<div class="inc-taker-row ${isSel ? 'inc-taker-selected' : ''}" onclick="selectIncTaker(${t.id})">
      <div>
        <div class="td-name">${t.name} ${hasBook ? '<span class="badge badge-sent" style="font-size:10px;padding:1px 6px;margin-left:4px">Programmato</span>' : ''}</div>
        <div class="td-email">${t.email} &middot; ${t.azienda}</div>
      </div>
      <span class="band-pill band-${(t.band||'').toLowerCase()}">${t.band || '—'}</span>
    </div>`;
  }).join('') || '<div style="font-size:13px;color:var(--light);padding:12px 0">Nessun partecipante con test completato.</div>';
}

function selectIncTaker(id) {
  incSelectedTaker = takers.find(t => t.id === id) || null;
  filterIncontriTakers();
  updateBookingSummary();
  updateIncEmailPreview();
  checkIncontroReady();
}

// ── Riepilogo & preview ──
function updateBookingSummary() {
  const ready = incSelectedTaker && calSelectedDate && calSelectedSlot;
  const box = document.getElementById('booking-summary');
  box.style.display = ready ? 'block' : 'none';
  if (!ready) return;

  const dateObj = new Date(calSelectedDate + 'T00:00:00');
  const dateLabel = dateObj.toLocaleDateString('it-IT', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  const modalita = document.getElementById('inc-modalita')?.value || 'video';
  const modalitaLabel = {video:'Videochiamata', presenza:'In presenza', telefono:'Telefono'}[modalita] || modalita;

  document.getElementById('bs-nome').textContent     = incSelectedTaker.name;
  document.getElementById('bs-data').textContent     = dateLabel;
  document.getElementById('bs-ora').textContent      = calSelectedSlot;
  document.getElementById('bs-modalita').textContent = modalitaLabel;
}

function updateIncEmailPreview() {
  const el = document.getElementById('inc-email-preview');
  if (!incSelectedTaker || !calSelectedDate || !calSelectedSlot) {
    el.textContent = "Seleziona un partecipante, una data e un orario per visualizzare l'anteprima.";
    el.style.fontStyle = 'italic';
    return;
  }
  el.style.fontStyle = 'normal';
  const dateObj = new Date(calSelectedDate + 'T00:00:00');
  const dateLabel = dateObj.toLocaleDateString('it-IT', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  const durata    = document.getElementById('inc-durata')?.value || '60';
  const modalita  = document.getElementById('inc-modalita')?.value || 'video';
  const link      = document.getElementById('inc-link')?.value || '';
  const note      = document.getElementById('inc-note')?.value || '';
  const modalitaLabel = {video:'Videochiamata', presenza:'In presenza', telefono:'Telefono'}[modalita] || modalita;

  let testo = `Gentile ${incSelectedTaker.name},

ti confermiamo l'incontro di restituzione del tuo Readiness Assessment Report.

📅  Data:      ${dateLabel}
🕐  Ora:       ${calSelectedSlot}
⏱  Durata:    ${durata} minuti
📌  Modalità:  ${modalitaLabel}`;

  if (modalita === 'video' && link) testo += `\n🔗  Link:      ${link}`;
  testo += `\n\nDurante l'incontro analizzeremo insieme i risultati del tuo profilo e risponderemo a tutte le tue domande.`;
  if (note) testo += `\n\nNote: ${note}`;
  testo += `\n\nA presto,\nIl team di Assessment`;

  el.textContent = testo;
}

function toggleIncLinkWrap() {
  const modalita = document.getElementById('inc-modalita')?.value;
  const wrap = document.getElementById('inc-link-wrap');
  if (wrap) wrap.style.display = (modalita === 'video') ? 'block' : 'none';
  updateBookingSummary();
  updateIncEmailPreview();
}

function checkIncontroReady() {
  const ready = !!(incSelectedTaker && calSelectedDate && calSelectedSlot);
  document.getElementById('btn-send-incontro').disabled = !ready;
}

function sendIncontro() {
  if (!incSelectedTaker || !calSelectedDate || !calSelectedSlot) return;
  const modalita = document.getElementById('inc-modalita')?.value || 'video';
  const durata   = document.getElementById('inc-durata')?.value || '60';
  const modalitaLabel = {video:'Videochiamata', presenza:'In presenza', telefono:'Telefono'}[modalita] || modalita;

  scheduledIncontri.push({
    id: Date.now(),
    takerId: incSelectedTaker.id,
    name: incSelectedTaker.name,
    azienda: incSelectedTaker.azienda,
    date: calSelectedDate,
    time: calSelectedSlot,
    modalita: modalitaLabel,
    stato: 'Confermato'
  });

  renderScheduledIncontri();
  renderCalendar();

  // Reset
  calSelectedDate = null;
  calSelectedSlot = null;
  incSelectedTaker = null;
  document.getElementById('cal-slots-wrap').style.display = 'none';
  document.getElementById('booking-summary').style.display = 'none';
  document.getElementById('btn-send-incontro').disabled = true;
  filterIncontriTakers();
  updateBookingSummary();
  updateIncEmailPreview();
  document.getElementById('inc-note').value = '';

  const note = document.getElementById('inc-sent-note');
  note.style.display = 'inline';
  showToast('Invito incontro inviato con successo');
  setTimeout(() => { note.style.display = 'none'; }, 4000);
}

function renderScheduledIncontri() {
  const tbody = document.getElementById('inc-scheduled-tbody');
  if (!tbody) return;
  if (!scheduledIncontri.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--light);font-size:13px">Nessun incontro programmato</td></tr>`;
    return;
  }
  tbody.innerHTML = scheduledIncontri.map(inc => {
    const dateObj = new Date(inc.date + 'T00:00:00');
    const dateLabel = dateObj.toLocaleDateString('it-IT', {day:'2-digit', month:'short', year:'numeric'});
    return `<tr>
      <td><div class="td-name">${inc.name}</div></td>
      <td style="font-size:13px;color:var(--mid)">${inc.azienda}</td>
      <td style="font-size:13px;color:var(--mid)">${dateLabel} &mdash; ${inc.time}</td>
      <td style="font-size:13px;color:var(--mid)">${inc.modalita}</td>
      <td><span class="badge badge-sent">${inc.stato}</span></td>
      <td><span style="font-size:12px;color:var(--light);cursor:pointer" onclick="deleteIncontro(${inc.id})">Rimuovi</span></td>
    </tr>`;
  }).join('');
}

function deleteIncontro(id) {
  scheduledIncontri = scheduledIncontri.filter(i => i.id !== id);
  renderScheduledIncontri();
  renderCalendar();
  filterIncontriTakers();
}
