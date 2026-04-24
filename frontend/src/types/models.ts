export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface Organismo {
  id: number;
  nombre: string;
  rut: string;
}

export interface PAC {
  id: number;
  organismo_id: number;
  usuario_id: number;
  nombre: string;
  fecha_creacion: string;
  estado: string;
}

export interface Requerimiento {
  id: number;
  pac_id: number;
  descripcion: string;
  monto_estimado: string;
  moneda: string;
}

export interface Item {
  id: number;
  requerimiento_id: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: string;
}

export interface VersionPAC {
  id: number;
  pac_id: number;
  version: number;
  fecha: string;
  cambios: string;
}

export interface OrdenCompra {
  id: number;
  numero_oc: string;
  pac_id: number;
  monto_transado: string;
  estado: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface PACCreate {
  organismo_id: number;
  usuario_id: number;
  nombre: string;
}

export interface RequerimientoCreate {
  pac_id: number;
  descripcion: string;
  monto_estimado: string;
  moneda: string;
}

export interface ItemCreate {
  requerimiento_id: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: string;
}

export interface PACPublicarRequest {
  pac_id: number;
  firma: string;
}

export interface PACPublicarResponse {
  pac_id: number;
  estado: string;
}
