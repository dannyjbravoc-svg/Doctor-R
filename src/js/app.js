// src/js/app.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Aplicación inicializada');
  
  // Inicializar el router
  if (typeof initializeRouter === 'function') {
    initializeRouter();
  }
  
  // Inicializar otros componentes globales
  initGlobalComponents();
});

const initGlobalComponents = () => {
  // Configurar notificaciones
  if (document.querySelector('.toast-container')) {
    initNotifications();
  }
  
  // Configurar menú responsive
  document.getElementById('menuToggle').addEventListener('click', toggleMenu);
  
  // Configurar modo oscuro
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
};

const toggleMenu = () => {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('active');
};

const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
};

const initNotifications = () => {
  // Lógica para notificaciones
};

const initDarkMode = () => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
};

// Inicializar el sistema
document.addEventListener('DOMContentLoaded', () => {
  initGlobalComponents();
});
