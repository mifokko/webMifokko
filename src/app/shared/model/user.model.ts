export interface Usuario {
    correo: string,
    password: string,
    uid: string,
    perfil: 'empresa' | 'independiente' | 'general',
    referencia: string,
    plan: 'mensualE' | 'anualE' | 'mensualI' | 'anualI' | 'general',
    fechaInicio: string,
    fechaFin: string,
    estadoPago: boolean,
}