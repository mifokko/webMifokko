import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Oferta } from '../../model/oferta.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';

@Component({
  selector: 'app-subir-oferta',
  templateUrl: './subir-oferta.component.html',
  styleUrls: ['./subir-oferta.component.scss'],
  providers: [NgbDatepickerConfig, DataServices, AuthService]
})
export class SubirOfertaComponent implements OnInit {

  @ViewChild('image') inputImage: ElementRef | undefined;
  
  ofertaForm!: FormGroup;
  private isCel = "\(3[0-9]{2}\)[0-9]{3}[0-9]{4}";
  rol: 'empresa' | 'independiente' | 'general' | undefined;
  uid = '';

  //Tipo de plan
  tipoPlan!: string;

  //Elementos para almacenamiento de imagenes en la BD
  uploadPercent!: Observable<number | undefined>
  urlImage!: Observable<string>

  //Lista de link de imagenes
  listaImagenes: SafeUrl[] = [];
  contador = 0;

  //Lista de archivos
  listaArchivos: any[] = [];

  oferta: Oferta[] = [];
  date: Date = new Date();

  constructor(public modal: NgbActiveModal, private storage: AngularFireStorage, private authService: AuthService, private data: DataServices, private firestore: DataServices, private fb: FormBuilder) {
    this.authService.stateUser().subscribe(res => {
      if (res) {
        this.getDatosUser(res.uid);
        console.log(res.uid);
        this.uid = res.uid;
      }
    })
  }

  ngOnInit(): void {
    this.initForm();
  }

  async OnSave(): Promise<void> {
    if (this.ofertaForm.valid) {
      try {
        this.modal.close();
        const formValue = this.ofertaForm.value;
        console.log('datos ->', this.ofertaForm);
        let path = '';
        if (this.rol == 'empresa') {
          path = 'Empresas';
        } else if (this.rol == 'independiente') {
          path = 'Independiente';
        } else {
          path = '';
        }
        const subpath = 'Ofertas';
        let id = '';
        const numeros = '0123456789';
        for (let i = 0; i < 6; i++) {
          id += numeros.charAt(Math.floor(Math.random() * numeros.length));
        }

        for (let index = 0; index < this.listaArchivos.length; index++) {
          const id = Math.random().toString(36).substring(2);
          const file = this.listaArchivos[index];
          const filePath = `Ofertas/${id}_${this.uid}`;
          const ref = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);
          this.uploadPercent = task.percentageChanges();
          task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
          //Guardar referencia de las imágenes en un array
          task.then(() => {
            this.urlImage.forEach(value => {
              this.listaImagenes[this.contador] = value;
              this.contador++;
              //this.firestore.updateCamposDocCollDoc(value, path, id, 'Ofertas', ('IMG' + index));
            })
          });
          await timer(6000);
          (await task).state;
        }
        await this.data.createColInDoc(formValue, path, this.uid, subpath, id);
        await this.data.updateCamposDocCollDoc2(id, path, this.uid, subpath, id, 'id');
        this.firestore.updateCamposDocCollDoc2(this.listaImagenes, path, this.uid, subpath, id,'imagenes');
        Swal.fire('Registro exitoso', 'Volver al inicio', 'success');
        this.ofertaForm.reset()
        this.modal.close();
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

  //Almacenar imagenes en storage
  async onUpload(e: any) {
    switch (this.tipoPlan) {
      case 'EMPRESARIALORO':
        //Con este paquete se pueden subir 5 fotos para oferta
        if (e.target.files.length <= 5) {
          this.listaArchivos = e.target.files;
        } else {
          alert('La cantidad de imágenes que permite su paquete es de 5');
        }
        break;
      case 'EMPRESARIALPLATA':
        //Con este paquete se pueden subir 3 fotos para oferta
        if (e.target.files.length <= 3) {
          this.listaArchivos = e.target.files;
        } else {
          alert('La cantidad de imágenes que permite su paquete es de 3');
        }
        break;
      case 'INDEPENDIENTEORO':
        //Con este paquete se pueden subir 4 fotos para oferta
        if (e.target.files.length <= 4) {
          this.listaArchivos = e.target.files;
        } else {
          alert('La cantidad de imágenes que permite su paquete es de 4');
        }
        break;
      case 'INDEPENDIENTEPLATA':
        //Con este paquete se pueden subir 2 fotos para oferta
        if (e.target.files.length <= 2) {
          this.listaArchivos = e.target.files;
        } else {
          alert('La cantidad de imágenes que permite su paquete es de 2');
        }
        break;
      default:
        alert('No se especifico su plan');
        break;
    }
    console.log(this.listaImagenes);
  }

  //Obtener Perfil del usuario actual
  getDatosUser(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    //Se obtiene el rol del usuario que va subir la oferta y que tipo de paquete tiene este usuario
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res) {
        this.rol = res.perfil;
        this.tipoPlan = res.tipoPlan;
      }
    });
  }

  //Validaciones
  isValidField(field: string): string {
    const validateField = this.ofertaForm.get(field);
    return (!validateField?.valid && validateField?.touched)
      ? 'is-invalid' : validateField?.touched ? 'is-valid' : '';
  }

  notRequiredHasValue(field: string): string {
    return this.ofertaForm.get(field)?.value ? 'is-valid' : '';
  }

  //Estructura
  private initForm(): void {
    this.ofertaForm = this.fb.group({
      imagenes: ['', [Validators.required]],
      nombreOferta: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      precio: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      domicilio: ['', [Validators.required]],
      alcance: ['', [Validators.required]],
      celular: ['', [Validators.required, Validators.pattern(this.isCel)]],
      direccion: ['', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      horaFin: ['', [Validators.required]],
      informacionAdicional: [''],
      estado: ['Activo']
    });

  }

}

function timer(ms: number) { return new Promise(res => setTimeout(res, ms)); }
