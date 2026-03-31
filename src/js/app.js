document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el almacenamiento local con datos de demo
  initStorage();
  
  // Inicializar el sistema de enrutamiento
  initializeRouter();
  
  // Verificar autenticación al cargar
  if (checkAuth()) {
    const user = getCurrentUser();
    showToast(`Bienvenido, ${user.nombre}`, 'success');
  }
  
  // Configurar el botón del menú móvil
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('mainNav').classList.toggle('active');
  });
  
  // Cerrar menú al hacer clic en un enlace
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      document.getElementById('mainNav').classList.remove('active');
    }
  });
  
  // Inicializar la página actual
  if (window.location.pathname === '/') {
    renderRoute('/');
  }
});
