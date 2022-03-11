import { Component, OnInit } from '@angular/core';
import { Oferta } from '../../model/oferta.model';

@Component({
  selector: 'app-ver-ofertas',
  templateUrl: './ver-ofertas.component.html',
  styleUrls: ['./ver-ofertas.component.scss']
})
export class VerOfertasComponent implements OnInit {

  oferta: Oferta = {
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
    estado: true,
  }

  constructor() { }

  ngOnInit(): void {
  }

}
