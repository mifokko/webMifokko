import { SafeUrl } from "@angular/platform-browser"

export interface Busqueda {
    nombre: string,
    actividadPrincipal: string,
    ciudad: string,
    rol: string,
    id: string,
    fotoPerfil: SafeUrl;
}

export interface BusquedaI {
    nombre: string,
    profesion: string,
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
    fotoPerfil: SafeUrl | undefined;
    path: string,
    id: string, 
    uid: string,
    estado: string,
    fechaInicio: {day: number, month: number, year: number},
    fechaFin: {day: number, month: number, year: number},
}