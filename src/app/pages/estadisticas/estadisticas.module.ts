import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadisticasRoutingModule } from './estadisticas-routing.module';
import { EstadisticasComponent } from './estadisticas.component';
import { FormsModule } from '@angular/forms';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';


@NgModule({
  declarations: [
    EstadisticasComponent
  ],
  imports: [
    CommonModule,
    EstadisticasRoutingModule,
    FormsModule,
    Ng2GoogleChartsModule
  ]
})
export class EstadisticasModule { }
