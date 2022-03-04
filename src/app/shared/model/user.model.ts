export interface Usuario {
    correo: string,
    password: string,
    uid: string,
    perfil: 'empresa' | 'independiente' | 'general',
}