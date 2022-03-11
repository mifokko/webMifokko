export interface Usuario {
    correo: string,
    password: string,
    uid: string,
    perfil: 'empresa' | 'independiente' | 'general',
    referencia: string,
    plan: 'mensual' | 'anual' | 'general',
    fechaInicio: string,
    fechaFin: string,
}