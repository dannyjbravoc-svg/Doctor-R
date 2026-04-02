// src/js/data.js
// Datos médicos para el sistema

export const enfermedades = [
  { id: 'diabetes', nombre: 'Diabetes Mellitus', categoria: 'metabolismo' },
  { id: 'hipertension', nombre: 'Hipertensión Arterial', categoria: 'cardiovascular' },
  { id: 'asma', nombre: 'Asma Bronquial', categoria: 'respiratorio' },
  { id: 'artritis', nombre: 'Artritis Reumatoide', categoria: 'reumatico' },
  { id: 'hipotiroidismo', nombre: 'Hipotiroidismo', categoria: 'endocrino' },
  { id: 'hipertiroidismo', nombre: 'Hipertiroidismo', categoria: 'endocrino' },
  { id: 'epoc', nombre: 'EPOC', categoria: 'respiratorio' },
  { id: 'cardiopatia', nombre: 'Cardiopatía', categoria: 'cardiovascular' },
  { id: 'insuficiencia_renal', nombre: 'Insuficiencia Renal', categoria: 'renal' },
  { id: 'cancer', nombre: 'Cáncer', categoria: 'oncologico' },
  { id: 'epilepsia', nombre: 'Epilepsia', categoria: 'neurologico' },
  { id: 'depresion', nombre: 'Depresión', categoria: 'psiquiatrico' },
  { id: 'ansiedad', nombre: 'Trastorno de Ansiedad', categoria: 'psiquiatrico' },
  { id: 'migrena', nombre: 'Migraña', categoria: 'neurologico' },
  { id: 'gastritis', nombre: 'Gastritis Crónica', categoria: 'digestivo' },
  { id: 'ulcera', nombre: 'Úlcera Péptica', categoria: 'digestivo' },
  { id: 'colelitiasis', nombre: 'Colelitiasis (Cálculos Biliares)', categoria: 'digestivo' },
  { id: 'hepatitis', nombre: 'Hepatitis', categoria: 'digestivo' },
  { id: 'anemia', nombre: 'Anemia', categoria: 'hematologico' },
  { id: 'obesidad', nombre: 'Obesidad', categoria: 'metabolismo' }
];

export const sintomas = [
  { id: 'dolor_cabeza', nombre: 'Dolor de Cabeza', categoria: 'neurologico' },
  { id: 'dolor_abdominal', nombre: 'Dolor Abdominal', categoria: 'digestivo' },
  { id: 'dolor_pecho', nombre: 'Dolor de Pecho', categoria: 'cardiovascular' },
  { id: 'fiebre', nombre: 'Fiebre', categoria: 'general' },
  { id: 'tos', nombre: 'Tos', categoria: 'respiratorio' },
  { id: 'dificultad_respirar', nombre: 'Dificultad para Respirar', categoria: 'respiratorio' },
  { id: 'fatiga', nombre: 'Fatiga/Cansancio', categoria: 'general' },
  { id: 'perdida_peso', nombre: 'Pérdida de Peso', categoria: 'general' },
  { id: 'aumento_peso', nombre: 'Aumento de Peso', categoria: 'general' },
  { id: 'nauseas', nombre: 'Náuseas/Vómitos', categoria: 'digestivo' },
  { id: 'diarrea', nombre: 'Diarrea', categoria: 'digestivo' },
  { id: 'estrenimiento', nombre: 'Estreñimiento', categoria: 'digestivo' },
  { id: 'mareo', nombre: 'Mareo/Vértigo', categoria: 'neurologico' },
  { id: 'palpitaciones', nombre: 'Palpitaciones', categoria: 'cardiovascular' },
  { id: 'dolor_articular', nombre: 'Dolor Articular', categoria: 'reumatico' },
  { id: 'dolor_muscular', nombre: 'Dolor Muscular', categoria: 'reumatico' },
  { id: 'dolor_espalda', nombre: 'Dolor de Espalda', categoria: 'reumatico' },
  { id: 'insomnio', nombre: 'Insomnio', categoria: 'psiquiatrico' },
  { id: 'ansiedad', nombre: 'Ansiedad', categoria: 'psiquiatrico' },
  { id: 'perdida_apetito', nombre: 'Pérdida de Apetito', categoria: 'general' }
];

export const servicios = [
  { id: 'consulta_general', nombre: 'Consulta General', precioUSD: 20, duracion: 30, descripcion: 'Consulta médica general' },
  { id: 'control_diabetes', nombre: 'Control de Diabetes', precioUSD: 25, duracion: 45, descripcion: 'Seguimiento de diabetes mellitus' },
  { id: 'control_hipertension', nombre: 'Control de Hipertensión', precioUSD: 25, duracion: 45, descripcion: 'Seguimiento de hipertensión arterial' },
  { id: 'consulta_pediatria', nombre: 'Consulta Pediátrica', precioUSD: 22, duracion: 30, descripcion: 'Consulta médica para niños' },
  { id: 'consulta_ginecologia', nombre: 'Consulta Ginecológica', precioUSD: 30, duracion: 45, descripcion: 'Examen ginecológico' },
  { id: 'electrocardiograma', nombre: 'Electrocardiograma', precioUSD: 15, duracion: 15, descripcion: 'Estudio del ritmo cardíaco' },
  { id: 'curacion', nombre: 'Curación de Heridas', precioUSD: 10, duracion: 20, descripcion: 'Limpieza y curación de heridas' },
  { id: 'inyectable', nombre: 'Aplicación de Inyectable', precioUSD: 5, duracion: 10, descripcion: 'Aplicación de medicamento inyectable' },
  { id: 'toma_presion', nombre: 'Toma de Presión Arterial', precioUSD: 3, duracion: 5, descripcion: 'Medición de presión arterial' },
  { id: 'certificado_medico', nombre: 'Certificado Médico', precioUSD: 10, duracion: 15, descripcion: 'Emisión de certificado médico' }
];

// Función para obtener enfermedades
export function getEnfermedades() {
  return enfermedades;
}

// Función para obtener síntomas
export function getSintomas() {
  return sintomas;
}

// Función para obtener servicios
export function getServicios() {
  return servicios;
}

// Función para obtener enfermedad por ID
export function getEnfermedadById(id) {
  return enfermedades.find(e => e.id === id);
}

// Función para obtener síntoma por ID
export function getSintomaById(id) {
  return sintomas.find(s => s.id === id);
}

// Función para obtener servicio por ID
export function getServicioById(id) {
  return servicios.find(s => s.id === id);
}

// Exportar globalmente para uso en scripts inline
window.getEnfermedades = getEnfermedades;
window.getSintomas = getSintomas;
window.getServicios = getServicios;