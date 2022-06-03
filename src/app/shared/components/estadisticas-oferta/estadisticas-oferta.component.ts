import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { Estadisticas } from '../../model/estadistica.model';
import { Usuario } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import { DataServices } from '../../services/data.service';

@Component({
  selector: 'app-estadisticas-oferta',
  templateUrl: './estadisticas-oferta.component.html',
  styleUrls: ['./estadisticas-oferta.component.scss']
})
export class EstadisticasOfertaComponent implements OnInit {
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
      this.idOfert = JSON.stringify(prm['idOfert']).toString();
      this.idOfert = this.idOfert.substring(1, this.idOfert.length - 1);
      this.mes = JSON.stringify(prm['mes']).toString();
      this.mes = this.mes.substring(1, this.mes.length - 1);
      this.anio = JSON.stringify(prm['anio']).toString();
      this.anio = this.anio.substring(1, this.anio.length - 1);
      //console.log(this.seleccion + ' / ' + this.palabra);
    });
  }

  ngOnInit(): void {
    this.getDatosEstadisticos(this.idUser);
  }

  //Obtener datos de la BD
  getDatosEstadisticos(idUser: string) {
    let path = '';
    this.firestore.getDoc<Usuario>('Usuarios', idUser).subscribe(res => {
      if (res) {
        this.rol = res.perfil;
      }
      if (this.rol == 'empresa') {
        this.firestore.getDocColDocColl<Estadisticas>('Empresas', idUser, 'Ofertas', this.idOfert, 'Estadisticas').subscribe(res => {
          this.estadistica = res;
          console.log(res);
          if (res.length >= 0) {
            for (let index = 0; index < this.estadistica.length; index++) {
              const fecha = this.estadistica[index].fecha.split('/');
              console.log(fecha[1], this.mes, this.anio, fecha[2]);
              if (this.mes == fecha[1] && this.anio == fecha[2]) {
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
                ['Otros', this.otros]],
                this.mostrar = true;
              } else if (this.masculino == 0 && this.otros == 0 && this.femenino == 0) {
                const month = parseInt(this.mes);
                this.meses = this.lista[month - 1];
                alert('No hubo visitas a esta oferta en el mes de ' + this.meses + ' .');
                this.estadistica = [];
                this.mostrar = false;
              }
            }
          }else{
            const month = parseInt(this.mes);
            this.meses = this.lista[month - 1];
            alert('No hubo visitas a esta oferta en el mes de ' + this.meses + ' .');
            this.estadistica = [];
            this.mostrar = false;
          }
        })
      } else if (this.rol == 'independiente') {
        this.firestore.getDocColDocColl<Estadisticas>('Independiente', idUser, 'Ofertas', this.idOfert, 'Estadisticas').subscribe(res => {
          this.estadistica = res;
          console.log(res);
          if (res.length != 0) {
            for (let index = 0; index < this.estadistica.length; index++) {
              const fecha = this.estadistica[index].fecha.split('/');
              console.log(fecha)
              if (this.mes == fecha[1] && this.anio == fecha[2]) {
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
                const month = parseInt(this.mes);
                this.meses = this.lista[month - 1];
                alert('No hubo visitas a esta oferta en el mes de ' + this.meses + ' .');
                this.estadistica = [];
                this.mostrar = false;
              }
            }
          } else {
            const month = parseInt(this.mes);
            this.meses = this.lista[month - 1];
            alert('No hubo visitas a esta oferta en el mes de ' + this.meses + ' .');
            this.estadistica = [];
            this.mostrar = false;
          }
        })
      }
    })

  }

}
