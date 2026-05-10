// =====================================================================
// DUNI AI — main.js
// =====================================================================

// ===== MOBILE MENU =====
function toggleMobile() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ===== NAVBAR SCROLL BEHAVIOR =====
const navbar = document.getElementById('navbar');
const announcementBar = document.getElementById('announcementBar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    announcementBar.style.transform = 'translateY(-100%)';
  } else {
    navbar.classList.remove('scrolled');
    announcementBar.style.transform = 'translateY(0)';
  }
}, { passive: true });
announcementBar.style.transition = 'transform 0.4s ease';

// ===== HERO CANVAS (dark bg, cyan/teal particles) =====
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;
let W, H;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.8 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.25;
    this.opacity = Math.random() * 0.55 + 0.08;
    // Cyan (185-210) or teal (160-185)
    this.hue = Math.random() < 0.6 ? 190 + Math.random() * 25 : 165 + Math.random() * 20;
    this.sat = 80 + Math.random() * 15;
    this.life = 0;
    this.maxLife = Math.random() * 220 + 100;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    const fade = this.life < 20 ? this.life / 20 : this.life > this.maxLife - 20 ? (this.maxLife - this.life) / 20 : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, 72%, ${this.opacity * fade})`;
    ctx.fill();
  }
}

function drawLines() {
  const maxDist = 110;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.09;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(80, 210, 230, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function drawNebula(time) {
  const g1 = ctx.createRadialGradient(W * 0.72, H * 0.38, 0, W * 0.72, H * 0.38, W * 0.45);
  g1.addColorStop(0, 'rgba(20, 55, 130, 0.55)');
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(W * 0.22, H * 0.62, 0, W * 0.22, H * 0.62, W * 0.32);
  g2.addColorStop(0, 'rgba(10, 50, 90, 0.4)');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  const pulse = 0.5 + 0.2 * Math.sin(time * 0.0007);
  const g3 = ctx.createRadialGradient(W * 0.58, H * 0.6, 0, W * 0.58, H * 0.6, W * 0.28);
  g3.addColorStop(0, `rgba(20, 184, 166, ${0.18 * pulse})`);
  g3.addColorStop(1, 'transparent');
  ctx.fillStyle = g3;
  ctx.fillRect(0, 0, W, H);
}

function animate(time) {
  ctx.fillStyle = '#050A14';
  ctx.fillRect(0, 0, W, H);
  drawNebula(time);
  drawLines();
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animate);
}

function initCanvas() {
  resizeCanvas();
  particles = Array.from({ length: 160 }, () => new Particle());
  cancelAnimationFrame(animFrame);
  animate(0);
}

window.addEventListener('resize', () => { resizeCanvas(); particles.forEach(p => p.reset()); }, { passive: true });
initCanvas();

// ===== HERO PILL CYCLING =====
const pills = document.querySelectorAll('.hero-pill');
let activePill = 0;
setInterval(() => {
  pills[activePill].classList.remove('active');
  activePill = (activePill + 1) % pills.length;
  pills[activePill].classList.add('active');
}, 2600);

// ===== EXPLORE TABS =====
function switchTab(tab) {
  document.querySelectorAll('.explore-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.explore-panel').forEach(p => p.classList.add('hidden'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`panel-${tab}`).classList.remove('hidden');
}

// ===== SCROLL REVEAL (Intersection Observer) =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===== BENTO — WHATSAPP CHAT SIMULATION =====
const chatData = [
  { type: 'incoming', text: 'Hola! ¿Tienen cita disponible esta semana? 😊', delay: 600 },
  { type: 'outgoing', text: 'Hola María! 👋 Sí, tenemos el martes a las 10:00 AM o jueves a las 3:00 PM. ¿Cuál prefieres?', delay: 1600 },
  { type: 'incoming', text: 'El martes perfecto!', delay: 2800 },
  { type: 'outgoing', text: '✅ Cita confirmada: Martes 14 · 10:00 AM. Te envío recordatorio el día anterior. ¡Que tenga un excelente día! 🦷', delay: 3800 },
  { type: 'incoming', text: 'Muchas gracias! 🙏', delay: 5200 },
];

function runChatSim() {
  const container = document.getElementById('chatBubbles');
  if (!container) return;
  container.innerHTML = '';

  chatData.forEach(msg => {
    setTimeout(() => {
      if (!document.getElementById('chatBubbles')) return;
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.type}`;
      bubble.textContent = msg.text;
      container.appendChild(bubble);
      requestAnimationFrame(() => bubble.classList.add('show'));
      container.scrollTop = container.scrollHeight;
    }, msg.delay);
  });

  // Loop after all messages
  const totalDuration = chatData[chatData.length - 1].delay + 4000;
  setTimeout(runChatSim, totalDuration);
}

// ===== BENTO — REVENUE CHART =====
const revData = [42, 55, 38, 68, 61, 100];
function buildRevenueChart() {
  const chart = document.getElementById('revenueChart');
  if (!chart) return;
  chart.innerHTML = '';
  revData.forEach((pct) => {
    const bar = document.createElement('div');
    bar.className = 'rev-bar';
    bar.style.height = pct + '%';
    chart.appendChild(bar);
  });
}

function animateRevenueBars() {
  const bars = document.querySelectorAll('.rev-bar');
  bars.forEach((bar, i) => {
    setTimeout(() => bar.classList.add('animated'), i * 120);
  });
}

// ===== BENTO — CALENDAR MOCK =====
const calSlots = [
  { time: '9:00', name: 'Ana Torres', type: 'Limpieza', booked: true },
  { time: '10:30', name: 'Carlos M.', type: 'Revisión', booked: true },
  { time: '12:00', name: 'Disponible', type: '', booked: false },
  { time: '2:00', name: 'Rosa Vega', type: 'Ortodoncia', booked: true },
  { time: '4:00', name: 'Luis F.', type: 'Implante', booked: true },
];

function buildCalendar() {
  const cal = document.getElementById('calendarMock');
  if (!cal) return;
  cal.innerHTML = '';
  calSlots.forEach(slot => {
    const el = document.createElement('div');
    el.className = `cal-slot ${slot.booked ? 'booked' : 'free'}`;
    el.innerHTML = `
      <span class="time">${slot.time}</span>
      <span class="name">${slot.name}${slot.type ? ` · <span style="opacity:0.5;font-size:10px">${slot.type}</span>` : ''}</span>
      <span class="badge ${slot.booked ? 'badge-booked' : 'badge-free'}">${slot.booked ? 'CONF.' : 'LIBRE'}</span>
    `;
    cal.appendChild(el);
  });
}

function animateCalendar() {
  const slots = document.querySelectorAll('.cal-slot');
  slots.forEach((slot, i) => {
    setTimeout(() => slot.classList.add('show'), i * 180);
  });
}

// ===== OBSERVE BENTO SECTION TO TRIGGER ANIMATIONS =====
const bentoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runChatSim();
      setTimeout(animateRevenueBars, 400);
      setTimeout(animateCalendar, 200);
      bentoObserver.disconnect();
    }
  });
}, { threshold: 0.15 });

const bentoSection = document.querySelector('.bento-grid');
if (bentoSection) {
  buildRevenueChart();
  buildCalendar();
  bentoObserver.observe(bentoSection);
}

// =====================================================================
// LIVE DEMO — Interactive Chat Widget
// =====================================================================
const demoResponses = [
  {
    keys: ['cancel', 'cancelar', 'cancelaron', 'canceló'],
    answer: `Hoy cancelaron 2 pacientes:\n• María García — 10:00 AM (Limpieza dental)\n• Carlos López — 2:30 PM (Control ortodoncia)\n\nYa les envié mensajes de reagendamiento automático. ¿Quieres bloquear esos horarios o dejarlos disponibles?`
  },
  {
    keys: ['ingreso', 'perdí', 'dinero', 'plata', 'pérdida', 'perdi'],
    answer: `Este mes, las citas canceladas representaron $480 en ingresos potenciales. Duni recuperó $320 de ese monto mediante reagendamiento automático.\n\nEficiencia de recuperación: 66.7% 📈\n\n¿Quieres ver el reporte detallado?`
  },
  {
    keys: ['mañana', 'recuerda', 'recordatorio', 'notifica', 'avisa'],
    answer: `Listo! Ya envié recordatorios por WhatsApp a los 4 pacientes de mañana:\n\n✅ Ana Torres — 9:00 AM (Confirmó)\n✅ Luis Mendoza — 11:00 AM (Confirmó)\n⏳ Patricia Ruiz — 3:00 PM (Sin respuesta)\n✅ Roberto Vega — 5:00 PM (Confirmó)\n\n¿Quieres que reenvíe el mensaje a Patricia?`
  },
  {
    keys: ['cuántos', 'pacientes', 'semana', 'agenda', 'citas'],
    answer: `Esta semana tienes 23 citas confirmadas:\n\n• Lunes: 4 pacientes\n• Martes: 6 pacientes (casi lleno)\n• Miércoles: 5 pacientes\n• Jueves: 4 pacientes\n• Viernes: 4 pacientes\n\nTienes 3 espacios disponibles para urgencias. ¿Quieres que te muestre el detalle por día?`
  },
  {
    keys: ['hola', 'buenos', 'buenas', 'hi', 'hey'],
    answer: `Hola Doctora/Doctor! 👋 Lista para ayudarte. Cuéntame: ¿qué necesitas saber sobre tu práctica hoy?`
  },
];

function findResponse(text) {
  const lower = text.toLowerCase();
  for (const r of demoResponses) {
    if (r.keys.some(k => lower.includes(k))) return r.answer;
  }
  return `Estoy procesando tu consulta sobre "${text}"...\n\nEn tu práctica real, tendría acceso a tus datos para darte información precisa. ¿Quieres que te cuente sobre cancelaciones, ingresos, o agenda de esta semana?`;
}

function miniOrbHTML() {
  return `<div class="mini-orb"><svg width="36" height="36"><use href="#duniOrbMini"/></svg></div>`;
}

function addDemoMessage(text, type) {
  const container = document.getElementById('demoMessages');
  const msg = document.createElement('div');
  msg.className = type === 'user' ? 'demo-msg-user' : 'demo-msg-ai';

  if (type === 'user') {
    msg.innerHTML = `<div class="bubble">${text}</div>`;
  } else {
    msg.innerHTML = `${miniOrbHTML()}<div class="bubble">${text.replace(/\n/g, '<br>')}</div>`;
  }

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  return msg;
}

function showTyping() {
  const container = document.getElementById('demoMessages');
  const typing = document.createElement('div');
  typing.className = 'demo-msg-ai';
  typing.id = 'typingIndicator';
  typing.innerHTML = `${miniOrbHTML()}<div class="bubble"><div class="neural-wave"><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span></div></div>`;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

function setOrbState(state) {
  const orb = document.getElementById('duniOrbHero');
  const status = document.getElementById('orbStatus');
  if (!orb) return;
  orb.classList.remove('thinking', 'speaking');
  if (state === 'thinking') {
    orb.classList.add('thinking');
    if (status) status.textContent = 'DUNI AI · PROCESANDO';
  } else if (state === 'speaking') {
    orb.classList.add('speaking');
    if (status) status.textContent = 'DUNI AI · RESPONDIENDO';
  } else {
    if (status) status.textContent = 'DUNI AI · ESCUCHANDO';
  }
}

let demoLocked = false;

function sendDemo() {
  if (demoLocked) return;
  const input = document.getElementById('demoInput');
  const text = input.value.trim();
  if (!text) return;

  demoLocked = true;
  input.value = '';
  addDemoMessage(text, 'user');

  setOrbState('thinking');
  showTyping();
  const delay = 1100 + Math.random() * 900;

  setTimeout(() => {
    removeTyping();
    setOrbState('speaking');
    const response = findResponse(text);
    addDemoMessage(response, 'ai');

    setTimeout(() => {
      setOrbState('idle');
      demoLocked = false;
    }, 1200);
  }, delay);
}

function sendSuggestion(btn) {
  const text = btn.textContent.trim();
  const input = document.getElementById('demoInput');
  input.value = text;
  sendDemo();
}

// =====================================================================
// DUNI CINEMATIC CHAT — Deploy/Close/Interact
// =====================================================================

let cinemaChatOpen = false;
let cinemaLocked = false;

const cinemaResponses = [
  {
    keys: ['hoy', 'pasó', 'paso', 'resumen'],
    answer: `Aquí está el resumen de hoy:\n\n📅 <strong>8 citas completadas</strong> · 2 cancelaciones\n💬 <strong>23 mensajes</strong> respondidos automáticamente\n✅ <strong>3 reagendamientos</strong> realizados\n💰 Ingreso estimado: <strong>$640</strong>\n\nTodo bajo control mientras operabas. ¿Necesitas más detalles?`
  },
  {
    keys: ['ingreso', 'dinero', 'plata', 'gana', 'cobr'],
    answer: `📊 <strong>Análisis financiero — Mayo 2026</strong>\n\n• Ingresos confirmados: <strong>$2,840</strong>\n• Ingresos recuperados por Duni: <strong>$680</strong>\n• Cancelaciones no recuperadas: $160\n• Tasa de recuperación: <strong>81%</strong>\n\nEste mes superaste el mes anterior en un <strong>23%</strong>. ¿Quieres el desglose por tipo de tratamiento?`
  },
  {
    keys: ['cancel', 'faltaron', 'no vino', 'ausente'],
    answer: `Hoy hubo <strong>2 cancelaciones</strong>:\n\n• <strong>María García</strong> — 10:00 AM (Limpieza) → Ya le envié opciones de reagendamiento\n• <strong>Carlos López</strong> — 2:30 PM (Control ortodoncia) → Confirmó para el jueves\n\nRecupería estimada: <strong>$120</strong>. ¿Bloqueo esos horarios o los dejo disponibles?`
  },
  {
    keys: ['cit', 'agenda', 'mañana', 'semana', 'próxim'],
    answer: `📋 <strong>Próximas 24 horas</strong>:\n\n• 9:00 AM — Ana Torres · Limpieza ✅\n• 10:30 AM — Luis Mendoza · Implante ✅\n• 12:00 PM — <em>Espacio disponible</em>\n• 3:00 PM — Patricia Ruiz · Ortodoncia ✅\n• 5:00 PM — Roberto Vega · Revisión ✅\n\n¿Quieres que ofrezca el espacio de las 12:00 a pacientes en lista de espera?`
  },
  {
    keys: ['hola', 'buenos', 'buenas', 'hi', 'hey', 'saludos'],
    answer: `¡Hola, Doctor/a! 👋 Estoy monitoreando tu práctica en tiempo real.\n\nHoy gestioné <strong>23 mensajes</strong> y confirmé <strong>8 citas</strong> mientras operabas. Todo fluye perfectamente.\n\n¿En qué te puedo ayudar ahora mismo?`
  },
  {
    keys: ['pacient', 'historial', 'ficha'],
    answer: `Tengo acceso a <strong>847 fichas de pacientes</strong> activos en tu base de datos.\n\nLos más recientes que contactaron:\n• <strong>Ana Torres</strong> — hace 2 min (confirmó cita mañana)\n• <strong>Marco Jiménez</strong> — hace 1 hora (consulta sobre precios)\n• <strong>Valeria Castro</strong> — hace 3 horas (solicita reagendamiento)\n\n¿Quieres buscar un paciente específico?`
  }
];

function cinemFindResponse(text) {
  const lower = text.toLowerCase();
  for (const r of cinemaResponses) {
    if (r.keys.some(k => lower.includes(k))) return r.answer;
  }
  return `Estoy procesando tu consulta sobre <strong>"${text}"</strong>...\n\nEn tu práctica real tendría acceso completo a tus datos para darte información precisa. ¿Quieres que te cuente sobre agenda, ingresos o cancelaciones de hoy?`;
}

function deployDuniChat() {
  if (cinemaChatOpen) return;
  cinemaChatOpen = true;

  const stage = document.getElementById('cinemaOrbStage');
  const panel = document.getElementById('cinemaChatPanel');

  // Cinematic transition: orb shrinks and fades
  stage.classList.add('hidden-stage');

  setTimeout(() => {
    panel.classList.add('panel-open');
    // Focus input after animation
    setTimeout(() => {
      const inp = document.getElementById('cinemaInput');
      if (inp) inp.focus();
    }, 700);
  }, 300);
}

function closeDuniChat() {
  if (!cinemaChatOpen) return;
  const stage = document.getElementById('cinemaOrbStage');
  const panel = document.getElementById('cinemaChatPanel');

  panel.classList.remove('panel-open');
  setTimeout(() => {
    stage.classList.remove('hidden-stage');
    cinemaChatOpen = false;
    // Reset messages
    const msgs = document.getElementById('cinemaMsgs');
    if (msgs) {
      msgs.innerHTML = `<div class="cmsg cmsg-ai">
        <div class="cmsg-avatar"><img src="orb-hero.png" alt="Duni"/></div>
        <div class="cmsg-bubble">
          <p>¡Hola, Doctor/a! Soy <strong>Duni</strong>, tu asistente de IA odontológica. Tengo acceso a tu agenda, pacientes y métricas. ¿Cómo puedo ayudarte hoy?</p>
          <div class="cmsg-chips">
            <button onclick="cinemaSuggest(this)" class="cmsg-chip">¿Qué pasó hoy?</button>
            <button onclick="cinemaSuggest(this)" class="cmsg-chip">Análisis de ingresos</button>
            <button onclick="cinemaSuggest(this)" class="cmsg-chip">Cancelaciones</button>
            <button onclick="cinemaSuggest(this)" class="cmsg-chip">Próximas citas</button>
          </div>
        </div>
      </div>`;
    }
  }, 600);
}

function cinemaAddMsg(html, type) {
  const msgs = document.getElementById('cinemaMsgs');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `cmsg cmsg-${type}`;
  if (type === 'ai') {
    div.innerHTML = `<div class="cmsg-avatar"><img src="orb-hero.png" alt="Duni"/></div><div class="cmsg-bubble"><p>${html}</p></div>`;
  } else {
    div.innerHTML = `<div class="cmsg-bubble"><p>${html}</p></div>`;
  }
  div.style.opacity = '0';
  div.style.transform = type === 'ai' ? 'translateX(-10px)' : 'translateX(10px)';
  msgs.appendChild(div);
  requestAnimationFrame(() => {
    div.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    div.style.opacity = '1';
    div.style.transform = 'translateX(0)';
  });
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function cinemaShowTyping() {
  const msgs = document.getElementById('cinemaMsgs');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'cmsg cmsg-ai cmsg-typing';
  div.id = 'cinemaTyping';
  div.innerHTML = `<div class="cmsg-avatar"><img src="orb-hero.png" alt="Duni"/></div>
    <div class="cmsg-bubble">
      <div>
        <span class="wave-bar"></span><span class="wave-bar"></span>
        <span class="wave-bar"></span><span class="wave-bar"></span>
        <span class="wave-bar"></span>
      </div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function cinemaRemoveTyping() {
  const t = document.getElementById('cinemaTyping');
  if (t) t.remove();
}

function cinemaSubmit() {
  if (cinemaLocked) return;
  const input = document.getElementById('cinemaInput');
  const text = (input.value || '').trim();
  if (!text) return;

  cinemaLocked = true;
  input.value = '';
  cinemaAddMsg(text, 'user');
  cinemaShowTyping();

  const delay = 1000 + Math.random() * 800;
  setTimeout(() => {
    cinemaRemoveTyping();
    const response = cinemFindResponse(text);
    cinemaAddMsg(response, 'ai');
    cinemaLocked = false;
    setTimeout(() => { input.focus(); }, 100);
  }, delay);
}

function cinemaSuggest(btn) {
  const text = btn.textContent.trim();
  const input = document.getElementById('cinemaInput');
  if (input) { input.value = text; }
  cinemaSubmit();
}
