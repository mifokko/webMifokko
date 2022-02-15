import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaIndependienteComponent } from './busqueda-independiente.component';

const routes: Routes = [{ path: '', component: BusquedaIndependienteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusquedaIndependienteRoutingModule { }
