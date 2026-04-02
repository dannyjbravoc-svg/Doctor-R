// src/js/app.js
import { initializeRouter, navigate } from './router.js';
import { initNotifications, showToast } from './notifications.js';
import * as ui from './ui.js';
import * as storage from './storage.js';
import * as currency from './currency.js';

// Exponer funciones globalmente para uso en páginas cargadas dinámicamente
window.showToast = showToast;
window.navigate = navigate;

// Exponer módulos de UI y Storage globalmente para compatibilidad con scripts inline
window.ui = ui;
window.storage = storage;
window.currency = currency;

// Alias para funciones comunes usadas en los partials
window.renderCitas = ui.renderCitas;
window.renderPacientes = ui.renderPacientes;
window.renderServicios = ui.renderServicios;
window.getCitas = storage.getCitas;
window.getPacientes = () => storage.getUsers().filter(u => u.role === 'paciente');
window.getPacienteById = storage.getUserById;
window.getServicioById = storage.getServicioById;
window.formatDual = currency.formatDual;

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
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

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

function initDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
}
