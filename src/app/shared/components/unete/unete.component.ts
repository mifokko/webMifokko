import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { PlanEmpresaComponent } from '../plan-empresa/plan-empresa.component';
import { PlanIndependienteComponent } from '../plan-independiente/plan-independiente.component';
import { RegisterIndependienteComponent } from '../register-independiente/register-independiente.component';
import { RegisterUsuarioGeneralComponent } from '../register-usuario-general/register-usuario-general.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-unete',
  templateUrl: './unete.component.html',
  styleUrls: ['./unete.component.scss']
})
export class UneteComponent implements OnInit {
  
  login: boolean = false;
  constructor(public modal: NgbActiveModal, private modalService: NgbModal, private authService: AuthService) { }

  ngOnInit(): void {
    console.log('Únete');
  }

  openEmpresa(){
    this.modalService.open(PlanEmpresaComponent);
  }

  openIndependiente(){
    this.modalService.open(PlanIndependienteComponent);
  }

  openGeneral(){
    this.modalService.open(RegisterUsuarioGeneralComponent);
  }
}
