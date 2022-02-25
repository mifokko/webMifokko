import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth } from '@firebase/auth';
import { User } from '@firebase/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: Observable<firebase.User | null>;

  constructor(private afauth: AngularFireAuth) { 
    this.user = this.afauth.authState;
  }

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

  //Obtener el estado de autenticación 
  getAuthenticated() : boolean {
    return this.user != null;
  }

  async getCurrentUser(){
    return this.user;
  }

  async recuperarContrasena(correo: string){
    try{
      return this.afauth.sendPasswordResetEmail(correo);
    }catch(e){
      console.log("Error recuperar contraseña ", e);
    }

  }
}
