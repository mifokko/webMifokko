import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subir-oferta',
  templateUrl: './subir-oferta.component.html',
  styleUrls: ['./subir-oferta.component.scss']
})
export class SubirOfertaComponent implements OnInit {

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  
}
