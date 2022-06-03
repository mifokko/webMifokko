import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterIndependienteComponent } from '../register-independiente/register-independiente.component';

@Component({
  selector: 'app-plan-independiente',
  templateUrl: './plan-independiente.component.html',
  styleUrls: ['./plan-independiente.component.scss']
})
export class PlanIndependienteComponent implements OnInit {

  plan!: string;

  constructor(public modalService: NgbModal, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log('Plan independiente');
  }

  openRegisterIndependiente(e: any, tipoPlan: string, pagos: string){
    this.plan = e;
    console.log(this.plan);
    const modalRef = this.modalService.open(RegisterIndependienteComponent);
    //Pasando tipo de tipo de plan elegido, precio del plan y acuerdos de pago
    modalRef.componentInstance.passedData = tipoPlan;
    modalRef.componentInstance.precioPlan = e;
    modalRef.componentInstance.pagos = pagos;
  }

}
