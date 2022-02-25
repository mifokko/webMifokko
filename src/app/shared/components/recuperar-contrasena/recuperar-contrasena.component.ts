import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent implements OnInit {
  

  constructor(public modal: NgbActiveModal, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openLogin(){
    this.modalService.open(LoginComponent, {size: 'sm', centered: true});
  }
}
