import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService2 } from '../../services/dataRegUsuario.services';
import Swal from 'sweetalert2';
import { NgbModal, NgbDatepickerConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';
import { Usuario, UsuarioGeneral } from '../../model/user.model';
import { Ciudades } from '../../model/ciudades.model';


@Component({
  selector: 'app-register-usuario-general',
  templateUrl: './register-usuario-general.component.html',
  styleUrls: ['./register-usuario-general.component.scss'],
  providers: [DataService2, NgbDatepickerConfig, DataServices, AuthService]
})
export class RegisterUsuarioGeneralComponent implements OnInit {
  usuarioForm!: FormGroup;
  private isCel = "\(3[0-9]{2}\)[0-9]{3}[0-9]{4}";
  private isEmail = /\S+@\S+\.\S+/;

  usuario: UsuarioGeneral = {
    correo: '',
    password: '',
    uid: '',
    perfil: 'general'
  }

  ciudades: Ciudades[] = [];
  municipios: string[] = [];
  departamentos: string[] = [];
  departamento: string[] = [];
  seleccion!: string;

  fieldTextType: boolean = false;

  constructor(private fb: FormBuilder, private dataSvc: DataService2, config: NgbDatepickerConfig, public modal: NgbActiveModal,
    private afs: AuthService, private data: DataServices) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2022, month: 12, day: 31 };

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
      //this.municipios = this.municipios.sort();
      //console.log(this.departamento);
    })
  }

  ngOnInit(): void {
    this.initForm();
  }

  
  //Función que carga los municipios en una lista, según el departamento que se ha seleccionado 
  uploadMunicipios() {
    console.log(this.seleccion);
    for (let index = 0; index < this.ciudades.length; index++) {
      if (this.seleccion === this.ciudades[index].departamento) {
        this.municipios[index] = this.ciudades[index].municipio
      } else {
        //console.log('paso');
      }
    }

    this.municipios = this.municipios.filter(Boolean);
    this.municipios = this.municipios.sort();
    //console.log(this.municipios.length);
  }

  async OnSave(): Promise<void> {
    if (this.usuarioForm.valid) {
      try {
        //console.log(this.usuarioForm.value);
        this.registrar();
        this.usuarioForm.reset();
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

  //Creacion del Usuario, y almacenamiento de la información del usuario general  
  async registrar() {
    const formValue = this.usuarioForm.value;
    //console.log('datos -> ', this.usuario);
    const correo = this.usuario.correo;
    //Creación de cuenta con el correo y contraseña
    const res = await this.afs.registerGeneral(this.usuario).catch(error => {
      console.log('error');
    });
    if (res) {
      console.log('Exito al crear el usuario');
      this.usuario.correo = correo;
      const id = res.user!.uid;
      this.usuario.uid = id;
      this.usuario.password = '';
      //Se guarda la información de Usuario General y se guarda la información
      await this.data.createDoc(this.usuario, 'Usuarios', id);
      await this.dataSvc.onSaveUsuario(formValue, id);
    }
  }

  //Validacion de campos obligatorios
  isValidField(field: string): string {
    const validateField = this.usuarioForm.get(field);
    return (!validateField?.valid && validateField?.touched)
      ? 'is-invalid' : validateField?.touched ? 'is-valid' : '';
  }

  //Validacion de campos que no son obligatorios
  notRequiredHasValue(field: string): string {
    return this.usuarioForm.get(field)?.value ? 'is-valid' : '';
  }

  //Estructura de datos del registro
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

  //Ver contraseña
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}

