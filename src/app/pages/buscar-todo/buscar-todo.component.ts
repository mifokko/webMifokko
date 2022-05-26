import { ConsoleLogger } from '@angular/compiler-cli/private/localize';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Busqueda, BusquedaI, BusquedaO } from 'src/app/shared/model/busqueda.model';
import { Empresa } from 'src/app/shared/model/empresa.model';
import { Independiente } from 'src/app/shared/model/independiente.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataServices } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-buscar-todo',
  templateUrl: './buscar-todo.component.html',
  styleUrls: ['./buscar-todo.component.scss']
})
export class BuscarTodoComponent implements OnInit {
  //rol!: false;
  rol: 'empresa' | 'independiente' | undefined;
  seleccion = '';
  palabra = '';
  busquedaE: Busqueda[] = [];
  busquedaI: BusquedaI[] = [];
  busquedaOE: BusquedaO[] = [];
  busquedaOI: BusquedaO[] = [];
  busquedaOI2: BusquedaO[] = [];
  busquedaO: BusquedaO[] = [];

  //Redireccionar a perfil empresa
  verPerfilEmpresa(id: string) {
    this.router.navigate(['/perfil', id]);
  }

  //Redireccionar a perfil indepedniente
  verPerfilIndep(id: string) {
    this.router.navigate(['/perfilIndependiente', id]);
  }

  //Redireccionar a perfil oferta
  verPerfilOferta(uid: string, id: string) {
    this.router.navigate(['/perfilOfertas', uid , id]);
  }

  constructor(private authService: AuthService, private firestore: DataServices, private activatedRouter: ActivatedRoute, private router: Router) {
    activatedRouter.params.subscribe( prm => {
      console.log(`La seleccion es: ${prm['seleccion']}`);
      this.seleccion = JSON.stringify(prm['seleccion']).toString();
      this.seleccion = this.seleccion.substring(1, this.seleccion.length-1);
      this.palabra = JSON.stringify(prm['palabra']).toString();
      this.palabra = this.palabra.substring(1, this.palabra.length-1);
      console.log(this.seleccion + ' / ' + this.palabra);
      this.getBuscar(this.seleccion);
    });
   }

  ngOnInit(): void {
    console.log('buscar');
    //this.getBuscar();
  }


  getBuscar(seleccion: string){
    //Buscar en empresas
    if (seleccion == 'empresa') {
      this.firestore.getCollection<Busqueda>('Empresas').subscribe( res => {
        this.busquedaE = res;
      });
    }

    //Buscar en independientes
    if (seleccion == 'independiente') {
      this.firestore.getCollection<BusquedaI>('Independiente').subscribe( res => {
        this.busquedaI = res;
      });
    }
    
    //buscar por ofertas
    if (seleccion == 'ofertas') {
      this.firestore.getCollection<Busqueda>('Empresas').subscribe( res => {
        this.busquedaE = res;
        //console.log(this.busquedaE);
        for (let index = 0; index < this.busquedaE.length; index++) {
          //console.log('paso');
          this.firestore.getDocCol<BusquedaO>('Empresas', this.busquedaE[index].id, 'Ofertas').subscribe( res => {
            const num = index;
            if (this.busquedaO.length == 0) {
              this.busquedaO = res;
              for (let index = 0; index < this.busquedaO.length; index++) {
                this.busquedaO[index].fotoPerfil = this.busquedaE[num].fotoPerfil;
                this.busquedaO[index].uid = this.busquedaE[num].id;
              }
            }else if (this.busquedaO.length > 0){
              this.busquedaOE = res;
              for (let index = 0; index < this.busquedaOE.length; index++) {
                this.busquedaOE[index].fotoPerfil = this.busquedaE[num].fotoPerfil;
                this.busquedaOE[index].uid = this.busquedaE[num].id;
              }
              for (let index = 0; index < this.busquedaOE.length; index++) {
                this.busquedaO[this.busquedaO.length++] = this.busquedaOE[index]
              }
            }else {
              console.log('No ha publicado ofertas Emp');
            }
            //this.busquedaOE = [];
            //console.log('OE: ' + this.busquedaO.length);
            //console.log(this.busquedaOE);
          });
        }
        this.firestore.getCollection<BusquedaI>('Independiente').subscribe( res => {
          this.busquedaI = res;
          //console.log(this.busquedaI);
          for (let index = 0; index < this.busquedaI.length; index++) {
            //console.log('paso');
            this.firestore.getDocCol<BusquedaO>('Independiente', this.busquedaI[index].id, 'Ofertas').subscribe( res => {
              const num = index;
              if (this.busquedaO.length == 0) {
                this.busquedaO = res;
                for (let index = 0; index < this.busquedaO.length; index++) {
                  this.busquedaO[index].fotoPerfil = this.busquedaI[num].fotoPerfil;
                  this.busquedaO[index].uid = this.busquedaI[num].id;
                }
              }else if (this.busquedaO.length > 0) {
                this.busquedaOI = res;
                for (let index = 0; index < this.busquedaOI.length; index++) {
                  this.busquedaOI[index].fotoPerfil = this.busquedaI[num].fotoPerfil;
                  this.busquedaOI[index].uid = this.busquedaI[num].id;
                }
                for (let index = 0; index < this.busquedaOI.length; index++) {
                  this.busquedaO[this.busquedaO.length++] = this.busquedaOI[index];
                }
              }else{
                console.log('No ha publicado ofertas Indep')
              }
            });
          }
        });
      });
      this.busquedaOE = [];
      this.busquedaOI = [];
    }

    //Buscar entre todos
    if (seleccion == 'todos') {
      this.firestore.getCollection<Busqueda>('Empresas').subscribe( res => {
        this.busquedaE = res;
        //console.log(this.busquedaE);
        for (let index = 0; index < this.busquedaE.length; index++) {
          //console.log('paso');
          this.firestore.getDocCol<BusquedaO>('Empresas', this.busquedaE[index].id, 'Ofertas').subscribe( res => {
            const num = index;
            if (this.busquedaO.length == 0) {
              this.busquedaO = res;
              for (let index = 0; index < this.busquedaO.length; index++) {
                this.busquedaO[index].fotoPerfil = this.busquedaE[num].fotoPerfil;
                this.busquedaO[index].uid = this.busquedaE[num].id;
              }
            }else if (this.busquedaO.length > 0){
              this.busquedaOE = res;
              for (let index = 0; index < this.busquedaOE.length; index++) {
                this.busquedaOE[index].fotoPerfil = this.busquedaE[num].fotoPerfil;
                this.busquedaOE[index].uid = this.busquedaE[num].id;
              }
              for (let index = 0; index < this.busquedaOE.length; index++) {
                this.busquedaO[this.busquedaO.length++] = this.busquedaOE[index]
              }
            }else {
              console.log('No ha publicado ofertas Emp');
            }
            //this.busquedaOE = [];
            //console.log('OE: ' + this.busquedaO.length);
            //console.log(this.busquedaOE);
          });
        }
        this.firestore.getCollection<BusquedaI>('Independiente').subscribe( res => {
          this.busquedaI = res;
          //console.log(this.busquedaI);
          for (let index = 0; index < this.busquedaI.length; index++) {
            //console.log('paso');
            this.firestore.getDocCol<BusquedaO>('Independiente', this.busquedaI[index].id, 'Ofertas').subscribe( res => {
              const num = index;
              if (this.busquedaO.length == 0) {
                this.busquedaO = res;
                for (let index = 0; index < this.busquedaO.length; index++) {
                  this.busquedaO[index].fotoPerfil = this.busquedaI[num].fotoPerfil;
                  this.busquedaO[index].uid = this.busquedaI[num].id;
                }
              }else if (this.busquedaO.length > 0) {
                this.busquedaOI = res;
                for (let index = 0; index < this.busquedaOI.length; index++) {
                  this.busquedaOI[index].fotoPerfil = this.busquedaI[num].fotoPerfil;
                  this.busquedaOI[index].uid = this.busquedaI[num].id;
                }
                for (let index = 0; index < this.busquedaOI.length; index++) {
                  this.busquedaO[this.busquedaO.length++] = this.busquedaOI[index];
                }
              }else{
                console.log('No ha publicado ofertas Indep')
              }
            });
          }
        });
      });
      this.busquedaOE = [];
      this.busquedaOI = [];
      
      
    }
    
  }
}
