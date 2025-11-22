class ChartsManager {
  constructor () {
    this.dailyBars = document.getElementById('dailyBars');
    this.weeklyBars = document.getElementById('weeklyBars');
    this.todayEntries = document.getElementById('todayEntries');
    this.tabs = document.querySelectorAll('.tab');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadDailyData();
  }

  setupEventListeners() {
    // Gestion des onglets
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });
  }

  switchTab(tabName) {
    // Mettre à jour les onglets actifs
    this.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Afficher le bon graphique
    document.getElementById('dailyChart').classList.toggle('hidden', tabName !== 'daily');
    document.getElementById('weeklyChart').classList.toggle('hidden', tabName !== 'weekly');

    // Charger les données
    if (tabName === 'daily') {
      this.loadDailyData();
    } else {
      this.loadWeeklyData();
    }
  }

  loadDailyData() {
    const todayData = waterStorage.getTodayData();
    this.renderDailyChart(todayData);
    this.renderTodayEntries(todayData.entries);
  }

  loadWeeklyData() {
    const weekData = waterStorage.getWeekData();
    this.renderWeeklyChart(weekData);
  }

  renderDailyChart(todayData) {
    const goal = waterStorage.getDailyGoal();
    const percentage = Math.min((todayData.total / goal) * 100, 100);

    // Créer des barres pour chaque heure
    this.dailyBars.innerHTML = `
      <div class="chart-bar-container">
        <div class="chart-bar" style="height: ${percentage}%">
          <span class="chart-value">${todayData.total}ml</span>
        </div>
        <span class="chart-label">Aujourd'hui</span>
      </div>
    `;
  }

  renderWeeklyChart(weekData) {
    const goal = waterStorage.getDailyGoal();
    let barsHTML = '';

    Object.entries(weekData).forEach(([date, dayData]) => {
      const percentage = Math.min((dayData.total / goal) * 100, 100);
      const dayName = this.getDayName(date);

      barsHTML += `
        <div class="chart-bar-container">
          <div class="chart-bar" style="height: ${percentage}%">
            <span class="chart-value">${dayData.total}ml</span>
          </div>
          <span class="chart-label">${dayName}</span>
        </div>
      `;
    });

    this.weeklyBars.innerHTML = barsHTML;
  }

  renderTodayEntries(entries) {
    if (entries.length === 0) {
      this.todayEntries.innerHTML = `
        <div class="empty-state">
          <p>Aucune consommation enregistrée aujourd'hui</p>
        </div>
      `;
      return;
    }

    let entriesHTML = '';

    entries.forEach(entry => {
      entriesHTML += `
        <div class="entry-item">
          <span class="entry-time">${entry.time}</span>
          <span class="entry-amount">${entry.amount}ml</span>
        </div>
      `;
    });

    this.todayEntries.innerHTML = entriesHTML;
  }

  getDayName(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Auj';
    if (date.toDateString() === yesterday.toDateString()) return 'Hier';

    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[date.getDay()];
  }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
  new ChartsManager();
});
