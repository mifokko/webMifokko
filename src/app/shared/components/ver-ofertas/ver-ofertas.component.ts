import { Component, OnInit } from '@angular/core';
import { Oferta } from '../../model/oferta.model';
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

  ofertas: Oferta[] = [];
  independientes: Independiente[] = []; 
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
      
      console.log(res);
    });
  }

}
