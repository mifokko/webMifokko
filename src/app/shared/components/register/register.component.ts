import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  empresaForm!: FormGroup;
  private isNIT= "^([0-9]{0,15}-[0-9]{1})?$";
  private isCel= "\(3[0-9]{2}\) [0-9]{3}[ -][0-9]{4}";
  private isEmail= /\S+@\S+\.\S+/;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }
  
  OnSave(): void {
    if (this.empresaForm.valid) {
      console.log(this.empresaForm.value);
    } else {
      console.log('No Valid');
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
    nombreE: ['', [Validators.required]],
    nitE: ['', [Validators.required, Validators.pattern(this.isNIT)]],
    departamento: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    telefono: [''],
    celular: ['', [Validators.required, Validators.pattern(this.isCel)]],
    email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
    contraseña: ['', [Validators.required, Validators.minLength(8)]],
    actPrincipal: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    horario: [''],
    domicilio: [''],
    servicios: ['', [Validators.required]],
    infoAdd: [''],
    nomRef1: ['', [Validators.required]],
    celRef1: ['', [Validators.required, Validators.pattern(this.isCel)]],
    ocupRef1: ['', [Validators.required]],
    nomRef2: ['', [Validators.required]],
    celRef2: ['', [Validators.required, Validators.pattern(this.isCel)]],
    ocupRef2: ['', [Validators.required]],
    codigoA: [''],
    tyC: ['', [Validators.required]],
  })

  }

  clear() {
    console.log("clear clicked")
    this.empresaForm.reset();
  }
}
