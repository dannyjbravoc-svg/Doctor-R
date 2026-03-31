// src/js/notifications.js
const NOTIFICATIONS_KEY = 'medivzla_notifications';
const NOTIFICATION_TYPES = {
  ALERT: 'alert',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

export const showNotification = (title, message, type = NOTIFICATION_TYPES.INFO, duration = 5000) => {
  const notification = {
    id: generateNotificationId(),
    title,
    message,
    type,
    timestamp: Date.now(),
    read: false
  };
  
  saveNotification(notification);
  renderNotification(notification);
  
  // Auto-ocultar después de duration ms
  if (duration > 0) {
    setTimeout(() => {
      hideNotification(notification.id);
    }, duration);
  }
  
  return notification.id;
};

export const hideNotification = (id) => {
  const notificationElement = document.querySelector(`.notification[data-id="${id}"]`);
  if (notificationElement) {
    notificationElement.style.opacity = '0';
    setTimeout(() => {
      notificationElement.remove();
    }, 300);
  }
};

export const markAsRead = (id) => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === id);
  
  if (index !== -1) {
    notifications[index].read = true;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    
    const notificationElement = document.querySelector(`.notification[data-id="${id}"]`);
    if (notificationElement) {
      notificationElement.classList.add('read');
    }
  }
};

export const clearNotifications = () => {
  localStorage.removeItem(NOTIFICATIONS_KEY);
  const container = document.querySelector('.notifications-container');
  if (container) {
    container.innerHTML = '';
  }
};

export const getNotifications = () => {
  return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
};

export const getUnreadNotifications = () => {
  return getNotifications().filter(n => !n.read);
};

export const initNotifications = () => {
  const container = document.querySelector('.notifications-container');
  if (container) {
    renderAllNotifications();
    
    // Configurar botón de limpiar
    const clearButton = document.querySelector('.clear-notifications');
    if (clearButton) {
      clearButton.addEventListener('click', clearNotifications);
    }
  }
};

const generateNotificationId = () => {
  return `notif_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const saveNotification = (notification) => {
  const notifications = getNotifications();
  notifications.unshift(notification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

const renderNotification = (notification) => {
  const container = document.querySelector('.notifications-container');
  if (!container) return;
  
  const notificationElement = document.createElement('div');
  notificationElement.className = `notification ${notification.type} ${notification.read ? 'read' : ''}`;
  notificationElement.setAttribute('data-id', notification.id);
  
  notificationElement.innerHTML = `
    <div class="notification-header">
      <h3>${notification.title}</h3>
      <span class="notification-time">${formatTimeAgo(notification.timestamp)}</span>
    </div>
    <p>${notification.message}</p>
    <button class="notification-close">&times;</button>
  `;
  
  container.appendChild(notificationElement);
  
  // Configurar eventos
  notificationElement.querySelector('.notification-close').addEventListener('click', () => {
    hideNotification(notification.id);
    markAsRead(notification.id);
  });
  
  notificationElement.addEventListener('click', () => {
    markAsRead(notification.id);
  });
};

const renderAllNotifications = () => {
  const container = document.querySelector('.notifications-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  const notifications = getNotifications();
  notifications.forEach(notification => {
    renderNotification(notification);
  });
};

const formatTimeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) {
    return 'Hace unos segundos';
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  } else {
    return new Date(timestamp).toLocaleDateString('es-VE');
  }
};

// Inicializar notificaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Mostrar notificaciones de bienvenida para demo
  if (checkAuth()) {
    const user = getCurrentUser();
    if (user) {
      showNotification('Bienvenido', `Hola ${user.nombre}, ¡bienvenido de vuelta!`, NOTIFICATION_TYPES.SUCCESS, 3000);
    }
  }
  
  initNotifications();
});
