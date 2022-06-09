import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { BeneficiosComponent } from '../beneficios/beneficios.component';
import { InformacionComponent } from '../informacion/informacion.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  //Ver perfil empresa
  verPaginaE(id: string) {
    this.router.navigate(['/perfil', id])
  }

  //Ver perfil independiente
  verPaginaI(id: string) {
    this.router.navigate(['/perfilIndependiente', id])
  }

  //Ver perfil independiente
  verEstadisticas(id: string) {
    this.router.navigate(['/estadisticas', id])
  }
  private isEmail = /\S+@\S+\.\S+/; // Validar estructura de correo
  login!: boolean; // Variable que determina si se ha iniciado sesion o no 
  idUser = ''; // Variable que almacena el valor del identificador del usuario
  rol = ''; // Variable en la cual se guarad la el rol o el tipo de usuario que ha iniciado sesion o que esta interactuando con la pagina

  constructor(private modalService: NgbModal, private authService: AuthService, private firestore: DataServices, private router: Router) {
    this.authService.stateUser().subscribe(res => {
      if (res) {
        console.log('Esta logeado');
        this.login = true;
        this.idUser = res.uid;
        this.getDatosUser(res.uid);
        //console.log(res.uid);
      } else {
        console.log('No esta logeado');
        this.login = false;
      }
    })
  }

  ngOnInit(): void {
    
  }

  // Funcion que llama el modal de Beneficios y lo muestra
  openBeneficios() {
    this.modalService.open(BeneficiosComponent, { size: 'md', centered: true });
  }
  // Funcion que llama el modal de Informacion y lo muestra
  openInformacion() {
    this.modalService.open(InformacionComponent, { size: 'md', centered: true });
  }
  // Funcion que se utiliza para consultar y obtener los datos del usuario registrado
  getDatosUser(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res) {
        this.rol = res.perfil;
        console.log(res.perfil);
      }
    });
  }

}
