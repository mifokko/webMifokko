import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CounterPosition, Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ThumbnailsView } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import Swal from 'sweetalert2';
import { Empresa } from '../../model/empresa.model';
import { Independiente } from '../../model/independiente.model';
import { Redes } from '../../model/redes.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable, takeLast } from 'rxjs';
import { Perfil } from '../../model/perfil.model';
import { lookup } from 'dns';
import { Image } from '../../model/galeria.model';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  @ViewChild('imageUser') inputImageUser: ElementRef | undefined;
  @ViewChild('imagePortada') inputImagePortada: ElementRef | undefined;
  @ViewChild('imageGallery') inputImageGallery: ElementRef | undefined;

  redes = {
    youtube: '',
    instagram: '',
    whatsapp: '',
    facebook: ''
  }

  //imagen!: string;
  expresionRegular = /\s*;\s*/;
  imagen: string[] = [];
  imagenes: string[] = [];
  galeria!: boolean;

  urlGalery!: Observable<string>;
  file: any;
  filePath: any;
  sigte: boolean = true;
  index = 0;

  mostrar: boolean = false;
  red: 'save' | 'mostrar' | 'vacio' | undefined;
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
  imageData = galeryImages;
  paso!: boolean;

  id = '';
  path = '';
  numFotos!: number | undefined;


  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private firestore: DataServices, public gallery: Gallery, public lightbox: Lightbox, private storage: AngularFireStorage) {
    this.authService.stateUser().subscribe(res => {
      if (res) {
        this.getDatosUser(res.uid);
        this.id = res.uid;

      }
    });
  }

  ngOnInit(): void {
    this.items = this.imageData.map(item =>
      new ImageItem({ src: item.srcUrl, thumb: item.previewUrl })
    );

    const lightboxRef = this.gallery.ref('gallery-1');

    lightboxRef.setConfig({
      thumbPosition: ThumbnailsPosition.Top,
      thumbView: ThumbnailsView.Contain,
    });

    this.lightbox.setConfig({
      panelClass: 'fullscreen',
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
      await this.firestore.updateCamposDoc(value, path, this.id, 'FotoPerfil');
    });

    this.urlPortada.forEach(async value => {
      await this.firestore.updateCamposDoc(value, path, this.id, 'FotoPortada');
    });
    this.fotoP = true;
    //console.log('Paso');
  }

  onPortada(e: any) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercentP = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlPortada = ref.getDownloadURL())).subscribe();
    console.log(this.urlPortada);
  }

  async onUploadGaleria(e: any) {
    //let index = 0;
    console.log('paso', galeryImages.length);
    for (let index = 0; index < e.target.files.length; index++) {
      const id = Math.random().toString(36).substring(2);
      this.file = e.target.files[this.index];
      if (this.rol == 'empresa') {
        this.path = 'Empresas';
        this.filePath = `Galeria/${this.empresa?.nombre}/_${id}`;
        console.log('paso ' + this.path);
      } else if (this.rol == 'independiente') {
        this.path = 'Independiente';
        this.filePath = `Galeria/${this.independiente?.nombre}/_${id}`;
        console.log('paso ' + this.path);
      }

      const ref = this.storage.ref(this.filePath);
      const task = this.storage.upload(this.filePath, this.file);
      this.uploadPercent = task.percentageChanges();
      task.snapshotChanges().pipe(finalize(() => this.urlGalery = ref.getDownloadURL())).subscribe();
      console.log('paso');

      task.then(() =>
        this.urlGalery.forEach(async value => {
          if (galeryImages.length == 0) {
            if (this.index == 0) {
              this.index++;
              this.firestore.createColInDoc({ [this.index.toString()]: value }, this.path, this.id, 'Galeria', this.id);
            } else {
              this.index++;
              await this.firestore.updateCamposDocCollDoc(value, this.path, this.id, 'Galeria', (this.index.toString()));
              await this.firestore.updateCamposDoc(index, this.path, this.id, 'NumFotos');
              //index++;
            }
          } else if (galeryImages.length > 0) {
            this.index = galeryImages.length;
            this.index++;
            await this.firestore.updateCamposDocCollDoc(value, this.path, this.id, 'Galeria', (this.index.toString()));
            await this.firestore.updateCamposDoc(index, this.path, this.id, 'NumFotos');
            //index++;
          }
        })
      )

      await timer(5000);
    }
    this.index = this.index;
    console.log(this.index);
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
        this.path = 'Empresas';
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

        //Obteniendo url de Foto de portada y perfil de la BD
        this.firestore.getDoc<Perfil>('Empresas', id).subscribe(res => {
          //console.log(res?.FotoPerfil);
          if (res?.FotoPerfil == undefined && res?.FotoPortada == undefined) {
            this.fotoP = false;
          } else {
            this.fotoP = true;
            this.perfilSafe = res?.FotoPerfil;
            this.portadaSafe = res?.FotoPortada;
            console.log(res?.FotoPerfil + ' / ' + res?.FotoPortada);
          }
          // res?.FotoPerfil;
          // console.log(res?.FotoPerfil + ' / ' + res?.FotoPortada);
        });

        //obtener dirección de almacenamiento imágenes de la galeria y mostrarlas
        this.firestore.getDocColDoc('Empresas', id, 'Galeria').subscribe(res => {

          if (res == undefined) {
            this.galeria = false;
          } else {
            this.imagenes = JSON.stringify(res).split(',');
            for (let index = 0; index < this.imagenes.length; index++) {
              if (galeryImages.length == 0) {
                if (index == 0) {
                  this.imagen[index] = this.imagenes[index].substring(6, this.imagenes[index].length - 1).toString();
                  console.log(this.imagen[index] + 'paso1');
                } else if (index == (this.imagenes.length - 1) && this.imagenes.length > 1) {
                  this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
                  console.log(this.imagen[index] + 'paso1');
                } else {
                  this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
                  console.log(this.imagen[index] + 'paso1');
                }
              } else if (galeryImages.length == 1) {
                if (index == 0) {
                  this.imagen[index] = this.imagenes[index].substring(6, this.imagenes[index].length - 2).toString();
                  console.log(this.imagen[index] + 'paso2');
                } else if (index == (this.imagenes.length - 1) && this.imagenes.length > 1) {
                  this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 3).toString();
                  console.log(this.imagen[index] + 'paso2');
                } else {
                  this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
                  console.log(this.imagen[index] + 'paso2');
                }
              } else if (galeryImages.length > 1) {
                if (index == 0) {
                  this.imagen[index] = this.imagenes[index].substring(6, this.imagenes[index].length - 1).toString();
                  console.log(this.imagen[index] + 'paso3');
                } else if (index == this.imagenes.length - 1 && this.imagenes.length > 1) {
                  this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 2).toString();
                  console.log(this.imagen[index] + 'paso3');
                } else {
                  this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
                  console.log(this.imagen[index] + 'paso3');
                }
              }


              galeryImages[index] = {
                srcUrl: this.imagen[index],
                previewUrl: this.imagen[index]
              };

            }
            this.numFotos = galeryImages.length;
            console.log(galeryImages.length + ' - ' + this.numFotos);
            //console.log(data);
            this.firestore.updateCamposDoc(galeryImages.length, this.path, this.id, 'NumFotos');
            this.imageData = galeryImages;
            this.galeria = true;
          }
        })

      } else if (this.rol == 'independiente') {
        this.path = 'Independiente';
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
        //Obteniendo url de imagenes de la BD
        this.firestore.getDoc<Perfil>('Indeoendiente', id).subscribe(res => {
          //console.log(res?.FotoPerfil);
          if (res?.FotoPerfil == undefined && res?.FotoPortada == undefined) {
            this.fotoP = false;
          } else {
            this.fotoP = true;
            this.perfilSafe = res?.FotoPerfil;
            this.portadaSafe = res?.FotoPortada;
            console.log(res?.FotoPerfil + ' / ' + res?.FotoPortada);
          }
          // res?.FotoPerfil;
          // console.log(res?.FotoPerfil + ' / ' + res?.FotoPortada);
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
          console.log(this.path + ' - ' + this.rol);
        } else if (this.rol == 'independiente') {
          path = 'Independiente';
          this.path = 'Independiente';
        } else {
          path = '';
        }
        const subpath = 'Redes';
        await this.firestore.createColInDoc<Redes>(this.redes, path, this.id, subpath, this.id);
        this.red = 'save';
        Swal.fire('Información guardada', 'Regresa al perfil', 'success');
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

const galeryImages: { previewUrl: string; srcUrl: string; }[] = [];

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

function timer(ms: number) { return new Promise(res => setTimeout(res, ms)); }