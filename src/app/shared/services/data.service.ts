import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class DataServices {

  constructor(private readonly afs: AngularFirestore) { }

  //Crear un documento dentro de una colección 
  async createDoc(data: any, path: string, id: string){
    const collection = this.afs.collection(path);
    return await collection.doc(id).set(data);
  }

  getId() {
      return this.afs.createId();
  }

  //Obtener lista de los documentos de una coleccion 
  getCollection<tipo>(path: string) {
    const collection = this.afs.collection<tipo>(path);
    return collection.valueChanges();
  }

  //Obtener informacion de un documento en especifico
  getDoc<tipo>(path: string, id: string) {
      const collection = this.afs.collection<tipo>(path);
      return collection.doc(id).valueChanges();
  }

  //Obtener informacion de un documento que esta en una colección dentro de un documento 
  getDocColDoc<tipo>(path: string, id: string, subpath: string) {
    const collection = this.afs.collection(path);
    return collection.doc(id).collection<tipo>(subpath).doc(id).valueChanges();
  }

  //Obtener informacion de las ofertas, ya que tienen un id diferente
  getDocColDoc2<tipo>(path: string, uid: string, subpath: string, id: string) {
    const collection = this.afs.collection(path);
    return collection.doc(uid).collection<tipo>(subpath).doc(id).valueChanges();
  }

  //Obtener informacion de las ofertas, ya que tienen un id diferente
  getDocColDocColl<tipo>(path: string, uid: string, subpath: string, id: string, subbpath: string) {
    const collection = this.afs.collection(path);
    return collection.doc(uid).collection(subpath).doc(id).collection<tipo>(subbpath).valueChanges();
  }

  //Obtener informacion de una coleccion dentro de un documento 
  getDocCol<tipo>(path: string, id: string, subpath: string) {
    const collection = this.afs.collection(path);
    return collection.doc(id).collection<tipo>(subpath).valueChanges();
  }

  //Crea una collección dentro de un documento con un id especifico 
  async createColInDoc<tipo>(data: any, path: string, uid: string, subpath: string, id: string){
    const mapas = this.afs.collection(path);
    return await mapas.doc(uid).collection<tipo>(subpath).doc(id).set(data, {merge: true});
  }

  //Crea una collección dentro de un documento con un id especifico 
  async createColInDocColl<tipo>(data: any, path: string, uid: string, subpath: string, id: string, subbpath: string, index: string){
    const mapas = this.afs.collection(path);
    return await mapas.doc(uid).collection(subpath).doc(id).collection<tipo>(subbpath).doc(index).set(data, {merge: true});
  }

  //Actualizar o agregar campos 
  updateCamposDoc(data: any, path: string, id: string, campo: string){
    this.afs.doc(path + '/' + id).update({
      [(campo)] : data
    })
  }

  //Actualizar o agregar campos a colecciones dentro de documentos 
  updateCamposDocCollDoc(data: any, path: string, id: string, subpath:string, campo: string){
    this.afs.doc(path + '/' + id + '/' + subpath + '/' + id).update({
      [(campo)] : data
    })
  }

  //Actualizar o agregar campos a colecciones dentro de documentos especificamente a ofertas 
  updateCamposDocCollDoc2(data: any, path: string, uid: string, subpath:string, id: string, campo: string){
    this.afs.doc(path + '/' + uid + '/' + subpath + '/' + id).update({
      [(campo)] : data
    })
  }

  //Actualizar o agregar campos a colecciones dentro de documentos especificamente a comentarios de ofertas 
  updateCamposDocCollDocColl(data: any, path: string, uid: string, subpath:string, id: string, subbpath:string, index:string , campo: string){
    this.afs.doc(path + '/' + uid + '/' + subpath + '/' + id + '/' + subbpath + '/' + index).update({
      [(campo)] : data
    })
  }

  //Borrar campos de un documento 
  async deleteCamposDoc(path: string, id: string, campo: string){
    const docRef = this.afs.collection(path).doc(id);
    return await docRef.update({
      [(campo)] : firebase.firestore.FieldValue.delete()
    });
  }

  //Borrar campos de un documento destro de una subcolección 
  async deleteCamposColDoc(path: string, uid: string, subpath: string, id: string){
    const docRef = this.afs.collection(path).doc(uid).collection(subpath).doc(id).delete();
  }
}
