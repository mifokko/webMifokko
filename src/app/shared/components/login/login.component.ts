import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
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

  constructor(public modal: NgbActiveModal, private modalService: NgbModal, private authService: AuthService) { }

  ngOnInit(): void {
  }

  openGeneral() {
    const modalRef = this.modalService.open(RegisterUsuarioGeneralComponent);
  }

  Ingresar(){
    console.log(this.usuario);
    const {correo, contrasena} = this.usuario;
    this.authService.loginGeneral(correo, contrasena).then(res => {
    console.log("se ingreso con", res);
    });

  }

  IngresarGoogle(){
    console.log(this.usuario);
    const {correo, contrasena} = this.usuario;
    this.authService.loginGoogle(correo, contrasena).then(res => {
    console.log("se ingreso con", res);
    });
  }

  IngresarFacebook(){
    console.log(this.usuario);
    const {correo, contrasena} = this.usuario;
    this.authService.loginFacebook(correo, contrasena).then(res => {
    console.log("se ingreso con", res);
    });
  }
}
