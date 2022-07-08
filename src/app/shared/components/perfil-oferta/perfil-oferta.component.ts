import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ThumbnailsView } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Comentario } from '../../model/comentario.model';
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
  imagenes: string[] = [];
  galeria!: boolean;

  id = '';
  idOfert = '';
  rol: 'empresa' | 'independiente' | 'general' | undefined;
  plan = '';
  path = '';
  fecha: string | undefined;

  telefono!: boolean;
  login!: boolean;

  comentarios = {
    nombre: '',
    comentario: ''
  }
  coment = 0;
  chat: Comentario[] = [];
  numFotos!: string;

  red: 'vacio' | 'mostrar' | undefined;
  mostrar: boolean = false;
  editarInfo: boolean = false; //Se encarga de habiliatar y deshabilitar las areas de edición del perfil
  twitterSafe!: SafeUrl;
  celularG = '';

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private firestore: DataServices, public gallery: Gallery, public lightbox: Lightbox, private storage: AngularFireStorage, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(prm => {
      console.log(prm);
      console.log(`El id es: ${prm['id']}`);
      this.idOfert = JSON.stringify(prm['id']).toString();
      this.idOfert = this.idOfert.substring(1, this.idOfert.length - 1);
      //console.log(this.idOfert);
      this.id = JSON.stringify(prm['uid']).toString();
      this.id = this.id.substring(1, this.id.length - 1);

      if (this.id != '') {
        this.getDatosUser(this.id, this.idOfert);
      }
    });
    this.authService.stateUser().subscribe(res => {
      if (res) {
        console.log('Esta logeado');
        this.login = true;
        if (res.uid != this.id) {
          this.rol = 'general';
        } else {
          this.rol = 'empresa';
        }
        this.getDatosUser(res.uid, this.idOfert);
        //console.log(res.uid);
      } else {
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

  onUploadGaleria(e: any) {

  }

  //Guardar comentarios
  saveComentarios(form: NgForm) {
    try {
      if (this.comentarios.nombre == '') {
        this.comentarios.nombre = 'Anónimo';
      }
      console.log(this.comentarios);
      if (this.coment == 0) {
        this.firestore.createColInDocColl(this.comentarios, 'Empresas', this.id, 'Ofertas', this.idOfert, 'Comentarios', this.coment.toString());
        this.coment = this.coment + 1;
      } else {
        this.firestore.getDocColDocColl<Comentario>('Empresas', this.id, 'Ofertas', this.idOfert, 'Comentarios').subscribe(res => {
          this.coment = res.length + 1
        })
        this.firestore.createColInDocColl(this.comentarios, 'Empresas', this.id, 'Ofertas', this.idOfert, 'Comentarios', this.coment.toString());
        this.coment = this.coment + 1;
      }
      form.resetForm();
      Swal.fire('Comentario guardado', 'Regresar', 'success');
    } catch (error) {
      Swal.fire(
        'Error',
        'Error guardando comentario',
        'error'
      );
    }
  }

  //Editar Oferta
  editarPerfil() {
    this.editarInfo = !this.editarInfo;
    console.log(this.editarInfo);
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
      //Obteniendo datos de la oferta si el usuario es empresa
      if (this.rol == 'empresa') {
        this.path = 'Empresas';
        //Obteniendo datos de la empresa
        this.firestore.getDoc<Empresa>('Empresas', id).subscribe(res => {
          if (res) {
            this.empresa = res;
            this.celularG = this.empresa.celular;
            this.mostrar = true;
            console.log(this.empresa?.celular)
          }
        });

        //Obteniendo las redes sociales de la BD
        this.firestore.getDocColDoc<Redes>('Empresas', id, 'Redes').subscribe(res => {
          //console.log(res);
          if (res == undefined) {
            console.log('La empresa no a registrado sus redes sociales');
          } else {
            this.red === 'mostrar'
            this.network = res;
            this.network.whatsapp = this.network.whatsapp.slice(1, this.network.whatsapp.length).replace(/\s+/g, '');
            this.youtubeSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.youtube);
            this.facebookSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.facebook);
            this.instagramSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.instagram);
            this.twitterSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.twitter);
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
          //console.log(res);
          if (res) {
            this.oferta = res;
            this.fecha = this.oferta?.fechaFin.day.toString() + '/' + this.oferta?.fechaFin.month.toString() + '/' + this.oferta?.fechaFin.year.toString();
            //console.log(this.oferta);

            //obtener dirección de almacenamiento imágenes de la galeria y mostrarlas
            this.imagenes = this.oferta.imagenes
            //console.log(this.imagenes);
            if (this.imagenes.length < 5) {
              this.galeria = false;
            } else if (this.imagenes.length == 5) {
              this.galeria = true;
            }
            for (let index = 0; index < this.imagenes.length; index++) {
              galeryImages[index] = {
                srcUrl: this.imagenes[index],
                previewUrl: this.imagenes[index]
              };
            }
            //almacenar nùmero de fotos almacenadas
            this.firestore.updateCamposDocCollDoc2(galeryImages.length, 'Empresas', id, 'Ofertas', idOfert, 'numImages');
          }
        });

        //Mostrar comentarios almacenados 
        this.firestore.getDocColDocColl<Comentario>('Empresas', this.id, 'Ofertas', idOfert, 'Comentarios').subscribe(res => {
          this.chat = res;
          console.log(this.chat);
        })

        //Obteniendo datos de la oferta si el usuario es un independiente
      } else if (this.rol == 'independiente') {
        this.path = 'Independiente';
        console.log('paso ' + idOfert);
        this.firestore.getDoc<Independiente>('Independiente', id).subscribe(res => {
          if (res) {
            this.independiente = res;
            this.mostrar = true;
            this.celularG = this.independiente.celular;
          }

        });
        this.firestore.getDocColDoc<Redes>('Independiente', id, 'Redes').subscribe(res => {
          console.log(res);
          if (res == undefined) {
            console.log(res)
          } else {
            console.log('paso a redes');
            this.red = 'mostrar';
            this.network = res;
            console.log(this.independiente?.celular);
            this.youtubeSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.youtube);
            this.facebookSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.facebook);
            this.instagramSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.instagram);
            this.twitterSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.twitter);
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
          if (res) {
            this.oferta = res;
            this.fecha = this.oferta?.fechaFin.day.toString() + '/' + this.oferta?.fechaFin.month.toString() + '/' + this.oferta?.fechaFin.year.toString();
            //console.log(this.oferta);

            //obtener dirección de almacenamiento imágenes de la galeria y mostrarlas
            if (this.oferta.imagenes != undefined) {
              this.imagenes = this.oferta.imagenes
              console.log(this.imagenes);
              for (let index = 0; index < this.imagenes.length; index++) {
                galeryImages[index] = {
                  srcUrl: this.imagenes[index],
                  previewUrl: this.imagenes[index]
                };

              }
            }

          }
        })

        //Mostrar comentarios almacenados 
        this.firestore.getDocColDocColl<Comentario>('Independiente', this.id, 'Ofertas', idOfert, 'Comentarios').subscribe(res => {
          this.chat = res;
          console.log(this.chat);
        })

      }
    });
  }


}

const galeryImages: { previewUrl: string; srcUrl: string; }[] = [];