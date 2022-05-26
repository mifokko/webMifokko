import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ThumbnailsView } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { Observable } from 'rxjs';
import { Empresa } from '../../model/empresa.model';
import { Independiente } from '../../model/independiente.model';
import { Ofertas } from '../../model/oferta.model';
import { Perfil } from '../../model/perfil.model';
import { Redes } from '../../model/redes.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';

@Component({
  selector: 'app-perfil-oferta',
  templateUrl: './perfil-oferta.component.html',
  styleUrls: ['./perfil-oferta.component.scss']
})
export class PerfilOfertaComponent implements OnInit {

  empresa: Empresa | undefined;
  independiente: Independiente | undefined;
  oferta: Ofertas | undefined;
  network!: Redes;
  youtubeSafe!: SafeUrl;
  facebookSafe!: SafeUrl;
  instagramSafe!: SafeUrl;

  fotoP: boolean = false;
  fotoPor: boolean = false;
  perfilSafe!: SafeUrl | undefined;
  portadaSafe!: SafeUrl | undefined;
  urlImage!: Observable<string>;
  uploadPercent!: Observable<number | undefined>;

  items!: GalleryItem[];
  imageData = galeryImages;

  id = '';
  idOfert = '';
  rol: 'empresa' | 'independiente' | 'general' | undefined;
  plan = '';
  path =  '';
  fecha: string | undefined;

  telefono!: boolean;
  login!: boolean;

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private firestore: DataServices, public gallery: Gallery, public lightbox: Lightbox, private storage: AngularFireStorage, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe( prm => {
      console.log(prm);
      console.log(`El id es: ${prm['id']}`);
      this.idOfert = JSON.stringify(prm['id']).toString();
      this.idOfert = this.idOfert.substring(1, this.idOfert.length-1);
      console.log(this.idOfert);
      this.id = JSON.stringify(prm['uid']).toString();
      this.id = this.id.substring(1, this.id.length-1);

      if (this.id != '') {
        this.getDatosUser(this.id, this.idOfert);
      }
    });
    this.authService.stateUser().subscribe( res => {
      if(res) {
        console.log('Esta logeado');
        this.login = true;
        this.rol = 'empresa';
        this.getDatosUser(res.uid, this.idOfert);
        //console.log(res.uid);
      }else {
        console.log('No esta logeado');
        this.login = false;
        this.rol = 'general';
      }
    })

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

  onUploadGaleria(e: any){

  }

  //Consulta de datos de los usuarios para mostrar en el perfil 
  getDatosUser(uid: string, idOfert: string) {
    console.log(idOfert, uid);
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res) {
        //console.log(res);
        this.rol = res.perfil;
        this.plan = res.plan;
        //console.log(this.rol);
      }
      if (this.rol == 'empresa') {
        this.path = 'Empresas';
        //Obteniendo datos de la empresa
        this.firestore.getDoc<Empresa>('Empresas', id).subscribe(res => {
          this.empresa = res;
          console.log(this.empresa?.celular)
        });

        //Obteniendo las redes sociales de la BD
        this.firestore.getDocColDoc<Redes>('Empresas', id, 'Redes').subscribe(res => {
          //console.log(res);
          if (res == undefined) {
            console.log('La empresa no a registrado sus redes sociales');
          } else {
            this.network = res;
            this.network.whatsapp = this.network.whatsapp.slice(1, this.network.whatsapp.length).replace(/\s+/g, '');
            this.youtubeSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.youtube);
            this.facebookSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.facebook);
            this.instagramSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.instagram);
            //console.log(this.network.whatsapp);
          }
        });

        //Obteniendo url de Foto de portada y perfil de la BD
        this.firestore.getDoc<Perfil>('Empresas', id).subscribe(res => {
          //console.log(res?.FotoPerfil);
          if (res?.fotoPerfil == undefined && res?.fotoPortada == undefined) {
            this.fotoP = false;
            this.fotoPor = false;
          } else if (res?.fotoPerfil == undefined && res?.fotoPortada != undefined) {
            this.fotoP = false;
            this.portadaSafe = res?.fotoPortada;
            this.fotoPor = true;
          } else if (res?.fotoPerfil != undefined && res?.fotoPortada == undefined) {
            this.fotoP = true;
            this.perfilSafe = res?.fotoPerfil;
            this.fotoPor = false;
          } else {
            this.fotoP = true;
            this.fotoPor = true;
            this.perfilSafe = res?.fotoPerfil;
            this.portadaSafe = res?.fotoPortada;
            //console.log(res?.fotoPerfil + ' / ' + res?.fotoPortada);
          }
          // res?.FotoPerfil;
          // console.log(res?.FotoPerfil + ' / ' + res?.FotoPortada);
          
        });

        //Obteniendo informacion de oferta 
        this.firestore.getDocColDoc2<Ofertas>('Empresas', id, 'Ofertas', idOfert).subscribe(res => {
          console.log(res);
          this.oferta = res;
          this.fecha = this.oferta?.fechaFin.day.toString() + '/' + this.oferta?.fechaFin.month.toString() + '/' + this.oferta?.fechaFin.year.toString();
          console.log(this.oferta);
        })

        //obtener dirección de almacenamiento imágenes de la galeria y mostrarlas
        // this.firestore.getDocColDoc('Empresas', id, 'Galeria').subscribe(res => {

        //   if (res == undefined) {
        //     this.galeria = false;
        //   } else {
        //     this.imagenes = JSON.stringify(res).split(',');
        //     for (let index = 0; index < this.imagenes.length; index++) {
        //       if (galeryImages.length == 0) {
        //         if (index == 0) {
        //           this.imagen[index] = this.imagenes[index].substring(6, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso1-1');
        //         } else if (index == (this.imagenes.length - 1) && this.imagenes.length > 1) {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso1-2');
        //         } else {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso1-3');
        //         }
        //       } else if (galeryImages.length == 1) {
        //         if (index == 0) {
        //           this.imagen[index] = this.imagenes[index].substring(6, this.imagenes[index].length - 2).toString();
        //           console.log(this.imagen[index] + 'paso2-1');
        //         } else if (index == (this.imagenes.length - 1) && this.imagenes.length > 1) {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 3).toString();
        //           console.log(this.imagen[index] + 'paso2-2');
        //         } else {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso2-3');
        //         }
        //       } else if (galeryImages.length > 1) {
        //         if (index == 0) {
        //           this.imagen[index] = this.imagenes[index].substring(6, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso3-1');
        //         } else if (index == this.imagenes.length - 1 && this.imagenes.length > 1) {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 2).toString();
        //           console.log(this.imagen[index] + 'paso3-2');
        //         } else {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso3-3');
        //         }
        //       }


        //       galeryImages[index] = {
        //         srcUrl: this.imagen[index],
        //         previewUrl: this.imagen[index]
        //       };

        //     }
        //     this.reset();
        //     console.log(galeryImages.length + ' - ' + this.numFotos);
        //     //console.log(data);
        //     if (this.index == galeryImages.length) {
        //       this.firestore.updateCamposDoc(galeryImages.length, this.path, this.id, 'NumFotos');
        //       this.numFotos = galeryImages.length;
        //     } else if (this.index > galeryImages.length) {
        //       this.firestore.updateCamposDoc(this.index, this.path, this.id, 'NumFotos');
        //       this.numFotos = this.index;
        //     }
        //     this.imageData = galeryImages;
        //     this.galeria = true;
        //   }
        // });


      } else if (this.rol == 'independiente') {
        this.path = 'Independiente';
        console.log('paso ' + idOfert);
        this.firestore.getDoc<Independiente>('Independiente', id).subscribe(res => {
          this.independiente = res;
        });
        this.firestore.getDocColDoc<Redes>('Independiente', id, 'Redes').subscribe(res => {
          if (res == undefined) {
            console.log(res)
          } else {
            this.network = res;
            this.youtubeSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.youtube);
            this.facebookSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.facebook);
            this.instagramSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.instagram);
          }
        });

        //Obteniendo url de Foto de portada y perfil de la BD
        this.firestore.getDoc<Perfil>('Independiente', id).subscribe(res => {
          //console.log(res?.FotoPerfil);
          if (res?.fotoPerfil == undefined && res?.fotoPortada == undefined) {
            this.fotoP = false;
            this.fotoPor = false;
          } else if (res?.fotoPerfil == undefined && res?.fotoPortada != undefined) {
            this.fotoP = false;
            this.portadaSafe = res?.fotoPortada;
            this.fotoPor = true;
          } else if (res?.fotoPerfil != undefined && res?.fotoPortada == undefined) {
            this.fotoP = true;
            this.perfilSafe = res?.fotoPerfil;
            this.fotoPor = false;
          } else {
            this.fotoP = true;
            this.perfilSafe = res?.fotoPerfil;
            this.portadaSafe = res?.fotoPortada;
            console.log(res?.fotoPerfil + ' / ' + res?.fotoPortada);
          }
          // res?.FotoPerfil;
          // console.log(res?.FotoPerfil + ' / ' + res?.FotoPortada);
        });

        //Obteniendo informacion de oferta 
        this.firestore.getDocColDoc2<Ofertas>('Independiente', id, 'Ofertas', idOfert).subscribe(res => {
          this.oferta = res;
          this.fecha = this.oferta?.fechaFin.day.toString() + '/' + this.oferta?.fechaFin.month.toString() + '/' + this.oferta?.fechaFin.year.toString();
          //console.log(this.oferta);
        })

        //obtener dirección de almacenamiento imágenes de la galeria y mostrarlas
        // this.firestore.getDocColDoc('Independiente', id, 'Galeria').subscribe(res => {

        //   if (res == undefined) {
        //     this.galeria = false;
        //   } else {
        //     this.imagenes = JSON.stringify(res).split(',');
        //     for (let index = 0; index < this.imagenes.length; index++) {
        //       if (galeryImages.length == 0) {
        //         if (index == 0) {
        //           this.imagen[index] = this.imagenes[index].substring(6, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso1-1');
        //         } else if (index == (this.imagenes.length - 1) && this.imagenes.length > 1) {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso1-2');
        //         } else {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso1-3');
        //         }
        //       } else if (galeryImages.length == 1) {
        //         if (index == 0) {
        //           this.imagen[index] = this.imagenes[index].substring(6, this.imagenes[index].length - 2).toString();
        //           console.log(this.imagen[index] + 'paso2-1');
        //         } else if (index == (this.imagenes.length - 1) && this.imagenes.length > 1) {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 3).toString();
        //           console.log(this.imagen[index] + 'paso2-2');
        //         } else {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso2-3');
        //         }
        //       } else if (galeryImages.length > 1) {
        //         if (index == 0) {
        //           this.imagen[index] = this.imagenes[index].substring(6, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso3-1');
        //         } else if (index == this.imagenes.length - 1 && this.imagenes.length > 1) {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 2).toString();
        //           console.log(this.imagen[index] + 'paso3-2');
        //         } else {
        //           this.imagen[index] = this.imagenes[index].substring(5, this.imagenes[index].length - 1).toString();
        //           console.log(this.imagen[index] + 'paso3-3');
        //         }
        //       }


        //       galeryImages[index] = {
        //         srcUrl: this.imagen[index],
        //         previewUrl: this.imagen[index]
        //       };

        //     }
        //     this.reset();
        //     console.log(galeryImages.length + ' - ' + this.numFotos);
        //     //console.log(data);
        //     if (this.index == galeryImages.length) {
        //       this.firestore.updateCamposDoc(galeryImages.length, this.path, this.id, 'NumFotos');
        //       this.numFotos = galeryImages.length;
        //     } else if (this.index > galeryImages.length) {
        //       this.firestore.updateCamposDoc(this.index, this.path, this.id, 'NumFotos');
        //       this.numFotos = this.index;
        //     }
        //     this.imageData = galeryImages;
        //     this.galeria = true;
        //   }
        // });

      }
    });
  }


}

const galeryImages: { previewUrl: string; srcUrl: string; }[] = [];