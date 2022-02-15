import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusquedaEmpresaRoutingModule } from './busqueda-empresa-routing.module';
import { BusquedaEmpresaComponent } from './busqueda-empresa.component';


@NgModule({
  declarations: [
    BusquedaEmpresaComponent
  ],
  imports: [
    CommonModule,
    BusquedaEmpresaRoutingModule
  ]
})
export class BusquedaEmpresaModule { }
