// src/js/ui.js
// Funciones de UI - Sin dependencias circulares
import { getTasaCambio, formatDual, setTasaCambio } from './currency.js';

// showToast se inyecta globalmente desde app.js
const showToast = (message, type, duration) => {
  if (typeof window.showToast === 'function') {
    window.showToast(message, type, duration);
  } else {
    console.log(`Toast: [${type}] ${message}`);
  }
};

// navigate se inyecta globalmente desde app.js
const navigate = (path) => {
  if (typeof window.navigate === 'function') {
    window.navigate(path);
  } else {
    window.location.href = path;
  }
};

export const renderCitas = (citas) => {
  const citasContainer = document.querySelector('.citas-list');
  if (!citasContainer) return;

  if (citas.length === 0) {
    citasContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <h3 class="empty-state-title">No hay citas programadas</h3>
        <p class="empty-state-description">Aún no tienes citas programadas. ¡Agenda tu primera cita!</p>
        <a href="/doctor/citas/nueva" data-link class="btn btn-primary">Agendar Cita</a>
      </div>
    `;
    return;
  }
  
  let html = '';
  citas.forEach(cita => {
    const paciente = getPacienteById(cita.pacienteId);
    const servicio = getServicioById(cita.servicioId);

    html += `
      <div class="appointment-item" data-id="${cita.id}">
        <div class="appointment-time">${cita.hora}</div>
        <div class="appointment-details">
          <h3>${paciente ? paciente.nombre : 'Paciente desconocido'}</h3>
          <p>${servicio ? servicio.nombre : 'Servicio desconocido'}</p>
          <span class="appointment-status status-${cita.estado}">${formatStatus(cita.estado)}</span>
        </div>
        <div class="appointment-actions">
          <button class="btn btn-icon view-cita" data-id="${cita.id}">👁️</button>
          <button class="btn btn-icon edit-cita" data-id="${cita.id}">📝</button>
          <button class="btn btn-icon delete-cita" data-id="${cita.id}">🗑️</button>
        </div>
      </div>
    `;
  });

  citasContainer.innerHTML = html;

  // Configurar eventos
  document.querySelectorAll('.view-cita').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const citaId = e.target.closest('button').dataset.id;
      viewCitaDetails(citaId);
    });
  });

  document.querySelectorAll('.edit-cita').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const citaId = e.target.closest('button').dataset.id;
      editCita(citaId);
    });
  });

  document.querySelectorAll('.delete-cita').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const citaId = e.target.closest('button').dataset.id;
      deleteCita(citaId);
    });
  });
};

export const renderPacientes = (pacientes) => {
  const pacientesContainer = document.querySelector('.pacientes-list');
  if (!pacientesContainer) return;

  if (pacientes.length === 0) {
    pacientesContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👥</div>
        <h3 class="empty-state-title">No hay pacientes registrados</h3>
        <p class="empty-state-description">Aún no has agregado pacientes a tu sistema.</p>
        <a href="/doctor/pacientes/nuevo" data-link class="btn btn-primary">Agregar Paciente</a>
      </div>
    `;
    return;
  }

  let html = '';
  pacientes.forEach(paciente => {
    html += `
      <div class="patient-card" data-id="${paciente.id}">
        <div class="patient-avatar">
          ${getInitials(paciente.nombre)}
        </div>
        <div class="patient-info">
          <h3 class="patient-name">${paciente.nombre}</h3>
          <p class="patient-id">${paciente.cedula}</p>
        </div>
        <div class="patient-actions">
          <button class="btn btn-icon view-paciente" data-id="${paciente.id}">👁️</button>
        </div>
      </div>
    `;
  });

  pacientesContainer.innerHTML = html;

  // Configurar eventos
  document.querySelectorAll('.view-paciente').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pacienteId = e.target.closest('button').dataset.id;
      navigate(`/doctor/pacientes/${pacienteId}`);
    });
  });
};

export const renderServicios = (servicios) => {
  const serviciosContainer = document.querySelector('.servicios-grid');
  if (!serviciosContainer) return;

  if (servicios.length === 0) {
    serviciosContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛠️</div>
        <h3 class="empty-state-title">No hay servicios configurados</h3>
        <p class="empty-state-description">Aún no has agregado servicios a tu sistema.</p>
        <a href="/doctor/servicios/nuevo" data-link class="btn btn-primary">Agregar Servicio</a>
      </div>
    `;
    return;
  }

  let html = '';
  servicios.forEach(servicio => {
    html += `
      <div class="service-card" data-id="${servicio.id}">
        <div class="service-header">
          <h3>${servicio.nombre}</h3>
          <span class="service-price currency-display" data-usd="${servicio.precioUSD}">${formatDual(servicio.precioUSD)}</span>
        </div>
        <p>${servicio.descripcion}</p>
        <div class="service-meta">
          <span class="service-duration">${servicio.duracion} min</span>
          ${servicio.preparacionRequerida ? '<span class="service-requirement">Preparación requerida</span>' : ''}
        </div>
        <div class="service-actions">
          <button class="btn btn-outline edit-service" data-id="${servicio.id}">Editar</button>
          <button class="btn ${servicio.activo ? 'btn-danger' : 'btn-secondary'} toggle-service" data-id="${servicio.id}">
            ${servicio.activo ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    `;
  });

  serviciosContainer.innerHTML = html;

  // Configurar eventos
  document.querySelectorAll('.edit-service').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const servicioId = e.target.closest('button').dataset.id;
      editServicio(servicioId);
    });
  });

  document.querySelectorAll('.toggle-service').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const servicioId = e.target.closest('button').dataset.id;
      toggleServicio(servicioId);
    });
  });
};

export const renderMonedero = () => {
  const monederoContainer = document.querySelector('.monedero-container');
  if (!monederoContainer) return;

  const tasa = getTasaCambio();
  const fecha = new Date();

  monederoContainer.innerHTML = `
    <div class="monedero-header">
      <h2>Configuración de Tasa de Cambio</h2>
      <p>Actualiza la tasa de conversión entre USD y Bs</p>
    </div>
    
    <div class="monedero-current">
      <h3>Tasa Actual</h3>
      <div class="tasa-value">1 USD = Bs ${tasa.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <p class="tasa-date">Última actualización: ${fecha.toLocaleDateString('es-VE')}</p>
    </div>

    <div class="monedero-form">
      <div class="form-group">
        <label for="tasa-cambio">Nueva Tasa USD → Bs</label>
        <input type="number" id="tasa-cambio" step="0.01" min="0.01" value="${tasa}" required>
        <div class="error-message" id="tasa-error"></div>
      </div>

      <button type="submit" class="btn btn-primary" id="update-tasa">Actualizar Tasa</button>
    </div>

    <div class="monedero-historial">
      <h3>Historial de Tasas</h3>
      <table class="history-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tasa (Bs/USD)</th>
          </tr>
        </thead>
        <tbody>
          ${renderHistorialTasas()}
        </tbody>
      </table>
    </div>
  `;

  // Configurar evento de actualización
  const updateBtn = document.getElementById('update-tasa');
  if (updateBtn) {
    updateBtn.addEventListener('click', updateTasa);
  }
};

const renderHistorialTasas = () => {
  const config = JSON.parse(localStorage.getItem('medivzla_config') || '{}');
  const historial = config.historialTasas || [];

  if (historial.length === 0) {
    return `
      <tr>
        <td colspan="2" style="text-align: center; padding: var(--space-4);">No hay historial de tasas</td>
      </tr>
    `;
  }

  return historial.slice(-5).reverse().map(entry => {
    const date = new Date(entry.fecha);
    return `
      <tr>
        <td>${date.toLocaleDateString('es-VE')} ${date.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</td>
        <td>${entry.tasa.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
    `;
  }).join('');
};

const updateTasa = () => {
  const tasaInput = document.getElementById('tasa-cambio');
  const errorElement = document.getElementById('tasa-error');

  const nuevaTasa = parseFloat(tasaInput.value);
  if (isNaN(nuevaTasa) || nuevaTasa <= 0) {
    errorElement.textContent = 'La tasa debe ser un número positivo';
    errorElement.classList.add('active');
    return;
  }

  errorElement.classList.remove('active');

  try {
    setTasaCambio(nuevaTasa);
    showToast('Tasa de cambio actualizada correctamente', 'success');
    renderMonedero();
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.add('active');
  }
};

const getPacienteById = (id) => {
  const users = JSON.parse(localStorage.getItem('medivzla_users') || '[]');
  return users.find(u => u.id === id && u.role === 'paciente');
};

const getServicioById = (id) => {
  const servicios = JSON.parse(localStorage.getItem('medivzla_servicios') || '[]');
  return servicios.find(s => s.id === id);
};

const formatStatus = (status) => {
  const statuses = {
    'pendiente': 'Pendiente',
    'confirmada': 'Confirmada',
    'completada': 'Completada',
    'cancelada': 'Cancelada',
    'reprogramada': 'Reprogramada'
  };

  return statuses[status] || status;
};

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const viewCitaDetails = (citaId) => {
  navigate(`/doctor/citas/${citaId}`);
};

const editCita = (citaId) => {
  navigate(`/doctor/citas/editar/${citaId}`);
};

const deleteCita = (citaId) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
    // Lógica para eliminar cita
    showToast('Cita eliminada correctamente', 'success');
    renderCitas(getCitas());
  }
};

const editServicio = (servicioId) => {
  navigate(`/doctor/servicios/editar/${servicioId}`);
};

const toggleServicio = (servicioId) => {
  // Lógica para alternar estado del servicio
  showToast('Estado del servicio actualizado', 'success');
  renderServicios(getServicios());
};

const getCitas = () => {
  return JSON.parse(localStorage.getItem('medivzla_citas') || '[]');
};

const getServicios = () => {
  return JSON.parse(localStorage.getItem('medivzla_servicios') || '[]');
};

// Funciones de inicialización
export const initDashboard = () => {
  renderCitas(getCitas().slice(0, 3));
  renderPacientes(getPacientes().slice(0, 5));
  renderServicios(getServicios().slice(0, 4));
};

export const initCitas = () => {
  renderCitas(getCitas());
};

export const initPacientes = () => {
  renderPacientes(getPacientes());
};

export const initMonedero = () => {
  renderMonedero();
};

export const initPacienteDetail = (params) => {
  if (!params || !params.id) {
    navigate('/doctor/pacientes');
    return;
  }

  const paciente = getPacienteById(params.id);
  if (!paciente) {
    navigate('/doctor/pacientes');
    return;
  }

  renderPacienteDetail(paciente);
};

const renderPacienteDetail = (paciente) => {
  const detailContainer = document.querySelector('.paciente-detail');
  if (!detailContainer) return;

  detailContainer.innerHTML = `
    <div class="paciente-header">
      <div class="paciente-avatar">${getInitials(paciente.nombre)}</div>
      <h2>${paciente.nombre}</h2>
      <p>${paciente.cedula}</p>
    </div>

    <div class="paciente-tabs">
      <div class="tab active" data-tab="general">Información General</div>
      <div class="tab" data-tab="historial">Historial Médico</div>
      <div class="tab" data-tab="citas">Citas</div>
      <div class="tab" data-tab="evidencias">Evidencias</div>
    </div>

    <div class="tab-content active" data-tab="general">
      <div class="grid grid-2">
        <div>
          <h3>Datos Personales</h3>
          <ul class="info-list">
            <li><strong>Fecha de Nacimiento:</strong> ${formatDate(paciente.fechaNacimiento)}</li>
            <li><strong>Edad:</strong> ${calculateAge(paciente.fechaNacimiento)}</li>
            <li><strong>Teléfono:</strong> ${paciente.telefono}</li>
            <li><strong>Email:</strong> ${paciente.email}</li>
          </ul>
        </div>
        <div>
          <h3>Dirección</h3>
          <ul class="info-list">
            <li><strong>Estado:</strong> ${paciente.direccion.estado}</li>
            <li><strong>Ciudad:</strong> ${paciente.direccion.ciudad}</li>
            <li><strong>Zona:</strong> ${paciente.direccion.zona}</li>
            <li><strong>Calle:</strong> ${paciente.direccion.calle}</li>
          </ul>
        </div>
      </div>

      <div class="grid grid-2">
        <div>
          <h3>Contacto de Emergencia</h3>
          <ul class="info-list">
            <li><strong>Nombre:</strong> ${paciente.contactoEmergencia.nombre}</li>
            <li><strong>Relación:</strong> ${paciente.contactoEmergencia.relacion}</li>
            <li><strong>Teléfono:</strong> ${paciente.contactoEmergencia.telefono}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="tab-content" data-tab="historial">
      <h3>Condiciones Crónicas</h3>
      <div class="conditions-grid">
        ${paciente.historialMedico.condicionesCronicas.map(condicion =>
          `<span class="condition-tag">${condicion}</span>`
        ).join('')}
      </div>

      <div class="grid grid-2" style="margin-top: var(--space-4);">
        <div>
          <h3>Alergias</h3>
          <p>${paciente.historialMedico.alergias || 'Ninguna conocida'}</p>
        </div>
        <div>
          <h3>Medicamentos Actuales</h3>
          <p>${paciente.historialMedico.medicamentos || 'Ninguno'}</p>
        </div>
      </div>
    </div>

    <div class="tab-content" data-tab="citas">
      <h3>Historial de Citas</h3>
      <div class="history-timeline">
        ${renderCitasTimeline(paciente.id)}
      </div>
    </div>

    <div class="tab-content" data-tab="evidencias">
      <h3>Evidencias Médicas</h3>
      <div class="evidencias-grid">
        ${renderEvidencias(paciente.id)}
      </div>
    </div>
  `;

  // Configurar tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active');
    });
  });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-VE');
};

const calculateAge = (dateString) => {
  if (!dateString) return '';
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const renderCitasTimeline = (pacienteId) => {
  const citas = getCitas().filter(c => c.pacienteId === pacienteId);
  if (citas.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <h3 class="empty-state-title">No hay citas programadas</h3>
        <p class="empty-state-description">Este paciente no tiene citas registradas.</p>
      </div>
    `;
  }
  
  return citas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(cita => {
    const servicio = getServicioById(cita.servicioId);
    const date = new Date(cita.fecha);

    return `
      <div class="timeline-event">
        <div class="timeline-date">${date.toLocaleDateString('es-VE')}</div>
        <div class="timeline-content">
          <h4>${servicio ? servicio.nombre : 'Servicio desconocido'}</h4>
          <p>${cita.motivo}</p>
          <span class="appointment-status status-${cita.estado}">${formatStatus(cita.estado)}</span>
        </div>
      </div>
    `;
  }).join('');
};

const renderEvidencias = (pacienteId) => {
  const evidencias = getEvidenciasByPaciente(pacienteId);
  if (evidencias.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📷</div>
        <h3 class="empty-state-title">No hay evidencias médicas</h3>
        <p class="empty-state-description">Este paciente no tiene evidencias médicas registradas.</p>
      </div>
    `;
  }

  return evidencias.map(evidencia => {
    return `
      <div class="evidencia-card">
        <div class="evidencia-image">
          <div style="height: 200px; background: var(--color-gray-100); display: flex; align-items: center; justify-content: center;">
            <span>Evidencia Médica</span>
          </div>
        </div>
        <div class="evidencia-details">
          <h4>${evidencia.tipo}</h4>
          <p>${evidencia.descripcion}</p>
          <small>${new Date(evidencia.fechaCaptura).toLocaleDateString('es-VE')}</small>
        </div>
      </div>
    `;
  }).join('');
};

const getEvidenciasByPaciente = (pacienteId) => {
  const evidencias = JSON.parse(localStorage.getItem('medivzla_evidencias_meta') || '[]');
  return evidencias.filter(e => e.pacienteId === pacienteId);
};

const getPacientes = () => {
  const users = JSON.parse(localStorage.getItem('medivzla_users') || '[]');
  return users.filter(u => u.role === 'paciente');
};

// Escuchar cambios de ruta para reinicializar la UI
document.addEventListener('routeChanged', (e) => {
  const { route, params } = e.detail;
  
  if (route === 'doctor-dashboard') {
    initDashboard();
  } else if (route === 'doctor-citas') {
    initCitas();
  } else if (route === 'doctor-pacientes') {
    initPacientes();
  } else if (route === 'doctor-paciente-detail') {
    initPacienteDetail(params);
  } else if (route === 'doctor-monedero') {
    initMonedero();
  }
});

// Inicializar UI cuando el DOM esté listo (para la primera carga)
document.addEventListener('DOMContentLoaded', () => {
  // El router disparará routeChanged en la primera carga, 
  // pero por si acaso manejamos el estado inicial aquí también.
  const path = window.location.pathname;
  // (La lógica de inicialización ya está cubierta por el evento routeChanged que dispara el router)
});

