// src/js/app.js
import { initializeRouter } from './router.js';
import { initNotifications } from './notifications.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Aplicación inicializada');
  
  // Inicializar el router
  initializeRouter();
  
  // Inicializar otros componentes globales
  initGlobalComponents();
});

function initGlobalComponents() {
  // Configurar notificaciones
  initNotifications();
  
  // Configurar menú responsive
  document.getElementById('menuToggle').addEventListener('click', toggleMenu);
  
  // Configurar modo oscuro
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
  
  // Inicializar modo oscuro
  initDarkMode();
}

function toggleMenu() {
  const nav = document.getElementById('mainNav');
  if (nav) {
    nav.classList.toggle('active');
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

function initNotifications() {
  // Lógica para notificaciones
}

function initDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
}
