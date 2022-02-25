import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent implements OnInit {
  
  user = {
    correo: ''
  }

  constructor(public modal: NgbActiveModal, private modalService: NgbModal, private authService: AuthService) { }

  ngOnInit(): void {
  }

  recuperar(){
    try {
      const {correo} = this.user;
      this.authService.recuperarContrasena(correo);
      alert("Revice por favor su correo y reestablesca su contraseña");
    } catch (error) {
      alert(error);
    }
    const {correo} = this.user;
    this.authService.recuperarContrasena(correo);

  }
  openLogin(){
    this.modalService.open(LoginComponent, {size: 'sm', centered: true});
  }
}
