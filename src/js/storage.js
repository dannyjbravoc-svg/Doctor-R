// src/js/storage.js
import { seedData } from './seed-data.js';

// Inicializar el sistema de almacenamiento
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
});

// Funciones para manejar datos
export const getUsers = () => {
  return JSON.parse(localStorage.getItem('medivzla_users') || '[]');
};

export const getUserById = (id) => {
  const users = getUsers();
  return users.find(u => u.id === id);
};

export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

export const saveUser = (user) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem('medivzla_users', JSON.stringify(users));
  return user;
};

export const deleteUser = (id) => {
  let users = getUsers();
  users = users.filter(u => u.id !== id);
  localStorage.setItem('medivzla_users', JSON.stringify(users));
};

export const getServicios = () => {
  return JSON.parse(localStorage.getItem('medivzla_servicios') || '[]');
};

export const getServicioById = (id) => {
  const servicios = getServicios();
  return servicios.find(s => s.id === id);
};

export const saveServicio = (servicio) => {
  const servicios = getServicios();
  const index = servicios.findIndex(s => s.id === servicio.id);
  
  if (index !== -1) {
    servicios[index] = servicio;
  } else {
    servicios.push(servicio);
  }
  
  localStorage.setItem('medivzla_servicios', JSON.stringify(servicios));
  return servicio;
};

export const deleteServicio = (id) => {
  let servicios = getServicios();
  servicios = servicios.filter(s => s.id !== id);
  localStorage.setItem('medivzla_servicios', JSON.stringify(servicios));
};

export const getCitas = () => {
  return JSON.parse(localStorage.getItem('medivzla_citas') || '[]');
};

export const getCitaById = (id) => {
  const citas = getCitas();
  return citas.find(c => c.id === id);
};

export const saveCita = (cita) => {
  const citas = getCitas();
  const index = citas.findIndex(c => c.id === cita.id);
  
  if (index !== -1) {
    citas[index] = cita;
  } else {
    citas.push(cita);
  }
  
  localStorage.setItem('medivzla_citas', JSON.stringify(citas));
  return cita;
};

export const deleteCita = (id) => {
  let citas = getCitas();
  citas = citas.filter(c => c.id !== id);
  localStorage.setItem('medivzla_citas', JSON.stringify(citas));
};

export const getPagos = () => {
  return JSON.parse(localStorage.getItem('medivzla_pagos') || '[]');
};

export const getPagoById = (id) => {
  const pagos = getPagos();
  return pagos.find(p => p.id === id);
};

export const savePago = (pago) => {
  const pagos = getPagos();
  const index = pagos.findIndex(p => p.id === pago.id);
  
  if (index !== -1) {
    pagos[index] = pago;
  } else {
    pagos.push(pago);
  }
  
  localStorage.setItem('medivzla_pagos', JSON.stringify(pagos));
  return pago;
};

export const deletePago = (id) => {
  let pagos = getPagos();
  pagos = pagos.filter(p => p.id !== id);
  localStorage.setItem('medivzla_pagos', JSON.stringify(pagos));
};

export const getEvidencias = () => {
  return JSON.parse(localStorage.getItem('medivzla_evidencias_meta') || '[]');
};

export const getEvidenciaById = (id) => {
  const evidencias = getEvidencias();
  return evidencias.find(e => e.id === id);
};

export const saveEvidencia = (evidencia) => {
  const evidencias = getEvidencias();
  const index = evidencias.findIndex(e => e.id === evidencia.id);
  
  if (index !== -1) {
    evidencias[index] = evidencia;
  } else {
    evidencias.push(evidencia);
  }
  
  localStorage.setItem('medivzla_evidencias_meta', JSON.stringify(evidencias));
  return evidencia;
};

export const deleteEvidencia = (id) => {
  let evidencias = getEvidencias();
  evidencias = evidencias.filter(e => e.id !== id);
  localStorage.setItem('medivzla_evidencias_meta', JSON.stringify(evidencias));
};

export const getConfig = () => {
  return JSON.parse(localStorage.getItem('medivzla_config') || '{}');
};

export const saveConfig = (config) => {
  localStorage.setItem('medivzla_config', JSON.stringify(config));
  return config;
};

const initStorage = () => {
  console.log('Storage system initialized');
  seedData();
};
