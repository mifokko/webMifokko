import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuscarTodoRoutingModule } from './buscar-todo-routing.module';
import { BuscarTodoComponent } from './buscar-todo.component';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    BuscarTodoComponent
  ],
  imports: [
    CommonModule,
    BuscarTodoRoutingModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class BuscarTodoModule { }
