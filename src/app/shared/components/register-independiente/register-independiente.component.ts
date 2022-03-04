import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
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
  independienteForm!: FormGroup;
  private isCel= "\(3[0-9]{2}\)[0-9]{3}[0-9]{4}";
  private isEmail= /\S+@\S+\.\S+/;

  usuario: Usuario = {
    correo: '',
    password: '',
    uid: '',
    perfil: 'independiente',
  }

  constructor(private fb: FormBuilder, private dataSvc: DataService1, public modal: NgbActiveModal, private data: DataServices, private afs: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  async OnSave(): Promise<void> {
    if (this.independienteForm.valid) {
      try {
        //console.log(this.independienteForm.value)
        const formValue = this.independienteForm.value;
        await this.dataSvc.onSaveIndependiente(formValue); 
        this.registrar();
        //Notificación de confirmación
        Swal.fire('Registro exitoso', 'Volver al inicio', 'success');
        this.independienteForm.reset() 
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

  //Registrar usuario
  async registrar() {
    console.log('datos -> ', this.usuario);
    const res = await this.afs.register(this.usuario).catch( error => {
      console.log('error');
    });
    if (res) {
      console.log('Exito al crear el usuario');
      const path = 'Usuarios';
      const id = res.user!.uid;
      this.usuario.uid = id;
      this.usuario.password = '';
      await this.data.createDoc(this.usuario, path, id);
    }
  }

  isValidField (field:string): string {
    const validateField = this.independienteForm.get(field);
    return (!validateField?.valid && validateField?.touched)
      ? 'is-invalid' : validateField?.touched ? 'is-valid' : '';
  }

  notRequiredHasValue(field: string):string {
    return this.independienteForm.get(field)?.value ? 'is-valid' : '';
  }

  private initForm(): void {
  this.independienteForm = this.fb.group({
    nombre: ['', [Validators.required]],
    id: ['', [Validators.required]],
    profesion: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    telefono: [''],
    celular: ['', [Validators.required, Validators.pattern(this.isCel)]],
    correo: ['', [Validators.required, Validators.pattern(this.isEmail)]],
    contraseña: ['', [Validators.required, Validators.minLength(8)]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    domicilio: [''],
    servicios: ['', [Validators.required]],
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
}

