import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export interface Empresa {
    nombre: string;
    nit: string;
    departamento: string;
    ciudad: string;
    direccion: string;
    telefono?: string;
    celular: string;
    email: string;
    contraseña: string;
    actividadPrincipal: string;
    descripcion: string;
    domicilio?: string;
    servicios: string;
    informacionAdicional?: string;
    nombreReferencia1: string;
    celularReferencia1: string;
    ocupacionReferencia1: string;
    nombreReferencia2: string;
    celularReferencia2: string;
    ocupacionReferencia2: string;
    codigoAsesor?: string;
}

@Injectable()
export class DataService {
    empresa!: Observable<Empresa>;
    private empresaCollection!: AngularFirestoreCollection<Empresa>;

    constructor(private readonly afs: AngularFirestore, private auth: AuthService) {
        this.empresaCollection = afs.collection<any>('Empresas');
    }


    async onSaveEmpresa (empresaForm: Empresa, data2: any, id: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                //const id = this.afs.createId();
                const data = {...empresaForm};
                const result = this.empresaCollection.doc(id).set(data);
                resolve(result);
                await this.empresaCollection.doc(id).collection('User').doc(id).set(data2);
            } catch (error) {
                reject(error);
            }
        })
    }
}