import { Component, OnInit} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-plan-empresa',
  templateUrl: './plan-empresa.component.html',
  styleUrls: ['./plan-empresa.component.scss']
})
export class PlanEmpresaComponent implements OnInit {

  plan!: string;

  constructor(public modalService: NgbModal, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log('Plan empresa');
  }

  openRegisterEmpresa(e: any, tipoPlan: string, numPagos: string){
    this.plan = e;
    console.log(this.plan);
    const modalRef = this.modalService.open(RegisterComponent, {backdrop: 'static'});
    modalRef.componentInstance.passedData = tipoPlan;
    modalRef.componentInstance.precioPlan = e;
    modalRef.componentInstance.pagos = numPagos;
  }


}
