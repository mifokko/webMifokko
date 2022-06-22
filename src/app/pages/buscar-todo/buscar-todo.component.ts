import { ConsoleLogger } from '@angular/compiler-cli/private/localize';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Busqueda, BusquedaI, BusquedaO } from 'src/app/shared/model/busqueda.model';
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
  rol = ''; // perfil del usuario que ha iniciado sesion 
  seleccion = ''; // Filtro de busqueda 
  palabra = ''; // Palabra a buscar 
  ciudad = ''; // Ciudad donde se esta buscando el servicio 
  busquedaE: Busqueda[] = []; //Lista de Empresas
  busquedaI: BusquedaI[] = []; // Lista de independientes
  busquedaOE: BusquedaO[] = []; // Lista de Ofertas por empresa
  busquedaOI: BusquedaO[] = []; // Lista de Ofertas por independiente
  busquedaOI2: BusquedaO[] = []; // Lista de ofertas por independiente
  busquedaO: BusquedaO[] = []; // Lista de ofertas disponibles
  resultadosE: Busqueda[] = []; // Lista de resultados de busqueda empresa
  resultadosI: BusquedaI[] = []; // Lista de resultados de busqueda independiente
  resultadosO: BusquedaO[] = []; // Lista de resultados de busqueda ofertas

  //Esta estructura se utliza para almacenar la informacion necesaria para las estadisticas 
  estadistica = {
    genero: '',
    fecha: ''
  }

  page!: number; // Paginas en las que se dividira el contenido 
  resultados: boolean = false; 

  date: Date = new Date(); // Se utiliza para obtenr la fecha actual 
  login!: boolean; // Muestra si se ha iniado sesion o no 
  idUser = ''; //Muestra el id del usuario que ha iniado sesion 

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

  //Dar formato a seleccion
  opcionBusqueda = '';

  constructor(private authService: AuthService, private firestore: DataServices, private activatedRouter: ActivatedRoute, private router: Router) {
    activatedRouter.params.subscribe(prm => {
      //console.log(`La seleccion es: ${prm['seleccion']}`);
      this.seleccion = JSON.stringify(prm['seleccion']).toString();
      this.seleccion = this.seleccion.substring(1, this.seleccion.length - 1);
      this.palabra = JSON.stringify(prm['palabra']).toString();
      this.palabra = this.palabra.substring(1, this.palabra.length - 1);
      this.ciudad = JSON.stringify(prm['ciudad']).toString();
      this.ciudad = this.ciudad.substring(1, this.ciudad.length - 1);
      //console.log(this.seleccion + ' / ' + this.palabra);
      this.getBuscar(this.seleccion, this.palabra.toLowerCase());
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

    this.opcionBusqueda = this.seleccion.charAt(0).toUpperCase() + this.seleccion.slice(1);
   
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
    } else if (this.login == true && this.rol != 'general' || this.login == false) {
      this.estadistica.genero = 'Otros';
      this.estadistica.fecha = this.date.toLocaleDateString();
      this.firestore.createColInDoc(this.estadistica, path, id, 'Estadisticas', idEstadistica);
      //console.log('Estadistica guardada');
    } else {
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
    } else if (this.login == true && this.rol != 'general' || this.login == false) {
      this.estadistica.genero = 'Otros';
      this.estadistica.fecha = this.date.toLocaleDateString();
      this.firestore.createColInDocColl(this.estadistica, path, id, 'Ofertas', idOfert, 'Estadisticas', idEstadistica);
      console.log('Estadistica guardada');
    } else {
      console.log('No se pudo almacenar la estadistica');
    }
  }

  //Se obtienen los datos del usuario que esta buscando, si esta resgistrado 
  getDatosUser(id: string) {
    this.firestore.getDoc<Usuario>('Usuarios', id).subscribe(res => {
      if (res) {
        this.rol = res.perfil;
      }
    });
  }

  //Se obtienen los resuktados de la busqueda
  getBuscar(seleccion: string, palabra: string) {
    this.resultadosE = [];
    this.resultadosI = [];
    this.resultadosO = [];
    //Buscar en empresas
    //console.log(seleccion, palabra);
    if (seleccion == 'empresa') {
      this.resultados = false;
      this.firestore.getCollection<Busqueda>('Empresas').subscribe(res => {
        this.busquedaE = res;

        for (let index = 0; index < this.busquedaE.length; index++) {
          if (this.busquedaE[index].actividadPrincipal.toLowerCase().indexOf(palabra) != -1 || this.busquedaE[index].descripcion.toLowerCase().indexOf(palabra) != -1 || this.busquedaE[index].servicios.toLowerCase().indexOf(palabra) != -1) {
            console.log('Si esta en la busqueda');
            console.log(this.ciudad);
            // Se verifica si se aplico filtro de ciudad y si es asi, se guarada en la lista de resultados los independientes que esten esa ciudad
            if (this.ciudad.length > 0) {
              if (this.busquedaE[index].ciudad == this.ciudad){
                console.log('paso ciudad');
                // Se verifica si la lista de resultados esta vacia, para guaradar el resultado en la posicion adecuada
                if (this.resultadosI.length == 0) {
                  this.resultadosE[0] = this.busquedaE[index];
                } else {
                  this.resultadosE[this.resultadosE.length++] = this.busquedaE[index];
                } 
              }
              //Si no hay filtro de ciudad, se guardan los resultados referentes solo a la palabra buscada
            }else{
              if (this.resultadosE.length == 0) {
                this.resultadosE[0] = this.busquedaE[index];
              } else {
                this.resultadosE[this.resultadosE.length++] = this.busquedaE[index];
              }
            }
            //Si no hay empresas que tengan el servicio buscado, devolvera una alerta
          } else {
            console.log('Esta empresa no tiene ese servicio');
          }
        }
        console.log(this.resultadosE);
        this.resultados = true;
      });
    }
//-------------------------------------------------------------------------------------------------------------
    //Buscar en independientes
    if (seleccion == 'independiente') {
      this.resultados = false;
      this.firestore.getCollection<BusquedaI>('Independiente').subscribe(res => {
        this.busquedaI = res;
        for (let index = 0; index < this.busquedaI.length; index++) {
          if (this.busquedaI[index].profesion.toLowerCase().indexOf(palabra) != -1 || this.busquedaI[index].descripcion.toLowerCase().indexOf(palabra) != -1 || this.busquedaI[index].servicios.toLowerCase().indexOf(palabra) != -1) {
            console.log('Si esta en la busqueda');
            console.log(this.ciudad);
            // Se verifica si se aplico filtro de ciudad y si es asi, se guarada en la lista de resultados los independientes que esten esa ciudad
            if (this.ciudad.length > 0) {
              if (this.busquedaI[index].ciudad == this.ciudad){
                console.log('paso ciudad');
                // Se verifica si la lista de resultados esta vacia, para guaradar el resultado en la posicion adecuada
                if (this.resultadosI.length == 0) {
                  this.resultadosI[0] = this.busquedaI[index];
                } else {
                  this.resultadosI[this.resultadosI.length++] = this.busquedaI[index];
                } 
              }
              //Si no hay filtro de ciudad, se guardan los resultados referentes solo a la palabra buscada
            }else{
              if (this.resultadosI.length == 0) {
                this.resultadosI[0] = this.busquedaI[index];
              } else {
                this.resultadosI[this.resultadosI.length++] = this.busquedaI[index];
              }
            }
            //Si no hay empresas que tengan el servicio buscado, devolvera una alerta
          } else {
            console.log('Esta empresa no tiene ese servicio');
          }
        }
        console.log(this.resultadosI);
        this.resultados = true;
      });
    }
//---------------------------------------------------------------------------------------------------------------
    //Buscar por ofertas
    if (seleccion == 'ofertas') {
      this.resultados = false;
      this.firestore.getCollection<Busqueda>('Empresas').subscribe(res => {
        this.busquedaE = res;
        //console.log(this.busquedaE);
        for (let index = 0; index < this.busquedaE.length; index++) {
          //console.log('paso');
          this.firestore.getDocCol<BusquedaO>('Empresas', this.busquedaE[index].id, 'Ofertas').subscribe(res => {
            const num = index;
            //Se verifica si busquedaO esta vacio 
            if (this.busquedaO.length == 0) {
              this.busquedaO = res;
              // Se asigna el identificador de la empresa en la cual se encuentra la oferta, si asigna foto de perfil e identificador, para cuando se valla a visitar el perfil de oferta, poder hacer la redireccion correcta
              for (let index = 0; index < this.busquedaO.length; index++) {
                this.busquedaO[index].fotoPerfil = this.busquedaE[num].fotoPerfil;
                this.busquedaO[index].uid = this.busquedaE[num].id;
                this.busquedaO[index].path = 'Empresas';
              }
            } else if (this.busquedaO.length > 0) {
              this.busquedaOE = res;
              // Se asigna el identificador de la empresa en la cual se encuentra la oferta, si asigna foto de perfil e identificador, para cuando se valla a visitar el perfil de oferta, poder hacer la redireccion correcta
              for (let index = 0; index < this.busquedaOE.length; index++) {
                this.busquedaOE[index].fotoPerfil = this.busquedaE[num].fotoPerfil;
                this.busquedaOE[index].uid = this.busquedaE[num].id;
                this.busquedaOE[index].path = 'Empresas';
              }
              //Se juntan las dos lista creadas hasta el momento 
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
        //Buscar ofertas en usuarios independientes
        this.firestore.getCollection<BusquedaI>('Independiente').subscribe(res => {
          this.busquedaI = res;
          //console.log(this.busquedaI);
          for (let index = 0; index < this.busquedaI.length; index++) {
            //console.log('paso');
            this.firestore.getDocCol<BusquedaO>('Independiente', this.busquedaI[index].id, 'Ofertas').subscribe(res => {
              const num = index;
              //Se verfica si la busquedaO esta vacia
              if (this.busquedaO.length == 0) {
                this.busquedaO = res;
                // Se asigna el identificador del independiente en la cual se encuentra la oferta, si asigna foto de perfil e identificador, para cuando se valla a visitar el perfil de oferta, poder hacer la redireccion correcta
                for (let index = 0; index < this.busquedaO.length; index++) {
                  this.busquedaO[index].fotoPerfil = this.busquedaI[num].fotoPerfil;
                  this.busquedaO[index].uid = this.busquedaI[num].id;
                  this.busquedaO[index].path = 'Independiente';
                }
              } else if (this.busquedaO.length > 0) {
                this.busquedaOI = res;
                // Se asigna el identificador de la empresa en la cual se encuentra la oferta, si asigna foto de perfil e identificador, para cuando se valla a visitar el perfil de oferta, poder hacer la redireccion correcta
                for (let index = 0; index < this.busquedaOI.length; index++) {
                  this.busquedaOI[index].fotoPerfil = this.busquedaI[num].fotoPerfil;
                  this.busquedaOI[index].uid = this.busquedaI[num].id;
                  this.busquedaOI[index].path = 'Independiente';
                }
                // Se juntan las lista generadas hasta el momentop, con todas las ofertas que se han publicado 
                for (let index = 0; index < this.busquedaOI.length; index++) {
                  this.busquedaO[this.busquedaO.length++] = this.busquedaOI[index];
                }
              } else {
                console.log('No ha publicado ofertas Indep')
              }
              //Se verifica la fecha de finalizacion de la oferta para saber si se encuentra activa o no 
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
              //Se guaradan en la lista las ofertas que se encuentran activas
              for (let index = 0; index < this.busquedaO.length; index++) {
                if (this.busquedaO[index].estado == 'Inactivo') {
                  this.busquedaO = this.busquedaO.splice(0, index);
                } else {
                  //console.log('No se elimino ');
                }
              }

              // Se filtran las ofertas por la palabra buscada y la ciudad
              for (let index = 0; index < this.busquedaO.length; index++) {
                if (this.busquedaO[index].descripcion.toLowerCase().indexOf(palabra) != -1 || this.busquedaO[index].nombreOferta.toLowerCase().indexOf(palabra) != -1 || this.busquedaO[index].informacionAdicional.toLowerCase().indexOf(palabra) != -1) {
                  console.log('Si esta en la busqueda');
                  console.log(this.ciudad);
                  // Se verifica si se aplico filtro de ciudad y si es asi, se guarada en la lista de resultados los independientes que esten esa ciudad
                  if (this.ciudad.length > 0) {
                    if (this.busquedaO[index].ciudad == this.ciudad){
                      console.log('paso ciudad');
                      // Se verifica si la lista de resultados esta vacia, para guaradar el resultado en la posicion adecuada
                      if (this.resultadosO.length == 0) {
                        this.resultadosO[0] = this.busquedaO[index];
                      } else {
                        this.resultadosO[this.resultadosO.length++] = this.busquedaO[index];
                      } 
                    }
                    //Si no hay filtro de ciudad, se guardan los resultados referentes solo a la palabra buscada
                  }else{
                    if (this.resultadosO.length == 0) {
                      this.resultadosO[0] = this.busquedaO[index];
                    } else {
                      this.resultadosO[this.resultadosO.length++] = this.busquedaO[index];
                    }
                  }
                } else {
                  console.log('No tiene ese servicio');
                }
              }
            });
          }
        });
      });
      this.busquedaOE = [];
      this.busquedaOI = [];
      this.resultados = true;
    }

//------------------------------------------------------------------------------------------------------------
    //Buscar entre todos
    if (seleccion == 'todos') {
      this.resultados = false;
      //BUSCANDO EMPRESAS
      this.firestore.getCollection<Busqueda>('Empresas').subscribe(res => {
        this.busquedaE = res;
         //Generando la lista de resultados según: "palabra" y/o "ciudad"
        for (let index = 0; index < this.busquedaE.length; index++) {
          if (this.busquedaE[index].actividadPrincipal.toLowerCase().indexOf(palabra) != -1 || this.busquedaE[index].descripcion.toLowerCase().indexOf(palabra) != -1 || this.busquedaE[index].servicios.toLowerCase().indexOf(palabra) != -1) {
            console.log('Si esta en la busqueda');
            console.log(this.ciudad);
            // Se verifica si se aplico filtro de ciudad y si es asi, se guarada en la lista de resultados los independientes que esten esa ciudad
            if (this.ciudad.length > 0) {
              if (this.busquedaE[index].ciudad == this.ciudad){
                console.log('paso ciudad');
                // Se verifica si la lista de resultados esta vacia, para guaradar el resultado en la posicion adecuada
                if (this.resultadosI.length == 0) {
                  this.resultadosE[0] = this.busquedaE[index];
                } else {
                  this.resultadosE[this.resultadosE.length++] = this.busquedaE[index];
                } 
              }
              //Si no hay filtro de ciudad, se guardan los resultados referentes solo a la palabra buscada
            }else{
              if (this.resultadosE.length == 0) {
                this.resultadosE[0] = this.busquedaE[index];
              } else {
                this.resultadosE[this.resultadosE.length++] = this.busquedaE[index];
              }
            }
            //Si no hay empresas que tengan el servicio buscado, devolvera una alerta
          } else {
            console.log('Esta empresa no tiene ese servicio');
          }
        }
        //console.log(this.busquedaE);
        //BUSQUEDA DE OFERTAS DE EMPRESAS
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
        //BUSCANDO INDEPENDIENTES
        this.firestore.getCollection<BusquedaI>('Independiente').subscribe(res => {
          this.busquedaI = res;
          //Generando la lista de resultados según: "palabra" y/o "ciudad"
          for (let index = 0; index < this.busquedaI.length; index++) {
            if (this.busquedaI[index].profesion.toLowerCase().indexOf(palabra) != -1 || this.busquedaI[index].descripcion.toLowerCase().indexOf(palabra) != -1 || this.busquedaI[index].servicios.toLowerCase().indexOf(palabra) != -1) {
              console.log('Si esta en la busqueda');
              console.log(this.ciudad);
              // Se verifica si se aplico filtro de ciudad y si es asi, se guarada en la lista de resultados los independientes que esten esa ciudad
              if (this.ciudad.length > 0) {
                if (this.busquedaI[index].ciudad == this.ciudad){
                  console.log('paso ciudad');
                  // Se verifica si la lista de resultados esta vacia, para guaradar el resultado en la posicion adecuada
                  if (this.resultadosI.length == 0) {
                    this.resultadosI[0] = this.busquedaI[index];
                  } else {
                    this.resultadosI[this.resultadosI.length++] = this.busquedaI[index];
                  } 
                }
                //Si no hay filtro de ciudad, se guardan los resultados referentes solo a la palabra buscada
              }else{
                if (this.resultadosI.length == 0) {
                  this.resultadosI[0] = this.busquedaI[index];
                } else {
                  this.resultadosI[this.resultadosI.length++] = this.busquedaI[index];
                }
              }
              //Si no hay independientes que tengan el servicio buscado, devolvera una alerta
            } else {
              console.log('No tiene ese servicio');
            }
          }
          //console.log(this.busquedaI);
          //BUSQUEDA DE OFERTAS DE INDEPENDIENTES
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
              //ESTADO DE LA OFERTA
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
              //OFERTAS QUE ESTAN ACTIVAS
              for (let index = 0; index < this.busquedaO.length; index++) {
                if (this.busquedaO[index].estado == 'Inactivo') {
                  this.busquedaO = this.busquedaO.splice(0, index);
                } else {
                  //console.log('No se elimino ');
                }
              }
              // Se filtran las ofertas por la palabra buscada y la ciudad
              for (let index = 0; index < this.busquedaO.length; index++) {
                if (this.busquedaO[index].descripcion.toLowerCase().indexOf(palabra) != -1 || this.busquedaO[index].nombreOferta.toLowerCase().indexOf(palabra) != -1 || this.busquedaO[index].informacionAdicional.toLowerCase().indexOf(palabra) != -1) {
                  console.log('Si esta en la busqueda');
                  console.log(this.ciudad);
                  // Se verifica si se aplico filtro de ciudad y si es asi, se guarada en la lista de resultados los independientes que esten esa ciudad
                  if (this.ciudad.length > 0) {
                    if (this.busquedaO[index].ciudad == this.ciudad){
                      console.log('paso ciudad');
                      // Se verifica si la lista de resultados esta vacia, para guaradar el resultado en la posicion adecuada
                      if (this.resultadosO.length == 0) {
                        this.resultadosO[0] = this.busquedaO[index];
                      } else {
                        this.resultadosO[this.resultadosO.length++] = this.busquedaO[index];
                      } 
                    }
                    //Si no hay filtro de ciudad, se guardan los resultados referentes solo a la palabra buscada
                  }else{
                    if (this.resultadosO.length == 0) {
                      this.resultadosO[0] = this.busquedaO[index];
                    } else {
                      this.resultadosO[this.resultadosO.length++] = this.busquedaO[index];
                    }
                  }
                } else {
                  console.log('No tiene ese servicio');
                }
              }

            });
          }
          this.resultados = true;
        });
      });
      this.busquedaOE = [];
      this.busquedaOI = [];
    }
  }
}
