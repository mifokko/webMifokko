import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ThumbnailsView } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import Swal from 'sweetalert2';
import { Empresa } from '../../model/empresa.model';
import { Independiente } from '../../model/independiente.model';
import { Redes } from '../../model/redes.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { Perfil } from '../../model/perfil.model';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  @ViewChild('imageUser') inputImageUser: ElementRef | undefined;
  @ViewChild('imagePortada') inputImagePortada: ElementRef | undefined;

  redes = {
    youtube: '',
    instagram: '',
    whatsapp: '',
    facebook: ''
  }

  perfil!: Perfil;
  youtubeSafe!: SafeUrl;
  facebookSafe!: SafeUrl;
  instagramSafe!: SafeUrl;
  fotoP: boolean = false;


  perfilSafe!: SafeUrl | undefined;
  portadaSafe!: SafeUrl | undefined;

  uploadPercent!: Observable<number | undefined>;
  uploadPercentP!: Observable<number | undefined>;
  urlImage!: Observable<string>;
  urlPortada!: Observable<string>;

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

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private firestore: DataServices, public gallery: Gallery, public lightbox: Lightbox, private storage: AngularFireStorage) {
    this.authService.stateUser().subscribe(res => {
      if (res) {
        this.getDatosUser(res.uid);
        this.id = res.uid;
      }
    })
  }

  ngOnInit(): void {
    this.items = this.imageData.map(item =>
      new ImageItem({ src: item.srcUrl, thumb: item.previewUrl })
    );

    const lightboxRef = this.gallery.ref('lightbox');

    lightboxRef.setConfig({
      thumbPosition: ThumbnailsPosition.Top,
      thumbView: ThumbnailsView.Contain,
    });

    lightboxRef.load(this.items);
  }

  onUpload(e: any) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
  }

  onPortada(e: any) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercentP = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlPortada = ref.getDownloadURL())).subscribe();
  }

  async saveImage() {
    let path = '';
    if (this.rol == 'empresa') {
      path = 'Empresas';
      this.path = 'Empresas';
    } else if (this.rol == 'independiente') {
      path = 'Independiente';
      this.path = 'Independiente';
    } else {
      path = '';
    }

    this.urlImage.forEach(async value => {
      //this.perfil = value.toString();
      //console.log('Value => ' + this.perfil);
      await this.firestore.updateCamposDoc(value, path, this.id, 'FotoPerfil');
    });

    this.urlPortada.forEach(async value => {
      await this.firestore.updateCamposDoc(value, path, this.id, 'FotoPortada');
    });
    this.fotoP = true;
    console.log('Paso');
  }

  getDatosUser(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res) {
        //console.log(res);
        this.rol = res.perfil;
        console.log(this.rol);
      }
      if (this.rol == 'empresa') {
        //Obteniendo datos de la empresa
        this.firestore.getDoc<Empresa>('Empresas', id).subscribe(res => {
          this.empresa = res;
        });
        
        //Obteniendo las redes sociales de la BD
        this.firestore.getDocColDoc<Redes>('Empresas', id, 'Redes').subscribe(res => {
          //console.log(res);
          if (res == undefined) {
            //console.log(res)
            this.red = 'vacio';
            this.mostrar = false;
            //console.log(this.red);
          } else {
            //console.log('paso');
            this.red = 'mostrar';
            //console.log(res);
            this.network = res;
            this.youtubeSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.youtube);
            this.facebookSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.facebook);
            this.instagramSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.instagram);
          }
        });

        //Obteniendo url de imagenes de la BD
        this.firestore.getDoc<Perfil>('Empresas', id).subscribe(res => {
          if (res == undefined) {
            this.fotoP = false;
          }else{
            this.fotoP = true;
            this.perfilSafe = res.FotoPerfil;
            this.portadaSafe = res.FotoPortada;
            console.log(res.FotoPerfil + ' / ' + res.FotoPortada);
          }
          // res?.FotoPerfil;
          // console.log(res?.FotoPerfil + ' / ' + res?.FotoPortada);
        });

      } else if (this.rol == 'independiente') {
        //console.log('paso');
        this.firestore.getDoc<Independiente>('Independiente', id).subscribe(res => {
          this.independiente = res;
        });
        this.firestore.getDocColDoc<Redes>('Independiente', id, 'Redes').subscribe(res => {
          if (res == undefined) {
            //console.log(res)
            this.red = 'vacio';
            this.mostrar = false;
            //console.log(this.red);
          } else {
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

  async redesSocialesR() {
    this.mostrar = false;
    console.log(this.redes);
    if (this.redes) {
      try {
        let path = '';
        if (this.rol == 'empresa') {
          path = 'Empresas';
          this.path = 'Empresas';
        } else if (this.rol == 'independiente') {
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