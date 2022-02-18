import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterIndependienteComponent } from 'src/app/shared/components/register-independiente/register-independiente.component';
import { RegisterUsuarioGeneralComponent } from 'src/app/shared/components/register-usuario-general/register-usuario-general.component';
import { RegisterComponent } from 'src/app/shared/components/register/register.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  constructor( private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  
  openRegisterEmpresa(){
    const modalRef = this.modalService.open(RegisterComponent);
  }

  openRegisterIndependiente(){
    const modalRef1 = this.modalService.open(RegisterIndependienteComponent);
  }

  openRegisterUsuario(){
    const modalRef2 = this.modalService.open(RegisterUsuarioGeneralComponent);
  }
}
