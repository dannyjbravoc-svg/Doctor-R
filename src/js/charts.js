// src/js/charts.js
export const createBarChart = (canvasId, labels, data, options = {}) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Limpiar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Configuración por defecto
  const config = {
    barColor: options.barColor || '#2563EB',
    barWidth: options.barWidth || 30,
    gridColor: options.gridColor || '#E5E7EB',
    textColor: options.textColor || '#1F2937',
    showValues: options.showValues !== false,
    maxValue: options.maxValue || Math.max(...data) * 1.1,
    ...options
  };
  
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Dibujar grid horizontal
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const y = padding + chartHeight - (chartHeight * i / steps);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.strokeStyle = config.gridColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    
    // Etiquetas de valor
    const value = (config.maxValue * i / steps).toFixed(2);
    ctx.font = '10px Inter';
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'right';
    ctx.fillText(value, padding - 5, y + 4);
  }
  
  // Dibujar barras
  const barWidth = config.barWidth;
  const barSpacing = (chartWidth - (barWidth * labels.length)) / (labels.length + 1);
  
  for (let i = 0; i < data.length; i++) {
    const x = padding + barSpacing + (barWidth + barSpacing) * i;
    const barHeight = (data[i] / config.maxValue) * chartHeight;
    
    // Dibujar barra
    ctx.fillStyle = config.barColor;
    ctx.fillRect(x, padding + chartHeight - barHeight, barWidth, barHeight);
    
    // Dibujar valor
    if (config.showValues) {
      ctx.font = '10px Inter';
      ctx.fillStyle = config.textColor;
      ctx.textAlign = 'center';
      ctx.fillText(data[i].toFixed(2), x + barWidth / 2, padding + chartHeight - barHeight - 5);
    }
  }
  
  // Dibujar eje X
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.strokeStyle = config.textColor;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Dibujar etiquetas X
  for (let i = 0; i < labels.length; i++) {
    const x = padding + barSpacing + (barWidth + barSpacing) * i + barWidth / 2;
    ctx.font = '10px Inter';
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x, height - padding + 15);
  }
  
  // Título
  if (options.title) {
    ctx.font = '14px Inter';
    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'center';
    ctx.fillText(options.title, width / 2, 20);
  }
};

export const createPieChart = (canvasId, labels, data, options = {}) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const radius = Math.min(width, height) / 2 - 20;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Limpiar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Configuración por defecto
  const config = {
    colors: options.colors || ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
    showValues: options.showValues !== false,
    showLabels: options.showLabels !== false,
    ...options
  };
  
  // Calcular el total
  const total = data.reduce((sum, value) => sum + value, 0);
  
  // Dibujar cada segmento
  let startAngle = 0;
  for (let i = 0; i < data.length; i++) {
    const sliceAngle = (data[i] / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;
    
    // Dibujar segmento
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = config.colors[i % config.colors.length];
    ctx.fill();
    
    // Dibujar valor
    if (config.showValues) {
      const midAngle = startAngle + sliceAngle / 2;
      const valueX = centerX + (radius / 2) * Math.cos(midAngle);
      const valueY = centerY + (radius / 2) * Math.sin(midAngle);
      
      ctx.font = '10px Inter';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(data[i].toFixed(1), valueX, valueY + 3);
    }
    
    // Dibujar etiqueta
    if (config.showLabels && labels[i]) {
      const labelAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + (radius + 15) * Math.cos(labelAngle);
      const labelY = centerY + (radius + 15) * Math.sin(labelAngle);
      
      ctx.font = '10px Inter';
      ctx.fillStyle = config.textColor || '#1F2937';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], labelX, labelY);
    }
    
    startAngle = endAngle;
  }
  
  // Título
  if (options.title) {
    ctx.font = '14px Inter';
    ctx.fillStyle = config.textColor || '#1F2937';
    ctx.textAlign = 'center';
    ctx.fillText(options.title, width / 2, 20);
  }
};

// Inicializar gráficos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Ejemplo de uso en el dashboard
  if (document.querySelector('.dashboard-container')) {
    const ingresosData = [150, 220, 180, 250, 200];
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
    createBarChart('ingresosChart', dias, ingresosData, {
      title: 'Ingresos por Día',
      barColor: '#2563EB',
      maxValue: 300
    });
    
    const serviciosData = [45, 30, 20, 5];
    const serviciosLabels = ['Consulta General', 'Control Diabetes', 'Otro', 'Emergencia'];
    createPieChart('serviciosChart', serviciosLabels, serviciosData, {
      title: 'Distribución de Servicios',
      showValues: true
    });
  }
});
