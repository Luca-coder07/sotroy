class WaterStorage {
  constructor() {
    this.storageKey = 'sotroyWaterData';
    this.init();
  }

  // Initialiser les données si elles n'existent pas
  init () {
    if (!this.loadData()) {
      const initialData = {
        userSettings: {
          dailyGoal: 2000,
          unit: 'ml',
          notifications: true,
          reminderInterval: 30
        },
        dailyHistory: {}
      };
      this.saveData(initialData);
    }
  }

  // Charger mes données depuis localStorage
  loadData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      return null;
    }
  }

  // Sauvegarder les données dans localStorage
  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }

  // Ajouter une consommation d'eau
  addWaterConsumption(amount) {
    const data = this.loadData();
    if (!data) return false;

    const today = this.getTodayKey();

    // Initialiser la journée si elle n'existe pas
    if (!data.dailyHistory[today]) {
      data.dailyHistory[today] = {
        total: 0,
        entries: []
      };
    }

    // Ajouter l'entrée
    const entry = {
      time: this.getCurrentTime(),
      amount: amount
    };

    data.dailyHistory[today].entries.push(entry);
    data.dailyHistory[today].total += amount;

    return this.saveData(data);
  }

  // Obtenir les données du jour
  getTodayData() {
    const data = this.loadData();
    const today = this.getTodayKey();

    return data.dailyHistory[today] || {
      total: 0,
      entries: []
    };
  }

  // Obtenir l'objectif quotidien
  getDailyGoal() {
    const data = this.loadData();
    return data ? data.userSettings.dailyGoal : 2000;
  }

  // Mettre à jour l'objectif quotidien
  setDailyGoal(goal) {
    const data = this.loadData();
    if (!data) return false;

    data.userSettings.dailyGoal = goal;
    return this.saveData(data);
  }

  // Obtenir les données de la semaine
  getWeekData() {
    const data = this.loadData();
    const weekData = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = this.formatDate(date);

      weekData[dateKey] = data.dailyHistory[dateKey] || {
        total: 0,
        entries: []
      };
    }

    return weekData;
  }

  // Methodes utilitaires
  getTodayKey() {
    return this.formatDate(new Date());
  }

  getCurrentTime() {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // HH:MM
  }

  formatDate(date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  // Réinitialiser toutes les données
  resetAllData() {
    const settings = this.loadData()?.userSettings;
    const initialData = {
      userSettings: settings || {
        dailyGoal: 2000,
        unit: 'ml',
        notifications: true,
        reminderInterval: 30
      },
      dailyHistory: {}
    };
    return this.saveData(initialData);
  }
}

// Création d'une instance globale
const waterStorage = new WaterStorage();
