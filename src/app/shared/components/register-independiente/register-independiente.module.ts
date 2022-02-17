import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterIndependienteComponent } from './register-independiente.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RegisterIndependienteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class RegisterIndependienteModule { }
