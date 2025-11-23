// Charger le thème au démarrage
function loadTheme() {
  const isDark = localStorage.getItem('sotroyDarkTheme') === 'true';
  applyTheme(isDark);
}

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.style.setProperty('--white', '#2c3e50');
    document.documentElement.style.setProperty('--light-gray', '#34495e');
    document.documentElement.style.setProperty('--text', '#ecf0f1');
    document.documentElement.style.setProperty('--dark-gray', '#bdc3c7');
    document.documentElement.style.setProperty('--medium-gray', '#4a6572');
  } else {
    document.documentElement.style.setProperty('--white', '#fffff');
    document.documentElement.style.setProperty('--light-gray', '#f8f9fa');
    document.documentElement.style.setProperty('--text', '#2c3e50');
    document.documentElement.style.setProperty('--dark-gray', '#343a40');
    document.documentElement.style.setProperty('--medium-gray', '#e9ecef');
  }
}

// Écouter les changements de thème
window.addEventListener('settingsChanged', function() {
  const isDark = localStorage.getItem('sotroyDarkTheme') === 'true';
  applyTheme(isDark);
});

// Éléments DOM
const consumedAmount = document.querySelector('.consumed-amount');
const remainingAmount = document.querySelector('.remaining-amount');
const waterFill = document.querySelector('.water-fill');
const waterButtons = document.querySelectorAll('.water-btn');

// Données actuelles
let currentConsumption = 0;
let dailyGoal = 2000;

// Charger les données au démarrage
function loadInitialData() {
  const todayData = waterStorage.getTodayData();
  dailyGoal = waterStorage.getDailyGoal();

  currentConsumption = todayData.total;

  const data = waterStorage.loadData();
  if (data && data.userSettings) {
    currentUnit = data.userSettings.unit || 'ml';
  }

  updateDisplay();
}

// Mettre à jour l'affichage
function updateDisplay() {
  const remaining = dailyGoal - currentConsumption;
  const percentage = (Math.min((currentConsumption / dailyGoal) * 100, 100));

  // Texte
  consumedAmount.textContent = `${currentConsumption}ml`;
  remainingAmount.textContent = `${remaining}ml restant`;

  // Remplissage progressif
  waterFill.style.width = `${percentage}%`;
  waterFill.style.height = `${percentage}%`;

  // Changer couleur si objectif atteint
  if (percentage >= 100) {
    waterFill.style.background = 'var(--success)';
    waterFill.style.animation = 'pulseSuccess 1s ease-in-out';
    setTimeout(() => {
      waterFill.style.animation = '';
    }, 1000);
  } else {
    waterFill.style.background = `linear-gradient(to top,
      var(--primary-blue),
      var(--light-blue))`;
  }
}

// AJouter de l'eau
function addWater(amount) {
  // Sauvegarder dans le storage
  const success = waterStorage.addWaterConsumption(amount);

  if (success) {
    // Metter à jour l'affichage local
    currentConsumption += amount;

    showAddConfirmation(amount);

    // Animation du bouton
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);

    createWaveAnimation();
    updateDisplay();
  } else {
    alert('Erreur lors de la sauvegarde');
  }
}

function showAddConfirmation(amount) {
  const confirmation = document.createElement('div');
  confirmation.className = 'add-confirmation';
  confirmation.textContent = `+${amount}ml 💧!`;
  confirmation.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--success);
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: bold;
    z-index = 12;
    animation: fadeInOut 1.5s ease-in-out;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  `;

  document.body.appendChild(confirmation);

  setTimeout(() => {
    confirmation.remove();
  }, 1500);
}

// Animation de vague dans le cercle
function createWaveAnimation() {
  const wave = document.createElement('div');
  wave.style.cssText = `
    position: absolute;
    top: 6px;
    left: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    background: rgba(52, 152, 219, 0.3);
    border-radius: 50%;
    pointer-events: none;
    z-index: 5;
    animation: waveRipple 0.8s ease-out forwards;
  `;

  document.querySelector('.progress-circle').appendChild(wave);

  setTimeout(() => {
    document.querySelector('.progress-circle').removeChild(wave);
  }, 800);
}

// Événements
waterButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const amount = parseInt(e.target.getAttribute('data-amount'));
    addWater(amount);
  });
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  loadInitialData();
})
