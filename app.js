const views = [...document.querySelectorAll('.view')];
const viewLinks = [...document.querySelectorAll('[data-view-link]')];
const sidebar = document.querySelector('.sidebar');
const menuButton = document.querySelector('.mobile-menu');
const toast = document.querySelector('.toast');
let toastTimer;

function showView(viewName) {
  const target = document.querySelector(`[data-view="${viewName}"]`) || document.querySelector('[data-view="home"]');
  views.forEach((view) => view.classList.toggle('active-view', view === target));
  viewLinks.forEach((link) => link.classList.toggle('active', link.dataset.viewLink === (target?.dataset.view || 'home')));
  document.title = `${target?.querySelector('h1')?.textContent || 'Etusivu'} | CampusConnect`;
  sidebar.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function handleRoute() {
  showView(window.location.hash.slice(1) || 'home');
}

viewLinks.forEach((link) => link.addEventListener('click', (event) => {
  const viewName = link.dataset.viewLink;
  if (link.tagName === 'BUTTON') event.preventDefault();
  if (window.location.hash.slice(1) !== viewName) window.location.hash = viewName;
  else showView(viewName);
}));

menuButton?.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('[data-action="add-event"]').forEach((button) => button.addEventListener('click', () => notify('Uuden tapahtuman lomake avautuu pian.')));
document.querySelector('[data-action="join-event"]')?.addEventListener('click', (event) => {
  event.currentTarget.textContent = 'Ilmoittautuminen vastaanotettu';
  event.currentTarget.disabled = true;
  notify('Olet ilmoittautunut tapahtumaan.');
});
document.querySelector('[data-action="new-message"]')?.addEventListener('click', () => notify('Uuden viestin luonnos avattu.'));
document.querySelectorAll('.message-item').forEach((item) => item.addEventListener('click', () => {
  document.querySelectorAll('.message-item').forEach((message) => message.classList.remove('active'));
  item.classList.add('active');
  notify(`${item.querySelector('b').textContent} valittu`);
}));

document.querySelector('#global-search')?.addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();
  if (!query) return;
  const match = [...document.querySelectorAll('h2, h3')].find((heading) => heading.textContent.toLowerCase().includes(query));
  if (match) notify(`Löytyi: ${match.textContent}`);
});

window.addEventListener('hashchange', handleRoute);
handleRoute();
