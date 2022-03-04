import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { RecuperarContrasenaComponent } from '../recuperar-contrasena/recuperar-contrasena.component';
import { RegisterUsuarioGeneralComponent } from '../register-usuario-general/register-usuario-general.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  emailOrPasswordIncorrectas: boolean = false;

  usuario = {
    correo: '',
    contrasena: ''
  }

  constructor(public modal: NgbActiveModal, private modalService: NgbModal, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  openGeneral() {
    const modalRef = this.modalService.open(RegisterUsuarioGeneralComponent);
  }

  openRecuperar(){
    this.modalService.open(RecuperarContrasenaComponent, {size: 'sm', centered: true});
  }

  Ingresar(){
    console.log(this.usuario);
    const {correo, contrasena} = this.usuario;
    this.router.navigate(['/home']);
    this.authService.loginGeneral(correo, contrasena).then(res => {
    console.log("se ingreso con", res);
    });
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
