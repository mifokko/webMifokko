import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanEmpresaComponent } from 'src/app/shared/components/plan-empresa/plan-empresa.component';
import { PlanIndependienteComponent } from 'src/app/shared/components/plan-independiente/plan-independiente.component';
import { RegisterIndependienteComponent } from 'src/app/shared/components/register-independiente/register-independiente.component';
import { RegisterUsuarioGeneralComponent } from 'src/app/shared/components/register-usuario-general/register-usuario-general.component';
import { RegisterComponent } from 'src/app/shared/components/register/register.component';
import { Empresa } from 'src/app/shared/model/empresa.model';
import { Independiente } from 'src/app/shared/model/independiente.model';
import { Usuario } from 'src/app/shared/model/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataServices } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  seleccion = '';
  login = false;
  lista: string[] = ['INDEPENDIENTES', 'EMPRESAS', 'OFERTAS', 'TODOS'];
  rol: 'empresa' | 'independiente' | 'general' | undefined;
  ciudades: string[] = [];
  municipios: string[] = [];
  subscripcion!: boolean;
  plan!: string;
  id = '';
  fechaFin: string[] = []
  usuarios!: Usuario;
  alerta: boolean = false;
  palabra = '';

  //Ver perfil independiente
  verPaginaBuscar(seleccion: string, palabra: string){
    this.router.navigate(['/buscar', seleccion, palabra]);
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

  inView(ele: any) {
    ele.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }

  openPlanEmpresa() {
    const modalRef = this.modalService.open(PlanEmpresaComponent);
  }

  openPlanIndependiente() {
    const modalRef1 = this.modalService.open(PlanIndependienteComponent);
  }

  openRegisterUsuario() {
    const modalRef2 = this.modalService.open(RegisterUsuarioGeneralComponent);
  }

  Capturar(seleccion: string) {
    //console.log('Seleccion: ' + seleccion);
  }

  //Estado de subscripción 
  actualizarSubs() {
    const fecha = new Date();
    let fechaFin = '';
    if (this.plan == 'mensualE' || this.plan == 'anualE') {
      this.firestore.updateCamposDoc('empresa', 'Usuarios', this.id, 'perfil');
      if (this.plan == 'mensualE') {
        this.firestore.updateCamposDoc(fecha.toLocaleDateString(), 'Usuarios', this.id, 'fechaInicio');
        fechaFin = (fecha.getDate() + '/' + (fecha.getMonth() + 2) + '/' + fecha.getFullYear());
        this.firestore.updateCamposDoc(fechaFin, 'Usuarios', this.id, 'fechaFin');
        this.firestore.updateCamposDoc(true, 'Usuarios', this.id, 'estadoPago');
        this.firestore.updateCamposDoc(true, 'Empresas', this.id, 'estadoPago');
      } else {
        this.firestore.updateCamposDoc(fecha.toLocaleDateString(), 'Usuarios', this.id, 'fechaInicio');
        fechaFin = (fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + (fecha.getFullYear() + 1));
        this.firestore.updateCamposDoc(fechaFin, 'Usuarios', this.id, 'fechaFin');
        this.firestore.updateCamposDoc(true, 'Usuarios', this.id, 'estadoPago');
        this.firestore.updateCamposDoc(true, 'Empresas', this.id, 'estadoPago');
      }

    } else if (this.plan == 'mensualI' || this.plan == 'anualI') {
      this.firestore.updateCamposDoc('independiente', 'Usuarios', this.id, 'perfil');
      if (this.plan == 'mensualI') {
        this.firestore.updateCamposDoc(fecha.toLocaleDateString(), 'Usuarios', this.id, 'fechaInicio');
        fechaFin = (fecha.getDate() + '/' + (fecha.getMonth() + 2) + '/' + fecha.getFullYear());
        this.firestore.updateCamposDoc(fechaFin, 'Usuarios', this.id, 'fechaFin');
        this.firestore.updateCamposDoc(true, 'Usuarios', this.id, 'estadoPago');
        this.firestore.updateCamposDoc(true, 'Independiente', this.id, 'estadoPago');
      } else {
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
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res) {
        this.usuarios = res;
        const fecha = new Date();
        this.fechaFin = this.usuarios.fechaFin.split('/');
        //console.log(this.fechaFin);
        if (fecha.getDate() > parseInt(this.fechaFin[0])) {
          if ((fecha.getMonth() + 1) >= parseInt(this.fechaFin[1])) {
            if (fecha.getFullYear() >= parseInt(this.fechaFin[2]) && this.usuarios.estadoPago == true) {
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

        if (res.plan != 'general' && res.perfil == 'general') {
          this.subscripcion = false;
          this.plan = res.plan;
        } else {
          this.subscripcion = true;
        }
      }
    })
  }
}
