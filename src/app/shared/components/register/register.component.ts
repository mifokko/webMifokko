import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/dataRegE.services';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [DataService]
})
export class RegisterComponent implements OnInit {
  empresaForm!: FormGroup;
  private isNIT= "^([0-9]{0,15}-[0-9]{1})?$";
  private isCel= "\(3[0-9]{2}\)[0-9]{3}[0-9]{4}";
  private isEmail= /\S+@\S+\.\S+/;
  
  constructor( public modal: NgbActiveModal, private fb: FormBuilder, private dataSvc: DataService) { }

  ngOnInit(): void {
    this.initForm();
  }
  
  async OnSave(): Promise<void> {
    if (this.empresaForm.valid) {
      try {
        const formValue = this.empresaForm.value;
        await this.dataSvc.onSaveEmpresa(formValue); 
        //Notificación de confirmación
        Swal.fire('Registro exitoso', 'Volver al inicio', 'success');
        this.empresaForm.reset() 
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
    horaMañanaInicio: [''],
    horaMañanaFin: [''],
    horaTardeInicio: [''],
    horaTardeFin: [''],
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

  clear() {
    console.log("clear clicked")
    this.empresaForm.reset();
  }
}
