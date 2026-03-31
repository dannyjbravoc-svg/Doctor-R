// src/js/router.js
const routes = {
  '/': 'landing',
  '/nosotros': 'nosotros',
  '/contacto': 'contacto',
  '/faq': 'faq',
  '/terminos': 'terminos',
  '/privacidad': 'privacidad',
  '/doctor/login': 'doctor-login',
  '/paciente/registro': 'paciente-registro',
  '/paciente/login': 'paciente-login',
  // Rutas protegidas - Doctor
  '/doctor/dashboard': 'doctor-dashboard',
  '/doctor/citas': 'doctor-citas',
  '/doctor/citas/:id': 'doctor-citas',
  '/doctor/pacientes': 'doctor-pacientes',
  '/doctor/pacientes/:id': 'doctor-paciente-detail',
  '/doctor/servicios': 'doctor-servicios',
  '/doctor/monedero': 'doctor-monedero',
  '/doctor/evidencias': 'doctor-evidencias',
  '/doctor/evidencias/:id': 'doctor-evidencias',
  '/doctor/reportes': 'doctor-reportes',
  '/doctor/perfil': 'doctor-perfil',
  // Rutas protegidas - Paciente
  '/paciente/portal': 'paciente-portal',
  '/paciente/agendar': 'paciente-agendar',
  '/paciente/mis-citas': 'paciente-mis-citas',
  '/paciente/mis-citas/:id': 'paciente-mis-citas',
  '/paciente/pagos': 'paciente-pagos',
  '/paciente/historial': 'paciente-historial',
  '/paciente/perfil': 'paciente-perfil'
};

// Estado de navegación
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
  
  // Manejar el primer render
  renderRoute(window.location.pathname);
};

const renderRoute = (path) => {
  // Verificar autenticación para rutas protegidas
  const isAuthRoute = path.startsWith('/doctor/') || path.startsWith('/paciente/');
  const isAuthenticated = checkAuth();
  
  // Si es una ruta protegida y no está autenticado, redirigir
  if (isAuthRoute && !isAuthenticated) {
    if (path.startsWith('/doctor/')) {
      navigate('/doctor/login');
    } else {
      navigate('/paciente/login');
    }
    return;
  }
  
  // Si es una ruta de login/registro y está autenticado, redirigir al dashboard
  const isLoginOrRegister = path.includes('login') || path.includes('registro');
  if (isLoginOrRegister && isAuthenticated) {
    const user = getCurrentUser();
    if (user.role === 'doctor') {
      navigate('/doctor/dashboard');
    } else {
      navigate('/paciente/portal');
    }
    return;
  }
  
  // Determinar ruta
  let routeName = routes[path] || '404';
  
  // Si la ruta es dinámica (con parámetros)
  if (routeName === '404' && path !== '/404') {
    // Intentar encontrar una ruta con parámetros
    const dynamicRoutes = Object.keys(routes).filter(r => r.includes(':'));
    
    for (const route of dynamicRoutes) {
      const routePattern = new RegExp(`^${route.replace(/:\w+/g, '([\\w-]+)')}$`);
      const match = path.match(routePattern);
      
      if (match) {
        routeName = routes[route];
        // Guardar parámetros para uso posterior
        const paramNames = route.match(/:([a-z]+)/g).map(p => p.replace(':', ''));
        const params = {};
        
        match.slice(1).forEach((value, index) => {
          params[paramNames[index]] = value;
        });
        
        window.currentRouteParams = params;
        break;
      }
    }
  }
  
  // Cargar contenido
  const contentArea = document.getElementById('app-content');
  if (!contentArea) return;
  
  if (routeName === '404') {
    contentArea.innerHTML = `
      <div class="container" style="padding: 4rem 0; text-align: center;">
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
        <a href="/" class="btn btn-primary" data-link>Regresar al inicio</a>
      </div>
    `;
    return;
  }
  
  // Mostrar estado de carga
  contentArea.innerHTML = `
    <div class="app-loading">
      <div class="loading-spinner"></div>
    </div>
  `;
  
  // Cargar plantilla de página
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
      
      // Inicializar componentes específicos de la página
      initPageComponents(routeName);
      
      // Actualizar el título de la página
      updatePageTitle(routeName);
      
      // Actualizar el estado de la navegación
      updateNavigationState();
    })
    .catch(error => {
      console.error('Error al cargar la página:', error);
      contentArea.innerHTML = `
        <div class="container" style="padding: 4rem 0; text-align: center;">
          <h1>Error al cargar la página</h1>
          <p>Hubo un problema al cargar el contenido. Por favor, intenta de nuevo.</p>
          <a href="/" class="btn btn-primary" data-link>Regresar al inicio</a>
        </div>
      `;
    });
};

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
    case 'doctor-paciente-detail':
      initPacienteDetail();
      break;
    case 'paciente-agendar':
      initAgendarCita();
      break;
    case 'landing':
      initLandingPage();
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
  
  // Actualizar el menú del footer
  const footerLinks = document.querySelectorAll('.footer-links a[data-link]');
  
  footerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (window.location.pathname === href) {
      link.style.fontWeight = '600';
    } else {
      link.style.fontWeight = 'normal';
    }
  });
};

// Inicializar el router cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeRouter);
