// src/js/calendar.js
export const initCalendar = () => {
  const calendarContainer = document.querySelector('.calendar-container');
  if (!calendarContainer) return;
  
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  
  // Mostrar calendario
  renderCalendar(currentMonth, currentYear);
  
  // Configurar navegación
  document.querySelector('.calendar-prev').addEventListener('click', () => {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
    renderCalendar(currentMonth, currentYear);
  });
  
  document.querySelector('.calendar-next').addEventListener('click', () => {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
    renderCalendar(currentMonth, currentYear);
  });
  
  // Inicializar vista semanal
  document.querySelector('.view-week').addEventListener('click', () => {
    document.querySelector('.month-view').style.display = 'none';
    document.querySelector('.week-view').style.display = 'grid';
    document.querySelector('.day-view').style.display = 'none';
    
    document.querySelector('.view-month').classList.remove('active');
    document.querySelector('.view-week').classList.add('active');
    document.querySelector('.view-day').classList.remove('active');
  });
  
  // Inicializar vista mensual
  document.querySelector('.view-month').addEventListener('click', () => {
    document.querySelector('.month-view').style.display = 'grid';
    document.querySelector('.week-view').style.display = 'none';
    document.querySelector('.day-view').style.display = 'none';
    
    document.querySelector('.view-month').classList.add('active');
    document.querySelector('.view-week').classList.remove('active');
    document.querySelector('.view-day').classList.remove('active');
  });
  
  // Inicializar vista diaria
  document.querySelector('.view-day').addEventListener('click', () => {
    document.querySelector('.month-view').style.display = 'none';
    document.querySelector('.week-view').style.display = 'none';
    document.querySelector('.day-view').style.display = 'grid';
    
    document.querySelector('.view-month').classList.remove('active');
    document.querySelector('.view-week').classList.remove('active');
    document.querySelector('.view-day').classList.add('active');
  });
  
  // Inicializar eventos de clic en días
  calendarContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('day')) {
      const day = e.target.dataset.day;
      const month = currentMonth + 1;
      const year = currentYear;
      
      // Abrir formulario de evento
      openEventForm(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
    }
  });
};

const renderCalendar = (month, year) => {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
                     'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  document.querySelector('.calendar-title').textContent = `${monthNames[month]} ${year}`;
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Limpiar el calendario
  const daysContainer = document.querySelector('.month-grid');
  daysContainer.innerHTML = '';
  
  // Días del mes anterior (para completar la grilla)
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day day-other';
    dayDiv.textContent = prevMonthDays - i;
    dayDiv.dataset.day = prevMonthDays - i;
    daysContainer.appendChild(dayDiv);
  }
  
  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    dayDiv.textContent = i;
    dayDiv.dataset.day = i;
    
    // Marcar el día actual
    const today = new Date();
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayDiv.classList.add('day-today');
    }
    
    // Agregar eventos
    const events = getEventsForDate(year, month, i);
    if (events.length > 0) {
      const eventsContainer = document.createElement('div');
      eventsContainer.className = 'day-events';
      
      events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = `day-event event-${event.status}`;
        eventDiv.textContent = event.title;
        eventsContainer.appendChild(eventDiv);
      });
      
      dayDiv.appendChild(eventsContainer);
    }
    
    daysContainer.appendChild(dayDiv);
  }
  
  // Días del mes siguiente (para completar la grilla)
  const totalCells = 42; // 6 filas * 7 columnas
  const remainingCells = totalCells - (firstDay + daysInMonth);
  for (let i = 1; i <= remainingCells; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day day-other';
    dayDiv.textContent = i;
    dayDiv.dataset.day = i;
    daysContainer.appendChild(dayDiv);
  }
};

const getEventsForDate = (year, month, day) => {
  // En una implementación real, esto obtendría los eventos del almacenamiento
  const events = [
    { id: '1', title: 'Consulta', status: 'confirmada' },
    { id: '2', title: 'Control', status: 'pendiente' }
  ];
  
  return events;
};

const openEventForm = (date) => {
  const eventForm = document.querySelector('.event-form');
  if (!eventForm) return;
  
  document.querySelector('.event-date').textContent = formatDate(date);
  eventForm.style.display = 'block';
};

const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day:*
