// src/js/router.js
const routes = {
  '/': 'landing',
  '/nosotros': 'nosotros',
  '/contacto': 'contacto',
  '/faq': 'faq',
  '/terminos': 'terminos',
  '/privacidad': 'privacidad',
  '/doctor/login': 'doctor-login',
  '/doctor/dashboard': 'doctor-dashboard',
  '/doctor/citas': 'doctor-citas',
  '/doctor/pacientes': 'doctor-pacientes',
  '/doctor/pacientes/:id': 'doctor-paciente-detail',
  '/doctor/servicios': 'doctor-servicios',
  '/doctor/monedero': 'doctor-monedero',
  '/doctor/evidencias': 'doctor-evidencias',
  '/doctor/reportes': 'doctor-reportes',
  '/doctor/perfil': 'doctor-perfil',
  '/paciente/registro': 'paciente-registro',
  '/paciente/login': 'paciente-login',
  '/paciente/portal': 'paciente-portal',
  '/paciente/agendar': 'paciente-agendar',
  '/paciente/mis-citas': 'paciente-mis-citas',
  '/paciente/mis-citas/:id': 'paciente-mis-citas',
  '/paciente/pagos': 'paciente-pagos',
  '/paciente/historial': 'paciente-historial',
  '/paciente/perfil': 'paciente-perfil'
};

let currentRoute = null;

export const navigate = (path) => {
  window.history.pushState({}, '', path);
  renderRoute(path);
};

export const initializeRouter = () => {
  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
  });
  
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigate(e.target.href);
    }
  });
  
  // Manejar la primera carga
  renderRoute(window.location.pathname);
};

const renderRoute = (path) => {
  const contentArea = document.getElementById('app-content');
  if (!contentArea) return;
  
  // Limpiar y mostrar estado de carga
  contentArea.innerHTML = `
    <div class="container" style="padding: 100px 0; text-align: center;">
      <h2>Cargando...</h2>
      <div class="loading-spinner"></div>
    </div>
  `;
  
  // Determinar la ruta
  let routeName = routes[path] || '404';
  
  // Si es una ruta dinámica
  if (routeName === '404' && path !== '/404') {
    const dynamicRoutes = Object.keys(routes).filter(r => r.includes(':'));
    
    for (const route of dynamicRoutes) {
      const routePattern = new RegExp(`^${route.replace(/:\w+/g, '([\\w-]+)')}$`);
      const match = path.match(routePattern);
      
      if (match) {
        routeName = routes[route];
        break;
      }
    }
  }
  
  // Cargar la página
  fetch(`src/pages/${routeName}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Página no encontrada');
      }
      return response.text();
    })
    .then(html => {
      contentArea.innerHTML = html;
      currentRoute = routeName;
      initPageComponents(routeName);
      updatePageTitle(routeName);
      updateNavigationState();
    })
    .catch(error => {
      contentArea.innerHTML = `
        <div class="container" style="padding: 100px 0; text-align: center;">
          <h2>Página no encontrada</h2>
          <p>La página que estás buscando no existe.</p>
          <a href="/" data-link class="btn btn-primary">Regresar al inicio</a>
        </div>
      `;
    });
};

// Funciones auxiliares
const initPageComponents = (routeName) => {
  // Inicializar componentes específicos según la página
  switch(routeName) {
    case 'doctor-dashboard':
      initDashboard();
      break;
    case 'doctor-monedero':
      initMonedero();
      break;
    case 'doctor-citas':
      initCitas();
      break;
    case 'landing':
      initLandingPage();
      break;
    case 'paciente-registro':
      initPacienteRegistro();
      break;
    case 'paciente-login':
      initPacienteLogin();
      break;
    case 'paciente-portal':
      initPacientePortal();
      break;
    case 'doctor-login':
      initDoctorLogin();
      break;
  }
};

const updatePageTitle = (routeName) => {
  const titles = {
    'landing': 'MediVzla - Sistema Médico Profesional',
    'nosotros': 'Sobre Nosotros - MediVzla',
    'contacto': 'Contáctanos - MediVzla',
    'faq': 'Preguntas Frecuentes - MediVzla',
    'terminos': 'Términos y Condiciones - MediVzla',
    'privacidad': 'Política de Privacidad - MediVzla',
    'doctor-login': 'Iniciar Sesión - Doctor - MediVzla',
    'paciente-registro': 'Registro de Paciente - MediVzla',
    'paciente-login': 'Iniciar Sesión - Paciente - MediVzla',
    'doctor-dashboard': 'Dashboard - MediVzla',
    'doctor-citas': 'Gestión de Citas - MediVzla',
    'doctor-pacientes': 'Pacientes - MediVzla',
    'doctor-paciente-detail': 'Detalle de Paciente - MediVzla',
    'doctor-servicios': 'Servicios - MediVzla',
    'doctor-monedero': 'Monedero - MediVzla',
    'doctor-evidencias': 'Evidencias - MediVzla',
    'doctor-reportes': 'Reportes - MediVzla',
    'doctor-perfil': 'Perfil - MediVzla',
    'paciente-portal': 'Portal del Paciente - MediVzla',
    'paciente-agendar': 'Agendar Cita - MediVzla',
    'paciente-mis-citas': 'Mis Citas - MediVzla',
    'paciente-pagos': 'Pagos - MediVzla',
    'paciente-historial': 'Historial Médico - MediVzla',
    'paciente-perfil': 'Mi Perfil - MediVzla'
  };
  
  document.title = titles[routeName] || 'MediVzla - Sistema Médico Profesional';
};

const updateNavigationState = () => {
  // Actualizar la clase 'active' en el menú de navegación
  const navLinks = document.querySelectorAll('.nav-list a[data-link]');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (window.location.pathname === href) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

// Inicializar el router cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el sistema de enrutamiento
  initializeRouter();
});
