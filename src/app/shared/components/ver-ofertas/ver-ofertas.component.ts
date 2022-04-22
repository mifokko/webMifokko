import { Component, OnInit } from '@angular/core';
import { Fecha, Oferta } from '../../model/oferta.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';

@Component({
  selector: 'app-ver-ofertas',
  templateUrl: './ver-ofertas.component.html',
  styleUrls: ['./ver-ofertas.component.scss']
})
export class VerOfertasComponent implements OnInit {

  date: Date = new Date();
  oferta: Oferta[] = [];
  ofertas: Oferta[] = [];
  lista: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  years: string[] = [];
  uid = '';
  rol = '';
  cont = 0;
  anio = '';
  meses = '';
  mes = '';
  verSeleccion = '';

  constructor(private firestore: DataServices, private authService: AuthService) {
    const year = this.date.getFullYear();
    for(let i = 2020; i < year+1; i++){
      this.years[this.cont] = i.toString();
      this.cont += 1; 
    }
    this.authService.stateUser().subscribe( res => {
      if(res) {
        
        this.uid = res.uid;
        this.firestore.getDoc<Usuario>('Usuarios', this.uid).subscribe( res => {
          if(res) {
            this.rol = res.perfil;
          }
        })
      }
    });
  }

  ngOnInit(): void {
    this.oferta.length = 0;
  }

  capturar(){
    this.ofertas.length = 0;
    console.log(this.anio, this.meses);
    switch (this.meses) {
      case 'Enero':
        this.mes = '1';
        break;
      case 'Febrero':
        this.mes = '2';
        break;
      case 'Marzo':
        this.mes = '3';
        break;
      case 'Abril':
        this.mes = '4';
        break;
      case 'Mayo':
        this.mes = '5';
        break;
      case 'Junio':
        this.mes = '6';
        break;
      case 'Julio':
        this.mes = '7';
        break;
      case 'Agosto':
        this.mes = '8';
        break;
      case 'Septiembre':
        this.mes = '9';
        break;
      case 'Octubre':
        this.mes = '10';
        break;
      case 'Noviembre':
        this.mes = '11';
        break;
      case 'Diciembre':
        this.mes = '12';
        break;
      default:
        break;
    }
    console.log(this.anio, this.mes);
  }

  getOfertas() {let cont = 0;
    let path = '';
    if (this.rol == 'empresa'){
      path = 'Empresas';
    } else if(this.rol == 'independiente') {
      path = 'Independiente';
    } else {
      path = '';
    }
    
    
      if(this.meses.length !== 0 && this.anio.length !== 0){
        
        this.oferta.length = 0;
        this.firestore.getDocCol<Oferta>(path, this.uid, 'Ofertas').subscribe( res => {
          this.oferta = res;
          console.log(this.oferta.length);
          for (let index = 0; index < this.oferta.length; index++) {
            const fecha = this.oferta[index].fechaInicio.day.toString() + '/' + this.oferta[index].fechaInicio.month.toString() + '/' + this.oferta[index].fechaInicio.year.toString();
            console.log(fecha);
            console.log(this.oferta[index].fechaInicio.month.toLocaleString() + ', ' + this.mes);
            if (this.oferta[index].fechaInicio.month.toLocaleString() === this.mes && this.oferta[index].fechaInicio.year.toLocaleString() === this.anio){
              console.log(true);
              if(this.date.getDate() >= this.oferta[index].fechaInicio.day && this.date.getDate() <= this.oferta[index].fechaFin.day){
                this.oferta[index].estado = 'Activo';
              }else{
                this.oferta[index].estado = 'Inactivo';
              }
              if(!this.ofertas.length){
                this.ofertas[cont] = this.oferta[index];
                cont++;
              }else{
                this.ofertas[cont++] = this.oferta[index];
              }
            }else {
              console.log(false);
            }
            console.log(this.ofertas);
            // if(this.oferta[index].fechaInicio.month.toLocaleString() === this.mes && this.oferta[index].fechaInicio.year.toLocaleString() === this.anio){
            //   console.log('pas');
            //   if(this.oferta[index].fechaInicio.month.toString() !== this.mes && this.oferta[index].fechaInicio.year.toString() === this.anio){
            //     this.oferta.splice(index,1);
            //   }else {
            //     this.ofertas[index] = this.oferta[index];
            //   }
              
            //   console.log(this.ofertas);
            // }
          }
          if(!this.ofertas.length){
            alert('No se encontraron ofertas publicadas en ' + this.meses + '.');
            this.oferta.length = 0;
          }
        });
      }else{
        alert('Debe seleccionar año y mes, para buscar las ofertas');
        
      }
    // } catch (error) {
    //   alert('Debe seleccionar año y mes, para buscar las ofertas /n' +  error)
    // }
    
    
    console.log('paso');
    // this.firestore.getDocCol<Oferta>(path, this.uid, 'Ofertas').subscribe( res => {
    //   this.oferta = res;
    //   //console.log(this.oferta);
    //   try {
    //   for (let index = 0; index < this.oferta.length; index++) {
    //     const fecha = this.oferta[index].fechaInicio.day.toString() + '/' + this.oferta[index].fechaInicio.month.toString() + '/' + this.oferta[index].fechaInicio.year.toString();
    //     const fecham = this.oferta[index].fechaInicio.month.toString();
    //     const presenteF = this.date.toLocaleDateString();
    //     if(fecha == presenteF) {
    //       this.oferta[index].estado = 'Activo';
    //     } else {
    //       this.oferta[index].estado = 'Inactivo' ;
    //     }
    //     //console.log(fecham);
       
    //       if((this.oferta[index].fechaInicio.month.toString() !== this.mes) && (this.oferta[index].fechaInicio.year.toString() === this.anio)){
    //         this.oferta.splice(index,1);
    //         console.log(this.oferta);
    //       }
    //       if((this.oferta[index].fechaInicio.month.toString() === this.mes) && (this.oferta[index].fechaInicio.year.toString() === this.anio)){
    //         this.ofertas[index] = this.oferta[index];
    //         //console.log(this.oferta[index].fechaInicio.month.toString())
    //         console.log(this.ofertas);
    //         //console.log('paso');
    //       }
    //     } 
    //     if(!this.ofertas.length){
    //       alert('No hay ofertas publicadas en '+ this.meses + '.')
    //     }
    //   } catch (error) {
    //     alert('Debe seleccionar año y mes, para buscar las ofertas ' +  error);
    //   }
      
    //   //console.log(res);
    // });
  }

}
