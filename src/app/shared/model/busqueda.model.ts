import { SafeUrl } from "@angular/platform-browser"

export interface Busqueda {
    nombre: string,
    actividadPrincipal: string,
    descripcion: string,
    servicios: string,
    ciudad: string,
    rol: string,
    id: string,
    fotoPerfil: SafeUrl;
}

export interface BusquedaI {
    nombre: string,
    profesion: string,
    descripcion: string,
    servicios: string,
    ciudad: string,
    rol: string,
    id: string,
    fotoPerfil: SafeUrl;
}

export interface BusquedaO {
    nombreOferta: string,
    ciudad: string,
    rol: 'Oferta',
    alcance: string,
    fotoPerfil: SafeUrl | undefined,
    descripcion: string,
    informacionAdicional: string,
    path: string,
    id: string, 
    uid: string,
    estado: string,
    fechaInicio: {day: number, month: number, year: number},
    fechaFin: {day: number, month: number, year: number},
}
