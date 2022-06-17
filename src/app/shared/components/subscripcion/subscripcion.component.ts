import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subscripcion',
  templateUrl: './subscripcion.component.html',
  styleUrls: ['./subscripcion.component.scss']
})
export class SubscripcionComponent implements OnInit {

  pago!: number;
  referencia!: string;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.pago, this.referencia);
  }

}
