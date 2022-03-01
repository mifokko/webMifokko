import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'buscarTodo', loadChildren: () => import('./pages/buscar-todo/buscar-todo.module').then(m => m.BuscarTodoModule) },
  { path: 'busquedaEmpresa', loadChildren: () => import('./pages/busqueda-empresa/busqueda-empresa.module').then(m => m.BusquedaEmpresaModule) },
  { path: 'busquedaIndependiente', loadChildren: () => import('./pages/busqueda-independiente/busqueda-independiente.module').then(m => m.BusquedaIndependienteModule) },
  { path: 'estadisticas', loadChildren: () => import('./pages/estadisticas/estadisticas.module').then(m => m.EstadisticasModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }