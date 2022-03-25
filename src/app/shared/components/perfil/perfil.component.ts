import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../model/empresa.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  empresas: Empresa[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  inView(ele: any) {
    ele.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
  }
  


}
