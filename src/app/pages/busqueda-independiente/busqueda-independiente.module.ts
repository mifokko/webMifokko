import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusquedaIndependienteRoutingModule } from './busqueda-independiente-routing.module';
import { BusquedaIndependienteComponent } from './busqueda-independiente.component';


@NgModule({
  declarations: [
    BusquedaIndependienteComponent
  ],
  imports: [
    CommonModule,
    BusquedaIndependienteRoutingModule
  ]
})
export class BusquedaIndependienteModule { }
