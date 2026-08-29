const app = document.querySelector('#app');
const title = document.querySelector('#screenTitle');
const backBtn = document.querySelector('#backBtn');

const profileImages = ['img/profile/profile001.jpg', 'img/profile/profile002.png', 'img/profile/profile003.jpg', 'img/profile/profile004.png'];

const roles = {
  cazador: 'Cazador Empresa',
  cazadorNatural: 'Cazador Persona Natural',
  presa: 'Presa Trabajador',
  admin: 'Admin'
};

const seed = {
  users: [
    { user: 'empresa', pass: '1234', role: 'cazador', profile: { empresa: 'Emro Hunters S.A.', sector: 'Tecnología', ubicacion: 'Managua', domicilio: 'Carretera a Masaya', horario: '8:00 AM - 5:00 PM', logo: 'img/logo.png' } },
    { user: 'natural', pass: '1234', role: 'cazadorNatural', profile: { nombre: 'Ana López', correo: 'ana@demo.com', telefono: '8888-0000', departamento: 'Granada', ciudad: 'Granada', direccion: 'Centro histórico', motivo: 'Necesito servicios por proyecto', foto: 'img/profile/profile002.png' } },
    { user: 'presa', pass: '1234', role: 'presa', profile: { nombre: 'Carlos Méndez', cedula: '001-010190-0000A', locacion: 'León', profesion: 'Técnico en redes', domicilio: 'Sutiava', educacion: 'Técnico certificado', recomendaciones: 'Carta de Claro Nicaragua', expectativas: 'Remoto, diurno, medio tiempo', motivo: 'Mostrar mis habilidades y encontrar mejores oportunidades.', condicion: 'Sin padecimientos reportados, 72kg, 1.76m', genero: 'Masculino', nacimiento: '1990-01-01', edad: 36, telefono: '8777-1111', correo: 'carlos@demo.com', experiencia: '5 años en soporte e instalación', conocimientos: 'Redes, fibra óptica, atención al cliente', foto: 'img/profile/profile001.jpg' } },
    { user: 'admin', pass: '1234', role: 'admin', profile: { nombre: 'Administrador CAZA NICA' } }
  ],
  audit: []
};

const read = key => JSON.parse(localStorage.getItem(key) || 'null');
const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));
function init() { if (!read('cazaNica')) write('cazaNica', seed); }
function db() { return read('cazaNica'); }
function save(data) { write('cazaNica', data); }
function trace(actor, action, target = '-', accepted = '-') {
  const data = db();
  data.audit.push({ actor, action, target, accepted, at: new Date().toLocaleString('es-NI') });
  save(data);
}
function setTitle(text, showLogout = false) { title.textContent = text; backBtn.classList.toggle('hidden', !showLogout); }
backBtn.onclick = () => renderLanding();

function imgPath(value, fallback = 'img/profile/profile001.jpg') {
  return value && typeof value === 'string' && !value.includes('fakepath') ? value : fallback;
}
function photoStyle(path) { return `style="--photo:url('${path}')"`; }
function randomFrom(list) { return list[Math.floor(Math.random() * list.length)]; }
function floatingFaces() {
  return `<div class="floating-faces">${Array.from({ length: 15 }, (_, i) => {
    const left = Math.floor(Math.random() * 90) + 2;
    const top = Math.floor(Math.random() * 78) + 4;
    const img = randomFrom(profileImages);
    const speed = (3.2 + Math.random() * 4.5).toFixed(1);
    const delay = (Math.random() * 4).toFixed(1);
    return `<span class="floating-face" style="left:${left}%;top:${top}%;--img:url('${img}');--speed:${speed}s;--delay:-${delay}s"></span>`;
  }).join('')}</div>`;
}

function renderLanding() {
  setTitle('¿QUÉ SOS?');
  app.innerHTML = `<section class="board">${floatingFaces()}<div class="role-grid">
    ${roleButton('cazador', 'CAZADOR (EMRO)', '🏢')}
    ${roleButton('cazadorNatural', 'CAZADOR (PERSONA NATURAL)', '🧭')}
    ${roleButton('presa', 'PRESA (TRABAJADOR)', '🧑‍🔧')}
  </div></section>`;
  document.querySelectorAll('[data-role]').forEach(btn => btn.onclick = () => renderAuth(btn.dataset.role));
}
function roleButton(role, label, icon) { return `<button class="role-card" data-role="${role}"><div class="avatar-stamp">${icon}</div><h2>${label}</h2></button>`; }

function renderAuth(role) {
  setTitle(roles[role], true);
  app.innerHTML = `<section class="auth-layout">
    <aside class="panel green"><h2>Ingreso confidencial</h2><p class="muted">Usuarios demo: empresa, natural, presa, admin. Contraseña: 1234.</p></aside>
    <div class="panel"><h2>Login</h2><form id="loginForm" class="form-grid">
      <label>Usuario<input name="user" required></label><label>Contraseña<input type="password" name="pass" required></label>
      <button class="primary" type="submit">Entrar</button><button class="primary alt" id="registerBtn" type="button">Registrar</button>
    </form><div id="authMsg" class="muted"></div></div></section>`;
  loginForm.onsubmit = e => { e.preventDefault(); const fd = Object.fromEntries(new FormData(loginForm)); const u = db().users.find(x => x.user === fd.user && x.pass === fd.pass); if (!u) return authMsg.textContent = 'Credenciales incorrectas.'; trace(u.user, 'Inició sesión', u.role); renderDashboard(u); };
  registerBtn.onclick = () => renderRegister(role);
}

function field(name, label, type='text', extra='') { return `<label>${label}<input name="${name}" type="${type}" ${extra}></label>`; }
function renderRegister(role) {
  setTitle(`Registro ${roles[role]}`, true);
  let fields = field('user','Usuario') + field('pass','Contraseña','password');
  if (role === 'presa') fields += field('foto','Ruta/foto de perfil','text','placeholder="img/profile/profile001.jpg"') + field('cedula','Número de cédula') + field('locacion','Locación') + field('nombre','Nombre') + field('profesion','Profesión') + field('domicilio','Domicilio') + `<label>Nivel educativo/técnico<select name="educacion"><option>Primaria</option><option>Secundaria</option><option>Universitario</option><option>Certificación técnica</option></select></label><label class="full">Cartas de recomendación<textarea name="recomendaciones"></textarea></label><label class="full">Expectativa de trabajo<textarea name="expectativas" placeholder="Nocturno, rango de hora, días, remoto, presencial..."></textarea></label><label class="full">Motivo de inscripción<textarea name="motivo"></textarea></label><label>Condición física / médica<input name="condicion" placeholder="peso, altura, padecimientos"></label><label>Género<input name="genero"></label>${field('nacimiento','Fecha nacimiento','date')}<label>Teléfono<input name="telefono"></label><label>Correo<input name="correo" type="email"></label><label class="full">Experiencia<textarea name="experiencia"></textarea></label><label class="full">Conocimientos<textarea name="conocimientos"></textarea></label>`;
  if (role === 'cazador') fields += field('empresa','Nombre de empresa') + `<label>Sector<select name="sector"><option>Tecnología</option><option>Construcción</option><option>Salud</option><option>Educación</option><option>Comercio</option></select></label>` + field('ubicacion','Ubicación') + field('domicilio','Domicilio') + field('horario','Horario de atención') + field('logo','Ruta del logo','text','placeholder="img/logo.png"');
  if (role === 'cazadorNatural') fields += field('nombre','Nombre y apellido') + field('correo','Correo','email') + field('telefono','Teléfono') + field('departamento','Departamento') + field('ciudad','Ciudad') + field('direccion','Dirección específica') + `<label class="full">Motivo de búsqueda<textarea name="motivo"></textarea></label>` + field('foto','Ruta/foto','text','placeholder="img/profile/profile002.png"');
  app.innerHTML = `<form id="regForm" class="panel form-grid">${fields}<button class="primary full" type="submit">Crear perfil</button></form>`;
  regForm.onsubmit = e => { e.preventDefault(); const fd = Object.fromEntries(new FormData(regForm)); const data = db(); const profile = {...fd}; delete profile.user; delete profile.pass; if (profile.nacimiento) profile.edad = calcAge(profile.nacimiento); data.users.push({ user: fd.user, pass: fd.pass, role, profile }); save(data); trace(fd.user, 'Se registró', role); renderDashboard(data.users.at(-1)); };
}
function calcAge(date) { const d = new Date(date), n = new Date(); let a = n.getFullYear()-d.getFullYear(); if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--; return a; }
function uniqueOptions(talents, key) { return [...new Set(talents.map(t => t.profile[key]).filter(Boolean))].map(x => `<option value="${x}">${x}</option>`).join(''); }

function renderDashboard(user) {
  setTitle(`Panel ${roles[user.role]}`, true);
  if (user.role === 'admin') return renderAdmin(user);
  if (user.role === 'presa') return renderPresa(user);
  const talents = db().users.filter(u => u.role === 'presa');
  app.innerHTML = `<section class="dashboard"><aside class="panel filter-menu"><h2>Filtros de caza</h2><ul class="filter-list"><li><label>Categoría<select id="fCat"><option value="">Todas</option>${uniqueOptions(talents, 'profesion')}</select></label></li><li><label>Nivel educativo<select id="fEdu"><option value="">Todos</option>${uniqueOptions(talents, 'educacion')}</select></label></li><li><label>Experiencias<select id="fExp"><option value="">Todas</option>${uniqueOptions(talents, 'experiencia')}</select></label></li><li><label>Conocimientos<select id="fKnow"><option value="">Todos</option>${uniqueOptions(talents, 'conocimientos')}</select></label></li></ul><button class="primary alt" id="filterBtn">Filtrar</button></aside><div><h2>Presas disponibles</h2><div id="talentList" class="talent-list"></div></div></section>`;
  let currentTalents = talents;
  const draw = list => { currentTalents = list; talentList.innerHTML = list.map((t,i) => card(t,i)).join('') || '<p>No hay resultados.</p>'; };
  draw(talents);
  filterBtn.onclick = () => { const terms = [fCat.value, fEdu.value, fExp.value, fKnow.value].filter(Boolean).map(v => v.toLowerCase()); trace(user.user, 'Aplicó filtros', terms.join(', ') || 'sin filtro'); draw(talents.filter(t => terms.every(q => JSON.stringify(t.profile).toLowerCase().includes(q)))); };
  talentList.onclick = e => { if (e.target.dataset.idx !== undefined) renderTalent(user, currentTalents[e.target.dataset.idx]); };
}
function card(t,i) { const p=t.profile; return `<article class="talent-card"><div class="photo" ${photoStyle(imgPath(p.foto, randomFrom(profileImages)))}>👤</div><h3>${p.nombre}</h3><p class="muted">${p.profesion || ''}</p><span class="badge">${p.educacion || ''}</span><p>${p.experiencia || ''}</p><button class="primary" data-idx="${i}">Ver ficha</button></article>`; }
function detail(label, value, wide = false) { return value ? `<div class="detail-item ${wide ? 'full' : ''}"><span>${label}</span>${value}</div>` : ''; }
function renderTalent(viewer, talent) {
  setTitle('Ficha confidencial: SE BUSCA', true); trace(viewer.user, 'Vio perfil', talent.profile.nombre);
  const p = talent.profile;
  app.innerHTML = `<section class="panel profile"><div><div class="photo" ${photoStyle(imgPath(p.foto))}>👤</div><button class="primary alt" onclick="renderLanding()">Cerrar sesión</button></div><div><h2>${p.nombre}</h2><div class="profile-details">${detail('Profesión', p.profesion)}${detail('Locación', p.locacion)}${detail('Educación', p.educacion)}${detail('Edad', p.edad)}${detail('Género', p.genero)}${detail('Condición física/médica', p.condicion)}${detail('Experiencia', p.experiencia, true)}${detail('Conocimientos', p.conocimientos, true)}${detail('Expectativas', p.expectativas, true)}${detail('Recomendaciones', p.recomendaciones, true)}</div><div class="actions"><button id="contactBtn" class="primary">Ver datos de contacto</button></div><div id="contactData" class="profile-details"></div></div></section>`;
  contactBtn.onclick = () => confirmContact(viewer, talent);
}
function confirmContact(viewer, talent) { app.insertAdjacentHTML('beforeend', `<div class="modal"><div class="modal-card"><h2>Confirmación confidencial</h2><p>A continuación se mostrarán los datos de contacto de esta presa. Asegura que usted es real y usará estos datos con fines adecuados.</p><button id="accept" class="primary">Aceptar</button> <button id="deny" class="ghost">No aceptar</button></div></div>`); accept.onclick = () => { trace(viewer.user, 'Intentó ver contacto', talent.profile.nombre, 'Aceptó'); contactData.innerHTML = `${detail('Teléfono', talent.profile.telefono)}${detail('Correo', talent.profile.correo)}${detail('Cédula', talent.profile.cedula)}`; document.querySelector('.modal').remove(); }; deny.onclick = () => { trace(viewer.user, 'Intentó ver contacto', talent.profile.nombre, 'No aceptó'); document.querySelector('.modal').remove(); }; }
function renderPresa(user) { trace(user.user, 'Consultó su perfil'); const p = user.profile; app.innerHTML = `<section class="panel profile"><div><div class="photo" ${photoStyle(imgPath(p.foto))}>👤</div><button class="primary alt" onclick="renderLanding()">Cerrar sesión</button></div><div><h2>Tu ficha de presa</h2><p class="muted">Este perfil promociona tus conocimientos para que puedan encontrarte.</p><div class="profile-details">${detail('Nombre', p.nombre)}${detail('Cédula', p.cedula)}${detail('Locación', p.locacion)}${detail('Profesión', p.profesion)}${detail('Domicilio', p.domicilio)}${detail('Educación', p.educacion)}${detail('Teléfono', p.telefono)}${detail('Correo', p.correo)}${detail('Edad', p.edad)}${detail('Género', p.genero)}${detail('Experiencia', p.experiencia, true)}${detail('Conocimientos', p.conocimientos, true)}${detail('Expectativas', p.expectativas, true)}${detail('Motivo', p.motivo, true)}${detail('Recomendaciones', p.recomendaciones, true)}${detail('Condición física/médica', p.condicion, true)}</div></div></section>`; }
function renderAdmin() { const rows = db().audit.map(a => `<tr><td>${a.at}</td><td>${a.actor}</td><td>${a.action}</td><td>${a.target}</td><td>${a.accepted}</td></tr>`).join(''); app.innerHTML = `<section class="panel"><h2>Trazabilidad</h2><table class="audit-table"><thead><tr><th>Fecha/hora</th><th>Actor</th><th>Acción</th><th>Objetivo</th><th>Aceptó</th></tr></thead><tbody>${rows}</tbody></table><button class="primary alt" onclick="renderLanding()">Cerrar sesión</button></section>`; }

init();
renderLanding();
