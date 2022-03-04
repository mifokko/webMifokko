import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService2 } from '../../services/dataRegUsuario.services';
import Swal from 'sweetalert2';
import { NgbModal, NgbDatepickerConfig, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { Usuario } from '../../model/user.model';


@Component({
  selector: 'app-register-usuario-general',
  templateUrl: './register-usuario-general.component.html',
  styleUrls: ['./register-usuario-general.component.scss'],
  providers: [DataService2, NgbDatepickerConfig, DataServices, AuthService]
})
export class RegisterUsuarioGeneralComponent implements OnInit {
  usuarioForm!: FormGroup;
  private isCel= "\(3[0-9]{2}\)[0-9]{3}[0-9]{4}";
  private isEmail= /\S+@\S+\.\S+/;

  usuario: Usuario = {
    correo: '',
    password: '',
    uid: '',
    perfil: 'general',
  }

  constructor(private fb: FormBuilder, private dataSvc: DataService2, config: NgbDatepickerConfig, public modal: NgbActiveModal,
    private afs: AuthService, private data: DataServices) { 
    config.minDate = {year: 1900, month:1, day: 1};
    config.maxDate = {year: 2022, month:12, day:31};
  }

  ngOnInit(): void {
    this.initForm();
  }

  async OnSave(): Promise<void> {
    if (this.usuarioForm.valid) {
      try {
        //console.log(this.usuarioForm.value);
        const formValue = this.usuarioForm.value;
        await this.dataSvc.onSaveUsuario(formValue); 
        this.registrar();
        this.afs.cerrarSesion();
        //Notificación de confirmación
        Swal.fire('Registro exitoso', 'Volver al inicio', 'success');
        this.usuarioForm.reset() 
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
    const validateField = this.usuarioForm.get(field);
    return (!validateField?.valid && validateField?.touched)
      ? 'is-invalid' : validateField?.touched ? 'is-valid' : '';
  }

  notRequiredHasValue(field: string):string {
    return this.usuarioForm.get(field)?.value ? 'is-valid' : '';
  }

  private initForm(): void {
  this.usuarioForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    genero: ['', [Validators.required]],
    celular: ['', [Validators.required, Validators.pattern(this.isCel)]],
    fechanacimiento: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.pattern(this.isEmail)]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
    departamento: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
    terminosyCondiciones: ['', [Validators.required]],
  })

  }
}

