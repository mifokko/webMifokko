import { ConsoleLogger } from '@angular/compiler-cli/private/localize';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Busqueda, BusquedaI, BusquedaO } from 'src/app/shared/model/busqueda.model';
import { Estadisticas } from 'src/app/shared/model/estadistica.model';
import { Empresa } from 'src/app/shared/model/empresa.model';
import { Independiente } from 'src/app/shared/model/independiente.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataServices } from 'src/app/shared/services/data.service';
import { Usuario } from 'src/app/shared/model/user.model';
import { UsuarioG } from 'src/app/shared/services/dataRegUsuario.services';

@Component({
  selector: 'app-buscar-todo',
  templateUrl: './buscar-todo.component.html',
  styleUrls: ['./buscar-todo.component.scss']
})
export class BuscarTodoComponent implements OnInit {
  //rol!: false;
  rol = '';
  seleccion = '';
  palabra = '';
  busquedaE: Busqueda[] = [];
  busquedaI: BusquedaI[] = [];
  busquedaOE: BusquedaO[] = [];
  busquedaOI: BusquedaO[] = [];
  busquedaOI2: BusquedaO[] = [];
  busquedaO: BusquedaO[] = [];

  estadistica = {
    genero: '',
    fecha: ''
  }
  date: Date = new Date();
  login!: boolean;
  idUser = '';

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
    this.router.navigate(['/perfilOfertas', uid, id]);
  }

  constructor(private authService: AuthService, private firestore: DataServices, private activatedRouter: ActivatedRoute, private router: Router) {
    activatedRouter.params.subscribe(prm => {
      //console.log(`La seleccion es: ${prm['seleccion']}`);
      this.seleccion = JSON.stringify(prm['seleccion']).toString();
      this.seleccion = this.seleccion.substring(1, this.seleccion.length - 1);
      this.palabra = JSON.stringify(prm['palabra']).toString();
      this.palabra = this.palabra.substring(1, this.palabra.length - 1);
      //console.log(this.seleccion + ' / ' + this.palabra);
      this.getBuscar(this.seleccion);
    });
    this.authService.stateUser().subscribe(res => {
      if (res) {
        //console.log('Esta logeado');
        this.login = true;
        this.idUser = res.uid;
        this.getDatosUser(res.uid);
      } else {
        //console.log('No esta logeado');
        this.login = false;
      }
    });
  }

  ngOnInit(): void {
    console.log('buscar');
    //this.getBuscar();
  }

  //Guardar click para estadisticas de empresa e independiente 
  saveEstadistica(id: string, path: string) {
    //console.log('Estadisticas');
    let idEstadistica = '';
    const numeros = '0123456789';
    for (let i = 0; i < 6; i++) {
      idEstadistica += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    if (this.login == true && this.rol == 'general') {
      this.firestore.getDoc<UsuarioG>('UsuarioG', this.idUser).subscribe(res => {
        if (res) {
          this.estadistica.genero = res.genero;
          this.estadistica.fecha = this.date.toLocaleDateString();
          this.firestore.createColInDoc(this.estadistica, path, id, 'Estadisticas', idEstadistica);  
          //console.log('Estadistica guardada');
        }
      })
    }else if (this.login == true && this.rol != 'general' || this.login == false) {
      this.estadistica.genero = 'Otros';
      this.estadistica.fecha = this.date.toLocaleDateString();
      this.firestore.createColInDoc(this.estadistica, path, id, 'Estadisticas', idEstadistica);
      //console.log('Estadistica guardada');
    }else {
      console.log('No se pudo almacenar la estadistica');
    }
    
  }

  //Guardar click para estadisticas de oferta
  saveEstadisticaOferta(id: string, idOfert: string, path: string) {
    let idEstadistica = '';
    const numeros = '0123456789';
    for (let i = 0; i < 6; i++) {
      idEstadistica += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    if (this.login == true && this.rol == 'general') {
      this.firestore.getDoc<UsuarioG>('UsuarioG', this.idUser).subscribe(res => {
        if (res) {
          this.estadistica.genero = res.genero;
          this.estadistica.fecha = this.date.toLocaleDateString();
          this.firestore.createColInDocColl(this.estadistica, path, id, 'Ofertas', idOfert, 'Estadisticas', idEstadistica);  
          console.log('Estadistica guardada');
        }
      })
    }else if (this.login == true && this.rol != 'general' || this.login == false) {
      this.estadistica.genero = 'Otros';
      this.estadistica.fecha = this.date.toLocaleDateString();
      this.firestore.createColInDocColl(this.estadistica, path, id, 'Ofertas', idOfert, 'Estadisticas', idEstadistica);
      console.log('Estadistica guardada');
    }else {
      console.log('No se pudo almacenar la estadistica');
    }
  }

  getDatosUser(id: string) {
    this.firestore.getDoc<Usuario>('Usuarios', id).subscribe(res => {
      if (res) {
        this.rol = res.perfil;
      }
    });
  }

  getBuscar(seleccion: string) {
    //Buscar en empresas
    if (seleccion == 'empresa') {
      this.firestore.getCollection<Busqueda>('Empresas').subscribe(res => {
        this.busquedaE = res;
      });
    }

    //Buscar en independientes
    if (seleccion == 'independiente') {
      this.firestore.getCollection<BusquedaI>('Independiente').subscribe(res => {
        this.busquedaI = res;
      });
    }

    //buscar por ofertas
    if (seleccion == 'ofertas') {
      this.firestore.getCollection<Busqueda>('Empresas').subscribe(res => {
        this.busquedaE = res;
        //console.log(this.busquedaE);
        for (let index = 0; index < this.busquedaE.length; index++) {
          //console.log('paso');
          this.firestore.getDocCol<BusquedaO>('Empresas', this.busquedaE[index].id, 'Ofertas').subscribe(res => {
            const num = index;
            if (this.busquedaO.length == 0) {
              this.busquedaO = res;
              for (let index = 0; index < this.busquedaO.length; index++) {
                this.busquedaO[index].fotoPerfil = this.busquedaE[num].fotoPerfil;
                this.busquedaO[index].uid = this.busquedaE[num].id;
                this.busquedaO[index].path = 'Empresas';
              }
            } else if (this.busquedaO.length > 0) {
              this.busquedaOE = res;
              for (let index = 0; index < this.busquedaOE.length; index++) {
                this.busquedaOE[index].fotoPerfil = this.busquedaE[num].fotoPerfil;
                this.busquedaOE[index].uid = this.busquedaE[num].id;
                this.busquedaOE[index].path = 'Empresas';
              }
              for (let index = 0; index < this.busquedaOE.length; index++) {
                this.busquedaO[this.busquedaO.length++] = this.busquedaOE[index]
              }
            } else {
              console.log('No ha publicado ofertas Emp');
            }
            //this.busquedaOE = [];
            //console.log('OE: ' + this.busquedaO.length);
            //console.log(this.busquedaOE);
          });
        }
        this.firestore.getCollection<BusquedaI>('Independiente').subscribe(res => {
          this.busquedaI = res;
          //console.log(this.busquedaI);
          for (let index = 0; index < this.busquedaI.length; index++) {
            //console.log('paso');
            this.firestore.getDocCol<BusquedaO>('Independiente', this.busquedaI[index].id, 'Ofertas').subscribe(res => {
              const num = index;
              if (this.busquedaO.length == 0) {
                this.busquedaO = res;
                for (let index = 0; index < this.busquedaO.length; index++) {
                  this.busquedaO[index].fotoPerfil = this.busquedaI[num].fotoPerfil;
                  this.busquedaO[index].uid = this.busquedaI[num].id;
                  this.busquedaO[index].path = 'Independiente';
                }
              } else if (this.busquedaO.length > 0) {
                this.busquedaOI = res;
                for (let index = 0; index < this.busquedaOI.length; index++) {
                  this.busquedaOI[index].fotoPerfil = this.busquedaI[num].fotoPerfil;
                  this.busquedaOI[index].uid = this.busquedaI[num].id;
                  this.busquedaOI[index].path = 'Independiente';
                }
                for (let index = 0; index < this.busquedaOI.length; index++) {
                  this.busquedaO[this.busquedaO.length++] = this.busquedaOI[index];
                }
              } else {
                console.log('No ha publicado ofertas Indep')
              }
              for (let index = 0; index < this.busquedaO.length; index++) {
                if (this.busquedaO[index].fechaInicio.month.toLocaleString() === (this.date.getMonth() + 1).toLocaleString() && this.busquedaO[index].fechaInicio.year.toLocaleString() === this.date.getFullYear().toLocaleString()) {
                  //console.log(true);
                  if (this.date.getDate() >= this.busquedaO[index].fechaInicio.day && this.date.getDate() <= this.busquedaO[index].fechaFin.day) {
                    this.busquedaO[index].estado = 'Activo';
                    //this.firestore.updateCamposDocCollDoc2(this.busquedaO[index].estado, path, this.uid, 'busquedaOs', this.busquedaO[index].id , 'estado');
                  } else {
                    this.busquedaO[index].estado = 'Inactivo';
                    //this.firestore.updateCamposDocCollDoc2(this.busquedaO[index].estado, path, this.uid, 'busquedaOs', this.busquedaO[index].id , 'estado');
                  }
                }
              }
              //console.log(this.busquedaO.length);
              for (let index = 0; index < this.busquedaO.length; index++) {
                if (this.busquedaO[index].estado == 'Inactivo') {
                  this.busquedaO = this.busquedaO.splice(0, index);
                } else {
                  //console.log('No se elimino ');
                }
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
      this.firestore.getCollection<Busqueda>('Empresas').subscribe(res => {
        this.busquedaE = res;
        //console.log(this.busquedaE);
        for (let index = 0; index < this.busquedaE.length; index++) {
          //console.log('paso');
          this.firestore.getDocCol<BusquedaO>('Empresas', this.busquedaE[index].id, 'Ofertas').subscribe(res => {
            const num = index;
            if (this.busquedaO.length == 0) {
              this.busquedaO = res;
              for (let index = 0; index < this.busquedaO.length; index++) {
                this.busquedaO[index].fotoPerfil = this.busquedaE[num].fotoPerfil;
                this.busquedaO[index].uid = this.busquedaE[num].id;
              }
            } else if (this.busquedaO.length > 0) {
              this.busquedaOE = res;
              for (let index = 0; index < this.busquedaOE.length; index++) {
                this.busquedaOE[index].fotoPerfil = this.busquedaE[num].fotoPerfil;
                this.busquedaOE[index].uid = this.busquedaE[num].id;
              }
              for (let index = 0; index < this.busquedaOE.length; index++) {
                this.busquedaO[this.busquedaO.length++] = this.busquedaOE[index]
              }
            } else {
              console.log('No ha publicado ofertas Emp');
            }
            //this.busquedaOE = [];
            //console.log('OE: ' + this.busquedaO.length);
            //console.log(this.busquedaOE);
          });
        }
        this.firestore.getCollection<BusquedaI>('Independiente').subscribe(res => {
          this.busquedaI = res;
          //console.log(this.busquedaI);
          for (let index = 0; index < this.busquedaI.length; index++) {
            //console.log('paso');
            this.firestore.getDocCol<BusquedaO>('Independiente', this.busquedaI[index].id, 'Ofertas').subscribe(res => {
              const num = index;
              if (this.busquedaO.length == 0) {
                this.busquedaO = res;
                for (let index = 0; index < this.busquedaO.length; index++) {
                  this.busquedaO[index].fotoPerfil = this.busquedaI[num].fotoPerfil;
                  this.busquedaO[index].uid = this.busquedaI[num].id;
                }
              } else if (this.busquedaO.length > 0) {
                this.busquedaOI = res;
                for (let index = 0; index < this.busquedaOI.length; index++) {
                  this.busquedaOI[index].fotoPerfil = this.busquedaI[num].fotoPerfil;
                  this.busquedaOI[index].uid = this.busquedaI[num].id;
                }
                for (let index = 0; index < this.busquedaOI.length; index++) {
                  this.busquedaO[this.busquedaO.length++] = this.busquedaOI[index];
                }
              } else {
                console.log('No ha publicado ofertas Indep')
              }

              for (let index = 0; index < this.busquedaO.length; index++) {
                if (this.busquedaO[index].fechaInicio.month.toLocaleString() === (this.date.getMonth() + 1).toLocaleString() && this.busquedaO[index].fechaInicio.year.toLocaleString() === this.date.getFullYear().toLocaleString()) {
                  //console.log(true);
                  if (this.date.getDate() >= this.busquedaO[index].fechaInicio.day && this.date.getDate() <= this.busquedaO[index].fechaFin.day) {
                    this.busquedaO[index].estado = 'Activo';
                    //this.firestore.updateCamposDocCollDoc2(this.busquedaO[index].estado, path, this.uid, 'busquedaOs', this.busquedaO[index].id , 'estado');
                  } else {
                    this.busquedaO[index].estado = 'Inactivo';
                    //this.firestore.updateCamposDocCollDoc2(this.busquedaO[index].estado, path, this.uid, 'busquedaOs', this.busquedaO[index].id , 'estado');
                  }
                }
              }
              //console.log(this.busquedaO.length);
              for (let index = 0; index < this.busquedaO.length; index++) {
                if (this.busquedaO[index].estado == 'Inactivo') {
                  this.busquedaO = this.busquedaO.splice(0, index);
                } else {
                  //console.log('No se elimino ');
                }
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
