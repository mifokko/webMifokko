import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DataService1 } from '../../services/dataRegIndependiente.services';

@Component({
  selector: 'app-register-independiente',
  templateUrl: './register-independiente.component.html',
  styleUrls: ['./register-independiente.component.scss'],
  providers: [DataService1]
})
export class RegisterIndependienteComponent implements OnInit {
  independienteForm!: FormGroup;
  private isCel= "\(3[0-9]{2}\)[0-9]{3}[0-9]{4}";
  private isEmail= /\S+@\S+\.\S+/;

  constructor(private fb: FormBuilder, private dataSvc: DataService1) { }

  ngOnInit(): void {
    this.initForm();
  }

  async OnSave(): Promise<void> {
    if (this.independienteForm.valid) {
      try {
        const formValue = this.independienteForm.value;
        await this.dataSvc.onSaveIndependiente(formValue); 
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
  })

  }

  clear() {
    console.log("clear clicked")
    this.independienteForm.reset();
  }
}

