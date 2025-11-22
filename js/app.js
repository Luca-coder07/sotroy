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
  updateDisplay();
}

// Mettre à jour l'affichage
function updateDisplay() {
  const remaining = dailyGoal - currentConsumption;
  const percentage = Math.min((currentConsumption / dailyGoal) * 100, 100);

  // Texte
  consumedAmount.textContent = `${currentConsumption}ml`;
  remainingAmount.textContent = `${remaining}ml restant`;

  // Remplissage progressif
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
  loadInitialData();
})
