const preferenceKey = 'py-path.appearance.v1';

function readTheme() {
  try {
    return localStorage.getItem(preferenceKey) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

let theme = readTheme();
function applyTheme() {
  const root = document.documentElement;
  root.dataset.theme = theme;
  const color = getComputedStyle(root).getPropertyValue('--page').trim();
  if (color) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}
applyTheme();

export function mountThemeToggle(button: HTMLButtonElement) {
  const label = button.querySelector('.theme-label')!;
  const updateButton = () => {
    button.setAttribute('aria-pressed', String(theme === 'light'));
    label.textContent = theme === 'light' ? '浅色' : '深色';
  };
  updateButton();
  button.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    updateButton();
    try {
      localStorage.setItem(preferenceKey, theme);
    } catch {
      // The active theme still applies for this page session.
    }
  });
}
