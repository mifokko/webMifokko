import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Usuario } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afauth: AngularFireAuth) { 
    
  }

  async register(datos: Usuario){
    try {
      return await this.afauth.createUserWithEmailAndPassword(datos.correo, datos.password);
    } catch (e) {
      console.log("Error en login: ", e);
      return null;
    }
  }

  loginGeneral(correo: string, contrasena: string){
    return this.afauth.signInWithEmailAndPassword(correo,contrasena);
  }

  async loginGoogle(){
    try {
      return await this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (e) {
      console.log("Error en login: ", e);
      return null;
    }
  }

  async loginFacebook(){
    try {
      return await this.afauth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    } catch (e) {
      console.log("Error en login: ", e);
      return null;
    }
  }

  async cerrarSesion(){
    await this.afauth.signOut();
  }

  async recuperarContrasena(correo: string){
    try{
      return this.afauth.sendPasswordResetEmail(correo);
    }catch(e){
      console.log("Error recuperar contraseña ", e);
    }
  }

  stateUser(){
    return this.afauth.authState;
  }

}
