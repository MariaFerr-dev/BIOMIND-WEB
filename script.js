const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

const modal = document.querySelector('.modal');
document.querySelectorAll('.open-modal').forEach((button) => button.addEventListener('click', () => modal.showModal()));
document.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
document.querySelector('.modal form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.innerHTML = '¡Solicitud enviada! <span>✓</span>';
  button.disabled = true;
  setTimeout(() => modal.close(), 1200);
});
