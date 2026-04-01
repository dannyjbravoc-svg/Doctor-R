// src/js/auth.js
import { navigate } from './router.js';

export const login = (email, password, rememberMe) => {
  const users = JSON.parse(localStorage.getItem('medivzla_users') || '[]');
  const user = users.find(u => u.email === email && u.password === btoa(password));
  
  if (user) {
    const token = btoa(`${user.id}:${Date.now()}`);
    const session = {
      token,
      userId: user.id,
      role: user.role,
      expires: rememberMe ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000
    };
    
    localStorage.setItem('medivzla_session', JSON.stringify(session));
    localStorage.setItem('medivzla_user', JSON.stringify(user));
    
    return { success: true, user };
  }
  
  return { success: false, error: 'Credenciales inválidas' };
};

export const logout = () => {
  localStorage.removeItem('medivzla_session');
  localStorage.removeItem('medivzla_user');
  
  // Redirigir según el rol anterior
  if (window.location.pathname.startsWith('/doctor/')) {
    navigate('/doctor/login');
  } else {
    navigate('/paciente/login');
  }
};

export const checkAuth = () => {
  const session = JSON.parse(localStorage.getItem('medivzla_session'));
  if (!session) return false;
  
  if (Date.now() > session.expires) {
    logout();
    return false;
  }
  
  // Renovar sesión si está por expirar
  if (Date.now() > session.expires - 30 * 60 * 1000) {
    session.expires = Date.now() + (session.expires - Date.now() > 30 * 24 * 60 * 60 * 1000 ? 
      30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
    localStorage.setItem('medivzla_session', JSON.stringify(session));
  }
  
  return true;
};

export const getCurrentUser = () => {
  if (!checkAuth()) return null;
  return JSON.parse(localStorage.getItem('medivzla_user'));
};

export const getCurrentRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

// Funciones de guardado de rutas
export const requireAuth = (to, from, next) => {
  if (checkAuth()) {
    next();
  } else {
    if (to.path.startsWith('/doctor/')) {
      next('/doctor/login');
    } else {
      next('/paciente/login');
    }
  }
};

export const requireRole = (role) => (to, from, next) => {
  if (checkAuth()) {
    const user = getCurrentUser();
    if (user.role === role) {
      next();
    } else {
      next(`/${user.role}/dashboard`);
    }
  } else {
    if (to.path.startsWith('/doctor/')) {
      next('/doctor/login');
    } else {
      next('/paciente/login');
    }
  }
};

// Inicializar autenticación
document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación en cada cambio de ruta
  if (typeof window.initializeRouter === 'function') {
    const originalNavigate = window.navigate;
    
    window.navigate = (path) => {
      const route = path;
      const isAuthRoute = route.startsWith('/doctor/') || route.startsWith('/paciente/');
      
      if (isAuthRoute && !checkAuth()) {
        if (route.startsWith('/doctor/')) {
          originalNavigate('/doctor/login');
        } else {
          originalNavigate('/paciente/login');
        }
        return;
      }
      
      originalNavigate(path);
    };
  }
});
