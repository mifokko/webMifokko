import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanEmpresaComponent } from 'src/app/shared/components/plan-empresa/plan-empresa.component';
import { PlanIndependienteComponent } from 'src/app/shared/components/plan-independiente/plan-independiente.component';
import { RegisterIndependienteComponent } from 'src/app/shared/components/register-independiente/register-independiente.component';
import { RegisterUsuarioGeneralComponent } from 'src/app/shared/components/register-usuario-general/register-usuario-general.component';
import { RegisterComponent } from 'src/app/shared/components/register/register.component';
import { Usuario } from 'src/app/shared/model/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataServices } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  seleccion= '';
  login = false;
  lista: string[] = ['INDEPENDIENTES', 'EMPRESAS', 'OFERTAS', 'TODOS'];
  rol: 'empresa' | 'independiente' | 'general' | undefined;
  
  constructor( private modalService: NgbModal, private authService: AuthService, private firestore: DataServices,) { 
    this.authService.stateUser().subscribe( res => {
      if(res) {
        console.log('Esta logeado');
        this.login = true;
        this.getDatosUser(res.uid);
      }else {
        console.log('No esta logeado');
        this.login = false;
      }
    })
  }

  ngOnInit(): void {
    console.log('Home');
  }

  inView(ele: any) {
    ele.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
  }

  openPlanEmpresa(){
    const modalRef = this.modalService.open(PlanEmpresaComponent);
  }

  openPlanIndependiente(){
    const modalRef1 = this.modalService.open(PlanIndependienteComponent);
  }

  openRegisterUsuario(){
    const modalRef2 = this.modalService.open(RegisterUsuarioGeneralComponent);
  }

  Capturar(seleccion: string){
    console.log('Seleccion: ' + seleccion);
  }

  getDatosUser(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<Usuario>(path,id).subscribe( res => {
      if(res) {
        this.rol = res.perfil;
      }
    })
  }
}
