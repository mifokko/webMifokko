import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaEmpresaComponent } from './busqueda-empresa.component';

const routes: Routes = [{ path: '', component: BusquedaEmpresaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusquedaEmpresaRoutingModule { }
