import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanEmpresaComponent } from 'src/app/shared/components/plan-empresa/plan-empresa.component';
import { PlanIndependienteComponent } from 'src/app/shared/components/plan-independiente/plan-independiente.component';
import { RegisterUsuarioGeneralComponent } from 'src/app/shared/components/register-usuario-general/register-usuario-general.component';
import { SubscripcionComponent } from 'src/app/shared/components/subscripcion/subscripcion.component';
import { Empresa } from 'src/app/shared/model/empresa.model';
import { Independiente } from 'src/app/shared/model/independiente.model';
import { Ofertas } from 'src/app/shared/model/oferta.model';
import { TablaBusqueda } from 'src/app/shared/model/tablaBusqueda.model';
import { Usuario } from 'src/app/shared/model/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataServices } from 'src/app/shared/services/data.service';
import { UsuarioG } from 'src/app/shared/services/dataRegUsuario.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  seleccion = ''; // Almacena el tipo de usuario que se esta buscando 
  palabra = ''; // Es la encargada de almacenar las palabras que se desean buscar 
  ciudad = ''; // Es la encargada de almacenar la ciudad en donde se desea buscar el servicio 
  login = false; // Informa si se ha iniciado o no sesion 
  rol: 'empresa' | 'independiente' | 'general' | undefined; // Almacena el tipo de rol del usuario
  // Estas dos listas se usan para filtrar y listar las ciudades en las que se han registrado usuarios
  ciudades: string[] = [];
  municipios: string[] = [];

  subscripcion!: boolean; // Muestra el estado de la subscripcion 
  plan!: string; // Acuerdo de pagos 
  tipoPlan!: string; //Tipo de paquete que adquirio el usuario
  id = ''; // Identificador del usuario 
  fechaFin: string[] = [] //Lista donde se deivide la el objeto fecha
  usuarios!: Usuario; // Se almacena la informacion del usuario 
  alerta: boolean = false;
  
  empresa: Empresa[] = [];
  independiente: Independiente[] = [];
  ofertas: Ofertas[] = []

  //Crear tabla de los servicios y oficios de los usuarios, para facilitar la busqueda
  tablaBusqueda = {
    servicios: '',
    idUser: '',
    path: ''
  }

  //Ver perfil independiente
  verPaginaBuscar(seleccion: string, palabra: string, ciudad: string) {
    if (seleccion.length == 0) {
      Swal.fire('Debe seleccionar un filtro', 'Volver a intentar', 'error');
    }else{
      this.router.navigate(['/buscar', ciudad, seleccion, palabra]);
    }
    //console.log(seleccion + '/ ' + palabra);
  }

  constructor(private modalService: NgbModal, private authService: AuthService, private firestore: DataServices, private router: Router) {
    this.authService.stateUser().subscribe(res => {
      if (res) {
        //console.log('Esta logeado');
        this.login = true;
        this.id = res.uid
        this.getDatosUser(res.uid);
      } else {
        //console.log('No esta logeado');
        this.login = false;
      }
    });

    //filtrar ciudades, para mostrar solo las ciudades en las cuales hay empresas o independientes registrados
    firestore.getCollection<Empresa>('Empresas').subscribe(res => {
      for (let index = 0; index < res.length; index++) {
        this.ciudades[index] = res[index].ciudad;
      }
    });
    firestore.getCollection<Independiente>('Independiente').subscribe(value => {
      for (let index = 0; index < value.length; index++) {
        this.ciudades[this.ciudades.length++] = (value[index].ciudad);
      }
      //console.log(this.ciudades.length);

      this.municipios = this.ciudades.filter((valor, indice) => {
        return this.ciudades.indexOf(valor) === indice;
      });

      //console.log(this.municipios);
    });

  }

  ngOnInit(): void {
    console.log('Home');
  }

  //Se usa para el scroll automatico
  inView(ele: any) {
    ele.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }
  //Abrir modal de planes de empresa
  openPlanEmpresa() {
    const modalRef = this.modalService.open(PlanEmpresaComponent);
  }
  //Abrir planes de independiente
  openPlanIndependiente() {
    const modalRef1 = this.modalService.open(PlanIndependienteComponent);
  }
  //Abrir modal de registro de usuario general 
  openRegisterUsuario() {
    const modalRef2 = this.modalService.open(RegisterUsuarioGeneralComponent);
  }
  //Abrir modal de actualizacion de subscripcion 
  openActualizarSub(){
    const modalRef = this.modalService.open(SubscripcionComponent);
    modalRef.componentInstance.pago = this.usuarios.pago;
    modalRef.componentInstance.referencia = this.usuarios.referencia;
  }

  //Estado de subscripción 
  actualizarSubs() {
    console.log('Entro',this.plan, this.tipoPlan);
    const fecha = new Date();
    let fechaFin = '';
    let fechaInicio: string[] = [];
    //Se verfica cual es el plan de pago del usuario y que tipo de paquete adquirio
    if (this.tipoPlan == 'EMPRESARIALORO' || this.tipoPlan == 'EMPRESARIALPLATA') {
      this.firestore.updateCamposDoc('empresa', 'Usuarios', this.id, 'perfil');
      //Si acordo pagar mensual 
      if (this.plan.indexOf('MENSUALES') != -1) {
        this.firestore.getDoc<Usuario>('Usuarios', this.id).subscribe(res => {
          if (res) {
            fechaInicio = res.fechaInicio.split('/');
          }
        })
        this.firestore.updateCamposDoc(fecha.toLocaleDateString(), 'Usuarios', this.id, 'fechaInicio');
        fechaFin = (fecha.getDate() + '/' + (fecha.getMonth() + 2) + '/' + fecha.getFullYear());
        this.firestore.updateCamposDoc(fechaFin, 'Usuarios', this.id, 'fechaFin');
        this.firestore.updateCamposDoc(true, 'Usuarios', this.id, 'estadoPago');
        this.firestore.updateCamposDoc(true, 'Empresas', this.id, 'estadoPago');
        if (this.plan == '3MENSUALES') {
          fechaFin = (fechaInicio[0] + '/' + (fecha.getMonth() - 1) + '/' + (fecha.getFullYear() + 1));
          this.firestore.updateCamposDoc(fechaFin, 'Usuarios', this.id, 'fechaFin');
        }
      } else if(this.plan == 'ANUAL') {
        //Si acordo pagar anual 
        this.firestore.updateCamposDoc(fecha.toLocaleDateString(), 'Usuarios', this.id, 'fechaInicio');
        fechaFin = (fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + (fecha.getFullYear() + 1));
        this.firestore.updateCamposDoc(fechaFin, 'Usuarios', this.id, 'fechaFin');
        this.firestore.updateCamposDoc(true, 'Usuarios', this.id, 'estadoPago');
        this.firestore.updateCamposDoc(true, 'Empresas', this.id, 'estadoPago');
      }
      //Se verfica cual es el plan de pago del usuario y que tipo de paquete adquirio
    } else if (this.tipoPlan == 'INDEPENDIENTEORO' || this.tipoPlan == 'INDEPENDIENTEPLATA') {
      this.firestore.updateCamposDoc('independiente', 'Usuarios', this.id, 'perfil');
      //Si acordo pagar mensual
      if (this.plan == '3MENSUALES') {
        this.firestore.updateCamposDoc(fecha.toLocaleDateString(), 'Usuarios', this.id, 'fechaInicio');
        fechaFin = (fecha.getDate() + '/' + (fecha.getMonth() + 2) + '/' + fecha.getFullYear());
        this.firestore.updateCamposDoc(fechaFin, 'Usuarios', this.id, 'fechaFin');
        this.firestore.updateCamposDoc(true, 'Usuarios', this.id, 'estadoPago');
        this.firestore.updateCamposDoc(true, 'Independiente', this.id, 'estadoPago');
      } else if (this.plan == 'ANUAL') {
        //Si acordo pagar anual 
        this.firestore.updateCamposDoc(fecha.toLocaleDateString(), 'Usuarios', this.id, 'fechaInicio');
        fechaFin = (fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + (fecha.getFullYear() + 1));
        this.firestore.updateCamposDoc(fechaFin, 'Usuarios', this.id, 'fechaFin');
        this.firestore.updateCamposDoc(true, 'Usuarios', this.id, 'estadoPago');
        this.firestore.updateCamposDoc(true, 'Independiente', this.id, 'estadoPago');
      }

    }
  }

  getDatosUser(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    //Obtener datos de inicio de sesion del usuario
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res) {
        this.usuarios = res;
        const fecha = new Date(); //fecha actual 
        this.fechaFin = this.usuarios.fechaFin.split('/'); // Fecha de corte de subscripcion 
        console.log(this.fechaFin);
        if (this.plan.indexOf('MENSUALES') != -1) {
          //Si la fecha del día de hoy es mayor o igual que el día del corte de subscripcion
          if (fecha.getDate() >= parseInt(this.fechaFin[0])) {
            // Si el mes actual es mayor o igual al mes de corte 
            if ((fecha.getMonth() + 1) >= parseInt(this.fechaFin[1])) {
              //Si el año actual es igual al año de corte y el estado de pago del usuario es true
              if (fecha.getFullYear() == parseInt(this.fechaFin[2]) && this.usuarios.estadoPago == true) {
                if (this.alerta == false) {
                  alert('Tu subscripción esta vencida');
                  this.usuarios.perfil = 'general';
                  this.usuarios.estadoPago = false;
                  this.firestore.updateCamposDoc(this.usuarios.perfil, 'Usuarios', id, 'perfil');
                  this.firestore.updateCamposDoc(this.usuarios.estadoPago, 'Usuarios', id, 'estadoPago');
                  this.firestore.updateCamposDoc(this.usuarios.estadoPago, 'Usuarios', id, 'estadoPago');
                  this.alerta = true;
                }
              }
            }
            this.rol = res.perfil;
          } else {
            this.rol = res.perfil;
          }
        } else if (this.plan == 'ANUAL') {
          if (fecha.getDate() >= parseInt(this.fechaFin[0])) {
            // Si el mes actual es mayor o igual al mes de corte 
            if ((fecha.getMonth() + 1) >= parseInt(this.fechaFin[1])) {
              //Si el año actual es igual al año de corte y el estado de pago del usuario es true
              if (fecha.getFullYear() >= parseInt(this.fechaFin[2]) && this.usuarios.estadoPago == true) {
                if (this.alerta == false) {
                  alert('Tu subscripción esta vencida');
                  this.usuarios.perfil = 'general';
                  this.usuarios.estadoPago = false;
                  this.firestore.updateCamposDoc(this.usuarios.perfil, 'Usuarios', id, 'perfil');
                  this.firestore.updateCamposDoc(this.usuarios.estadoPago, 'Usuarios', id, 'estadoPago');
                  //this.firestore.updateCamposDoc(this.usuarios.estadoPago, 'Usuarios', id, 'estadoPago');
                  this.alerta = true;
                }
              }
            }
            this.rol = res.perfil;
          } else {
            this.rol = res.perfil;
          }
        }
       

        //Se verifica si el usuario tiene su subscripcion al dia 
        if (res.plan != 'general' && res.perfil == 'general') {
          this.subscripcion = false;
          this.plan = res.plan;
          this.tipoPlan = res.tipoPlan;
        } else {
          this.subscripcion = true;
        }

        // this.firestore.getCollection<TablaBusqueda>('Busqueda').subscribe(res => {
        //   if (res === undefined) {
        //     //Guardar lista de servicios y profesiones para las busquedas
        //     this.firestore.getCollection<Empresa>('Empresas').subscribe(res => {
        //       if (res) {
        //         this.empresa = res;
        //         for (let index = 0; index < this.empresa.length; index++) {
        //           const services = this.empresa[index].servicios.split(', ');
        //           for (let i = 0; i < services.length; i++) {
        //             const uid = Math.random().toString(9).substring(2);
        //             const ser = services[i].toString();
        //             this.tablaBusqueda.servicios = services[i];
        //             this.tablaBusqueda.idUser = this.empresa[index].id;
        //             this.tablaBusqueda.path = 'Empresas';
        //             this.firestore.createDoc(this.tablaBusqueda, 'Busqueda', uid);
        //           }
        //         }

        //         this.firestore.getCollection<Independiente>('Independiente').subscribe(res => {
        //           if (res) {
        //             this.independiente = res;
        //             for (let j = 0; j < this.independiente.length; j++) {
        //               const uid = Math.random().toString(9).substring(2);
        //               this.tablaBusqueda.servicios = this.independiente[j].profesion;
        //               this.tablaBusqueda.idUser = this.independiente[j].id;
        //               this.tablaBusqueda.path = 'Independiente';
        //               this.firestore.createDoc(this.tablaBusqueda, 'Busqueda', uid);

        //               const service = this.independiente[j].servicios.split(',');
        //               for (let k = 0; k < service.length; k++) {
        //                 const uid = Math.random().toString(9).substring(2);
        //                 this.tablaBusqueda.servicios = service[k];
        //                 this.tablaBusqueda.idUser = this.independiente[j].id;
        //                 this.tablaBusqueda.path = 'Independiente';
        //                 this.firestore.createDoc(this.tablaBusqueda, 'Busqueda', uid);
        //               }
        //             }
        //           }
        //         })
        //       }
        //     })
        //   } else {
        //     console.log('Lista de busqueda completa');
        //   }
        // })

      }
    })
  }
}
