import { ChangeDetectionStrategy, Component, OnInit, ɵɵpureFunction1 } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { Empresa } from '../../model/empresa.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  rol: 'empresa' | 'independiente' | 'general' | undefined;
  empresas: Empresa[] = [];


  constructor(private authService: AuthService, private firestore: DataServices, public gallery: Gallery, public lightbox: Lightbox) {
    this.authService.stateUser().subscribe( res => {
      if(res) {
        this.getDatosUser(res.uid);
      }
    })
   }

  ngOnInit(): void { 
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
