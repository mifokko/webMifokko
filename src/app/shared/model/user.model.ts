export interface Usuario {
    correo: string,
    password: string,
    uid: string,
    perfil: 'empresa' | 'independiente' | 'general',
    referencia: string,
    plan: string,
    tipoPlan: string,
    pago: number,
    fechaInicio: string,
    fechaFin: string,
    estadoPago: boolean,
}

export interface UsuarioGeneral {
    correo: string,
    password: string,
    uid: string,
    perfil: 'general',
}