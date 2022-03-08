import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@firebase/auth';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { LoginComponent } from '../login/login.component';
import { SubirOfertaComponent } from '../subir-oferta/subir-oferta.component';
import { UneteComponent } from '../unete/unete.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  login: boolean = false;
  rol: 'empresa' | 'independiente' | 'general' | undefined;
  
  constructor(private modalService: NgbModal, private authService: AuthService, private firestore: DataServices, private router: Router) { 
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
    console.log('navbar');
  }

  options: NgbModalOptions = {
    size: 'sm',
    centered: true
  };

  openUnete(){
    this.modalService.open(UneteComponent, this.options);
  }

  openOferta() {
    this.modalService.open(SubirOfertaComponent, {centered: true});
  }

  openBeneficios() {}

  openLogin( ){
    const modalRef = this.modalService.open(LoginComponent, this.options);
  }

  Salir(){
    this.refresh();
    this.authService.cerrarSesion().then(res => {
      console.log("Sesión cerrado: ", res);
    });
    this.router.navigate(['/home']);
  }

  refresh(): void {
    window.location.reload();
  }

  getDatosUser(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<Usuario>(path,id).subscribe( res => {
      console.log('datos -> ', res);
      if(res) {
        this.rol = res.perfil;
      }
    })
  }

}
