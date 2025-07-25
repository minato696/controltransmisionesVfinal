// Definir interfaces básicas sin importar de otros archivos
export interface FilialBasic {
  id: string | number;
  nombre: string;
  activa?: boolean;
  isActivo?: boolean;
}

export interface ProgramaBasic {
  id: string | number;
  nombre: string;
  descripcion?: string;
  estado?: string;
  horario?: string;
  horaInicio?: string;
}

// Basic reporte interface
export interface Reporte {
  id: number;
  filialId: number;
  programaId: number;
  fecha: Date;
  estadoId: number;
  hora?: string | null;
  horaTt?: string | null;
  targetId?: number | null;
  motivo?: string | null;
  observaciones?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Extended reporte interface with relations
export interface ReporteWithRelations extends Reporte {
  filial: FilialBasic;
  programa: ProgramaBasic;
  estado: {
    id: number;
    nombre: string;
  };
  target?: {
    id: number;
    codigo: string;
    nombre: string;
    tipo: string;
  } | null;
}

// Interface for the transformed reporte returned to frontend
export interface ReporteTransformed {
  id_reporte: number;
  filialId: number;
  programaId: number;
  fecha: string;
  estado: 'si' | 'no' | 'tarde' | 'pendiente';
  estadoTransmision: string;
  target?: string | null;
  motivo?: string | null;
  horaReal?: string | null;
  hora?: string | null;
  hora_tt?: string | null;
  observaciones?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Input type for creating/updating reportes
export interface ReporteInput {
  filialId: number;
  programaId: number;
  fecha: string;
  estadoTransmision?: string;
  estado?: 'si' | 'no' | 'tarde' | 'pendiente';
  target?: string | null;
  motivo?: string | null;
  hora?: string | null;
  horaReal?: string | null; 
  hora_tt?: string | null;
  observaciones?: string | null;
  id_reporte?: number;
}