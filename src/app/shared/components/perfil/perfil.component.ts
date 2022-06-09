import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ThumbnailsView } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import Swal from 'sweetalert2';
import { Empresa } from '../../model/empresa.model';
import { Redes } from '../../model/redes.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { finalize, Observable, takeLast } from 'rxjs';
import { Perfil } from '../../model/perfil.model';
import { GaleriaImage, Image } from '../../model/galeria.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Comentario } from '../../model/comentario.model';
import { deleteObject, getStorage, ref } from 'firebase/storage';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  @ViewChild('imageUser') inputImageUser: ElementRef | undefined;
  @ViewChild('imagePortada') inputImagePortada: ElementRef | undefined;
  @ViewChild('imageGallery') inputImageGallery: ElementRef | undefined;
  @ViewChild('imagenesGaleria') inputImagenesGaleria!: ElementRef;
  @ViewChild('archivoPortafolio') inputarchivoPortafolio: ElementRef | undefined;

  //Esta estructura se usa cuando se va a guardar las redes sociales
  redes = {
    youtube: '',
    instagram: '',
    whatsapp: '',
    facebook: ''
  }

  //Esta estructura se usa para conocer y validar que campos de redes sociales no se han llenado
  networks = {
    youtube: '',
    instagram: '',
    whatsapp: '',
    facebook: ''
  }

  //Estructura para almacenar los comentarios
  comentarios = {
    nombre: '',
    comentario: ''
  }
  coment = 0;
  campo!: string; //Nombre del campo para actualizar
  tipoPlan!: string; //Tipo de paquete de subscripción del usuario
  //imagen!: string;
  expresionRegular = /\s*;\s*/;
  imagen: string[] = []; //Se usa para almacenar las referencias que se pueden usar para mostrar las imagenes en pantalla 
  imagenes: GaleriaImage[] = []; //Se usa para separar las referencias de las imagenes de la galeria
  galeria!: boolean;
  video!: boolean;
  refUrl = ''; //Se usa para almacenar la Url de la imagen mientras se termina el proceso 
  listaArchivos: any[] = []; //Se usa para almacenar la lisa de archivos a almacenar, se emplea con el fin de verificar la cantidad de imagenes que puede subir segun el plan que paga

  servicios!: string[] | undefined; //Se usa para separar y almacenar los servicios 

  urlGalery!: Observable<string>;
  file: any; //Referencia del archivo a subir 
  filePath: any; //Direccion donde se almacenara la imagen
  sigte: boolean = true;
  index = 0; //Se usa como contador para guardar en orden las imagenes 

  mostrar: boolean = false;
  red: 'save' | 'mostrar' | 'vacio' | undefined;
  net: 'save' | undefined;
  youtubeSafe!: SafeUrl; //Variable que contiene el link de youtube del usuario a mostrar
  facebookSafe!: SafeUrl; //Variable que contiene el link de fecebook del usuario a mostrar
  instagramSafe!: SafeUrl; //Variable que contiene el link de instagram del usuario a mostrar

  fotoP: boolean = false; //Nos dice si hay o no en la base de datos imagen de perfil de la empresa
  fotoPor: boolean = false; //Nos dice si hay o no en la base de datos imagen de portada de la empresa
  perfilSafe!: SafeUrl | undefined; //Variable que contiene el link de la imagen de perfil para mostrar 
  portadaSafe!: SafeUrl | undefined; //Variable que contiene el link de la imagen de portada para mostrar
  uploadPercent!: Observable<number | undefined>; //Muestra el porcentaje de subida de las imagenes 
  uploadPercentP!: Observable<number | undefined>; //Muestra el porcentaje de subida de la imagen de portada 
  urlImage!: Observable<string>; // Almacena la direccion URL donde se almacenado la imagen de pefil
  urlPortada!: Observable<string>; //ALmacena la deireccion URL deonde se almacena la imagen de portada  

  uploadPercentPortafolio!: Observable<number | undefined>;
  urlPortafolio!: Observable<string>;
  portafolio!: boolean;

  rol: 'empresa' | 'independiente' | 'general' | undefined;
  gallerys!: boolean; // Con esta nos damos cuenta si el usuario en su galeria ya ha cumplido con la capacidad de fotos que puede subir 
  network!: Redes; // Objeto donde se almacenan la referencia de las redes sociales del usuario, para mostrar 
  empresa: Empresa | undefined; // Objeto que contiene la informacion del usuario para mostrar

  // Este grupo se usa en la galeria, 
  items!: GalleryItem[];
  imageData = galeryImages;
  paso!: boolean;

  id = ''; // Numero con el cual esta guardada la informacion del usuario en la base de datos
  path = ''; // Se usa como referencia de la carpeta en donde esta almacenada la informacion del Usuario, para saber que tipo de Coleccion es.
  plan = ''; // Muestra el tipo de paquete al que esta subscrito el usuario
  numFotos!: number; // Se almacena el número de imagenes almacenadas 
  filepathPortafolio!: string; // Se usa para guardar la referencia que se usara al momento de eliminar el portafolio

  telefono!: boolean; // Se usa para saber si han dado click en el icono del telefono y muestra el número 
  chat: Comentario[] = []; //Lista donde se almacenan los comentarios que se han hecho a la empresa
  userToken!: string; //Guarda el token del usuario loggeado
  login!: boolean; // Muestra se se inicio sesion o no 
  editarInfo: boolean = false; //Se encarga de habiliatar y deshabilitar las areas de edición del perfil

  checksImagenes: string[] = []; // Se almacena la referencia de la imagen que se desea eliminar 
  idsImagenes: string[] = []; // Almacena el identificador de la imagen a eliminar 

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private firestore: DataServices, public gallery: Gallery, public lightbox: Lightbox, private storage: AngularFireStorage, private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(prm => {
      //console.log(`El id es: ${prm['id']}`);
      this.id = JSON.stringify(prm['id']).toString();
      this.id = this.id.substring(1, this.id.length - 1);
      //console.log(this.id);
      this.getDatosUser(this.id);
    });

    this.authService.stateUser().subscribe(res => {
      if (res) {
        //console.log('Esta logeado');
        res.getIdToken().then(idToken => {
          this.userToken = idToken;
        })
        this.login = true;
        if (res.uid != this.id) {
          this.rol = 'general';
        } else {
          this.rol = 'empresa';
        }
        //console.log(this.rol);
        //console.log(res.uid);
      } else {
        //console.log('No esta logeado');
        this.login = false;
        this.rol = 'general';
        //console.log(this.rol);
      }
    })
  }

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

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

  //Cargar Imagen de Perfil
  onUpload(e: any) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();

  }
  //Guardar referencia de foto de perfil en BD 
  async saveImageP() {
    let path = 'Empresas';

    this.urlImage.forEach(async value => {
      this.firestore.updateCamposDoc(value, path, this.id, 'fotoPerfil');
    });
    this.fotoP = true;

    //console.log('Paso');
  }

  //Cargar Imagen de Portada
  onPortada(e: any) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercentP = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlPortada = ref.getDownloadURL())).subscribe();
  }

  //Guardar referencia de foto de portada en BD 
  async saveImagePor() {
    let path = 'Empresas';

    this.urlPortada.forEach(async value => {
      this.firestore.updateCamposDoc(value, path, this.id, 'fotoPortada');
    });

    this.fotoPor = true;
    //console.log('Paso');
  }

  //Guardar imagenes en storage y firebase
  async onUploadGaleria(e: any) {
    //console.log('paso', galeryImages.length, this.numFotos);
    //console.log(e.target.files.length);
    //Verificando la cantidad de imagenes que se desean subir 
    switch (this.tipoPlan) {
      case 'EMPRESARIALORO':
        //Con este paquete se pueden subir 5 fotos para oferta
        if (e.target.files.length <= 10 || galeryImages.length <= 10) {
          this.listaArchivos = e.target.files;
        } else {
          alert('La cantidad de imágenes que permite su paquete es de 10');
        }
        break;
      case 'EMPRESARIALPLATA':
        //Con este paquete se pueden subir 3 fotos para oferta
        if (e.target.files.length <= 6 || galeryImages.length <= 6) {
          this.listaArchivos = e.target.files;
        } else {
          alert('La cantidad de imágenes que permite su paquete es de 3');
        }
        break;
      default:
        alert('No se especifico su plan');
        break;
    }
    const metadata = {
      contentType: 'image/jpeg'
    };

    //Funcion para el almacenamiento de las imagenes en el Storage de la base de datos
    for (let index = 0; index < this.listaArchivos.length; index++) {
      const id = Math.random().toString(36).substring(2);
      this.file = this.listaArchivos[index]; //Archivo a almacenar
      this.path = 'Empresas'; //Carpeta principal donde se va a almacenar
      this.filePath = `Galeria/${this.empresa?.nombre}/${this.listaArchivos[index].name}_${id}`; //Dirección de almacenamiento
      //console.log('paso ' + this.path);
      const ref = this.storage.ref(this.filePath);
      const task = this.storage.upload(this.filePath, this.file, metadata); //Funcion de almacenamiento//
      this.uploadPercent = task.percentageChanges(); //Variable que muestra el porcentaje de carga de las imagenes 
      task.snapshotChanges().pipe(finalize(() => this.urlGalery = ref.getDownloadURL())).subscribe(); //Obtiene la URL de referencia de la imagen almacenada
      console.log('paso');
      //En esta seccion se guardan las URL de referencia de las imagenes en la carpeta de Galeria en la Base de Datos 
      await timer(4000);
      task.then(() =>
        this.urlGalery.forEach(async valor => {
          console.log(valor);
          this.refUrl = valor;
        })
      )
      await timer(3000);
      this.imagen[index] = this.refUrl;
      this.refUrl = '';
      console.log(this.refUrl, this.imagen[index]);
      (await task).state;
    }
    // if (galeryImages.length > 0) {
    //   this.index = galeryImages.length + 1;
    // } else {
    //   this.index = this.index;
    // }
    this.index = this.index;
    console.log(this.index, this.imagen);
    if (galeryImages.length < 10) {
      for (let index = 0; index < this.imagen.length; index++) {
        const codigo = Math.random().toString(36).substring(2);
        this.firestore.createColInDoc({ 'IMG': this.imagen[index] }, 'Empresas', this.id, 'Galeria', this.index.toString());
        this.firestore.updateCamposDocCollDoc2(this.index.toString(), 'Empresas', this.id, 'Galeria', this.index.toString(), 'uid');
        this.index++;
      }
    } else if (galeryImages.length >= 10) {
      alert('No se pueden subir más imágenes');
    }

    this.imagen = [];
  }

  //Funcion para eliminar las imagenes selecionadas
  eliminarImagenes(){
    for (let index = 0; index < this.checksImagenes.length; index++) {
      const storagea = getStorage();
      const desertRef = ref(storagea, this.checksImagenes[index]);
      deleteObject(desertRef).then(() => {
        this.firestore.deleteCamposColDoc(this.path, this.id, 'Galeria', this.idsImagenes[index]);
      }).catch((error) => {
        Swal.fire('Error Eliminando archivo', 'Intentelo de nuevo', 'error');
      });
    }
    Swal.fire('Imágenes eliminadas', 'Regresar al perfil', 'success');
    console.log(this.checksImagenes);
  }

  agregar(data: string, e: any, index: string) { // Agregamos el elemento
    const input = e as HTMLInputElement;
    if (input.checked) {
      this.checksImagenes.push(data);
      this.idsImagenes.push(index);
    }else{
      this.checksImagenes = this.checksImagenes.filter(s => s !== data);
      this.idsImagenes = this.idsImagenes.filter(s => s !== index);
    }
    console.log(this.checksImagenes);
  }


  //Suibir archivo portafolio
  onPortafolio(e: any) {
    let path = 'Empresas';
    const storagee = getStorage();
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `Portafolio/${this.empresa?.nombre}/${id}_${e.target.files[0].name}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercentPortafolio = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlPortafolio = ref.getDownloadURL())).subscribe();
    task.then(() => {
      try {
        this.urlPortafolio.forEach(value => {
          this.firestore.updateCamposDoc(value, path, this.id, 'portafolio');
        })
        Swal.fire('Archivo guardado', 'Regresa al perfil', 'success');
      } catch (error) {
        Swal.fire(
          'Error',
          'Error cargando archivo',
          'error'
        );
      }
    });
  }

    //Funcion que se encarga de eliminar los archivos 
    async eliminarArchivo(portafolio: string){
      const storagea = getStorage();
      const desertRef = ref(storagea, portafolio);
      deleteObject(desertRef).then(() => {
        this.firestore.deleteCamposDoc(this.path, this.id, 'portafolio');
        Swal.fire('Portafolio eliminado', 'Regresar al perfil', 'success');
      }).catch((error) => {
        Swal.fire('Error Eliminando archivo', 'Intentelo de nuevo', 'error');
      });
    }

  //Actualizar redes sociales 
  actualizarRedesS() {
    this.mostrar = false;
    let path = 'Empresas';
    try {
      if (this.redes.facebook != '') {
        this.firestore.updateCamposDocCollDoc(this.redes.facebook, path, this.id, 'Redes', 'facebook');
      }
      if (this.redes.youtube != '') {
        this.firestore.updateCamposDocCollDoc(this.redes.youtube, path, this.id, 'Redes', 'youtube');
      }
      if (this.redes.instagram != '') {
        this.firestore.updateCamposDocCollDoc(this.redes.instagram, path, this.id, 'Redes', 'instagram');
      }
      if (this.redes.whatsapp != '') {
        this.firestore.updateCamposDocCollDoc(this.redes.whatsapp, path, this.id, 'Redes', 'whatsapp');
      }
      Swal.fire('Redes Actualizadas', 'Regresa al perfil', 'success');
    } catch (error) {
      Swal.fire(
        'Error',
        'Error cargando links',
        'error'
      );
    }

  }

  //Guardar comentarios
  saveComentarios(form: NgForm) {
    try {
      if (this.comentarios.nombre == '') {
        this.comentarios.nombre = 'Anónimo';
      }
      console.log(this.comentarios);
      if (this.coment == 0) {
        this.firestore.createColInDoc(this.comentarios, 'Empresas', this.id, 'Comentarios', this.coment.toString());
        this.coment = this.coment + 1;
      } else {
        this.firestore.getDocCol<Comentario>('Empresas', this.id, 'Comentarios').subscribe(res => {
          this.coment = res.length + 1
        })
        this.firestore.createColInDoc(this.comentarios, 'Empresas', this.id, 'Comentarios', this.coment.toString());
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

  //Consulta de datos de los usuarios para mostrar en el perfil 
  getDatosUser(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res) {
        this.path = 'Empresas';
        this.tipoPlan = res.tipoPlan;
      }

      //Obteniendo datos de la empresa
      this.firestore.getDoc<Empresa>('Empresas', id).subscribe(res => {
        this.empresa = res;

        //Listar los servicios 
        this.servicios = this.empresa?.servicios.split(',');
        //console.log(this.servicios);

        //Carga portafolio
        if (this.empresa?.portafolio == undefined) {
          this.portafolio = false;
        } else {
          this.portafolio = true;
          //console.log(this.empresa.portafolio);
        }

        if (this.empresa?.youtubeVideo == '') {
          this.video = false;
          //console.log(this.video);
        } else {
          this.video = true;
          //console.log(this.video);
        }
      });

      //Obteniendo las redes sociales de la BD
      this.firestore.getDocColDoc<Redes>('Empresas', id, 'Redes').subscribe(res => {
        //console.log(res);
        if (res == undefined) {
          //console.log(res)
          this.red = 'vacio';
          this.mostrar = false;
          this.net = undefined;
          //console.log(this.red);
        } else {
          //console.log('paso');
          this.red = 'mostrar';
          //console.log(res);
          this.network = res;
          if (!this.network.facebook.length || !this.network.instagram.length || !this.network.whatsapp.length || !this.network.youtube.length) {
            this.net = 'save';
            this.networks.facebook = this.network.facebook;
            this.networks.youtube = this.network.youtube;
            this.networks.instagram = this.network.instagram;
            this.networks.whatsapp = this.network.whatsapp
          } else {
            this.net = undefined;
          }
          this.network.whatsapp = this.network.whatsapp.slice(1, this.network.whatsapp.length).replace(/\s+/g, '');
          this.youtubeSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.youtube);
          this.facebookSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.facebook);
          this.instagramSafe = this.sanitizer.bypassSecurityTrustUrl(this.network.instagram);
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

      //obtener dirección de almacenamiento imágenes de la galeria y mostrarlas
      this.firestore.getDocCol<GaleriaImage>('Empresas', id, 'Galeria').subscribe(res => {
        if (res == undefined) {
          this.galeria = false;
          this.gallerys = false;
          console.log(res);
        } else {
          if (res.length < 10) {
            this.gallerys = false;
          } else if (res.length == 10) {
            this.gallerys = true;
          }
          this.imagenes = res;
          console.log(res);
          for (let index = 0; index < this.imagenes.length; index++) {
            galeryImages[index] = {
              srcUrl: this.imagenes[index].IMG,
              previewUrl: this.imagenes[index].IMG,
              id: this.imagenes[index].uid
            };
          }
          // Guardar cantidad de imagenes almacenadas 
          if (this.index == galeryImages.length) {
            this.firestore.updateCamposDoc(galeryImages.length, this.path, this.id, 'NumFotos');
            this.numFotos = galeryImages.length;
          } else if (this.index > galeryImages.length) {
            this.firestore.updateCamposDoc(this.index, this.path, this.id, 'NumFotos');
            this.numFotos = this.index;
          }
        }

        //console.log(galeryImages.length + ' - ' + this.numFotos);
        //console.log(data);
        if (this.index == galeryImages.length) {
          this.firestore.updateCamposDoc(galeryImages.length, this.path, this.id, 'NumFotos');
          this.numFotos = galeryImages.length;
        } else if (this.index > galeryImages.length) {
          this.firestore.updateCamposDoc(this.index, this.path, this.id, 'NumFotos');
          this.numFotos = this.index;
        }
        this.imageData = galeryImages;
        this.galeria = true;

        if (this.tipoPlan == 'EMPRESARIALORO') {
          if (galeryImages.length < 10) {
            this.gallerys = false;
          }
        } else if (this.tipoPlan == 'EMPRESARIALORO' && galeryImages.length == 10) {
          this.gallerys = true;
        }

      });

      //Mostrar comentarios almacenados 
      this.firestore.getDocCol<Comentario>('Empresas', this.id, 'Comentarios').subscribe(res => {
        this.chat = res;
        //console.log(this.chat);
      })
    })
  }



  redesSociales() {
    this.mostrar = true;
  }

  async redesSocialesR() {
    this.mostrar = false;
    console.log(this.redes);
    if (this.redes) {
      try {
        let path = 'Empresas';
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

  //Funcion que muestra las areas para editar la informacion del perfil
  editarPerfil() {
    this.editarInfo = !this.editarInfo;
    console.log(this.editarInfo);
  }

  //Funcion que guarada en la base de datos la informacion editada del perfil 
  async guardarEdicion(descripcion: string, ciudad: string, direccion: string, celular: string, horaMInicio: string, horaMFin: string, horaTInicio: string, horaTFin: string, domicilio: string, infoAdd: string) {
    try {
      await this.firestore.updateCamposDoc(descripcion, this.path, this.id, 'descripcion');
      await this.firestore.updateCamposDoc(ciudad, this.path, this.id, 'ciudad');
      await this.firestore.updateCamposDoc(direccion, this.path, this.id, 'direccion');
      await this.firestore.updateCamposDoc(horaMInicio, this.path, this.id, 'horaMInicio');
      await this.firestore.updateCamposDoc(horaMFin, this.path, this.id, 'horaMFin');
      await this.firestore.updateCamposDoc(horaTInicio, this.path, this.id, 'horaTInicio');
      await this.firestore.updateCamposDoc(horaTFin, this.path, this.id, 'horaTFin');
      await this.firestore.updateCamposDoc(domicilio, this.path, this.id, 'domicilio');
      await this.firestore.updateCamposDoc(infoAdd, this.path, this.id, 'informacionAdicional');
      Swal.fire('Información actualizada', 'Regresar al perfil', 'success');

    } catch (error) {
      Swal.fire(
        'Error',
        'Revisar información ingresada',
        'error'
      );
    }
    //console.log(descripcion, ciudad, direccion, horaMInicio, horaMFin, horaTInicio, horaTFin, domicilio, infoAdd);
  }

  //Funcion que guarda en la base de datos la informacion editada en la seccion de servicios
  async guardarServicios(servicios: string) {
    try {
      await this.firestore.updateCamposDoc(servicios, this.path, this.id, 'servicios');
      Swal.fire('Servicios actuaizados', 'Regresar al perfil', 'success');
    } catch (error) {
      Swal.fire(
        'Error',
        'Revisar información ingresada',
        'error'
      );
    }
  }



}



const galeryImages: { previewUrl: string; srcUrl: string; id: string }[] = [];

//Función para esperar que se termine una acción antes de continuar
function timer(ms: number) { return new Promise(res => setTimeout(res, ms)); }