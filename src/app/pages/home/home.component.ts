import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanEmpresaComponent } from 'src/app/shared/components/plan-empresa/plan-empresa.component';
import { PlanIndependienteComponent } from 'src/app/shared/components/plan-independiente/plan-independiente.component';
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
    console.log('Home');
  }
  
  inView(ele: any) {
    ele.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
  }

  openPlanEmpresa(){
    const modalRef = this.modalService.open(PlanEmpresaComponent);
  }

  openPlanIndependiente(){
    const modalRef1 = this.modalService.open(PlanIndependienteComponent);
  }

  openRegisterUsuario(){
    const modalRef2 = this.modalService.open(RegisterUsuarioGeneralComponent);
  }
}
