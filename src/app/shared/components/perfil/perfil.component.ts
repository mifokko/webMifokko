import { ChangeDetectionStrategy, Component, OnInit, ɵɵpureFunction1 } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition, ThumbnailsView } from 'ng-gallery';
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
  empresa: Empresa [] = [];
  empresas: Empresa [] = [];
  // empresas = {
  //   nombre: '',
  //   ciudad: '',
  //   direccion: '',
  //   actividadPrincipal: '',
  //   descripcion: '',
  //   horaMInicio: '',
  //   horaMFin: '',
  //   horaTInicio: '',
  //   horaTFin: '',
  //   domicilio: '',
  //   servicios: '',
  //   informacionAdicional: '',
  //   estado: true,
  // };
  items!: GalleryItem[];
  imageData = data;
  mostrar: boolean = false;

  constructor(private authService: AuthService, private firestore: DataServices, public gallery: Gallery, public lightbox: Lightbox) {
    this.authService.stateUser().subscribe( res => {
      if(res) {
        this.getDatosUser(res.uid);
      }
    })
   }

  ngOnInit(): void { 
    this.items = this.imageData.map(item =>
      new ImageItem({ src: item.srcUrl, thumb: item.previewUrl})
    );
    
    const lightboxRef = this.gallery.ref('lightbox');
    
    lightboxRef.setConfig({
      thumbPosition: ThumbnailsPosition.Top,
      thumbView: ThumbnailsView.Contain,      
    });

    lightboxRef.load(this.items);
  }  

  getDatosUser(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<Usuario>(path,id).subscribe( res => {
      if(res) {
        //console.log(res);
        this.rol = res.perfil;
        console.log(this.rol);
      }
      if(this.rol == 'empresa'){
        console.log('paso');
        this.firestore.getCollection<Empresa>('Empresas').subscribe( res => {
          this.empresa = res;
          for(let index = 0; index < this.empresa.length; index++){
           console.log(this.empresa[index].id);
            if(this.empresa[index].id == id){
              console.log('paso');
              this.empresas[index] = this.empresa[index];
              console.log(this.empresas);
           }
          }
        });
      }
    });
    
  }

  redesSociales() {
    this.mostrar = true;
  }

  redesSocialesR(){
    this.mostrar = false;
  }

}

const data = [
  {
    srcUrl: 'https://cdn.pixabay.com/photo/2013/10/02/23/03/mountains-190055_960_720.jpg',
    previewUrl: 'https://cdn.pixabay.com/photo/2013/10/02/23/03/mountains-190055_960_720.jpg',
  },
  {
    srcUrl: 'https://cdn.pixabay.com/photo/2022/02/25/17/47/valley-7034573_960_720.jpg',
    previewUrl: 'https://cdn.pixabay.com/photo/2022/02/25/17/47/valley-7034573_960_720.jpg',
  },
  {
    srcUrl: 'https://cdn.pixabay.com/photo/2021/12/28/14/44/sunset-6899490_960_720.jpg',
    previewUrl: 'https://cdn.pixabay.com/photo/2021/12/28/14/44/sunset-6899490_960_720.jpg',
  },
  {
    srcUrl: 'https://cdn.pixabay.com/photo/2022/03/02/05/07/ocean-7042436_960_720.jpg',
    previewUrl: 'https://cdn.pixabay.com/photo/2022/03/02/05/07/ocean-7042436_960_720.jpg',
  },
  {
    srcUrl: 'https://cdn.pixabay.com/photo/2022/02/19/14/37/nordkette-7022793_960_720.jpg',
    previewUrl: 'https://cdn.pixabay.com/photo/2022/02/19/14/37/nordkette-7022793_960_720.jpg',
  },
  {
    srcUrl: 'https://cdn.pixabay.com/photo/2014/11/16/15/15/field-533541_960_720.jpg',
    previewUrl: 'https://cdn.pixabay.com/photo/2014/11/16/15/15/field-533541_960_720.jpg',
  },
  {
    srcUrl: 'https://cdn.pixabay.com/photo/2015/03/03/05/56/avenue-656969_960_720.jpg',
    previewUrl: 'https://cdn.pixabay.com/photo/2015/03/03/05/56/avenue-656969_960_720.jpg',
  },
  {
    srcUrl: 'https://cdn.pixabay.com/photo/2022/03/23/21/27/road-7087957_960_720.jpg',
    previewUrl: 'https://cdn.pixabay.com/photo/2022/03/23/21/27/road-7087957_960_720.jpg',
  },
  {
    srcUrl: 'https://cdn.pixabay.com/photo/2013/11/15/13/57/road-210913_960_720.jpg',
    previewUrl: 'https://cdn.pixabay.com/photo/2013/11/15/13/57/road-210913_960_720.jpg',
  }
];