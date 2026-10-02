const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const primaryButton = document.querySelector('.primary-btn');
const secondaryButton = document.querySelector('.secondary-btn');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
  });
}

if (primaryButton) {
  primaryButton.addEventListener('click', () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

if (secondaryButton) {
  secondaryButton.addEventListener('click', () => {
    document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
