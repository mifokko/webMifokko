export interface Oferta {
    nombreOferta: string,
    fechaInicio: {day: number, month: number, year: number},
    fechaFin: {day: number, month: number, year: number},
    estado: string,
}

export interface Fecha {
    day: number,
    month: number,
    year: number,
}