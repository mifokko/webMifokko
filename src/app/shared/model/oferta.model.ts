export interface Oferta {
    nombreOferta: string,
    fechaInicio: string
    fechaFin: string,
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
    fechaInicio: string,
    fechaFin: string,
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