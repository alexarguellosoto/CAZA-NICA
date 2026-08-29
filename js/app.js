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
function setTitle(text, showLogout = false, backLabel = 'Regresar') { title.textContent = text; backBtn.textContent = backLabel; backBtn.classList.toggle('hidden', !showLogout); }
backBtn.onclick = () => renderLanding();

function imgPath(value, fallback = 'img/profile/profile001.jpg') {
  return value && typeof value === 'string' && !value.includes('fakepath') ? value : fallback;
}
function filePath(folder, user, file) {
  if (!file || !file.name) return '';
  const cleanUser = (user || 'usuario').toLowerCase().replace(/[^a-z0-9_-]+/gi, '-');
  const cleanName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/gi, '-');
  return `${folder}/${cleanUser}_${Date.now()}_${cleanName}`;
}
function fileAsDataUrl(file) {
  return new Promise(resolve => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
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
    ${roleButton('presa', 'Cazador', 'Extranjero', 'traveler')}
    ${roleButton('cazadorNatural', 'Cazador', 'Nacional', 'local')}
    ${roleButton('cazador', 'Empresa', 'Organización', 'company')}
  </div></section>`;
  document.querySelectorAll('[data-role]').forEach(btn => btn.onclick = () => renderAuth(btn.dataset.role));
}
function roleButton(role, label, subtitle, icon) {
  const icons = {
    traveler: '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="31" r="15"/><path d="M27 91V67c0-13 10-24 23-24s23 11 23 24v24M22 53l-9 38M78 53l9 38M30 19c8-12 35-12 42 3-9 3-29 5-42-3Z"/></svg>',
    local: '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="31" r="15"/><path d="M27 91V67c0-13 10-24 23-24s23 11 23 24v24M20 91V62l13-9M80 91V62L67 53M39 15c16-8 31 0 36 10H45Z"/></svg>',
    company: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 91V35l31-15v71M49 91V45l33 13v33M29 43h9M29 55h9M29 67h9M29 79h9M59 59h10M59 70h10M59 81h10"/></svg>'
  };
  return `<button class="role-card" data-role="${role}"><span class="pin" aria-hidden="true"></span><div class="avatar-stamp">${icons[icon]}</div><h2>${label}</h2><p>${subtitle}</p><span class="role-symbol" aria-hidden="true">${icon === 'company' ? '▣' : icon === 'local' ? '◆' : '◎'}</span></button>`;
}

function renderAuth(role) {
  setTitle(roles[role], true, 'Regresar');
  app.innerHTML = `<section class="auth-layout">
    <aside class="panel green"><h2>Ingreso confidencial</h2><p class="muted">Usuarios demo: empresa, natural, presa, admin. Contraseña: 1234.</p></aside>
    <div class="panel"><h2>Login</h2><form id="loginForm" class="form-grid">
      <label>Usuario<input name="user" required></label><label>Contraseña<input type="password" name="pass" required></label>
      <button class="primary" type="submit">Entrar</button><button class="primary alt" id="registerBtn" type="button">Registrar</button>
    </form><div id="authMsg" class="muted"></div></div></section>`;
  loginForm.onsubmit = e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(loginForm));
    const u = db().users.find(x => x.user === fd.user && x.pass === fd.pass);
    if (!u) return authMsg.textContent = 'Credenciales incorrectas.';
    if (u.role !== role && u.role !== 'admin') return authMsg.textContent = `Este acceso es para ${roles[role]}. Seleccioná el tipo de perfil correcto para iniciar sesión.`;
    trace(u.user, 'Inició sesión', u.role);
    renderDashboard(u);
  };
  registerBtn.onclick = () => renderRegister(role);
}

function field(name, label, type='text', extra='') { return `<label>${label}<input name="${name}" type="${type}" ${extra}></label>`; }
function selectField(name, label, options, placeholder = 'Seleccioná una opción') {
  return `<label>${label}<select name="${name}" required><option value="">${placeholder}</option>${options.map(x => `<option value="${x}">${x}</option>`).join('')}</select></label>`;
}
const commonProfessions = ['Asistente administrativo','Contador/a','Vendedor/a','Atención al cliente','Docente','Enfermero/a','Técnico en redes','Programador/a','Diseñador/a gráfico','Conductor/a','Electricista','Fontanero/a','Carpintero/a','Operario/a de producción','Guardia de seguridad','Cocinero/a','Mecánico/a','Community manager'];
const workExpectations = ['Tiempo completo presencial','Medio tiempo presencial','Remoto','Híbrido','Por proyecto','Turno diurno','Turno nocturno','Fines de semana','Prácticas profesionales','Freelance'];
function renderRegister(role) {
  setTitle(`Registro ${roles[role]}`, false);
  let fields = field('user','Usuario') + field('pass','Contraseña','password');
  if (role === 'presa') fields += `<label>Ruta/foto de perfil<input name="fotoFile" type="file" accept="image/*"><small class="hint">Se registrará como img/profile/usuario_archivo.</small></label>` + field('cedula','Número de cédula') + field('locacion','Locación') + field('nombre','Nombre') + selectField('profesion','Profesión', commonProfessions) + field('domicilio','Domicilio') + `<label>Nivel educativo/técnico<select name="educacion"><option>Primaria</option><option>Secundaria</option><option>Universitario</option><option>Certificación técnica</option></select></label><label class="full">Cartas de recomendación<input name="recomendacionFiles" type="file" accept=".pdf,.doc,.docx,image/*" multiple><small class="hint">PDF, Word o imagen. Se registran en img/letterprofile con el nombre del usuario.</small></label><label class="full">Expectativa de trabajo<select name="expectativas" multiple size="5">${workExpectations.map(x => `<option value="${x}">${x}</option>`).join('')}</select><small class="hint">Podés seleccionar varias opciones.</small></label><label class="full">Motivo de inscripción<textarea name="motivo"></textarea></label><label>Condición física / médica<input name="condicion" placeholder="peso, altura, padecimientos"></label><label>Género<select name="genero"><option value="">Seleccioná</option><option>Masculino</option><option>Femenino</option></select></label>${field('nacimiento','Fecha de nacimiento','date')}<label>Edad<input name="edad" readonly placeholder="Se calcula automáticamente"></label><label>Teléfono<input name="telefono"></label><label>Correo<input name="correo" type="email"></label><label class="full">Experiencia<textarea name="experiencia" placeholder="Ejemplo: 3 años atendiendo clientes, manejo de caja y control de inventario en tienda minorista."></textarea></label><label class="full">Conocimientos<textarea name="conocimientos" placeholder="Ejemplo: Excel intermedio, facturación, fibra óptica, redes sociales y atención por WhatsApp Business."></textarea></label>`;
  if (role === 'cazador') fields += field('empresa','Nombre de empresa') + `<label>Sector<select name="sector"><option>Tecnología</option><option>Construcción</option><option>Salud</option><option>Educación</option><option>Comercio</option></select></label>` + field('ubicacion','Ubicación') + field('domicilio','Domicilio') + field('horario','Horario de atención') + `<label>Foto / logo de empresa<input name="logoFile" type="file" accept="image/*"><small class="hint">Vista previa local del archivo seleccionado.</small></label>`;
  if (role === 'cazadorNatural') fields += field('nombre','Nombre y apellido') + field('correo','Correo','email') + field('telefono','Teléfono') + field('departamento','Departamento') + field('ciudad','Ciudad') + field('direccion','Dirección específica') + `<label class="full">Motivo de búsqueda<textarea name="motivo"></textarea></label>` + `<label>Ruta/foto<input name="fotoFile" type="file" accept="image/*"><small class="hint">Se registrará como img/profile/usuario_archivo.</small></label>`;
  app.innerHTML = `<form id="regForm" class="panel form-grid"><header class="dossier-heading"><strong>${role === 'presa' ? 'Ficha SE BUSCA' : role === 'cazador' ? 'Certificado de identidad · Empresa' : 'Certificado de identidad'}</strong><span>CONFIDENCIAL</span></header>${fields}<div class="actions full"><button class="primary" type="submit">Crear perfil</button><button class="ghost cancel-btn" id="cancelRegisterBtn" type="button">Cancelar</button></div></form>`;
  cancelRegisterBtn.onclick = () => renderAuth(role);
  const birthInput = regForm.elements.nacimiento;
  if (birthInput) birthInput.addEventListener('change', () => { regForm.elements.edad.value = birthInput.value ? calcAge(birthInput.value) : ''; });
  regForm.onsubmit = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = Object.fromEntries(new FormData(form));
    const data = db();
    if (data.users.some(u => u.user.toLowerCase() === fd.user.trim().toLowerCase())) { alert('Ese nombre de usuario ya existe.'); return; }
    const profile = {...fd};
    delete profile.user; delete profile.pass; delete profile.fotoFile; delete profile.logoFile; delete profile.recomendacionFiles;
    const selectedExpectations = [...form.querySelectorAll('[name="expectativas"] option:checked')].map(o => o.value);
    if (selectedExpectations.length) profile.expectativas = selectedExpectations.join(', ');
    const photo = form.fotoFile?.files?.[0] || form.logoFile?.files?.[0];
    if (photo) { const isLogo = Boolean(form.logoFile); const key = isLogo ? 'logo' : 'foto'; profile[key] = filePath(isLogo ? 'img/company' : 'img/profile', fd.user, photo); profile[`${key}Preview`] = await fileAsDataUrl(photo); }
    const letters = [...(form.recomendacionFiles?.files || [])];
    if (letters.length) profile.recomendaciones = letters.map(file => ({ nombre: file.name, ruta: filePath('img/letterprofile', fd.user, file), tipo: file.type || 'archivo' }));
    if (profile.nacimiento) profile.edad = calcAge(profile.nacimiento);
    data.users.push({ user: fd.user, pass: fd.pass, role, profile });
    save(data); trace(fd.user, 'Se registró', role); renderDashboard(data.users.at(-1));
  };
}
function calcAge(date) { const d = new Date(date), n = new Date(); let a = n.getFullYear()-d.getFullYear(); if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--; return a; }
function uniqueOptions(talents, key) { return [...new Set(talents.map(t => t.profile[key]).filter(Boolean))].map(x => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join(''); }
function recommendationLinks(recs) {
  if (!recs) return '';
  if (Array.isArray(recs)) return recs.map(r => `<a class="file-chip" href="${escapeHtml(r.ruta)}" target="_blank" rel="noopener">${escapeHtml(r.nombre)} · ${escapeHtml(r.ruta)}</a>`).join('');
  return escapeHtml(recs);
}

function renderDashboard(user) {
  setTitle(`Panel ${roles[user.role]}`, true, 'Cerrar sesión');
  if (user.role === 'admin') return renderAdmin(user);
  if (user.role === 'presa') return renderPresa(user);
  const talents = db().users.filter(u => u.role === 'presa');
  const isNaturalHunter = user.role === 'cazadorNatural';
  const filterTitle = isNaturalHunter ? 'Filtros para contratar un servicio' : 'Filtros para encontrar talento';
  const resultsTitle = isNaturalHunter ? 'Servicios disponibles' : 'Presas disponibles';
  const helperText = isNaturalHunter
    ? 'Como persona natural, priorizá oficio, servicio ofrecido, ubicación y disponibilidad por proyecto.'
    : 'Como empresa, priorizá profesión, educación, experiencia, expectativa laboral y rango de edad.';
  const companyFilters = `<li><label>Nivel educativo<select id="fEdu"><option value="">Todos</option>${uniqueOptions(talents, 'educacion')}</select></label></li><li><label>Género<select id="fGen"><option value="">Todos</option><option>Masculino</option><option>Femenino</option></select></label></li><li class="split"><label>Edad mínima<input id="fMinAge" type="number" min="16" placeholder="18"></label><label>Edad máxima<input id="fMaxAge" type="number" min="16" placeholder="60"></label></li>`;
  const naturalFilters = `<li><label>Modalidad del servicio<select id="fWork"><option value="">Todas</option><option>Por proyecto</option><option>Freelance</option><option>Fines de semana</option><option>Medio tiempo presencial</option><option>Remoto</option></select></label></li><li><label>Experiencia mínima<input id="fExperience" placeholder="Ej: 2 años, instalaciones, eventos..."></label></li>`;
  const sharedWorkFilter = isNaturalHunter ? naturalFilters : `<li><label>Expectativa laboral<select id="fWork"><option value="">Todas</option>${workExpectations.map(x => `<option value="${x}">${x}</option>`).join('')}</select></label></li>`;
  app.innerHTML = `<section class="dashboard"><aside class="panel filter-menu"><h2>${filterTitle}</h2><p class="muted">${helperText}</p><ul class="filter-list"><li><label>Búsqueda general<input id="fText" placeholder="Nombre, habilidad, ciudad..."></label></li><li><label>${isNaturalHunter ? 'Servicio u oficio' : 'Profesión'}<select id="fCat"><option value="">Todas</option>${commonProfessions.map(x => `<option value="${x}">${x}</option>`).join('')}${uniqueOptions(talents, 'profesion')}</select></label></li><li><label>Locación<select id="fLoc"><option value="">Todas</option>${uniqueOptions(talents, 'locacion')}</select></label></li>${sharedWorkFilter}${isNaturalHunter ? '' : companyFilters}</ul><button class="primary alt" id="filterBtn">Filtrar</button></aside><div class="talent-results"><h2>${resultsTitle}</h2><div id="talentList" class="talent-list"></div></div></section>`;
  let currentTalents = talents;
  const draw = list => { currentTalents = list; talentList.innerHTML = list.map((t,i) => card(t,i)).join('') || '<p>No hay resultados.</p>'; };
  draw(talents);
  filterBtn.onclick = () => {
    const values = [fText.value, fCat.value, fLoc.value, fWork.value];
    if (!isNaturalHunter) values.push(fEdu.value, fGen.value);
    if (isNaturalHunter) values.push(fExperience.value);
    const terms = values.filter(Boolean).map(v => v.toLowerCase());
    const minAge = !isNaturalHunter && fMinAge.value ? Number(fMinAge.value) : 0;
    const maxAge = !isNaturalHunter && fMaxAge.value ? Number(fMaxAge.value) : 200;
    trace(user.user, 'Aplicó filtros', terms.join(', ') || 'sin filtro');
    draw(talents.filter(t => {
      const profileText = JSON.stringify(t.profile).toLowerCase();
      const age = Number(t.profile.edad) || 0;
      return terms.every(q => profileText.includes(q)) && age >= minAge && age <= maxAge;
    }));
  };
  talentList.onclick = e => { if (e.target.dataset.idx !== undefined) renderTalent(user, currentTalents[e.target.dataset.idx]); };
}
function card(t,i) { const p=t.profile; return `<article class="talent-card"><div class="photo" ${photoStyle(p.fotoPreview || imgPath(p.foto, randomFrom(profileImages)))}>👤</div><h3>${p.nombre}</h3><p class="muted">${p.profesion || ''}</p><span class="badge">${p.educacion || ''}</span><p>${p.experiencia || ''}</p><button class="primary" data-idx="${i}">Ver ficha</button></article>`; }
function detail(label, value, wide = false) { return value ? `<div class="detail-item ${wide ? 'full' : ''}"><span>${label}</span>${value}</div>` : ''; }
function renderTalent(viewer, talent) {
  setTitle('Ficha confidencial: SE BUSCA', true); trace(viewer.user, 'Vio perfil', talent.profile.nombre);
  const p = talent.profile;
  app.innerHTML = `<section class="panel profile"><div><div class="photo" ${photoStyle(p.fotoPreview || imgPath(p.foto))}>👤</div></div><div><h2>${p.nombre}</h2><div class="profile-details">${detail('Profesión', p.profesion)}${detail('Locación', p.locacion)}${detail('Educación', p.educacion)}${detail('Edad', p.edad)}${detail('Género', p.genero)}${detail('Condición física/médica', p.condicion)}${detail('Experiencia', p.experiencia, true)}${detail('Conocimientos', p.conocimientos, true)}${detail('Expectativas', p.expectativas, true)}${detail('Recomendaciones', recommendationLinks(p.recomendaciones), true)}</div><div class="actions"><button id="contactBtn" class="primary">Ver datos de contacto</button></div><div id="contactData" class="profile-details"></div></div></section>`;
  contactBtn.onclick = () => confirmContact(viewer, talent);
}
function confirmContact(viewer, talent) { app.insertAdjacentHTML('beforeend', `<div class="modal"><div class="modal-card"><h2>Confirmación confidencial</h2><p>A continuación se mostrarán los datos de contacto de esta presa. Asegura que usted es real y usará estos datos con fines adecuados.</p><button id="accept" class="primary">Aceptar</button> <button id="deny" class="ghost">No aceptar</button></div></div>`); accept.onclick = () => { trace(viewer.user, 'Intentó ver contacto', talent.profile.nombre, 'Aceptó'); contactData.innerHTML = `${detail('Teléfono', talent.profile.telefono)}${detail('Correo', talent.profile.correo)}${detail('Cédula', talent.profile.cedula)}`; document.querySelector('.modal').remove(); }; deny.onclick = () => { trace(viewer.user, 'Intentó ver contacto', talent.profile.nombre, 'No aceptó'); document.querySelector('.modal').remove(); }; }
function renderPresa(user) { trace(user.user, 'Consultó su perfil'); const p = user.profile; app.innerHTML = `<section class="panel profile"><div><div class="photo" ${photoStyle(p.fotoPreview || imgPath(p.foto))}>👤</div></div><div><h2>Tu ficha de presa</h2><p class="muted">Este perfil promociona tus conocimientos para que puedan encontrarte.</p><div class="profile-details">${detail('Nombre', p.nombre)}${detail('Cédula', p.cedula)}${detail('Locación', p.locacion)}${detail('Profesión', p.profesion)}${detail('Domicilio', p.domicilio)}${detail('Educación', p.educacion)}${detail('Teléfono', p.telefono)}${detail('Correo', p.correo)}${detail('Edad', p.edad)}${detail('Género', p.genero)}${detail('Experiencia', p.experiencia, true)}${detail('Conocimientos', p.conocimientos, true)}${detail('Expectativas', p.expectativas, true)}${detail('Motivo', p.motivo, true)}${detail('Recomendaciones', recommendationLinks(p.recomendaciones), true)}${detail('Condición física/médica', p.condicion, true)}</div></div></section>`; }
function renderAdmin() { const rows = db().audit.map(a => `<tr><td>${a.at}</td><td>${a.actor}</td><td>${a.action}</td><td>${a.target}</td><td>${a.accepted}</td></tr>`).join(''); app.innerHTML = `<section class="panel"><h2>Trazabilidad · Solo administrador</h2><div class="audit-wrap"><table class="audit-table"><thead><tr><th>Fecha/hora</th><th>Actor</th><th>Acción</th><th>Objetivo</th><th>Aceptó</th></tr></thead><tbody>${rows}</tbody></table></div></section>`; }

init();
renderLanding();
