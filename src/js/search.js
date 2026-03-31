// src/js/search.js
export const initSearch = () => {
  const searchInput = document.querySelector('.search-input');
  const searchContainer = document.querySelector('.search-container');
  const searchResults = document.querySelector('.search-results');
  
  if (!searchInput || !searchContainer || !searchResults) return;
  
  let currentTimeout;
  
  searchInput.addEventListener('input', () => {
    clearTimeout(currentTimeout);
    
    if (searchInput.value.length < 2) {
      searchContainer.classList.remove('active');
      return;
    }
    
    currentTimeout = setTimeout(() => {
      performSearch(searchInput.value);
    }, 300);
  });
  
  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) {
      searchContainer.classList.remove('active');
    }
  });
};

const performSearch = (query) => {
  const results = searchInAllData(query);
  displaySearchResults(results);
};

const searchInAllData = (query) => {
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  // Buscar en pacientes
  const pacientes = JSON.parse(localStorage.getItem('medivzla_users') || '[]')
    .filter(u => u.role === 'paciente');
  
  pacientes.forEach(paciente => {
    if (
      paciente.nombre.toLowerCase().includes(lowerQuery) ||
      paciente.cedula.toLowerCase().includes(lowerQuery) ||
      (paciente.historialMedico && paciente.historialMedico.condicionesCronicas &&
       paciente.historialMedico.condicionesCronicas.some(cond => 
         cond.toLowerCase().includes(lowerQuery)))
    ) {
      results.push({
        type: 'paciente',
        id: paciente.id,
        title: paciente.nombre,
        subtitle: paciente.cedula,
        url: `/doctor/pacientes/${paciente.id}`
      });
    }
  });
  
  // Buscar en servicios
  const servicios = JSON.parse(localStorage.getItem('medivzla_servicios') || '[]');
  
  servicios.forEach(servicio => {
    if (
      servicio.nombre.toLowerCase().includes(lowerQuery) ||
      servicio.descripcion.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        type: 'servicio',
        id: servicio.id,
        title: servicio.nombre,
        subtitle: `${formatDual(servicio.precioUSD)} · ${servicio.duracion} min`,
        url: `/doctor/servicios/${servicio.id}`
      });
    }
  });
  
  // Buscar en citas
  const citas = JSON.parse(localStorage.getItem('medivzla_citas') || '[]');
  
  citas.forEach(cita => {
    const paciente = pacientes.find(p => p.id === cita.pacienteId);
    const servicio = servicios.find(s => s.id === cita.servicioId);
    
    if (
      (paciente && paciente.nombre.toLowerCase().includes(lowerQuery)) ||
      (servicio && servicio.nombre.toLowerCase().includes(lowerQuery)) ||
      cita.motivo.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        type: 'cita',
        id: cita.id,
        title: paciente ? paciente.nombre : 'Cita',
        subtitle: `${servicio ? servicio.nombre : 'Servicio'} · ${cita.fecha} ${cita.hora}`,
        url: `/doctor/citas/${cita.id}`
      });
    }
  });
  
  return results;
};

const displaySearchResults = (results) => {
  const searchContainer = document.querySelector('.search-container');
  const searchResults = document.querySelector('.search-results');
  
  if (!searchContainer || !searchResults) return;
  
  searchContainer.classList.add('active');
  
  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="search-empty">
        <p>No se encontraron resultados para "${searchInput.value}"</p>
      </div>
    `;
    return;
  }
  
  let html = `
    <div class="search-results-header">
      <h3>Resultados de búsqueda</h3>
      <span>${results.length} encontrado${results.length === 1 ? '' : 's'}</span>
    </div>
  `;
  
  const grouped = groupResultsByType(results);
  
  for (const [type, items] of Object.entries(grouped)) {
    html += `<h4>${getTypeLabel(type)}</h4>`;
    html += '<ul class="search-results-list">';
    
    items.forEach(item => {
      html += `
        <li class="search-result-item">
          <a href="${item.url}" data-link>
            <div class="search-result-title">${item.title}</div>
            <div class="search-result-subtitle">${item.subtitle}</div>
          </a>
        </li>
      `;
    });
    
    html += '</ul>';
  }
  
  searchResults.innerHTML = html;
};

const groupResultsByType = (results) => {
  const grouped = {
    paciente: [],
    servicio: [],
    cita: []
  };
  
  results.forEach(result => {
    if (grouped[result.type]) {
      grouped[result.type].push(result);
    }
  });
  
  return grouped;
};

const getTypeLabel = (type) => {
  const labels = {
    paciente: 'Pacientes',
    servicio: 'Servicios',
    cita: 'Citas'
  };
  
  return labels[type] || type;
};

// Inicializar búsqueda cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
});
