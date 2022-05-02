import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
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

  constructor(public modal: NgbActiveModal, private modalService: NgbModal, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    console.log('Login');
  }

  openGeneral() {
    this.modalService.open(RegisterUsuarioGeneralComponent);
  }

  openRecuperar(){
    this.modalService.open(RecuperarContrasenaComponent, {size: 'sm', centered: true});
  }

  async Ingresar(){
    console.log(this.usuario);
    const {correo, contrasena} = this.usuario;
    try {
      await this.authService.loginGeneral(correo, contrasena).then(res => {
        console.log("se ingreso con", res);
      });
      this.modal.close();
      //this.router.navigate(['/home']);
    } catch (error: any) {
      Swal.fire('Error iniciando sesion: \n Correo y/o Contraseña incorrectos');
    }
    
  }

  IngresarGoogle(){
    console.log(this.usuario);
    const {correo, contrasena} = this.usuario;
    this.authService.loginGoogle(correo, contrasena).then(res => {
    console.log("se ingreso con", res);
    this.modal.close();
    });
  }

  IngresarFacebook(){
    console.log(this.usuario);
    const {correo, contrasena} = this.usuario;
    this.authService.loginFacebook(correo, contrasena).then(res => {
    console.log("se ingreso con", res);
    this.modal.close();
    });
  }

  refresh(): void {
    window.location.reload();
  }

}
