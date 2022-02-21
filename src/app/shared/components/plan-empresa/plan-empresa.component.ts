import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-plan-empresa',
  templateUrl: './plan-empresa.component.html',
  styleUrls: ['./plan-empresa.component.scss']
})
export class PlanEmpresaComponent implements OnInit {

  constructor(public modalService: NgbModal, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  openRegisterEmpresa(){
    const modalRef = this.modalService.open(RegisterComponent);
  }
}
