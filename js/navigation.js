// Marquer la navigation active
document.addEventListener('DOMCOntentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const link = item.getAttribute('href');
    if (link == currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Application du thème au chargement 
  function applyGlobalTheme() {
    const isDark = localStorage.getItem('sotroyDarkTheme') === 'true';

    if (isDark) {
      document.documentElement.style.setProperty('--white', '#2c3e50');
      document.documentElement.style.setProperty('--light-gray', '#34495e');
      document.documentElement.style.setProperty('--text', '#ecf0f1');
      document.documentElement.style.setProperty('--dark-gray', '#bdc3c7');
      document.documentElement.style.setProperty('--medium-gray', '4a6572');
    } else {
      document.documentElement.style.setProperty('--white', '#ffffff');
      document.documentElement.style.setProperty('--light-gray', '#f8f9fa');
      document.documentElement.style.setProperty('--text', '#2c3e50');
      document.documentElement.style.setProperty('--dark-gray', '#343a40');
      document.documentElement.style.setProperty('--medium-gray', '#e9ecef');
    }
  }

  applyGlobalTheme();

  window.addEventListener('settingsChanged', applyGlobalTheme);
});
