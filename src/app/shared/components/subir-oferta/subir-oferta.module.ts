import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SubirOfertaComponent } from './subir-oferta.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    SubirOfertaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class SubirOfertaModule { }
