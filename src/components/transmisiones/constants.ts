// src/components/transmisiones/constants.ts
import { DiaSemana } from './types';
import { startOfWeek, addDays, format } from 'date-fns';

// Ya no necesitamos CIUDADES porque vendrán de la API (filiales)

export const DIAS_SEMANA: DiaSemana[] = [
  { nombre: "Lunes", fecha: "" },
  { nombre: "Martes", fecha: "" },
  { nombre: "Miércoles", fecha: "" },
  { nombre: "Jueves", fecha: "" },
  { nombre: "Viernes", fecha: "" },
  { nombre: "Sábado", fecha: "" }
];

// Mapeo de días con y sin acentos para normalización
export const DIAS_NORMALIZADOS: Record<string, string> = {
  "LUNES": "LUNES",
  "MARTES": "MARTES",
  "MIÉRCOLES": "MIERCOLES",
  "MIERCOLES": "MIERCOLES",
  "JUEVES": "JUEVES",
  "VIERNES": "VIERNES",
  "SÁBADO": "SABADO",
  "SABADO": "SABADO",
  "DOMINGO": "DOMINGO"
};

// Targets para "No transmitió"
export const TARGETS_NO_TRANSMISION = [
  { value: 'Fta', label: 'Falta (Fta)' },
  { value: 'Enf', label: 'Enfermedad (Enf)' },
  { value: 'P.Tec', label: 'Problema técnico (P. Tec)' },
  { value: 'F.Serv', label: 'Falla de servicios (F. Serv)' },
  { value: 'Otros', label: 'Otros' }
];

// Targets para "Transmitió Tarde"
export const TARGETS_RETRASO = [
  { value: 'Tde', label: 'Tarde (Tde)' },
  { value: 'P.Tec', label: 'Problema técnico (P. Tec)' },
  { value: 'F.Serv', label: 'Falla de servicios (F. Serv)' },
  { value: 'Otros', label: 'Otros' }
];

export const ESTADOS_TRANSMISION = {
  PENDIENTE: 'pendiente',
  SI_TRANSMITIO: 'si',
  NO_TRANSMITIO: 'no',
  TRANSMITIO_TARDE: 'tarde'
} as const;

// Función para obtener las fechas de la semana a partir de una fecha dada
export const obtenerFechasSemana = (fecha: Date = new Date()): DiaSemana[] => {
  // Obtener el lunes de la semana
  const lunes = startOfWeek(fecha, { weekStartsOn: 1 });
  
  return DIAS_SEMANA.map((dia, index) => {
    const fechaDia = addDays(lunes, index);
    
    const dd = String(fechaDia.getDate()).padStart(2, '0');
    const mm = String(fechaDia.getMonth() + 1).padStart(2, '0');
    const yyyy = fechaDia.getFullYear();
    
    return {
      ...dia,
      fecha: `${yyyy}-${mm}-${dd}` // Formato YYYY-MM-DD para compatibilidad con la API
    };
  });
};

// Función para normalizar nombres de días (quitar acentos)
export const normalizarDiaSemana = (dia: string): string => {
  const diaUpperCase = dia.toUpperCase();
  return DIAS_NORMALIZADOS[diaUpperCase] || diaUpperCase;
};