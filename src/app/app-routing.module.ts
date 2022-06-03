import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadisticasOfertaComponent } from './shared/components/estadisticas-oferta/estadisticas-oferta.component';
import { PerfilIndependienteComponent } from './shared/components/perfil-independiente/perfil-independiente.component';
import { PerfilOfertaComponent } from './shared/components/perfil-oferta/perfil-oferta.component';
import { PerfilComponent } from './shared/components/perfil/perfil.component';
import { VerOfertasComponent } from './shared/components/ver-ofertas/ver-ofertas.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'buscar/:seleccion/:palabra', loadChildren: () => import('./pages/buscar-todo/buscar-todo.module').then(m => m.BuscarTodoModule) },
  { path: 'verOfertas', component: VerOfertasComponent},
  { path: 'estadisticas/:id', loadChildren: () => import('./pages/estadisticas/estadisticas.module').then(m => m.EstadisticasModule) },
  { path: 'perfil/:id', component: PerfilComponent},
  { path: 'terminos-y-condiciones', loadChildren: () => import('./pages/terminos/terminos.module').then(m => m.TerminosModule) },
  { path: 'perfilOferta/:id', component: PerfilOfertaComponent },
  { path: 'perfilOfertas/:uid/:id', component: PerfilOfertaComponent },
  { path: 'perfilIndependiente/:id', component: PerfilIndependienteComponent },
  { path: 'estadisticas/:mes/:anio/:id/:idOfert', component: EstadisticasOfertaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }