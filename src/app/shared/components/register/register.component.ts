import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/dataRegE.services';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [DataService, AuthService, DataServices]
})
export class RegisterComponent implements OnInit {
  empresaForm!: FormGroup;
  private isNIT= "^([0-9]{0,15}[0-9]{1})?$";
  private isCel= "\(3[0-9]{2}\)[0-9]{3}[0-9]{4}";
  private isEmail= /\S+@\S+\.\S+/;
  fecha = new Date;

  usuario: Usuario = {
    correo: '',
    password: '',
    uid: '',
    perfil: 'empresa',
    referencia: '',
    plan: 'mensual',
    fechaInicio: '',
    fechaFin: '',
  }

  constructor( public modal: NgbActiveModal, private fb: FormBuilder, private dataSvc: DataService, private afs: AuthService, private data: DataServices) { }

  ngOnInit(): void {
    this.initForm();
  }
  
  async OnSave(): Promise<void> {
    if (this.empresaForm.valid) {
      try {
        
        this.registrar();
        //Notificación de confirmación
        Swal.fire('Registro exitoso', 'Volver al inicio', 'success');
        this.empresaForm.reset()
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

  async registrar() {
    const formValue = this.empresaForm.value;
    console.log('datos -> ', this.usuario);
    const res = await this.afs.register(this.usuario).catch( error => {
      console.log('error');
    });
    if (res) {
      console.log('Exito al crear el usuario');
      const {correo} = this.empresaForm.value;
      const id = res.user!.uid;
      this.usuario.correo = correo;
      this.usuario.uid = id;
      this.usuario.password = '';
      this.usuario.referencia = this.referenciaPago();
      if (this.usuario.plan == 'mensual') {
        this.usuario.fechaInicio = this.fecha.toLocaleDateString();
        this.usuario.fechaFin = (this.fecha.getDate() + '/' + (this.fecha.getMonth() + 2) + '/' + this.fecha.getFullYear());
        console.log(this.usuario.fechaInicio, '-', this.usuario.fechaFin);
      } else if (this.usuario.plan == 'anual') {
        this.usuario.fechaInicio = this.fecha.toLocaleDateString();
        this.fecha.setDate(this.fecha.getFullYear() + 1);
        this.usuario.fechaFin = this.fecha.toLocaleDateString();
        console.log(this.usuario.fechaFin);
      }
      await this.data.createDoc(this.usuario, 'Usuarios', id);
      await this.dataSvc.onSaveEmpresa(formValue, this.usuario, id);
    }
  }

  isValidField (field:string): string {
    const validateField = this.empresaForm.get(field);
    return (!validateField?.valid && validateField?.touched)
      ? 'is-invalid' : validateField?.touched ? 'is-valid' : '';
  }

  notRequiredHasValue(field: string):string {
    return this.empresaForm.get(field)?.value ? 'is-valid' : '';
  }

  private initForm(): void {
    this.empresaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      nit: ['', [Validators.required, Validators.pattern(this.isNIT)]],
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: [''],
      celular: ['', [Validators.required, Validators.pattern(this.isCel)]],
      correo: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
      actividadPrincipal: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      horaMInicio: [''],
      horaMFin: [''],
      horaTInicio: [''],
      horaTFin: [''],
      domicilio: [''],
      servicios: ['', [Validators.required]],
      informacionAdicional: [''],
      nombreReferencia1: ['', [Validators.required]],
      celularReferencia1: ['', [Validators.required, Validators.pattern(this.isCel)]],
      ocupacionReferencia1: ['', [Validators.required]],
      nombreReferencia2: ['', [Validators.required]],
      celularReferencia2: ['', [Validators.required, Validators.pattern(this.isCel)]],
      ocupacionReferencia2: ['', [Validators.required]],
      codigoAsesor: [''],
      terminosyCondiciones: ['', [Validators.required]],
    });

  }

  referenciaPago() {
    let result = 'WP';
    const numeros = '0123456789';
    for (let i = 0; i < 6; i++) {
      result += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    console.log('Referencia de pago -> ' ,result)
    return result;
  }
}
