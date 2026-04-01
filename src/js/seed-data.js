// src/js/seed-data.js
export const seedData = () => {
  // Configuración inicial
  if (!localStorage.getItem('medivzla_config')) {
    localStorage.setItem('medivzla_config', JSON.stringify({
      tasaCambio: 36.50,
      fechaActualizacion: new Date().toISOString(),
      horarioAtencion: { 
        inicio: "08:00", 
        fin: "17:00", 
        dias: [1,2,3,4,5] 
      },
      duracionCitaDefault: 30
    }));
  }
  
  // Usuarios demo
  if (!localStorage.getItem('medivzla_users')) {
    const doctorDemo = {
      id: "usr_doc_001",
      role: "doctor",
      email: "doctor@medivzla.com",
      password: btoa("admin123"),
      nombre: "Dr. Carlos Eduardo Rodríguez Pérez",
      cedula: "V12345678",
      telefono: "+58 412-1234567",
      especialidad: "Medicina General",
      numeroColegiado: "12345",
      biografia: "Médico general con más de 15 años de experiencia en atención primaria y emergencias médicas.",
      direccionConsultorio: "Av. Principal, Edif. Médico, Piso 2, Consultorio 205, Caracas",
      fechaRegistro: new Date().toISOString(),
      ultimoAcceso: new Date().toISOString(),
      activo: true
    };
    
    const pacientesDemo = [
      {
        id: "usr_pat_001",
        role: "paciente",
        email: "maria@example.com",
        password: btoa("maria123"),
        nombre: "María González",
        cedula: "V23456789",
        telefono: "+58 414-5556677",
        fechaNacimiento: "1988-05-12",
        direccion: {
          estado: "Distrito Capital",
          ciudad: "Caracas",
          zona: "Chacao",
          calle: "Av. Principal"
        },
        fechaRegistro: new Date().toISOString(),
        ultimoAcceso: new Date().toISOString(),
        activo: true,
        historialMedico: {
          condicionesCronicas: ["Hipertensión arterial"],
          alergias: "Ninguna conocida",
          medicamentos: "Enalapril 10mg diario",
          antecedentes: "Control regular de presión arterial"
        },
        contactoEmergencia: {
          nombre: "Juan González",
          relacion: "Esposo",
          telefono: "+58 412-1234567"
        }
      },
      {
        id: "usr_pat_002",
        role: "paciente",
        email: "pedro@example.com",
        password: btoa("pedro123"),
        nombre: "Pedro Martínez",
        cedula: "V34567890",
        telefono: "+58 424-6667788",
        fechaNacimiento: "1980-02-25",
        direccion: {
          estado: "Zulia",
          ciudad: "Maracaibo",
          zona: "El Mene",
          calle: "Calle 15"
        },
        fechaRegistro: new Date().toISOString(),
        ultimoAcceso: new Date().toISOString(),
        activo: true,
        historialMedico: {
          condicionesCronicas: ["Diabetes mellitus tipo 2"],
          alergias: "Ninguna conocida",
          medicamentos: "Metformina 500mg dos veces al día",
          antecedentes: "Diabetes diagnosticada hace 5 años"
        },
        contactoEmergencia: {
          nombre: "Ana Martínez",
          relacion: "Hija",
          telefono: "+58 414-9998877"
        }
      }
    ];
    
    localStorage.setItem('medivzla_users', JSON.stringify([doctorDemo, ...pacientesDemo]));
  }
  
  // Servicios demo
  if (!localStorage.getItem('medivzla_servicios')) {
    const serviciosDemo = [
      { 
        id: "srv_001", 
        nombre: "Consulta General", 
        descripcion: "Evaluación médica completa con diagnóstico y tratamiento inicial",
        precioUSD: 25.00, 
        duracion: 30, 
        preparacionRequerida: false,
        instruccionesPreparacion: "",
        activo: true,
        creadoEn: new Date().toISOString()
      },
      { 
        id: "srv_002", 
        nombre: "Curas y Curaciones", 
        descripcion: "Tratamiento de heridas y curaciones post-operatorias",
        precioUSD: 15.00, 
        duracion: 20, 
        preparacionRequerida: false,
        instruccionesPreparacion: "",
        activo: true,
        creadoEn: new Date().toISOString()
      },
      { 
        id: "srv_003", 
        nombre: "Colocación de Yeso", 
        descripcion: "Inmovilización de extremidades con yeso",
        precioUSD: 40.00, 
        duracion: 40, 
        preparacionRequerida: false,
        instruccionesPreparacion: "",
        activo: true,
        creadoEn: new Date().toISOString()
      },
      { 
        id: "srv_004", 
        nombre: "Tratamiento de Fracturas", 
        descripcion: "Reducción de fracturas simples",
        precioUSD: 60.00, 
        duracion: 60, 
        preparacionRequerida: true,
        instruccionesPreparacion: "Jejuno de 8 horas antes del procedimiento",
        activo: true,
        creadoEn: new Date().toISOString()
      },
      { 
        id: "srv_005", 
        nombre: "Control de Diabetes", 
        descripcion: "Seguimiento y ajuste de tratamiento para pacientes diabéticos",
        precioUSD: 30.00, 
        duracion: 30, 
        preparacionRequerida: true,
        instruccionesPreparacion: "Ayuno de 8 horas para análisis de glucosa",
        activo: true,
        creadoEn: new Date().toISOString()
      }
    ];
    localStorage.setItem('medivzla_servicios', JSON.stringify(serviciosDemo));
  }
  
  // Citas demo
  if (!localStorage.getItem('medivzla_citas')) {
    const now = new Date();
    const citasDemo = [
      {
        id: "cta_001",
        pacienteId: "usr_pat_001",
        doctorId: "usr_doc_001",
        servicioId: "srv_001",
        fecha: now.toISOString().split('T')[0],
        hora: "09:00",
        duracion: 30,
        estado: "confirmada",
        motivo: "Control de presión arterial",
        sintomas: ["hipertension"],
        notasDoctor: "Paciente con presión arterial estable, continuar con medicación actual",
        precioUSD: 25.00,
        tasaCambioAplicada: 36.50,
        creadoEn: new Date().toISOString(),
        actualizadaEn: new Date().toISOString(),
        historialCambios: [{
          fecha: new Date().toISOString(),
          usuario: "usr_doc_001",
          accion: "Creación de cita"
        }]
      },
      {
        id: "cta_002",
        pacienteId: "usr_pat_002",
        doctorId: "usr_doc_001",
        servicioId: "srv_005",
        fecha: now.toISOString().split('T')[0],
        hora: "10:00",
        duracion: 30,
        estado: "pendiente",
        motivo: "Control de diabetes",
        sintomas: ["aumento_de_peso", "sed_excesiva"],
        notasDoctor: "",
        precioUSD: 30.00,
        tasaCambioAplicada: 36.50,
        creadoEn: new Date().toISOString(),
        actualizadaEn: new Date().toISOString(),
        historialCambios: [{
          fecha: new Date().toISOString(),
          usuario: "usr_doc_001",
          accion: "Creación de cita"
        }]
      },
      {
        id: "cta_003",
        pacienteId: "usr_pat_001",
        doctorId: "usr_doc_001",
        servicioId: "srv_001",
        fecha: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        hora: "14:00",
        duracion: 30,
        estado: "pendiente",
        motivo: "Control rutinario",
        sintomas: ["fatiga"],
        notasDoctor: "",
        precioUSD: 25.00,
        tasaCambioAplicada: 36.50,
        creadoEn: new Date().toISOString(),
        actualizadaEn: new Date().toISOString(),
        historialCambios: [{
          fecha: new Date().toISOString(),
          usuario: "usr_doc_001",
          accion: "Creación de cita"
        }]
      }
    ];
    localStorage.setItem('medivzla_citas', JSON.stringify(citasDemo));
  }
  
  // Pagos demo
  if (!localStorage.getItem('medivzla_pagos')) {
    const pagosDemo = [
      {
        id: "pay_001",
        citaId: "cta_001",
        pacienteId: "usr_pat_001",
        montoUSD: 25.00,
        montoBS: 912.50,
        metodoPago: "zelle",
        referencia: "ZELLE-123456",
        fechaPago: new Date().toISOString().split('T')[0],
        comprobanteImagenId: "img_001",
        estado: "verificado",
        verificadoPor: "usr_doc_001",
        notasVerificacion: "Pago recibido correctamente",
        creadoEn: new Date().toISOString()
      }
    ];
    localStorage.setItem('medivzla_pagos', JSON.stringify(pagosDemo));
  }
  
  // Evidencias meta demo
  if (!localStorage.getItem('medivzla_evidencias_meta')) {
    const evidenciasMetaDemo = [
      {
        id: "evi_001",
        pacienteId: "usr_pat_001",
        citaId: "cta_001",
        tipo: "herida",
        descripcion: "Control post-operatorio",
        fechaCaptura: new Date().toISOString().split('T')[0],
        imagenId: "img_001",
        subidoEn: new Date().toISOString()
      }
    ];
    localStorage.setItem('medivzla_evidencias_meta', JSON.stringify(evidenciasMetaDemo));
  }
};
