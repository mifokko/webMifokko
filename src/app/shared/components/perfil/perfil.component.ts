import { Component, OnInit} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ThumbnailsView } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import Swal from 'sweetalert2';
import { URL } from 'url';
import { Empresa } from '../../model/empresa.model';
import { Independiente } from '../../model/independiente.model';
import { Redes } from '../../model/redes.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  redes = {
    youtube: '',
    instagram: '',
    whatsapp: '',
    facebook: ''
  }
  youtubeSafe!: SafeUrl;
  facebookSafe!: SafeUrl;
  instagramSafe!: SafeUrl;
  

  rol: 'empresa' | 'independiente' | 'general' | undefined;
  network!: Redes;
  empresa: Empresa | undefined;
  independiente: Independiente | undefined;
  items!: GalleryItem[];
  imageData = data;
  mostrar: boolean = false;
  id = '';
  path = '';
  red: 'save' | 'mostrar' | 'vacio' | undefined;

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private firestore: DataServices, public gallery: Gallery, public lightbox: Lightbox) {
    this.authService.stateUser().subscribe( res => {
      if(res) {
        this.getDatosUser(res.uid);
        this.id = res.uid;
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
        this.firestore.getDoc<Empresa>('Empresas', id).subscribe( res => {
          this.empresa = res;
        });
        this.firestore.getDocColDoc<Redes>('Empresas', id, 'Redes').subscribe( res => {
          //console.log(res);
          if (res == undefined) {
            //console.log(res)
            this.red = 'vacio'; 
            this.mostrar = false;
            console.log(this.red);
          }else{
            console.log('paso');
            this.red = 'mostrar';
            console.log(res);
            this.network = res;
            this.youtubeSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.youtube);
            this.facebookSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.facebook);
            this.instagramSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.instagram);
          }
        });
      }else if(this.rol == 'independiente'){
        //console.log('paso');
        this.firestore.getDoc<Independiente>('Independiente', id).subscribe( res => {
          this.independiente = res;
        });
        this.firestore.getDocColDoc<Redes>('Independiente', id, 'Redes').subscribe(res => {
          if (res == undefined) {
            //console.log(res)
            this.red = 'vacio'; 
            this.mostrar = false;
            //console.log(this.red);
          }else{
            //console.log('paso');
            this.red = 'mostrar';
            //console.log(res);
            this.network = res;
            this.youtubeSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.youtube);
            this.facebookSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.facebook);
            this.instagramSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.instagram);
          } 
        });
      }
    });

  }

  redesSociales() {
    this.mostrar = true;
  }

  async redesSocialesR(){
    this.mostrar = false;
    console.log(this.redes);
    if (this.redes) {
      try {
        let path = '';
        if (this.rol == 'empresa'){
          path = 'Empresas';
          this.path = 'Empresas';
        } else if(this.rol == 'independiente') {
          path = 'Independiente';
          this.path = 'Independiente';
        } else {
          path = '';
        }
        const subpath = 'Redes';
        await this.firestore.createColInDoc<Redes>(this.redes, path, this.id, subpath, this.id);
        this.red = 'save';
        Swal.fire('Registro exitoso', 'Volver al inicio', 'success');
      } catch (e) {
        alert(e);
      }

      

    } else {
      //Notificacion de error
      Swal.fire(
        'Error',
        'Revisar información ingresada',
        'error'
      );
    }
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