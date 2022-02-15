import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarTodoComponent } from './buscar-todo.component';

const routes: Routes = [{ path: '', component: BuscarTodoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuscarTodoRoutingModule { }
