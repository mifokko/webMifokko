import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuscarTodoRoutingModule } from './buscar-todo-routing.module';
import { BuscarTodoComponent } from './buscar-todo.component';


@NgModule({
  declarations: [
    BuscarTodoComponent
  ],
  imports: [
    CommonModule,
    BuscarTodoRoutingModule
  ]
})
export class BuscarTodoModule { }
