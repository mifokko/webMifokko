import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { RecuperarContrasenaComponent } from '../recuperar-contrasena/recuperar-contrasena.component';
import { RegisterUsuarioGeneralComponent } from '../register-usuario-general/register-usuario-general.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario = {
    correo: '',
    contrasena: ''
  }

  user: Usuario = {
    correo: '',
    password: '',
    uid: '',
    perfil: 'general',
    referencia: '',
    plan: 'general',
    fechaInicio: '',
    fechaFin: '',
    estadoPago: false,
  }

  fechaFin: string[] = []
  id = '';
  usuarios!: Usuario;

  constructor(public modal: NgbActiveModal, private modalService: NgbModal, private authService: AuthService, private router: Router, private firestore: DataServices) { }

  ngOnInit(): void {
    console.log('Login');
  }

  openGeneral() {
    this.modalService.open(RegisterUsuarioGeneralComponent);
  }

  openRecuperar() {
    this.modalService.open(RecuperarContrasenaComponent, { size: 'sm', centered: true });
  }

  async Ingresar() {
    //console.log(this.usuario);
    const { correo, contrasena } = this.usuario;
    try {
      await this.authService.loginGeneral(correo, contrasena).then(res => {
        console.log("Ingreso");
      });
      this.modal.close();
      //this.router.navigate(['/home']);
    } catch (error: any) {
      Swal.fire('Error iniciando sesion: \n Correo y/o Contraseña incorrectos');
    }

  }

  IngresarGoogle() {
    this.authService.loginGoogle().then(res => {
      console.log("Ingreso");

      this.modal.close();
    });
  }

  IngresarFacebook() {
    this.authService.loginFacebook().then(res => {
      console.log("Ingreso", res);
      const correo = JSON.stringify(res?.user?.email);
      const uid = JSON.stringify(res?.user?.uid);
      this.user.correo = correo.substring(1, correo.length - 1)
      this.user.uid = uid.substring(1, uid.length - 1)
      console.log(this.user);
      this.firestore.createDoc(this.user, 'Usuarios', this.user.uid);
      this.modal.close();
    });
  }

  refresh(): void {
    window.location.reload();
  }

}
