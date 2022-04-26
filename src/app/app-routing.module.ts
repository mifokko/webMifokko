import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './shared/components/perfil/perfil.component';
import { VerOfertasComponent } from './shared/components/ver-ofertas/ver-ofertas.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'buscarTodo', loadChildren: () => import('./pages/buscar-todo/buscar-todo.module').then(m => m.BuscarTodoModule) },
  { path: 'verOfertas', component: VerOfertasComponent},
  { path: 'estadisticas', loadChildren: () => import('./pages/estadisticas/estadisticas.module').then(m => m.EstadisticasModule) },
  { path: 'perfil', component: PerfilComponent},
  { path: 'terminos-y-condiciones', loadChildren: () => import('./pages/terminos/terminos.module').then(m => m.TerminosModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }