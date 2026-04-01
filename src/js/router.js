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

// Función para navegar a una ruta
function navigate(path) {
  history.pushState({}, '', path);
  renderRoute(path);
}

// Inicializar el router
function initializeRouter() {
  // Manejar la navegación del historial
  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
  });
  
  // Manejar los clics en enlaces internos
  document.addEventListener('click', (e) => {
    // Solo procesar si es un enlace interno con data-link
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigate(e.target.href);
    }
  });
  
  // Manejar la primera carga
  renderRoute(window.location.pathname);
}

// Renderizar la ruta actual
function renderRoute(path) {
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
}

// Funciones auxiliares
function initPageComponents(routeName) {
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

// Funciones para las páginas
function initDashboard() {
  console.log('Dashboard initialized');
  // Lógica específica para dashboard
  if (document.querySelector('.dashboard-container')) {
    renderCitas();
    renderPacientes();
    renderServicios();
  }
}

function initCitas() {
  console.log('Citas page initialized');
  // Lógica específica para citas
  if (document.querySelector('.citas-list')) {
    renderCitas();
  }
}

function initMonedero() {
  console.log('Monedero page initialized');
  // Lógica específica para monedero
  if (document.querySelector('.monedero-container')) {
    renderMonedero();
  }
}

function initLandingPage() {
  console.log('Landing page initialized');
}

function initPacienteRegistro() {
  console.log('Paciente registro initialized');
  if (document.querySelector('.registration-steps')) {
    renderSintomas();
    renderEnfermedades();
  }
}

function initPacienteLogin() {
  console.log('Paciente login initialized');
  const loginForm = document.getElementById('paciente-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Validar campos
      let isValid = true;
      const emailError = document.getElementById('email-error');
      const passwordError = document.getElementById('password-error');
      
      emailError.textContent = '';
      passwordError.textContent = '';
      
      if (!email) {
        emailError.textContent = 'El correo es obligatorio';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        emailError.textContent = 'Formato de correo inválido';
        isValid = false;
      }
      
      if (!password) {
        passwordError.textContent = 'La contraseña es obligatoria';
        isValid = false;
      } else if (password.length < 6) {
        passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Intentar login
      const result = login(email, password, false);
      
      if (result.success) {
        showToast('Inicio de sesión exitoso', 'success');
        // Redirigir al portal después de un breve retraso
        setTimeout(() => {
          navigate('/paciente/portal');
        }, 1000);
      } else {
        showToast(result.error, 'error');
      }
    });
  }
}

function initPacientePortal() {
  console.log('Paciente portal initialized');
  if (document.querySelector('.dashboard-container')) {
    // Renderizar datos del paciente
    renderPacientePortal();
  }
}

function initDoctorLogin() {
  console.log('Doctor login initialized');
  const loginForm = document.getElementById('doctor-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Validar campos
      let isValid = true;
      const emailError = document.getElementById('email-error');
      const passwordError = document.getElementById('password-error');
      
      emailError.textContent = '';
      passwordError.textContent = '';
      
      if (!email) {
        emailError.textContent = 'El correo es obligatorio';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        emailError.textContent = 'Formato de correo inválido';
        isValid = false;
      }
      
      if (!password) {
        passwordError.textContent = 'La contraseña es obligatoria';
        isValid = false;
      } else if (password.length < 6) {
        passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Intentar login
      const result = login(email, password, false);
      
      if (result.success) {
        showToast('Inicio de sesión exitoso', 'success');
        // Redirigir al dashboard después de un breve retraso
        setTimeout(() => {
          navigate('/doctor/dashboard');
        }, 1000);
      } else {
        showToast(result.error, 'error');
      }
    });
  }
}

// Inicializar el router cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el sistema de enrutamiento
  if (typeof initializeRouter === 'function') {
    initializeRouter();
  }
  
  // Configurar menú responsive
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.getElementById('mainNav').classList.toggle('active');
    });
  }
  
  // Configurar modo oscuro
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    // Aplicar modo oscuro si está guardado
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }
});

// Exportar funciones para uso global
window.navigate = navigate;
window.initializeRouter = initializeRouter;
