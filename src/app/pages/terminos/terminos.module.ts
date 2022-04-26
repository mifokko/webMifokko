import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminosRoutingModule } from './terminos-routing.module';
import { TerminosComponent } from './terminos.component';


@NgModule({
  declarations: [
    TerminosComponent
  ],
  imports: [
    CommonModule,
    TerminosRoutingModule
  ]
})
export class TerminosModule { }
