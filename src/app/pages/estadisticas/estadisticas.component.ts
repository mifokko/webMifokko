import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { Estadisticas } from 'src/app/shared/model/estadistica.model';
import { Usuario } from 'src/app/shared/model/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataServices } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  idOfert = '';
  idUser = '';
  rol = '';
  femenino: number = 0;
  masculino: number = 0;
  otros: number = 0;
  anio = '';
  meses = '';
  cont = 0;
  years: string[] = [];
  mes = '';
  date = new Date;
  estadistica: Estadisticas[] = [];
  visitasPErfil = 0;
  mostrar: boolean = false;
  lista: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  pieChart: GoogleChartInterface = {
    chartType: GoogleChartType.PieChart,
    dataTable: [],
    options: {
      width: 400,
      height: 400,
      chartArea: { left: 15, top: 15, right: 0, bottom: 0 },
      pieSliceText: 'label'
    }
  };

  constructor(private authService: AuthService, private firestore: DataServices, private activatedRouter: ActivatedRoute) {
    activatedRouter.params.subscribe(prm => {
      //console.log(`La seleccion es: ${prm['seleccion']}`);
      this.idUser = JSON.stringify(prm['id']).toString();
      this.idUser = this.idUser.substring(1, this.idUser.length - 1);
      this.idOfert = JSON.stringify(prm['idOferta']).toString();
      this.idOfert = this.idOfert.substring(1, this.idOfert.length - 1);
      //console.log(this.seleccion + ' / ' + this.palabra);
    });
    const year = this.date.getFullYear();
    for (let i = 2020; i < year + 1; i++) {
      this.years[this.cont] = i.toString();
      this.cont += 1;
    }
  }

  ngOnInit(): void {
    console.log('Estadisticas');
    //this.getDatosEstadisticos(this.idUser);
  }

  capturar() {
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
    this.getDatosEstadisticos(this.idUser, this.mes, this.anio);
    console.log(this.mes, this.anio);
  }
  //Obtener datos de la BD
  getDatosEstadisticos(idUser: string, mes: string, anio: string) {
    let path = '';
    this.firestore.getDoc<Usuario>('Usuarios', idUser).subscribe(res => {
      if (res) {
        this.rol = res.perfil;
      }
      if (this.rol == 'empresa') {
        this.firestore.getDocCol<Estadisticas>('Empresas', idUser, 'Estadisticas').subscribe(res => {
          if (res) {
            this.estadistica = res;
            console.log(this.estadistica);
            for (let index = 0; index < this.estadistica.length; index++) {
              const fecha = this.estadistica[index].fecha.split('/');
              console.log(fecha)
              if (mes == fecha[1] && anio == fecha[2]) {
                if (this.estadistica[index].genero == 'Femenino') {
                  this.femenino = this.femenino + 1;
                } else if (this.estadistica[index].genero == 'Masculino') {
                  this.masculino = this.masculino + 1;
                } else {
                  this.otros = this.otros + 1;
                }
                this.visitasPErfil++;
                this.pieChart.dataTable = [['Genero', 'Vistas'],
                ['Femenino', this.femenino],
                ['Masculino', this.masculino],
                ['Otros', this.otros]]
                this.mostrar = true;
              } else if (this.masculino == 0 && this.otros == 0 && this.femenino == 0) {
                alert('No hubo visitas en el mes de ' + this.meses + ' .');
                this.estadistica = [];
                this.mostrar = false;
              }
            }
            console.log(this.femenino, this.masculino, this.otros);

          }
        })
      } else if (this.rol == 'independiente') {
        this.firestore.getDocCol<Estadisticas>('Independiente', idUser, 'Estadisticas').subscribe(res => {
          if (res) {
            this.estadistica = res;
            console.log(this.estadistica);
            for (let index = 0; index < this.estadistica.length; index++) {
              const fecha = this.estadistica[index].fecha.split('/');
              console.log(fecha)
              if (mes == fecha[1] && anio == fecha[2]) {
                if (this.estadistica[index].genero == 'Femenino') {
                  this.femenino = this.femenino + 1;
                } else if (this.estadistica[index].genero == 'Masculino') {
                  this.masculino = this.masculino + 1;
                } else {
                  this.otros = this.otros + 1;
                }
                this.visitasPErfil++;
                this.pieChart.dataTable = [['Genero', 'Vistas'],
                ['Femenino', this.femenino],
                ['Masculino', this.masculino],
                ['Otros', this.otros]]
                this.mostrar = true;
              } else if (this.masculino == 0 && this.otros == 0 && this.femenino == 0) {
                alert('No hubo visitas en el mes de ' + this.meses + ' .');
                this.estadistica = [];
                this.mostrar = false;
              }
            }
            console.log(this.femenino, this.masculino, this.otros);

          }
        })
      }
    })

  }

}
