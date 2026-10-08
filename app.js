(() => {
  'use strict';

  const L = window.LIBRO;
  const KEY = 'leamos:' + L.id + ':v1';
  const TOTAL = L.encuentros.length;
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ICONOS = {
    libro: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    corazon: '<path d="M12 21C6.5 16.8 2 13.6 2 8.9 2 6.1 4.2 4 6.9 4c2 0 3.6 1.1 5.1 3 1.5-1.9 3.1-3 5.1-3C19.8 4 22 6.1 22 8.9c0 4.7-4.5 7.9-10 12.1z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    charla: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
    compartir: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
    calendario: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    bajar: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    izq: '<path d="m15 18-6-6 6-6"/>',
    der: '<path d="m9 18 6-6-6-6"/>',
    mas: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>',
    menos: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M8 11h6"/>',
    luna: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    archivo: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3"/>',
    copiar: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/>',
    pegar: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    instalar: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 7v7M9 11l3 3 3-3M10 18h4"/>',
    reloj: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
  };
  const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONOS[n]}</svg>`;

  /* ---------- Datos guardados en este celular ---------- */

  const base = () => ({ yo: '', amigo: '', tema: 'auto', proxima: '', pagina: 1, zoom: 1, noche: false, enc: {}, suyo: null, invitadoPor: '' });
  function cargar() {
    try { return Object.assign(base(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { return base(); }
  }
  function guardar() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento: la app sigue funcionando en memoria */ }
  }
  let S = cargar();

  const enc = id => S.enc[id] || (S.enc[id] = { leido: false, conversado: false, nota: '' });
  const mascara = k => L.encuentros.reduce((m, e, i) => (enc(e.id)[k] ? m | (1 << i) : m), 0);
  const contar = m => { let n = 0; while (m) { n += m & 1; m >>= 1; } return n; };
  const minutos = e => Math.max(5, Math.round((e.hasta - e.desde + 1) * L.minPorPagina / 5) * 5);
  const actual = () => L.encuentros.find(e => !enc(e.id).leido) || null;
  const encDePagina = p => L.encuentros.find(e => p >= e.desde && p <= e.hasta) || (p < L.encuentros[0].desde ? L.encuentros[0] : null);
  const inicial = n => (n || '?').trim().charAt(0).toUpperCase() || '?';
  const amigo = () => S.amigo || 'quien lee contigo';

  /* ---------- Avisos ---------- */

  let toastT;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('si');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('si'), 2600);
  }

  /* ---------- Tema ---------- */

  function aplicarTema() {
    const r = document.documentElement;
    if (S.tema === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', S.tema);
    const oscuro = S.tema === 'dark' || (S.tema === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    $('meta[name="theme-color"]').setAttribute('content', oscuro ? '#191412' : '#8E2C3A');
  }

  /* ---------- Enlaces entre los dos ---------- */

  function miEnlace() {
    const u = new URL(location.href);
    u.search = '';
    u.hash = 'de=' + encodeURIComponent(S.yo) + '&l=' + mascara('leido') + '&c=' + mascara('conversado') + '&t=' + Date.now().toString(36);
    return u.toString();
  }

  function leerEnlace(texto) {
    const m = String(texto || '').match(/#(de=[^\s]+)/);
    if (!m) return null;
    const p = new URLSearchParams(m[1]);
    const nombre = (p.get('de') || '').trim().slice(0, 40);
    if (!nombre) return null;
    const t = parseInt(p.get('t') || '', 36);
    return { nombre, l: (parseInt(p.get('l'), 10) || 0) & 1023, c: (parseInt(p.get('c'), 10) || 0) & 1023, t: isNaN(t) ? Date.now() : t };
  }

  function aplicarEnlace(d) {
    if (S.yo && d.nombre.toLowerCase() === S.yo.toLowerCase()) { toast('Ese enlace es el tuyo: mándaselo a ' + amigo()); return false; }
    if (S.suyo && S.suyo.t > d.t) { toast('Ya tenías una noticia más nueva de ' + d.nombre); return false; }
    if (!S.amigo) S.amigo = d.nombre;
    if (!S.yo) S.invitadoPor = d.nombre;
    S.suyo = d;
    guardar();
    return true;
  }

  async function compartir(texto) {
    if (navigator.share) {
      try { await navigator.share({ text: texto }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  }

  async function copiar(texto) {
    try { await navigator.clipboard.writeText(texto); toast('Copiado'); } catch (e) {
      const t = document.createElement('textarea');
      t.value = texto; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); toast('Copiado'); } catch (_) { toast('No se pudo copiar'); }
      t.remove();
    }
  }

  const fechaLarga = iso => new Date(iso).toLocaleString('es-EC', { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' });

  function textoInvitacion() {
    return 'Hola' + (S.amigo ? ' ' + S.amigo : '') + '. ¿Leemos juntos *El arte de amar* de Erich Fromm? '
      + 'Lo dividí en ' + TOTAL + ' encuentros cortos, con preguntas para conversar. '
      + 'Ábrelo en tu celular y dale a «Instalar»:\n' + miEnlace();
  }

  function textoComoVoy() {
    const a = actual();
    let t = '*' + S.yo + '* · El arte de amar\n';
    t += a ? 'Voy por el encuentro ' + a.id + ' de ' + TOTAL + ': ' + a.titulo + '.\n' : '¡Terminé el libro!\n';
    t += 'Leídos: ' + contar(mascara('leido')) + ' de ' + TOTAL + ' · Conversados: ' + contar(mascara('conversado')) + '\n';
    const conNota = L.encuentros.filter(e => enc(e.id).leido && enc(e.id).nota.trim()).pop();
    if (conNota) t += '\nMi nota del encuentro ' + conNota.id + ':\n' + enc(conNota.id).nota.trim() + '\n';
    if (S.proxima && new Date(S.proxima) > new Date()) t += '\n¿Conversamos el ' + fechaLarga(S.proxima) + '?\n';
    t += '\nAbre esto para ver cómo voy: ' + miEnlace();
    return t;
  }

  function textoNota(e) {
    return '*' + S.yo + '* · Encuentro ' + e.id + ': ' + e.titulo + ' (págs. ' + e.desde + '–' + e.hasta + ')\n\n'
      + enc(e.id).nota.trim() + '\n\n' + miEnlace();
  }

  function textoCuaderno() {
    const partes = L.encuentros.filter(e => enc(e.id).nota.trim()).map(e =>
      'Encuentro ' + e.id + ' · ' + e.titulo + ' (págs. ' + e.desde + '–' + e.hasta + ')\n' + enc(e.id).nota.trim());
    return 'Mi cuaderno de «El arte de amar»' + (S.yo ? ' · ' + S.yo : '') + '\n\n' + partes.join('\n\n');
  }

  /* ---------- Instalar ---------- */

  let promptInstalar = null;
  const instalada = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); promptInstalar = e; if (ruta().v === 'inicio') mostrar(); });
  window.addEventListener('appinstalled', () => { promptInstalar = null; toast('¡Instalada! Ya la tienes en tu pantalla de inicio'); if (ruta().v === 'inicio') mostrar(); });

  function tarjetaInstalar() {
    if (instalada()) return '';
    let cuerpo;
    if (promptInstalar) {
      cuerpo = '<button class="btn primario ancho" data-accion="instalar">' + ic('instalar') + 'Instalar en este celular</button>';
    } else if (esIOS) {
      cuerpo = '<p>En Safari, toca el botón <strong>Compartir</strong> (el cuadrito con la flecha hacia arriba) y luego <strong>«Agregar a inicio»</strong>.</p>';
    } else {
      cuerpo = '<p>En Chrome, abre el menú <strong>⋮</strong> y elige <strong>«Instalar app»</strong> o <strong>«Agregar a la pantalla principal»</strong>.</p>';
    }
    return '<section class="card"><p class="eyebrow">Tenla a mano</p><h2>Instálala como una app</h2>'
      + '<p class="suave">Queda con su ícono en la pantalla de inicio y funciona sin internet.</p>' + cuerpo + '</section>';
  }

  /* ---------- Vistas ---------- */

  const VISTAS = ['inicio', 'plan', 'leer', 'cuaderno', 'ajustes'];
  function ruta() {
    let h = location.hash.slice(1);
    try { h = decodeURIComponent(h); } catch (e) { /* hash raro: se trata como texto */ }
    if (h.includes('=')) return { v: 'inicio' };
    const [v, x] = h.split('/');
    return { v: VISTAS.includes(v) ? v : 'inicio', x };
  }

  function filaLector(nombre, l, c, clase, detalle) {
    let cuentas = '';
    for (let i = 0; i < TOTAL; i++) {
      const cl = ((l >> i) & 1 ? ' leido' : '') + ((c >> i) & 1 ? ' conversado' : '');
      cuentas += '<span class="cuenta' + cl + '"></span>';
    }
    return '<div class="lector-fila ' + clase + '">'
      + '<div class="lector-cab"><strong>' + esc(nombre) + '</strong><span class="meta">' + contar(l) + ' de ' + TOTAL + ' leídos · ' + contar(c) + ' conversados</span></div>'
      + '<div class="cuentas" role="img" aria-label="' + esc(nombre) + ': ' + contar(l) + ' de ' + TOTAL + ' encuentros leídos">' + cuentas + '</div>'
      + (detalle ? '<p class="meta">' + detalle + '</p>' : '') + '</div>';
  }

  function haceCuanto(t) {
    const d = Math.floor((Date.now() - t) / 86400000);
    if (d <= 0) return 'hoy';
    if (d === 1) return 'ayer';
    return 'hace ' + d + ' días';
  }

  function vistaInicio() {
    const hero = '<section class="hero"><div class="portada" aria-hidden="true"><span class="pa">Erich Fromm</span><span class="pt">El arte<br>de amar</span>'
      + '<svg class="ic" viewBox="0 0 24 24">' + ICONOS.corazon + '</svg></div>'
      + '<div><p class="eyebrow">Leamos juntos</p><h1>El arte de amar</h1><p class="meta">Erich Fromm · ' + L.anio + ' · ' + TOTAL + ' encuentros</p></div></section>';

    if (!S.yo) {
      const inv = S.invitadoPor;
      return hero + '<section class="card"><p class="eyebrow">' + (inv ? 'Te invitaron' : 'Para empezar') + '</p>'
        + '<h2>' + (inv ? esc(inv) + ' quiere leer este libro contigo' : '¿Quiénes van a leer?') + '</h2>'
        + '<p class="suave">' + (inv ? 'Son ' + TOTAL + ' encuentros cortos. Cada uno lee a su ritmo, escribe una nota y luego conversan con las preguntas de cada parte.' : 'Escribe tu nombre y el de la persona con quien vas a leer. Todo se guarda solo en este celular.') + '</p>'
        + '<form class="pila" data-form="nombres">'
        + '<label class="campo">Tu nombre<input type="text" name="yo" required maxlength="40" autocomplete="given-name"></label>'
        + '<label class="campo">¿Con quién lees?<input type="text" name="amigo" maxlength="40" value="' + esc(S.amigo) + '"></label>'
        + '<button class="btn primario ancho" type="submit">' + ic('corazon') + 'Empezar</button></form></section>'
        + tarjetaInstalar();
    }

    const a = actual();
    const suyo = S.suyo;
    const progreso = '<section class="card"><p class="eyebrow">Así vamos</p><div class="lectores">'
      + filaLector(S.yo + ' (tú)', mascara('leido'), mascara('conversado'), 'yo')
      + (suyo
        ? filaLector(suyo.nombre, suyo.l, suyo.c, 'el', 'Su última noticia: ' + haceCuanto(suyo.t))
        : '<div class="lector-fila el"><div class="lector-cab"><strong>' + esc(amigo()) + '</strong></div><p class="meta">Todavía no sabes cómo va. Cuando te mande su enlace, ábrelo o pégalo abajo.</p></div>')
      + '</div></section>';

    const toca = a
      ? '<section class="card toca"><p class="eyebrow">Ahora toca</p><p class="toca-num">Encuentro ' + a.id + ' de ' + TOTAL + '</p><h3>' + esc(a.titulo) + '</h3>'
        + '<p class="meta">' + esc(a.seccion) + ' · págs. ' + a.desde + '–' + a.hasta + ' · unos ' + minutos(a) + ' min</p>'
        + '<div class="fila"><button class="btn primario" data-accion="ir-pagina" data-pagina="' + a.desde + '">' + ic('libro') + 'Leer ahora</button>'
        + '<a class="btn" href="#plan/' + a.id + '">' + ic('charla') + 'Ver preguntas</a></div></section>'
      : '<section class="card toca"><p class="eyebrow">Terminaste</p><h3>Leíste todo el libro</h3><p>Queda la última conversación.</p><a class="btn" href="#plan/cierre">' + ic('charla') + 'Para cerrar juntos</a></section>';

    const charla = '<section class="card"><p class="eyebrow">Próxima charla</p>'
      + '<label class="campo">¿Cuándo conversan?<input type="datetime-local" data-campo="proxima" value="' + esc(S.proxima) + '"></label>'
      + (S.proxima ? '<p class="meta">' + ic('reloj') + ' ' + esc(fechaLarga(S.proxima)) + '</p><button class="btn ancho" data-accion="calendario">' + ic('calendario') + 'Agregar a mi calendario</button>' : '')
      + '</section>';

    const entreDos = '<section class="card"><p class="eyebrow">Entre los dos</p><h2>Cuéntale a ' + esc(amigo()) + '</h2>'
      + '<div class="fila">'
      + (suyo ? '' : '<button class="btn primario" data-accion="invitar">' + ic('corazon') + 'Mandarle la invitación</button>')
      + '<button class="btn' + (suyo ? ' primario' : '') + '" data-accion="como-voy">' + ic('compartir') + 'Contarle cómo voy</button></div>'
      + '<details class="desplegar"><summary>' + ic('pegar') + '¿Te llegó un mensaje de ' + esc(amigo()) + '? Pégalo aquí' + ic('chev', 'chev') + '</summary>'
      + '<div><textarea id="pegado" rows="3" placeholder="Pega aquí el mensaje completo, con su enlace"></textarea>'
      + '<button class="btn" data-accion="leer-pegado">' + ic('check') + 'Ponerme al día</button></div></details></section>';

    const pasos = (contar(mascara('leido')) === 0)
      ? '<section class="card"><p class="eyebrow">Cómo funciona</p><ol class="pasos">' + L.pasos.map(p => '<li><div><strong>' + esc(p[0]) + '</strong><span class="suave">' + esc(p[1]) + '</span></div></li>').join('') + '</ol></section>'
      : '';

    return hero + toca + progreso + entreDos + charla + pasos + tarjetaInstalar();
  }

  const abiertos = new Set();

  function tarjetaEncuentro(e) {
    const x = enc(e.id);
    const abierto = abiertos.has(e.id);
    const suyo = S.suyo;
    const i = e.id - 1;
    const elLeyo = suyo && ((suyo.l >> i) & 1);
    const marcas = '<span class="marcas"><span class="marca-p yo' + (x.leido ? ' on' : '') + '" title="' + esc(S.yo || 'Tú') + (x.leido ? ': leído' : ': por leer') + '">' + esc(inicial(S.yo)) + '</span>'
      + (suyo ? '<span class="marca-p el' + (elLeyo ? ' on' : '') + '" title="' + esc(suyo.nombre) + (elLeyo ? ': leído' : ': por leer') + '">' + esc(inicial(suyo.nombre)) + '</span>' : '') + '</span>';
    const estado = (x.leido ? 'Leído por ti' : 'Por leer') + (suyo ? (elLeyo ? '; ' + suyo.nombre + ' ya lo leyó' : '; ' + suyo.nombre + ' aún no') : '');

    return '<article class="enc' + (x.leido ? ' leido' : '') + '" id="enc-' + e.id + '">'
      + '<button class="enc-cab" aria-expanded="' + abierto + '" aria-controls="cuerpo-' + e.id + '" data-accion="abrir" data-id="' + e.id + '">'
      + '<span class="num">' + (x.leido ? ic('check') : e.id) + '</span>'
      + '<span class="enc-tit"><span class="meta">' + esc(e.seccion) + '</span><strong>' + esc(e.titulo) + '</strong><span class="meta">págs. ' + e.desde + '–' + e.hasta + ' · ' + minutos(e) + ' min</span><span class="sr">' + esc(estado) + '</span></span>'
      + '<span class="enc-der">' + marcas + ic('chev', 'chev') + '</span></button>'
      + '<div class="enc-cuerpo" id="cuerpo-' + e.id + '"' + (abierto ? '' : ' hidden') + '>'
      + '<h3>De qué va</h3><p>' + esc(e.resumen) + '</p>'
      + '<h3>Para fijarse</h3><ul class="chips">' + e.ideas.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>'
      + '<h3>Para conversar</h3><ol class="preguntas">' + e.preguntas.map(t => '<li>' + esc(t) + '</li>').join('') + '</ol>'
      + '<div class="nota-cab"><h3><label for="nota-' + e.id + '">Mi nota</label></h3><span class="guardado" id="guardado-' + e.id + '">Guardado</span></div>'
      + '<textarea id="nota-' + e.id + '" data-nota="' + e.id + '" rows="4" placeholder="Una idea, una duda o algo que te pasó leyendo…">' + esc(x.nota) + '</textarea>'
      + '<div class="toggles"><button class="toggle" aria-pressed="' + x.leido + '" data-accion="leido" data-id="' + e.id + '">' + ic('check') + 'Lo leí</button>'
      + '<button class="toggle" aria-pressed="' + x.conversado + '" data-accion="conversado" data-id="' + e.id + '">' + ic('charla') + 'Ya lo conversamos</button></div>'
      + '<div class="fila"><button class="btn" data-accion="ir-pagina" data-pagina="' + e.desde + '">' + ic('libro') + 'Leer desde la pág. ' + e.desde + '</button>'
      + '<button class="btn" data-accion="mandar-nota" data-id="' + e.id + '">' + ic('compartir') + 'Mandarle mi nota</button></div>'
      + '</div></article>';
  }

  function vistaPlan() {
    const totalMin = L.encuentros.reduce((s, e) => s + minutos(e), 0);
    const horas = Math.round(totalMin / 30) / 2;
    return '<div class="titulo-vista"><p class="eyebrow">Plan de lectura</p><h1>' + TOTAL + ' encuentros</h1>'
      + '<p>Unas ' + String(horas).replace('.', ',') + ' horas de lectura en total. Toca un encuentro para ver de qué va, las preguntas y tu nota.</p></div>'
      + '<div class="plan">' + L.encuentros.map(tarjetaEncuentro).join('') + '</div>'
      + '<section class="card cierre" id="enc-cierre"><p class="eyebrow">Al final</p><h2>' + esc(L.cierre.titulo) + '</h2><p>' + esc(L.cierre.texto) + '</p>'
      + '<ol class="preguntas">' + L.cierre.preguntas.map(t => '<li>' + esc(t) + '</li>').join('') + '</ol></section>';
  }

  function vistaCuaderno() {
    const notas = L.encuentros.filter(e => enc(e.id).nota.trim());
    const lista = notas.length
      ? notas.map(e => '<article class="card"><p class="meta">Encuentro ' + e.id + ' · págs. ' + e.desde + '–' + e.hasta + '</p><h3>' + esc(e.titulo) + '</h3>'
        + '<p class="nota-texto">' + esc(enc(e.id).nota.trim()) + '</p><a href="#plan/' + e.id + '" class="meta">Editar</a></article>').join('')
        + '<div class="fila"><button class="btn" data-accion="copiar-cuaderno">' + ic('copiar') + 'Copiar todo</button><button class="btn" data-accion="compartir-cuaderno">' + ic('compartir') + 'Compartir</button></div>'
      : '<section class="card"><h3>Aún no hay notas</h3><p class="suave">Cuando escribas algo en un encuentro del plan, aparece aquí.</p><a class="btn" href="#plan">' + ic('libro') + 'Ir al plan</a></section>';

    return '<div class="titulo-vista"><p class="eyebrow">Solo en este celular</p><h1>Mi cuaderno</h1><p>Tus notas de cada encuentro, juntas.</p></div>'
      + lista
      + '<section class="card"><p class="eyebrow">El libro</p><h2>Sobre ' + esc(L.autor) + '</h2>' + L.sobre.map(p => '<p>' + esc(p) + '</p>').join('') + '</section>'
      + '<section class="card"><p class="eyebrow">Cómo leer juntos</p><ol class="pasos">' + L.pasos.map(p => '<li><div><strong>' + esc(p[0]) + '</strong><span class="suave">' + esc(p[1]) + '</span></div></li>').join('') + '</ol></section>';
  }

  function vistaAjustes() {
    const tema = (v, t) => '<button type="button" aria-pressed="' + (S.tema === v) + '" data-accion="tema" data-valor="' + v + '">' + t + '</button>';
    return '<div class="titulo-vista"><p class="eyebrow">Leamos juntos</p><h1>Ajustes</h1></div>'
      + '<section class="card"><h3>Nombres</h3><form class="pila" data-form="nombres">'
      + '<label class="campo">Tu nombre<input type="text" name="yo" required maxlength="40" value="' + esc(S.yo) + '"></label>'
      + '<label class="campo">¿Con quién lees?<input type="text" name="amigo" maxlength="40" value="' + esc(S.amigo) + '"></label>'
      + '<button class="btn" type="submit">' + ic('check') + 'Guardar</button></form></section>'
      + '<section class="card"><h3>Apariencia</h3><div class="segmentos" role="group" aria-label="Tema">' + tema('auto', 'Automático') + tema('light', 'Claro') + tema('dark', 'Oscuro') + '</div></section>'
      + '<section class="card" id="ajuste-pdf"><h3>Tu copia del libro</h3><p class="suave" id="pdf-estado">Revisando…</p></section>'
      + '<section class="card"><h3>Respaldo</h3><p class="suave">Tus notas y tu avance viven solo en este celular. Descarga un respaldo si vas a cambiar de teléfono.</p>'
      + '<div class="fila"><button class="btn" data-accion="respaldo">' + ic('bajar') + 'Descargar respaldo</button>'
      + '<label class="btn">' + ic('archivo') + 'Restaurar<input type="file" accept="application/json,.json" data-campo="restaurar" class="sr"></label></div></section>'
      + '<section class="card"><h3>Empezar de cero</h3><p class="suave">Borra nombres, notas y avance de este celular.</p><button class="btn peligro" data-accion="borrar-todo">Borrar todo</button></section>'
      + '<p class="meta pie">Leamos juntos · versión 1.0</p>';
  }

  /* ---------- Lector de PDF ---------- */

  let pdfDoc = null;
  let pdfToken = 0;
  let renderTask = null;

  function idb() {
    return new Promise((ok, mal) => {
      const r = indexedDB.open('leamos', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('archivos');
      r.onsuccess = () => ok(r.result);
      r.onerror = () => mal(r.error);
    });
  }
  async function idbHacer(modo, fn) {
    const db = await idb();
    return new Promise((ok, mal) => {
      const tx = db.transaction('archivos', modo);
      const q = fn(tx.objectStore('archivos'));
      tx.oncomplete = () => ok(q && q.result);
      tx.onerror = () => mal(tx.error);
    });
  }
  const idbGet = k => idbHacer('readonly', s => s.get(k)).catch(() => null);
  const idbSet = (k, v) => idbHacer('readwrite', s => s.put(v, k));
  const idbDel = k => idbHacer('readwrite', s => s.delete(k)).catch(() => null);

  function cargarScript(src) {
    return new Promise((ok, mal) => {
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = () => mal(new Error('No se pudo cargar ' + src));
      document.head.appendChild(s);
    });
  }
  async function pdfjs() {
    if (!window.pdfjsLib) {
      await cargarScript(PDFJS);
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    }
    return window.pdfjsLib;
  }
  async function abrirPdfGuardado() {
    if (pdfDoc) return true;
    const g = await idbGet('libro');
    if (!g || !g.datos) return false;
    const lib = await pdfjs();
    pdfDoc = await lib.getDocument({ data: new Uint8Array(g.datos.slice(0)) }).promise;
    return true;
  }

  function vistaLeerVacia(error) {
    return '<div class="titulo-vista"><p class="eyebrow">Leer</p><h1>Tu copia del libro</h1></div>'
      + '<section class="card"><p>Elige el PDF de <em>El arte de amar</em> que tienes en el celular. Se guarda <strong>solo aquí</strong>, en este dispositivo: no se sube a internet.</p>'
      + '<label class="btn primario ancho">' + ic('archivo') + 'Elegir el PDF<input type="file" accept="application/pdf,.pdf" data-campo="pdf" class="sr"></label>'
      + '<p class="ayuda">Las páginas del plan son las del PDF de ' + L.paginas + ' páginas. Si no lo tienes, pídeselo a quien te invitó.</p>'
      + (error ? '<p class="ayuda" role="alert">' + esc(error) + '</p>' : '') + '</section>';
  }

  function vistaLeer() {
    return '<div class="barra" role="toolbar" aria-label="Controles de lectura">'
      + '<button class="icon-btn" data-accion="pag-ant" aria-label="Página anterior">' + ic('izq') + '</button>'
      + '<label class="pag"><span class="sr">Página</span><input type="number" inputmode="numeric" min="1" id="pag-num" value="' + S.pagina + '"><span id="pag-total">/ …</span></label>'
      + '<button class="icon-btn" data-accion="pag-sig" aria-label="Página siguiente">' + ic('der') + '</button>'
      + '<button class="icon-btn" data-accion="zoom-menos" aria-label="Achicar">' + ic('menos') + '</button>'
      + '<button class="icon-btn" data-accion="zoom-mas" aria-label="Agrandar">' + ic('mas') + '</button>'
      + '<button class="icon-btn" data-accion="noche" aria-label="Página oscura" aria-pressed="' + S.noche + '">' + ic('luna') + '</button></div>'
      + '<p class="meta donde" id="donde"></p>'
      + '<div class="hoja' + (S.noche ? ' noche' : '') + (S.zoom > 1 ? ' zoom' : '') + '" id="hoja"><canvas role="img" aria-label="Página del libro"></canvas></div>'
      + '<section class="card aviso" id="fin-enc" hidden></section>';
  }

  async function pintarPagina() {
    if (!pdfDoc || !$('#hoja')) return;
    const tk = ++pdfToken;
    const n = Math.min(Math.max(1, S.pagina | 0), pdfDoc.numPages);
    S.pagina = n; guardar();
    const page = await pdfDoc.getPage(n);
    if (tk !== pdfToken || !$('#hoja')) return;
    if (renderTask) { try { renderTask.cancel(); } catch (e) { /* ya terminó */ } }
    const hoja = $('#hoja');
    const canvas = $('canvas', hoja);
    const v1 = page.getViewport({ scale: 1 });
    const escala = ((hoja.clientWidth - 2) / v1.width) * S.zoom;
    const vp = page.getViewport({ scale: escala });
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.floor(vp.width * dpr);
    canvas.height = Math.floor(vp.height * dpr);
    canvas.style.width = Math.floor(vp.width) + 'px';
    canvas.style.height = Math.floor(vp.height) + 'px';
    renderTask = page.render({ canvasContext: canvas.getContext('2d'), viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null });
    try { await renderTask.promise; } catch (e) { if (!e || e.name !== 'RenderingCancelledException') console.error(e); }
    if (tk !== pdfToken) return;

    $('#pag-num').value = n;
    $('#pag-num').max = pdfDoc.numPages;
    $('#pag-total').textContent = '/ ' + pdfDoc.numPages;
    $('[data-accion="pag-ant"]').disabled = n <= 1;
    $('[data-accion="pag-sig"]').disabled = n >= pdfDoc.numPages;
    const e = encDePagina(n);
    $('#donde').textContent = e ? 'Encuentro ' + e.id + ' · ' + e.titulo + ' · págs. ' + e.desde + '–' + e.hasta : '';
    const fin = $('#fin-enc');
    if (e && n === e.hasta) {
      fin.hidden = false;
      fin.innerHTML = enc(e.id).leido
        ? '<h3>Terminaste el encuentro ' + e.id + '</h3><div class="fila"><a class="btn" href="#plan/' + e.id + '">' + ic('charla') + 'Ver preguntas y nota</a></div>'
        : '<h3>Llegaste al final del encuentro ' + e.id + '</h3><p class="suave">' + esc(e.titulo) + '</p><div class="fila"><button class="btn primario" data-accion="leido-desde-lector" data-id="' + e.id + '">' + ic('check') + 'Marcar como leído</button></div>';
    } else {
      fin.hidden = true;
    }
  }

  async function montarLector() {
    const v = $('#vista');
    try {
      if (!(await abrirPdfGuardado())) { if (ruta().v === 'leer') v.innerHTML = '<div class="vista">' + vistaLeerVacia() + '</div>'; return; }
    } catch (e) {
      console.error(e);
      if (ruta().v === 'leer') v.innerHTML = '<div class="vista">' + vistaLeerVacia(navigator.onLine ? 'No se pudo abrir el PDF guardado. Vuelve a elegirlo.' : 'Para abrir el libro la primera vez hace falta internet.') + '</div>';
      return;
    }
    if (ruta().v !== 'leer') return;
    v.innerHTML = '<div class="vista">' + vistaLeer() + '</div>';
    pintarPagina();
  }

  async function guardarPdf(archivo) {
    if (!archivo) return;
    if (!/pdf$/i.test(archivo.type) && !/\.pdf$/i.test(archivo.name)) { toast('Ese archivo no es un PDF'); return; }
    toast('Abriendo el libro…');
    try {
      const datos = await archivo.arrayBuffer();
      const lib = await pdfjs();
      const doc = await lib.getDocument({ data: new Uint8Array(datos.slice(0)) }).promise;
      await idbSet('libro', { nombre: archivo.name, tamano: archivo.size, paginas: doc.numPages, datos });
      pdfDoc = doc;
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
      toast(doc.numPages === L.paginas ? 'Listo: el libro quedó guardado en este celular' : 'Guardado, pero tiene ' + doc.numPages + ' páginas: los números del plan pueden no coincidir');
      if (ruta().v === 'leer') montarLector(); else mostrar();
    } catch (e) {
      console.error(e);
      toast('No se pudo abrir ese PDF');
    }
  }

  function irPagina(p) {
    S.pagina = p; guardar();
    if (ruta().v === 'leer') pintarPagina(); else location.hash = '#leer';
  }

  /* ---------- Mostrar ---------- */

  function mostrar() {
    const r = ruta();
    document.querySelectorAll('.tabs a').forEach(a => {
      if (a.dataset.v === r.v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const v = $('#vista');
    if (r.v === 'leer') {
      v.innerHTML = '<div class="vista"><p class="meta" style="text-align:center;padding:40px 0">Abriendo el libro…</p></div>';
      montarLector();
      window.scrollTo(0, 0);
      return;
    }
    if (r.v === 'plan' && r.x && r.x !== 'cierre') abiertos.add(+r.x);
    const html = { inicio: vistaInicio, plan: vistaPlan, cuaderno: vistaCuaderno, ajustes: vistaAjustes }[r.v]();
    v.innerHTML = '<div class="vista">' + html + '</div>';
    if (r.v === 'ajustes') estadoPdf();
    if (r.v === 'plan' && r.x) {
      const el = document.getElementById('enc-' + r.x);
      if (el) { requestAnimationFrame(() => el.scrollIntoView({ block: 'start' })); return; }
    }
    window.scrollTo(0, 0);
  }

  async function estadoPdf() {
    const g = await idbGet('libro');
    const el = $('#ajuste-pdf');
    if (!el) return;
    el.innerHTML = '<h3>Tu copia del libro</h3>' + (g
      ? '<p class="suave">Guardado en este celular: ' + esc(g.nombre) + ' (' + g.paginas + ' págs., ' + Math.round(g.tamano / 1024) + ' KB).</p><button class="btn" data-accion="quitar-pdf">Quitar el PDF de este celular</button>'
      : '<p class="suave">Todavía no elegiste el PDF.</p><a class="btn" href="#leer">' + ic('archivo') + 'Elegirlo</a>');
  }

  /* ---------- Acciones ---------- */

  function bajarArchivo(nombre, contenido, tipo) {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const a = document.createElement('a');
    a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function calendario() {
    const d = new Date(S.proxima);
    if (isNaN(d)) return;
    const f = x => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const a = actual();
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Leamos juntos//ES', 'BEGIN:VEVENT',
      'UID:' + Date.now() + '@leamos-juntos', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(d), 'DTEND:' + f(new Date(d.getTime() + 3600000)),
      'SUMMARY:Charla de lectura con ' + amigo().replace(/[,;\\]/g, ' '),
      'DESCRIPTION:El arte de amar' + (a ? ' - encuentro ' + a.id + ' (págs. ' + a.desde + ' a ' + a.hasta + ')' : ''),
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    bajarArchivo('charla-el-arte-de-amar.ics', ics, 'text/calendar');
  }

  const acciones = {
    abrir(b) {
      const id = +b.dataset.id;
      const cuerpo = document.getElementById('cuerpo-' + id);
      const abrir = cuerpo.hidden;
      cuerpo.hidden = !abrir;
      b.setAttribute('aria-expanded', abrir);
      if (abrir) abiertos.add(id); else abiertos.delete(id);
    },
    leido(b) { marcar(+b.dataset.id, 'leido'); },
    conversado(b) { marcar(+b.dataset.id, 'conversado'); },
    'leido-desde-lector'(b) {
      const id = +b.dataset.id;
      enc(id).leido = true; guardar();
      toast(id === TOTAL ? '¡Terminaste el libro!' : 'Encuentro ' + id + ' leído. Escribe tu nota cuando quieras');
      pintarPagina();
    },
    'ir-pagina'(b) { irPagina(+b.dataset.pagina); },
    'mandar-nota'(b) {
      const e = L.encuentros[+b.dataset.id - 1];
      if (!enc(e.id).nota.trim()) { toast('Primero escribe tu nota'); $('#nota-' + e.id).focus(); return; }
      compartir(textoNota(e));
    },
    invitar() { compartir(textoInvitacion()); },
    'como-voy'() { compartir(textoComoVoy()); },
    'leer-pegado'() {
      const d = leerEnlace($('#pegado').value);
      if (!d) { toast('No encontré el enlace en ese mensaje'); return; }
      if (aplicarEnlace(d)) { toast('Listo: ya sabes cómo va ' + d.nombre); mostrar(); }
    },
    calendario,
    instalar() {
      if (!promptInstalar) return;
      promptInstalar.prompt();
      promptInstalar.userChoice.finally(() => { promptInstalar = null; mostrar(); });
    },
    tema(b) { S.tema = b.dataset.valor; guardar(); aplicarTema(); mostrar(); },
    'copiar-cuaderno'() { copiar(textoCuaderno()); },
    'compartir-cuaderno'() { compartir(textoCuaderno()); },
    'pag-ant'() { irPagina(S.pagina - 1); },
    'pag-sig'() { irPagina(S.pagina + 1); },
    'zoom-mas'() { S.zoom = Math.min(3, +(S.zoom + 0.25).toFixed(2)); guardar(); $('#hoja').classList.toggle('zoom', S.zoom > 1); pintarPagina(); },
    'zoom-menos'() { S.zoom = Math.max(1, +(S.zoom - 0.25).toFixed(2)); guardar(); $('#hoja').classList.toggle('zoom', S.zoom > 1); pintarPagina(); },
    noche(b) { S.noche = !S.noche; guardar(); $('#hoja').classList.toggle('noche', S.noche); b.setAttribute('aria-pressed', S.noche); },
    async 'quitar-pdf'() {
      if (!confirm('¿Quitar el PDF de este celular? Tus notas no se borran.')) return;
      await idbDel('libro'); pdfDoc = null; estadoPdf(); toast('PDF quitado');
    },
    respaldo() {
      bajarArchivo('leamos-respaldo-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(S, null, 2), 'application/json');
    },
    async 'borrar-todo'() {
      if (!confirm('¿Borrar nombres, notas y avance de este celular? No se puede deshacer.')) return;
      try { localStorage.removeItem(KEY); } catch (e) { /* nada */ }
      await idbDel('libro'); pdfDoc = null;
      S = base(); aplicarTema(); abiertos.clear();
      location.hash = '#inicio'; mostrar(); toast('Listo, empezamos de cero');
    }
  };

  function marcar(id, campo) {
    const x = enc(id);
    x[campo] = !x[campo];
    if (campo === 'conversado' && x.conversado) x.leido = true;
    guardar();
    const art = document.getElementById('enc-' + id);
    if (art) {
      art.outerHTML = tarjetaEncuentro(L.encuentros[id - 1]);
      const b = document.querySelector('#enc-' + id + ' [data-accion="' + campo + '"]');
      if (b) b.focus({ preventScroll: true });
    }
    if (campo === 'leido' && x.leido) toast(id === TOTAL ? '¡Terminaste el libro! Cuéntale a ' + amigo() : 'Encuentro ' + id + ' leído. Cuéntale a ' + amigo() + ' desde Inicio');
  }

  document.addEventListener('click', ev => {
    const b = ev.target.closest('[data-accion]');
    if (!b || !acciones[b.dataset.accion]) return;
    ev.preventDefault();
    acciones[b.dataset.accion](b);
  });

  document.addEventListener('submit', ev => {
    const f = ev.target.closest('[data-form="nombres"]');
    if (!f) return;
    ev.preventDefault();
    const yo = f.yo.value.trim().slice(0, 40);
    if (!yo) { f.yo.focus(); return; }
    S.yo = yo;
    S.amigo = f.amigo.value.trim().slice(0, 40);
    guardar();
    if (ruta().v === 'ajustes') toast('Guardado');
    else toast('¡Hola, ' + yo + '!');
    mostrar();
  });

  const timers = {};
  document.addEventListener('input', ev => {
    const t = ev.target;
    if (t.dataset.nota) {
      const id = +t.dataset.nota;
      enc(id).nota = t.value.slice(0, 4000);
      clearTimeout(timers[id]);
      const g = document.getElementById('guardado-' + id);
      if (g) g.classList.remove('si');
      timers[id] = setTimeout(() => { guardar(); if (g) g.classList.add('si'); }, 500);
    }
  });

  document.addEventListener('change', ev => {
    const t = ev.target;
    const campo = t.dataset.campo;
    if (campo === 'proxima') { S.proxima = t.value; guardar(); mostrar(); }
    else if (campo === 'pdf') guardarPdf(t.files[0]);
    else if (campo === 'restaurar' && t.files[0]) {
      t.files[0].text().then(txt => {
        const d = JSON.parse(txt);
        if (!d || typeof d !== 'object' || !d.enc) throw new Error('formato');
        S = Object.assign(base(), d); guardar(); aplicarTema(); toast('Respaldo restaurado'); mostrar();
      }).catch(() => toast('Ese archivo no es un respaldo de Leamos'));
    }
    if (t.id === 'pag-num') irPagina(parseInt(t.value, 10) || 1);
  });

  document.addEventListener('keydown', ev => {
    if (ruta().v !== 'leer' || /input|textarea/i.test(ev.target.tagName)) return;
    if (ev.key === 'ArrowLeft') irPagina(S.pagina - 1);
    if (ev.key === 'ArrowRight') irPagina(S.pagina + 1);
  });

  let toque = null;
  document.addEventListener('touchstart', ev => {
    if (!ev.target.closest('#hoja') || S.zoom > 1 || ev.touches.length > 1) { toque = null; return; }
    toque = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
  }, { passive: true });
  document.addEventListener('touchend', ev => {
    if (!toque) return;
    const dx = ev.changedTouches[0].clientX - toque.x;
    const dy = ev.changedTouches[0].clientY - toque.y;
    toque = null;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 50) irPagina(S.pagina + (dx < 0 ? 1 : -1));
  }, { passive: true });

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { if (ruta().v === 'leer') pintarPagina(); }, 200);
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', aplicarTema);

  /* ---------- Arranque ---------- */

  const llegada = leerEnlace(location.hash);
  if (llegada) {
    if (aplicarEnlace(llegada) && S.yo) setTimeout(() => toast('Te pusiste al día con ' + llegada.nombre), 300);
    history.replaceState(null, '', location.pathname + location.search + '#inicio');
  }

  aplicarTema();
  window.addEventListener('hashchange', mostrar);
  mostrar();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
