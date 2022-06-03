import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterIndependienteComponent } from './register-independiente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    RegisterIndependienteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule
  ]
})
export class RegisterIndependienteModule { }
