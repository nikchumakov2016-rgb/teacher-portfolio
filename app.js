/**
 * app.js — логика сайта-портфолио учителя биологии
 * Загружает content.json, рендерит все разделы, управляет UI
 */

'use strict';

/* =============================================
   SVG-иконки (встроенные)
   ============================================= */
const ICONS = {
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  award:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  compass:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  trophy:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>`,
  document: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  email:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.21 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.15 6.15l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>`,
  school:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  map:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  link:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
  person:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  star:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  book:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
};

/* =============================================
   Метки навигации
   ============================================= */
const NAV_LABELS = {
  hero:         'Главная',
  about:        'Сведения',
  results:      'Результаты',
  publications: 'Публикации',
  exams:        'Аттестация',
  research:     'Исследования',
  methods:      'Методика',
  programs:     'Программы',
  gallery:      'Галерея',
  contacts:     'Контакты',
};

/* =============================================
   Вспомогательные функции
   ============================================= */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function icon(name) {
  return `<span class="icon-wrap">${ICONS[name] || ''}</span>`;
}

function downloadBtn(file, label = 'Скачать') {
  if (!file) return '';
  return `<a href="${esc(file)}" class="btn btn-outline" download aria-label="${esc(label)}">
    ${ICONS.download} ${esc(label)}
  </a>`;
}

function openBtn(link, label = 'Открыть') {
  if (!link) return '';
  return `<a href="${esc(link)}" class="btn btn-outline" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}">
    ${ICONS.external} ${esc(label)}
  </a>`;
}

/* =============================================
   Рендеринг разделов
   ============================================= */

function renderHero(data) {
  const d = data.hero;
  const badges = (d.badges || []).map(b => `
    <div class="badge">
      <div class="badge-icon">${ICONS[b.icon] || ICONS.award}</div>
      <div class="badge-label">${esc(b.label)}</div>
      <div class="badge-value">${esc(b.value)}</div>
    </div>
  `).join('');

  const photoHTML = d.photo
    ? `<img src="${esc(d.photo)}" alt="Фото ${esc(d.fullName)}" class="hero-photo"
           onerror="this.parentElement.innerHTML='<div class=hero-photo-placeholder>${ICONS.person}<span>Фото</span></div>'">`
    : `<div class="hero-photo-placeholder">${ICONS.person}<span>Добавьте фото</span></div>`;

  document.getElementById('hero').innerHTML = `
    <div class="container">
      <div class="hero-inner">
        <div class="hero-photo-wrap">${photoHTML}</div>
        <div class="hero-info">
          <div class="hero-position">${esc(d.position)}</div>
          <h1 class="hero-name">${esc(d.fullName)}</h1>
          <p class="hero-school">${esc(d.school)}</p>
          ${d.motto ? `<blockquote class="hero-motto">${esc(d.motto)}</blockquote>` : ''}
          <div class="hero-badges">${badges}</div>
        </div>
      </div>
    </div>`;

  // Имя в шапке и подвале
  const shortName = d.fullName.split(' ').slice(0, 2).join(' ');
  document.getElementById('header-name').textContent = shortName;
  document.getElementById('header-name').title = d.fullName;
  document.getElementById('footer-name').textContent =
    `© ${new Date().getFullYear()} ${d.fullName} · ${d.position}`;
}

function renderAbout(data) {
  const d = data.about;
  const el = document.getElementById('about');

  const education = (d.education || []).map(e => `
    <p><strong>${esc(e.institution)}</strong><br>
    ${esc(e.specialty)}${e.year ? `, ${esc(e.year)} г.` : ''}</p>
  `).join('');

  const courses = (d.courses || []).map(c => `
    <div class="course-item">
      <div class="course-name">${esc(c.name)}</div>
      <div class="course-meta">${esc(c.provider)}${c.year ? `, ${esc(c.year)}` : ''}${c.hours ? ` · ${esc(c.hours)} ч.` : ''}</div>
      ${c.file ? downloadBtn(c.file, 'Скачать документ') : ''}
    </div>
  `).join('');

  const interests = (d.professionalInterests || []).map(i => {
    const title = i.title !== undefined ? i.title : i;
    return i.file
      ? `<a href="${esc(i.file)}" class="tag tag-link" download>${esc(title)}</a>`
      : `<span class="tag">${esc(title)}</span>`;
  }).join('');

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${esc(d.title)}</h2>
      <div class="about-grid">
        <div>
          <div class="about-block">
            <div class="about-block-title">Образование</div>
            ${education}
            ${d.qualification ? `<p style="margin-top:0.75rem"><em>${esc(d.qualification)}</em></p>` : ''}
          </div>
          ${d.selfEducationTopic ? `
          <div class="about-block" style="margin-top:1.25rem">
            <div class="about-block-title">Тема самообразования</div>
            <p>${esc(d.selfEducationTopic)}</p>
          </div>` : ''}
        </div>
        <div>
          ${courses ? `
          <div class="about-block">
            <div class="about-block-title">Повышение квалификации</div>
            ${courses}
          </div>` : ''}
          ${interests ? `
          <div class="about-block" style="margin-top:1.25rem">
            <div class="about-block-title">Профессиональные интересы</div>
            <div class="tags">${interests}</div>
          </div>` : ''}
        </div>
      </div>
    </div>`;
}

function renderResults(data) {
  const d = data.results;
  const el = document.getElementById('results');

  const olympiads = (d.olympiadResults || []).map(o => `
    <div class="olympiad-item">
      <div class="olympiad-event">${esc(o.event)}</div>
      ${o.description ? `<div class="olympiad-desc">${esc(o.description)}</div>` : ''}
      <div class="olympiad-result">${esc(o.result)}</div>
      <div class="olympiad-year">${esc(o.year)}</div>
      ${o.file ? downloadBtn(o.file, 'Документ') : ''}
    </div>
  `).join('');

  const awards = (d.awards || []).map(a => `
    <div class="award-item">
      <div class="award-name">${esc(a.name)}</div>
      ${a.description ? `<div class="award-desc">${esc(a.description)}</div>` : ''}
      <div class="award-issuer">${esc(a.issuer)}${a.year ? `, ${esc(a.year)} г.` : ''}</div>
      ${a.file ? downloadBtn(a.file, 'Скан') : ''}
    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${esc(d.title)}</h2>
      ${d.intro ? `<p class="section-intro">${esc(d.intro)}</p>` : ''}

      <div class="cards-grid-2">
        ${olympiads ? `
        <div class="about-block">
          <div class="results-block-title">${ICONS.trophy} Олимпиады и конкурсы</div>
          ${olympiads}
        </div>` : ''}

        ${awards ? `
        <div class="about-block">
          <div class="results-block-title">${ICONS.star} Награды и поощрения</div>
          ${awards}
        </div>` : ''}
      </div>
    </div>`;
}

function renderPublications(data) {
  const d = data.publications;
  const el = document.getElementById('publications');

  const items = (d.items || []).map(p => `
    <div class="publication-item">
      <div class="publication-title">${esc(p.title)}</div>
      <div class="publication-source">${esc(p.source)}</div>
      <div class="publication-footer">
        <span class="tag">${esc(p.year)}</span>
        ${p.link ? openBtn(p.link, 'Открыть публикацию') : ''}
        ${p.file ? downloadBtn(p.file, 'Скачать PDF') : ''}
      </div>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${esc(d.title)}</h2>
      ${d.intro ? `<p class="section-intro">${esc(d.intro)}</p>` : ''}
      <div class="items-list">${items}</div>
    </div>`;
}

function renderExams(data) {
  const d = data.exams;
  const el = document.getElementById('exams');

  const tabs = (d.tabs || []).map((t, i) =>
    `<button class="tab-btn${i === 0 ? ' active' : ''}" data-tab="${esc(t.id)}" type="button">${esc(t.label)}</button>`
  ).join('');

  const panels = (d.tabs || []).map((t, i) => {
    const mats = (t.materials || []).map(m => `
      <div class="material-item">
        <div class="material-info">
          <div class="material-title">${esc(m.title)}</div>
          ${m.description ? `<div class="material-desc">${esc(m.description)}</div>` : ''}
        </div>
        ${m.file ? downloadBtn(m.file, 'Скачать') : ''}
      </div>
    `).join('');

    return `
      <div class="tab-panel${i === 0 ? ' active' : ''}" id="tab-${esc(t.id)}">
        ${t.description ? `<p class="tab-description">${esc(t.description)}</p>` : ''}
        ${mats ? `<div class="materials-list">${mats}</div>` : ''}
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${esc(d.title)}</h2>
      <div class="tabs" role="tablist" aria-label="${esc(d.title)}">${tabs}</div>
      ${panels}
    </div>`;

  // Логика табов
  el.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      el.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = el.querySelector(`#tab-${btn.dataset.tab}`);
      if (panel) panel.classList.add('active');
    });
  });
}

function renderResearch(data) {
  const d = data.research;
  const el = document.getElementById('research');

  const cards = (d.projects || []).map(p => `
    <div class="research-card">
      ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" class="research-card-img"
          onerror="this.style.display='none'">` : ''}
      <div class="research-card-body">
        <div class="research-card-year">${esc(p.year)}</div>
        <div class="research-card-title">${esc(p.title)}</div>
        <div class="research-card-student">${esc(p.student)}</div>
        <p class="research-card-desc">${esc(p.description)}</p>
        ${p.result ? `<div class="research-card-result">${esc(p.result)}</div>` : ''}
      </div>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${esc(d.title)}</h2>
      ${d.intro ? `<p class="section-intro">${esc(d.intro)}</p>` : ''}
      <div class="cards-grid">${cards}</div>
    </div>`;
}

function renderMethods(data) {
  const d = data.methods;
  const el = document.getElementById('methods');

  const items = (d.items || []).map(m => `
    <div class="method-item">
      <div class="method-header">
        <div class="method-title">${esc(m.title)}</div>
        ${m.type ? `<span class="type-badge">${esc(m.type)}</span>` : ''}
      </div>
      ${m.description ? `<p class="method-desc">${esc(m.description)}</p>` : ''}
      ${m.file ? downloadBtn(m.file) : ''}
    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${esc(d.title)}</h2>
      ${d.intro ? `<p class="section-intro">${esc(d.intro)}</p>` : ''}
      <div class="items-list">${items}</div>
    </div>`;
}

function renderPrograms(data) {
  const d = data.programs;
  const el = document.getElementById('programs');

  const items = (d.items || []).map(p => `
    <div class="program-item">
      <div class="program-header">
        <div>
          <div class="program-title">${esc(p.title)}</div>
          ${p.classes ? `<div class="program-classes">${esc(p.classes)}</div>` : ''}
        </div>
        ${p.type ? `<span class="type-badge">${esc(p.type)}</span>` : ''}
      </div>
      ${p.description ? `<p class="program-desc">${esc(p.description)}</p>` : ''}
      ${p.file ? downloadBtn(p.file) : ''}
    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${esc(d.title)}</h2>
      ${d.intro ? `<p class="section-intro">${esc(d.intro)}</p>` : ''}
      <div class="items-list">${items}</div>
    </div>`;
}

function renderGallery(data) {
  const d = data.gallery;
  const el = document.getElementById('gallery');

  const items = (d.images || []).map(img => {
    const src   = img.image || img.src   || '';
    const title = img.title || img.caption || '';
    const desc  = img.description || '';
    return `
    <div class="gallery-item" tabindex="0" role="button"
         aria-label="Открыть фото: ${esc(title)}"
         data-src="${esc(src)}" data-caption="${esc(title)}">
      <img src="${esc(src)}" alt="${esc(title || 'Фото')}"
           loading="lazy" onerror="this.parentElement.style.display='none'">
      <div class="gallery-item-overlay">
        <div class="gallery-item-caption">${esc(title)}${desc ? `<br><small>${esc(desc)}</small>` : ''}</div>
      </div>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${esc(d.title)}</h2>
      ${d.intro ? `<p class="section-intro">${esc(d.intro)}</p>` : ''}
      <div class="gallery-grid">${items}</div>
    </div>`;

  setupGalleryModal(el);
}

function renderContacts(data) {
  const d = data.contacts;
  const el = document.getElementById('contacts');

  const items = [];

  if (d.email) items.push(`
    <div class="contact-item">
      <div class="contact-icon">${ICONS.email}</div>
      <div>
        <div class="contact-label">Email</div>
        <div class="contact-value"><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></div>
      </div>
    </div>`);

  if (d.phone) items.push(`
    <div class="contact-item">
      <div class="contact-icon">${ICONS.phone}</div>
      <div>
        <div class="contact-label">Телефон</div>
        <div class="contact-value"><a href="tel:${esc(d.phone)}">${esc(d.phone)}</a></div>
      </div>
    </div>`);

  if (d.schoolName) items.push(`
    <div class="contact-item">
      <div class="contact-icon">${ICONS.school}</div>
      <div>
        <div class="contact-label">Учебное заведение</div>
        <div class="contact-value">${d.schoolWebsite
          ? `<a href="${esc(d.schoolWebsite)}" target="_blank" rel="noopener">${esc(d.schoolName)}</a>`
          : esc(d.schoolName)
        }</div>
      </div>
    </div>`);

  if (d.address) items.push(`
    <div class="contact-item">
      <div class="contact-icon">${ICONS.map}</div>
      <div>
        <div class="contact-label">Адрес</div>
        <div class="contact-value">${esc(d.address)}</div>
      </div>
    </div>`);

  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${esc(d.title)}</h2>
      <div class="contacts-inner">${items.join('')}</div>
    </div>`;
}

/* =============================================
   Навигация
   ============================================= */
function buildNav() {
  const navList = document.getElementById('nav-list');
  if (!navList) return;

  navList.innerHTML = Object.entries(NAV_LABELS).map(([id, label]) => `
    <li><a href="#${id}" data-section="${id}">${label}</a></li>
  `).join('');

  // Плавный скролл
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (!target) return;
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-height')) || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  // Имя в шапке — скролл наверх
  document.getElementById('header-name').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   Intersection Observer — подсветка активного пункта меню
   ============================================= */
function setupActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('#nav-list a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`#nav-list a[data-section="${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, {
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0,
  });

  sections.forEach(s => observer.observe(s));
}

/* =============================================
   Бургер-меню
   ============================================= */
function setupBurger() {
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('main-nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Закрытие при клике вне меню
  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !nav.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

function closeMobileMenu() {
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('main-nav');
  if (!burger || !nav) return;
  nav.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}

/* =============================================
   Уменьшение шапки при скролле
   ============================================= */
function setupStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

/* =============================================
   Кнопка «Наверх»
   ============================================= */
function setupBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   Модальное окно галереи
   ============================================= */
function setupGalleryModal(galleryEl) {
  const modal   = document.getElementById('gallery-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const caption  = document.getElementById('modal-caption');

  function openModal(src, cap) {
    modalImg.src = src;
    modalImg.alt = cap || '';
    caption.textContent = cap || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    modalImg.src = '';
  }

  galleryEl.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      openModal(item.dataset.src, item.dataset.caption);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(item.dataset.src, item.dataset.caption);
      }
    });
  });

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* =============================================
   Главная функция — загрузка и рендеринг
   ============================================= */
async function init() {
  let data;

  try {
    const resp = await fetch('content.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    data = await resp.json();
  } catch (err) {
    console.warn('Не удалось загрузить content.json:', err.message);
    // Fallback: попробуем загрузить ещё раз через небольшую задержку
    // (помогает при открытии через file:// в некоторых браузерах)
    try {
      await new Promise(r => setTimeout(r, 300));
      const resp2 = await fetch('./content.json');
      data = await resp2.json();
    } catch (err2) {
      document.getElementById('main').innerHTML = `
        <div style="padding:4rem 2rem;text-align:center;font-family:sans-serif;color:#555">
          <h2 style="margin-bottom:1rem;color:#333">Не удалось загрузить данные</h2>
          <p>Убедитесь, что файл <strong>content.json</strong> находится рядом с <strong>index.html</strong>.</p>
          <p style="margin-top:0.5rem;font-size:0.85rem;color:#888">
            При открытии через <code>file://</code> используйте локальный сервер:<br>
            <code>python -m http.server 8000</code> или Live Server в VS Code.
          </p>
        </div>`;
      return;
    }
  }

  // Рендерим все разделы
  renderHero(data);
  renderAbout(data);
  renderResults(data);
  renderPublications(data);
  renderExams(data);
  renderResearch(data);
  renderMethods(data);
  renderPrograms(data);
  renderGallery(data);
  renderContacts(data);

  // UI
  buildNav();
  setupBurger();
  setupStickyHeader();
  setupBackToTop();

  // Intersection Observer запускаем после рендера
  requestAnimationFrame(() => {
    setupActiveNav();
  });

  // Если в URL есть якорь — скроллим к нему
  if (location.hash) {
    const id = location.hash.slice(1);
    const target = document.getElementById(id);
    if (target) {
      setTimeout(() => {
        const offset = 64;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 200);
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
