class SettingsManager {
    constructor() {
        this.elements = {
            dailyGoal: document.getElementById('dailyGoal'),
            unitMeasure: document.getElementById('unitMeasure'),
            notificationToggle: document.getElementById('notificationToggle'),
            notificationInterval: document.getElementById('notificationInterval'),
            notificationIntervalContainer: document.getElementById('notificationIntervalContainer'),
            themeToggle: document.getElementById('themeToggle'),
            exportData: document.getElementById('exportData'),
            resetData: document.getElementById('resetData'),
            confirmModal: document.getElementById('confirmModal'),
            modalMessage: document.getElementById('modalMessage'),
            confirmCancel: document.getElementById('confirmCancel'),
            confirmOk: document.getElementById('confirmOk')
        };

        this.init();
    }

    init() {
        this.loadCurrentSettings();
        this.setupEventListeners();
    }

    loadCurrentSettings() {
        const data = waterStorage.loadData();
        if (!data) return;

        const settings = data.userSettings;

        // Objectif quotidien
        this.elements.dailyGoal.value = settings.dailyGoal;

        // Unité de mesure
        this.elements.unitMeasure.value = settings.unit || 'ml';

        // Notifications
        this.elements.notificationToggle.checked = settings.notifications || false;
        this.elements.notificationInterval.value = settings.reminderInterval || 30;
        this.toggleNotificationInterval(settings.notifications);

        // Thème
        this.elements.themeToggle.checked = localStorage.getItem('sotroyDarkTheme') === 'true';
        this.applyTheme(this.elements.themeToggle.checked);
    }

    setupEventListeners() {
        // Sauvegarde automatique des paramètres
        this.elements.dailyGoal.addEventListener('change', () => {
            this.saveDailyGoal();
        });

        this.elements.unitMeasure.addEventListener('change', () => {
            this.saveUnitMeasure();
        });

        this.elements.notificationToggle.addEventListener('change', (e) => {
            this.saveNotificationSettings();
            this.toggleNotificationInterval(e.target.checked);
        });

        this.elements.notificationInterval.addEventListener('change', () => {
            this.saveNotificationSettings();
        });

        this.elements.themeToggle.addEventListener('change', (e) => {
            this.saveTheme(e.target.checked);
        });

        // Boutons d'actions
        this.elements.exportData.addEventListener('click', () => {
            this.exportData();
        });

        this.elements.resetData.addEventListener('click', () => {
            this.showResetConfirmation();
        });

        // Modal de confirmation
        this.elements.confirmCancel.addEventListener('click', () => {
            this.hideModal();
        });

        this.elements.confirmOk.addEventListener('click', () => {
            this.confirmReset();
        });
    }

    saveDailyGoal() {
        const goal = parseInt(this.elements.dailyGoal.value);
        const success = waterStorage.setDailyGoal(goal);
        
        if (success) {
            this.showSuccessMessage('Objectif mis à jour !');
        } else {
            this.showErrorMessage('Erreur lors de la sauvegarde');
        }
    }

    saveUnitMeasure() {
        const data = waterStorage.loadData();
        if (!data) return;

        data.userSettings.unit = this.elements.unitMeasure.value;
        const success = waterStorage.saveData(data);
        
        if (success) {
            this.showSuccessMessage('Unité de mesure mise à jour !');
        } else {
            this.showErrorMessage('Erreur lors de la sauvegarde');
        }
    }

    saveNotificationSettings() {
        const data = waterStorage.loadData();
        if (!data) return;

        data.userSettings.notifications = this.elements.notificationToggle.checked;
        data.userSettings.reminderInterval = parseInt(this.elements.notificationInterval.value);
        
        const success = waterStorage.saveData(data);
        
        if (success) {
            this.showSuccessMessage('Paramètres de notification mis à jour !');
            
            // Démarrer/arrêter les notifications
            if (data.userSettings.notifications) {
                this.startNotifications();
            } else {
                this.stopNotifications();
            }
        } else {
            this.showErrorMessage('Erreur lors de la sauvegarde');
        }
    }

    saveTheme(isDark) {
        localStorage.setItem('sotroyDarkTheme', isDark);
        this.applyTheme(isDark);
        this.showSuccessMessage('Thème mis à jour !');
    }

    applyTheme(isDark) {
        if (isDark) {
            document.documentElement.style.setProperty('--white', '#2c3e50');
            document.documentElement.style.setProperty('--light-gray', '#34495e');
            document.documentElement.style.setProperty('--text', '#ecf0f1');
            document.documentElement.style.setProperty('--dark-gray', '#bdc3c7');
        } else {
            document.documentElement.style.setProperty('--white', '#ffffff');
            document.documentElement.style.setProperty('--light-gray', '#f8f9fa');
            document.documentElement.style.setProperty('--text', '#2c3e50');
            document.documentElement.style.setProperty('--dark-gray', '#343a40');
        }
    }

    toggleNotificationInterval(show) {
        this.elements.notificationIntervalContainer.style.display = show ? 'block' : 'none';
    }

    startNotifications() {
        // À implémenter avec l'API Notifications
        console.log('Notifications démarrées');
    }

    stopNotifications() {
        // À implémenter avec l'API Notifications
        console.log('Notifications arrêtées');
    }

    exportData() {
        const data = waterStorage.loadData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `sotroy-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage('Données exportées !');
    }

    showResetConfirmation() {
        this.elements.modalMessage.textContent = 'Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.';
        this.elements.confirmModal.classList.remove('hidden');
    }

    confirmReset() {
        const success = waterStorage.resetAllData();
        this.hideModal();
        
        if (success) {
            this.showSuccessMessage('Données réinitialisées !');
            this.loadCurrentSettings(); // Recharger les paramètres
        } else {
            this.showErrorMessage('Erreur lors de la réinitialisation');
        }
    }

    hideModal() {
        this.elements.confirmModal.classList.add('hidden');
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Créer un toast message
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
            color: white;
            padding: 12px 20px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
    new SettingsManager();
});

