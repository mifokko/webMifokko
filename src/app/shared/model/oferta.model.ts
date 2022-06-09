export interface Oferta {
    nombreOferta: string,
    fechaInicio: {day: number, month: number, year: number},
    fechaFin: {day: number, month: number, year: number},
    estado: string,
    id: string
}

export interface Fecha {
    day: number,
    month: number,
    year: number,
}

export interface Ofertas {
    nombreOferta: string,
    fechaInicio: {day: number, month: number, year: number},
    fechaFin: {day: number, month: number, year: number},
    estado: string,
    descripcion: string,
    alcance: string,
    ciudad: string,
    domicilio: string,
    precio: string,
    direccion: string,
    celular: string,
    imagenes: [];
    numImages: number
}