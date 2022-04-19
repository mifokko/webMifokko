import { Component, OnInit } from '@angular/core';
import { Fecha, Oferta } from '../../model/oferta.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { Independiente } from '../../services/dataRegIndependiente.services';

@Component({
  selector: 'app-ver-ofertas',
  templateUrl: './ver-ofertas.component.html',
  styleUrls: ['./ver-ofertas.component.scss']
})
export class VerOfertasComponent implements OnInit {

  date: Date = new Date();
  ofertas: Oferta[] = [];
  lista: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  uid = '';
  rol = '';
  path = '';

  constructor(private firestore: DataServices, private authService: AuthService) {
    this.authService.stateUser().subscribe( res => {
      if(res) {
        console.log(res.uid);
        this.uid = res.uid;
        this.firestore.getDoc<Usuario>('Usuarios', this.uid).subscribe( res => {
          if(res) {
            this.rol = res.perfil;
          }
        })
      }
    });
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    let path = '';
        if (this.rol == 'empresa'){
          path = 'Empresas';
        } else if(this.rol == 'independiente') {
          path = 'Independiente';
        } else {
          path = '';
        }
    this.firestore.getDocCol<Oferta>(path, this.uid, 'Ofertas').subscribe( res => {
      this.ofertas = res;
      for (let index = 0; index < this.ofertas.length; index++) {
        const fecha = this.ofertas[index].fechaInicio.day.toLocaleString() + '/' + this.ofertas[index].fechaInicio.month.toString() + '/' + this.ofertas[index].fechaInicio.year.toString();
        const presenteF = this.date.toLocaleDateString();
        if(fecha == presenteF) {
          this.ofertas[index].estado = 'Activo';
        } else {
          this.ofertas[index].estado = 'Inactivo' ;
        }
      }
      
      console.log(res);
    });
  }

}
