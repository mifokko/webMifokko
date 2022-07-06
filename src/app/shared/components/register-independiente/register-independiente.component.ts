import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Ciudades } from '../../model/ciudades.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { DataService1 } from '../../services/dataRegIndependiente.services';

@Component({
  selector: 'app-register-independiente',
  templateUrl: './register-independiente.component.html',
  styleUrls: ['./register-independiente.component.scss'],
  providers: [DataService1, DataServices, AuthService]
})
export class RegisterIndependienteComponent implements OnInit {
  independienteForm!: FormGroup; //Estructura de los datos del independiente
  private isCel = "\(3[0-9]{2}\)[0-9]{3}[0-9]{4}"; //Estructura del número celular 
  private isDoc = "\[0-9]{8,10}"; // Estructura documento de identificación
  private isEmail = /\S+@\S+\.\S+/; //Estructura de verificacion de Email
  fecha = new Date(); //Obtener fecha actual 

  @ViewChild('imageFotoDoc') inputImageFotoDoc: ElementRef | undefined; //Input donde se subira el documento .pdf del documento de identificacion 
  urlFotoDoc!: Observable<string>; // Variable que almacena la referencia de donde esta almacenado el .pdf
  uploadPercent!: Observable<number | undefined>; // Variable que muestra el porcentaje de subida del documento 

  //Datos de plan, # de pagos, tipo de paquete y precio del plan
  passedData!: string;
  precioPlan!: number;
  pagos!: string;

  //Estructura de informacion de usuario
  usuario: Usuario = {
    correo: '', //Correo
    password: '', // Este campo se mantendra vacio
    uid: '', // Identificacion generada por AuthService
    perfil: 'independiente', //Rol del usuario 
    referencia: '', // Referencia de pago 
    plan: this.pagos, // Si es ANUAL o 3MENSUALES
    tipoPlan: this.passedData, //Si es INDEPENDIENTEORO o INDEPENDIENTEPLATA
    pago: this.precioPlan, // Precio que debe pagar el usuario por la subscripción 
    fechaInicio: '', //Fecha de inicio de subscripción 
    fechaFin: '', //Fecha final de subscripción 
    estadoPago: false //Estado del pago- Si se ha pagado o no la subscripción 
  }
  seleccion = ''; //Muestra el departamento seleccionado, para obtener los municipios de ese departamento  
  fieldTextType: boolean = false; // Función para mostrar la contraseña 

  ciudades: Ciudades[] = []; //Lista de la tabla CIUDADES de la base de datos 
  municipios: string[] = []; //Lista de los municipios de un determinado departamento 
  departamentos: string[] = []; //Lista de los departamentos de Colombia 
  departamento: string[] = [];

  //Referencias de pago 
  referenciaWompi = '';
  referenciaMercadoPago = '';

  constructor(private fb: FormBuilder, private dataSvc: DataService1, config: NgbDatepickerConfig, public modal: NgbActiveModal, private data: DataServices, private storage: AngularFireStorage, private afs: AuthService) {
    data.getCollection<Ciudades>('Ciudades').subscribe(res => {
      //console.log(res);
      this.ciudades = res;
      for (let index = 0; index < res.length; index++) {
        this.departamentos[index] = res[index].departamento;
      }
      this.departamento = this.departamentos.filter((valor, indice) => {
        return this.departamentos.indexOf(valor) === indice;
      });
      this.departamento = this.departamento.sort();
    })
    console.log(this.departamento);
    //Configuracion del input Date
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2022, month: 12, day: 31 };
    //Referencias de pago
    this.referenciaWompi = this.referenciaPago();
    this.referenciaMercadoPago = this.referenciaPagoM();
  }

  ngOnInit(): void {
    this.initForm();
  }

  //Función que carga los municipios en una lista, según el departamento que se ha seleccionado 
  uploadMunicipios() {
    this.municipios = [];
    console.log(this.seleccion);
    for (let index = 0; index < this.ciudades.length; index++) {
      if (this.seleccion === this.ciudades[index].departamento) {
        this.municipios[index] = this.ciudades[index].municipio
      } else {
        console.log('paso');
      }
    }

    this.municipios = this.municipios.filter(Boolean);
    this.municipios = this.municipios.sort();
    console.log(this.municipios.length);
  }

  //Función que se encarga de guardar el documento en el almacenamiento 
  onUpload(e: any) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `Documentos/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => this.urlFotoDoc = ref.getDownloadURL())).subscribe();
  }

  //Función que llama a la funcion de almacenamiento y es la encargada de resetear los formularios
  async OnSave(): Promise<void> {
    if (this.independienteForm.valid) {
      try {
        this.registrar();
        this.independienteForm.reset()
        this.modal.close();
        //Notificación de confirmación
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

  //Creacion del Usuario, y almacenamiento de la información del independiente 
  async registrar() {
    const formValue = this.independienteForm.value;
    console.log('datos -> ', this.usuario);
    //Creación de cuenta con el correo y contraseña
    const res = await this.afs.register(this.usuario).catch(error => {
      console.log('error');
    });
    if (res) {
      console.log('Exito al crear el usuario');
      const id = res.user!.uid;
      this.usuario.uid = id;
      this.usuario.password = '';
      this.usuario.referencia = this.referenciaPago();
      //Generar fecha de registro de la empresa y fecha de finalizacion de la subscripción
      if (this.usuario.plan == '1MENSUALES') {
        this.usuario.fechaInicio = this.fecha.toLocaleDateString();
        this.usuario.fechaFin = (this.fecha.getDate() + '/' + (this.fecha.getMonth() + 2) + '/' + this.fecha.getFullYear());
        //console.log(this.usuario.fechaInicio, '-', this.usuario.fechaFin);
      } else if (this.usuario.plan == 'ANUAL') {
        this.usuario.fechaInicio = this.fecha.toLocaleDateString();
        this.fecha.setDate(this.fecha.getFullYear() + 1);
        this.usuario.fechaFin = this.fecha.toLocaleDateString();
        //console.log(this.usuario.fechaFin);
      }
      //Se guarda la información de Usuario de la empresa y se guarda la información de la empresa
      await this.data.createDoc(this.usuario, 'Usuarios', id);
      await this.dataSvc.onSaveIndependiente(formValue, this.usuario, id);

      //Guardar la referencia del archivo de documento 
      this.urlFotoDoc.forEach(async value => {
        this.data.updateCamposDoc(value, 'Independiente', id, 'fotoDoc');
      });
    }
  }
  //Validacion de campos obligatorios 
  isValidField(field: string): string {
    const validateField = this.independienteForm.get(field);
    return (!validateField?.valid && validateField?.touched)
      ? 'is-invalid' : validateField?.touched ? 'is-valid' : '';
  }
  //Validacion de campos que no son obligatorios 
  notRequiredHasValue(field: string): string {
    return this.independienteForm.get(field)?.value ? 'is-valid' : '';
  }

  //Estructura de datos del registro del independiente
  private initForm(): void {
    this.independienteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      documento: ['', [Validators.required, Validators.pattern(this.isDoc)]],
      tipoDocumento: ['', [Validators.required]],
      fotoDoc: ['', [Validators.required]],
      fechanacimiento: [''],
      profesion: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: [''],
      barrio: [''],
      telefono: [''],
      celular: ['', [Validators.required, Validators.pattern(this.isCel)]],
      correo: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      domicilio: [''],
      servicios: ['', [Validators.required]],
      nombreReferencia1: ['', [Validators.required]],
      celularReferencia1: ['', [Validators.required, Validators.pattern(this.isCel)]],
      ocupacionReferencia1: [''],
      codigoAsesor: [''],
      terminosyCondiciones: ['', [Validators.required]],
    });

  }
  //Se obtiene la referencia de pago
  referenciaPago() {
    let result = 'WP';
    const numeros = '0123456789';
    for (let i = 0; i < 6; i++) {
      result += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    console.log('Referencia de pago -> ', result)
    return result;
  }

  //Se obtiene la referencia de pago
  referenciaPagoM() {
    let result = 'MP';
    const numeros = '0123456789';
    for (let i = 0; i < 6; i++) {
      result += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    console.log('Referencia de pago -> ', result)
    return result;
  }

  //Ver contraseña
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}

