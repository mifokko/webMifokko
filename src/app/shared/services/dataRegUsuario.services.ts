import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";

export interface UsuarioG {
    nombre: string,
    apellido: string,
    genero: string,
    celular: string,
    correo: string,
    contraseña: string,
    departamento: string,
    ciudad: string,
    fechanacimiento: string,
}

@Injectable()
export class DataService2 {
    usuarioG!: Observable<UsuarioG>;
    private usuarioGCollection!: AngularFirestoreCollection<UsuarioG>;

    constructor(private readonly afs: AngularFirestore) {
        this.usuarioGCollection = afs.collection<any>('UsuarioG');
    }


    async onSaveUsuario (usuarioForm: UsuarioG, data2: any, id: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                //const id = this.afs.createId();
                const data = {id,...usuarioForm};
                const result = this.usuarioGCollection.doc(id).set(data);
                resolve(result);
                await this.usuarioGCollection.doc(id).collection('User').doc(id).set(data2);
            } catch (error) {
                reject(error);
            }
        })
    }
}