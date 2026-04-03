// src/js/app.js
import { initializeRouter, navigate } from './router.js';
import { initNotifications, showToast } from './notifications.js';
import { getCurrentUser, checkAuth, logout } from './auth.js';
import * as ui from './ui.js';
import * as storage from './storage.js';
import * as currency from './currency.js';

// Exponer funciones globalmente para uso en páginas cargadas dinámicamente
window.showToast = showToast;
window.navigate = navigate;
window.logout = logout;

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
  
  // Actualizar navegación inicial
  updateNavigation();
});

// Escuchar cambios de ruta para actualizar la navegación
document.addEventListener('routeChanged', () => {
  updateNavigation();
});

// Escuchar cambios en la tasa de cambio para actualizar toda la UI
window.addEventListener('currencyUpdated', () => {
  if (typeof currency.updateCurrencyDisplay === 'function') {
    currency.updateCurrencyDisplay();
  }
});

function updateNavigation() {
  const authLink = document.getElementById('authLink');
  const navList = document.getElementById('navList');
  if (!navList) return;

  const user = getCurrentUser();
  const isAuthenticated = checkAuth();

  // Limpiar links dinámicos previos (mantener los 3 primeros: Nosotros, Contacto, FAQ)
  const links = navList.querySelectorAll('li');
  links.forEach((li, index) => {
    if (index > 2 && li.id !== 'authLink') {
      li.remove();
    }
  });

  if (isAuthenticated && user) {
    // Cambiar botón Ingresar por Cerrar Sesión
    if (authLink) {
      authLink.innerHTML = `<button onclick="logout()" class="btn btn-outline">Cerrar Sesión</button>`;
    }

    // Agregar links según el rol
    if (user.role === 'doctor') {
      const dashboardLink = document.createElement('li');
      dashboardLink.innerHTML = `<a href="/doctor/dashboard" data-link>Dashboard</a>`;
      navList.insertBefore(dashboardLink, authLink);

      const pacientesLink = document.createElement('li');
      pacientesLink.innerHTML = `<a href="/doctor/pacientes" data-link>Pacientes</a>`;
      navList.insertBefore(pacientesLink, authLink);

      const serviciosLink = document.createElement('li');
      serviciosLink.innerHTML = `<a href="/doctor/servicios" data-link>Servicios</a>`;
      navList.insertBefore(serviciosLink, authLink);
    } else if (user.role === 'paciente') {
      const portalLink = document.createElement('li');
      portalLink.innerHTML = `<a href="/paciente/portal" data-link>Mi Portal</a>`;
      navList.insertBefore(portalLink, authLink);
    }
  } else {
    // Restaurar botón Ingresar
    if (authLink) {
      authLink.innerHTML = `<a href="/doctor/login" data-link class="btn btn-outline">Ingresar</a>`;
    }
  }
}

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
