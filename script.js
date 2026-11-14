// ============================
// UTILITY
// ============================
function scrollToContact() {
  document.getElementById('contatti').scrollIntoView({ behavior: 'smooth' });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ============================
// MOBILE NAV
// ============================
function toggleMobileNav() {
  const nav = document.getElementById('mobile-nav');
  nav.classList.toggle('open');
}

// ============================
// SCROLL REVEAL
// ============================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ============================
// COUNT-UP ANIMATION
// ============================
function animateCountUp(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1500;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('it-IT');
    if (current >= target) clearInterval(timer);
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCountUp(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));

// ============================
// ACTIVE NAV LINK (scroll spy)
// ============================
const sections = document.querySelectorAll('section[id], div[id="prima-dopo"]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ============================
// BEFORE/AFTER SLIDER
// ============================
(function() {
  const slider = document.getElementById('ba-slider');
  const after = document.getElementById('ba-after');
  const divider = document.getElementById('ba-divider');
  if (!slider) return;
  let dragging = false;
  function setPos(pct) {
    pct = Math.max(5, Math.min(95, pct));
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    divider.style.left = pct + '%';
  }
  setPos(50);
  function getPercent(e) {
    const rect = slider.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    return (x / rect.width) * 100;
  }
  divider.addEventListener('mousedown', () => dragging = true);
  divider.addEventListener('touchstart', () => dragging = true, { passive: true });
  slider.addEventListener('mousemove', e => { if (dragging) setPos(getPercent(e)); });
  slider.addEventListener('touchmove', e => { if (dragging) setPos(getPercent(e)); }, { passive: true });
  window.addEventListener('mouseup', () => dragging = false);
  window.addEventListener('touchend', () => dragging = false);
  // Click anywhere on slider
  slider.addEventListener('click', e => setPos(getPercent(e)));
})();

// ============================
// ACCORDION
// ============================
function toggleAccordion(btn) {
  const body = btn.nextElementSibling;
  const isOpen = body.classList.contains('open');
  // Close all in same parent
  btn.closest('div.space-y-3').querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
  btn.closest('div.space-y-3').querySelectorAll('.accordion-btn').forEach(b => b.classList.remove('open'));
  if (!isOpen) { body.classList.add('open'); btn.classList.add('open'); }
}

// ============================
// TABS (caldaie)
// ============================
function switchTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// ============================
// CONTACT FORM WITH VALIDATION
// ============================
function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validatePhone(v) { return /^[\d\s\+\-\(\)]{8,15}$/.test(v.trim()); }

function submitForm(e) {
  e.preventDefault();
  let valid = true;
  const nome = document.getElementById('f-nome').value.trim();
  const tel = document.getElementById('f-tel').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const privacy = document.getElementById('f-privacy').checked;

  // Reset errors
  ['nome','tel','email','privacy'].forEach(id => document.getElementById('err-'+id).classList.add('hidden'));

  if (!nome) { document.getElementById('err-nome').classList.remove('hidden'); valid = false; }
  if (!validatePhone(tel)) { document.getElementById('err-tel').classList.remove('hidden'); valid = false; }
  if (email && !validateEmail(email)) { document.getElementById('err-email').classList.remove('hidden'); valid = false; }
  if (!privacy) { document.getElementById('err-privacy').classList.remove('hidden'); valid = false; }

  if (!valid) return;

  // Show spinner
  document.getElementById('submit-text').textContent = 'Invio in corso...';
  document.getElementById('submit-spinner').classList.remove('hidden');
  document.getElementById('submit-btn').disabled = true;

  // Simulate async submission
  setTimeout(() => {
    document.getElementById('contact-form-wrap').style.display = 'none';
    document.getElementById('form-success').classList.add('show');
    showToast('Richiesta inviata! Ti richiameremo entro 5 minuti.');
  }, 1400);
}

function resetForm() {
  document.getElementById('form-success').classList.remove('show');
  document.getElementById('contact-form-wrap').style.display = '';
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('submit-text').textContent = 'Richiedi assistenza immediata';
  document.getElementById('submit-spinner').classList.add('hidden');
  ['f-nome','f-tel','f-email','f-desc'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('f-tipo').selectedIndex = 0;
  document.getElementById('f-privacy').checked = false;
}

// ============================
// CHAT WIDGET
// ============================
let chatOpen = false;
const replies = {
  '📞 Chiamata urgente': 'Puoi chiamarci subito al <strong>+39 0521 123456</strong>! Siamo disponibili H24, 365 giorni l\'anno. 🔧',
  '💧 Perdita acqua': 'Per perdite d\'acqua interveniamo entro 30 minuti! Chiama subito o lascia il tuo numero e ti richiamiamo. 💧',
  '🔧 Preventivo': 'Offriamo preventivi gratuiti! Compila il modulo qui sotto ↓ o chiamaci per avere un prezzo immediato.',
};
const autoReplies = [
  'Capito! Posso aiutarti ulteriormente. Vuoi che un tecnico ti richiami?',
  'Certo! Per urgenze consiglio di chiamarci direttamente al +39 0521 123456.',
  'Ottima domanda! Il nostro team è sempre disponibile per qualsiasi esigenza.',
];
let autoIdx = 0;

function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chat-window');
  const badge = document.getElementById('chat-badge');
  win.classList.toggle('open', chatOpen);
  badge.style.display = chatOpen ? 'none' : 'flex';
}

function addChatMessage(text, isUser = false) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'flex gap-2' + (isUser ? ' justify-end' : '');
  div.innerHTML = isUser
    ? `<div class="bg-primary text-on-primary p-3 rounded-xl rounded-tr-none max-w-[80%] text-sm">${text}</div>`
    : `<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings:'FILL' 1">support_agent</span></div>
       <div class="bg-surface-container p-3 rounded-xl rounded-tl-none max-w-[80%] text-sm">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const val = input.value.trim();
  if (!val) return;
  addChatMessage(val, true);
  input.value = '';
  setTimeout(() => {
    addChatMessage(autoReplies[autoIdx % autoReplies.length]);
    autoIdx++;
  }, 800);
}

function quickReply(btn) {
  const text = btn.textContent.trim();
  addChatMessage(text, true);
  btn.remove();
  setTimeout(() => {
    addChatMessage(replies[text] || 'Grazie per il messaggio! Come posso aiutarti?');
  }, 700);
}

// Auto open chat hint after 4s
setTimeout(() => {
  if (!chatOpen) {
    document.getElementById('chat-badge').style.display = 'flex';
  }
}, 4000);
