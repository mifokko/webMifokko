import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataServices {

  constructor(private readonly afs: AngularFirestore) { }

  async createDoc(data: any, path: string, id: string){
    const collection = this.afs.collection(path);
    return await collection.doc(id).set(data);
  }

  getId() {
      return this.afs.createId();
  }

  getCollection<tipo>(path: string) {
    const collection = this.afs.collection<tipo>(path);
    return collection.valueChanges();
  }

  getDoc<tipo>(path: string, id: string) {
      const collection = this.afs.collection<tipo>(path);
      return collection.doc(id).valueChanges();
  }

  getDocColDoc<tipo>(path: string, id: string, subpath: string) {
    const collection = this.afs.collection<tipo>(path);
    return collection.doc(id).collection(subpath).doc(id).valueChanges();
  }

  getDocCol<tipo>(path: string, id: string, subpath: string) {
    const collection = this.afs.collection(path);
    return collection.doc(id).collection<tipo>(subpath).valueChanges();
  }

  //Crea una collección dentro de un documento con un id especifico 
  async createColInDoc(data: any, path: string, uid: string, subpath: string, id: string){
    const mapas = this.afs.collection(path);
    return await mapas.doc(uid).collection(subpath).doc(id).set(data);
  }
}
