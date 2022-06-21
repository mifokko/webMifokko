import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { PlanEmpresaComponent } from '../plan-empresa/plan-empresa.component';
import { PlanIndependienteComponent } from '../plan-independiente/plan-independiente.component';
import { RegisterUsuarioGeneralComponent } from '../register-usuario-general/register-usuario-general.component';

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
    this.modalService.open(PlanEmpresaComponent, {backdrop: 'static'});
  }

  openIndependiente(){
    this.modalService.open(PlanIndependienteComponent, {backdrop: 'static'});
  }

  openGeneral(){
    this.modalService.open(RegisterUsuarioGeneralComponent, {backdrop: 'static'});
  }
}
