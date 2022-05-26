import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { merge, Observable } from 'rxjs';

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
    const collection = this.afs.collection(path);
    return collection.doc(id).collection<tipo>(subpath).doc(id).valueChanges();
  }

  getDocColDoc2<tipo>(path: string, uid: string, subpath: string, id: string) {
    const collection = this.afs.collection(path);
    return collection.doc(uid).collection<tipo>(subpath).doc(id).valueChanges();
  }

  getDocCol<tipo>(path: string, id: string, subpath: string) {
    const collection = this.afs.collection(path);
    return collection.doc(id).collection<tipo>(subpath).valueChanges();
  }

  // getDocColCamp<tipo>(path: string, id: string, subpath: string, camp: any) {
  //   const collection = this.afs.collection(path);
  //   return collection.doc(id).collection<tipo>(subpath).ref([camp]).valueChanges();
  // }
  //Crea una collección dentro de un documento con un id especifico 
  async createColInDoc<tipo>(data: any, path: string, uid: string, subpath: string, id: string){
    const mapas = this.afs.collection(path);
    return await mapas.doc(uid).collection<tipo>(subpath).doc(id).set(data, {merge: true});
  }


  //Actualizar o agregar campos 
  updateCamposDoc(data: any, path: string, id: string, campo: string){
    this.afs.doc(path + '/' + id).update({
      [(campo)] : data
    })
  }

  updateCamposDocCollDoc(data: any, path: string, id: string, subpath:string, campo: string){
    this.afs.doc(path + '/' + id + '/' + subpath + '/' + id).update({
      [(campo)] : data
    })
  }

  updateCamposDocCollDoc2(data: any, path: string, uid: string, subpath:string, id: string, campo: string){
    this.afs.doc(path + '/' + uid + '/' + subpath + '/' + id).update({
      [(campo)] : data
    })
  }
}
