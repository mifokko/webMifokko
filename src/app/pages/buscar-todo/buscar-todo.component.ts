import { ConsoleLogger } from '@angular/compiler-cli/private/localize';
import { Component, OnInit } from '@angular/core';
import { Busqueda } from 'src/app/shared/model/busqueda.model';
import { Empresa } from 'src/app/shared/model/empresa.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataServices } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-buscar-todo',
  templateUrl: './buscar-todo.component.html',
  styleUrls: ['./buscar-todo.component.scss']
})
export class BuscarTodoComponent implements OnInit {

  busqueda: Busqueda[] = [];
  constructor(private authService: AuthService, private firestore: DataServices) { }

  ngOnInit(): void {
    console.log('buscar');
    this.getBuscar();
  }


  getBuscar(){
    this.firestore.getCollection<Empresa>('Empresas').subscribe( res => {
      this.busqueda = res;
      console.log(this.busqueda);
    });
  }
}
