// Marquer la navigation active
document.addEventListener('DOMContentLoaded', function() {
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
});
