// ============================================================
// theme.js — Gestion centralisée du thème clair / sombre
// Inclure ce fichier EN PREMIER dans chaque page HTML
// ============================================================

function applyTheme(isDark) {
  const root = document.documentElement;
  if (isDark) {
    root.style.setProperty('--white',       '#2c3e50');
    root.style.setProperty('--light-gray',  '#34495e');
    root.style.setProperty('--text',        '#ecf0f1');
    root.style.setProperty('--dark-gray',   '#bdc3c7');
    root.style.setProperty('--medium-gray', '#4a6572');
  } else {
    root.style.setProperty('--white',       '#ffffff');
    root.style.setProperty('--light-gray',  '#f8f9fa');
    root.style.setProperty('--text',        '#2c3e50');
    root.style.setProperty('--dark-gray',   '#343a40');
    root.style.setProperty('--medium-gray', '#e9ecef');
  }
}

function loadTheme() {
  const isDark = localStorage.getItem('sotroyDarkTheme') === 'true';
  applyTheme(isDark);
}

// Ré-appliquer le thème quand les paramètres changent (événement global)
window.addEventListener('settingsChanged', loadTheme);

// Appliquer immédiatement au chargement du script
loadTheme();