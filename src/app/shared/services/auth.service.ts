import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth } from '@firebase/auth';
import { User } from '@firebase/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afauth: AngularFireAuth) { }

  async register(correo: string, contrasena: string){
    try {
      return await this.afauth.createUserWithEmailAndPassword(correo,contrasena);
    } catch (e) {
      console.log("Error en login: ", e);
      return null;
    }
  }

  async loginGeneral(correo: string, contrasena: string){
    try {
      return await this.afauth.signInWithEmailAndPassword(correo,contrasena);
    } catch (e) {
      console.log("Error en login: ", e);
      return null;
    }
  }

  async loginGoogle(correo: string, contrasena: string){
    try {
      return await this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (e) {
      console.log("Error en login: ", e);
      return null;
    }
  }

  async loginFacebook(correo: string, contrasena: string){
    return null;
    try {
      return await this.afauth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    } catch (e) {
      console.log("Error en login: ", e);
    }
  }

  async cerrarSesion(){
    await this.afauth.signOut();
  }

  getCurrentUser(){

  }
}
