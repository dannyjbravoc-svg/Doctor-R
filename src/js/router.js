// src/js/router.js
// Router corregido - sin dependencias circulares

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
  '/doctor/citas/nueva': 'doctor-citas-nueva',
  '/doctor/citas/editar/:id': 'doctor-citas-editar',
  '/doctor/pacientes': 'doctor-pacientes',
  '/doctor/pacientes/:id': 'doctor-paciente-detail',
  '/doctor/pacientes/editar/:id': 'doctor-paciente-editar',
  '/doctor/servicios': 'doctor-servicios',
  '/doctor/monedero': 'doctor-monedero',
  '/doctor/evidencias': 'doctor-evidencias',
  '/doctor/reportes': 'doctor-reportes',
  '/doctor/perfil': 'doctor-perfil',
  '/paciente/registro': 'paciente-registro',
  '/paciente/login': 'paciente-login',
  '/paciente/recuperar': 'paciente-recuperar',
  '/paciente/portal': 'paciente-portal',
  '/paciente/agendar': 'paciente-agendar',
  '/paciente/mis-citas': 'paciente-mis-citas',
  '/paciente/mis-citas/:id': 'paciente-mis-citas-detalle',
  '/paciente/pagos': 'paciente-pagos',
  '/paciente/historial': 'paciente-historial',
  '/paciente/perfil': 'paciente-perfil'
};

let currentRoute = null;
let currentRouteParams = {};

// Función para navegar a una ruta - expuesta globalmente
export function navigate(path) {
  window.history.pushState({}, '', path);
  renderRoute(path);
}

// Función para obtener la ruta actual
export function getCurrentRoute() {
  return currentRoute;
}

// Función para obtener parámetros de la ruta actual
export function getRouteParams() {
  return currentRouteParams;
}

// Inicializar el router
export function initializeRouter() {
  // Manejar la navegación del historial
  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
  });

  // Delegación de eventos para enlaces internos con data-link
  document.addEventListener('click', (e) => {
    // Buscar el enlace más cercano con data-link
    const link = e.target.closest('[data-link]');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) {
        navigate(href);
      }
    }
  });

  // Manejar la primera carga
  renderRoute(window.location.pathname);

  // Debug: confirmar router inicializado
  console.log('Router inicializado correctamente');
}

// Renderizar la ruta actual
function renderRoute(path) {
  const contentArea = document.getElementById('app-content');
  if (!contentArea) {
    console.error('No se encontró el contenedor #app-content');
    return;
  }
  
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
      const routePattern = new RegExp('^' + route.replace(/:\w+/g, '([\\\\w-]+)') + '$');
      const match = path.match(routePattern);

      if (match) {
        routeName = routes[route];
        
        // Extraer parámetros
        const paramNames = route.match(/:([^/]+)/g)?.map(param => param.slice(1)) || [];
        currentRouteParams = {};

        for (let i = 1; i < match.length; i++) {
          if (paramNames[i - 1]) {
            currentRouteParams[paramNames[i - 1]] = match[i];
          }
        }

        break;
      }
    }
  }

  // Cargar la página - usar ruta absoluta para funcionar en Netlify
  fetch(\`/src/pages/\${routeName}.html\`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Página no encontrada');
      }
      return response.text();
    })
    .then(html => {
      contentArea.innerHTML = html;
      currentRoute = routeName;

      // Establecer parámetros de ruta en el contexto global
      window.currentRouteParams = currentRouteParams;

      // Ejecutar scripts inline si los hay
      executeInlineScripts(contentArea);

      updatePageTitle(routeName);
      updateNavigationState();
      initPageComponents(routeName);
    })
    .catch(error => {
      console.error('Error cargando página:', error);
      contentArea.innerHTML = \`
        <div class="container" style="padding: 100px 0; text-align: center;">
          <h2>Página no encontrada</h2>
          <p>La página que estás buscando no existe.</p>
          <a href="/" data-link class="btn btn-primary">Regresar al inicio</a>
        </div>
      \`;
    });
}

// Ejecutar scripts inline en el contenido cargado
function executeInlineScripts(container) {
  const scripts = container.querySelectorAll('script');
  
  // Establecer flag para que document.addEventListener('DOMContentLoaded', ...) funcione en SPAs
  window.isSPALoading = true;
  
  scripts.forEach(script => {
    const newScript = document.createElement('script');
    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
    }
    document.body.appendChild(newScript);
    script.remove();
  });
  
  // Limpiar flag después de ejecutar los scripts (asincrónicamente para dar tiempo a los scripts a ejecutarse)
  setTimeout(() => {
    window.isSPALoading = false;
  }, 100);
}

// Funciones auxiliares
function initPageComponents(routeName) {
  // Emitir evento personalizado para que otros módulos puedan inicializarse
  const event = new CustomEvent('routeChanged', {
    detail: { route: routeName, params: currentRouteParams }
  });
  document.dispatchEvent(event);

  console.log(\`Página cargada: \${routeName}\`);
}

function updatePageTitle(routeName) {
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
}

function updateNavigationState() {
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
}

// Exportar la instancia del router
export const router = {
  navigate,
  getCurrentRoute,
  getRouteParams,
  routes
};
