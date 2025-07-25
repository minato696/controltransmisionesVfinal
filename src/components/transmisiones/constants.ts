// src/components/transmisiones/constants.ts
import { DiaSemana } from './types';
import { startOfWeek, addDays } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';
import { es } from 'date-fns/locale';

// Definir la zona horaria para Perú
export const TIMEZONE = 'America/Lima';

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

// Función para obtener la fecha actual en la zona horaria de América/Lima
export const getFechaActualPeru = (): Date => {
  const now = new Date();
  return toZonedTime(now, TIMEZONE);
};

// Función para obtener las fechas de la semana a partir de una fecha dada
export const obtenerFechasSemana = (fecha: Date = getFechaActualPeru()): DiaSemana[] => {
  // Asegurarnos de trabajar con objetos Date nuevos para evitar mutaciones
  const fechaPeru = new Date(fecha);
  
  // Obtener el lunes de la semana
  const lunes = startOfWeek(fechaPeru, { weekStartsOn: 1 });
  
  // Generar días de la semana
  const diasGenerados = DIAS_SEMANA.map((dia, index) => {
    // Crear un nuevo objeto Date para cada día para evitar referencias compartidas
    const fechaDia = new Date(lunes);
    fechaDia.setDate(lunes.getDate() + index);
    
    // Formatear fecha como YYYY-MM-DD
    const fechaFormateada = format(fechaDia, 'yyyy-MM-dd', { timeZone: TIMEZONE });
    
    return {
      ...dia,
      fecha: fechaFormateada
    };
  });
  
  return diasGenerados;
};

// Función para normalizar nombres de días (quitar acentos)
export const normalizarDiaSemana = (dia: string): string => {
  const diaUpperCase = dia.toUpperCase();
  return DIAS_NORMALIZADOS[diaUpperCase] || diaUpperCase;
};