import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";

export interface Empresa {
    name: string;
    nit: string;
    departamento: string;
    ciudad: string;
    direccion: string;
    telefono: string;
    celular: string;
    email: string;
    contraseña: string;
    actPrincipal: string;
    descripcion: string;
    horario: string;
    domicilio: string;
    servicios: string;
    infoAdd: string;
    nomRef1: string;
    celRef1: string;
    ocupRef1: string;
    nomRef2: string;
    celRef2: string;
    ocupRef2: string;
    codigoA: string;
    tyC: string;
}

@Injectable()
export class DataService {
    empresa!: Observable<Empresa>;
    private empresaCollection!: AngularFirestoreCollection<Empresa>;

    constructor(private readonly afs: AngularFirestore) {
        this.empresaCollection = afs.collection<any>('Empresas');
    }


    async onSaveContact (contactForm: Empresa): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const id = this.afs.createId();
                const data = {id, ...contactForm};
                const result = this.empresaCollection.doc(id).set(data);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
}