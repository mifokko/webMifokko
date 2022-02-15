import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './shared/components/register/register.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'register', component: RegisterComponent},
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'buscarTodo', loadChildren: () => import('./pages/buscar-todo/buscar-todo.module').then(m => m.BuscarTodoModule) },
  { path: 'busquedaEmpresa', loadChildren: () => import('./pages/busqueda-empresa/busqueda-empresa.module').then(m => m.BusquedaEmpresaModule) },
  { path: 'busquedaIndependiente', loadChildren: () => import('./pages/busqueda-independiente/busqueda-independiente.module').then(m => m.BusquedaIndependienteModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
