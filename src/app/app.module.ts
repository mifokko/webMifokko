import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { HeaderModule } from './shared/components/header/header.module';
import { RegisterModule } from './shared/components/register/register.module';
import { LoginComponent } from './shared/components/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RegisterIndependienteModule } from './shared/components/register-independiente/register-independiente.module';
import { RegisterUsuarioGeneralModule } from './shared/components/register-usuario-general/register-usuario-general.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlanEmpresaComponent } from './shared/components/plan-empresa/plan-empresa.component';
import { PlanIndependienteComponent } from './shared/components/plan-independiente/plan-independiente.component';

import { FormsModule } from '@angular/forms';
import { UneteComponent } from './shared/components/unete/unete.component';
import { RecuperarContrasenaComponent } from './shared/components/recuperar-contrasena/recuperar-contrasena.component';
import { WhatsappComponent } from './shared/components/whatsapp/whatsapp.component';
import { WhatsappModule } from './shared/components/whatsapp/whatsapp.module';
import { SubirOfertaComponent } from './shared/components/subir-oferta/subir-oferta.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { VerOfertasComponent } from './shared/components/ver-ofertas/ver-ofertas.component';
import { InformacionComponent } from './shared/components/informacion/informacion.component';
import { BeneficiosComponent } from './shared/components/beneficios/beneficios.component';
import { PerfilComponent } from './shared/components/perfil/perfil.component';
import { PerfilIndependienteComponent } from './shared/components/perfil-independiente/perfil-independiente.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    PlanEmpresaComponent,
    PlanIndependienteComponent,
    UneteComponent,
    RecuperarContrasenaComponent,
    WhatsappComponent,
    SubirOfertaComponent,
    VerOfertasComponent,
    InformacionComponent,
    BeneficiosComponent,
    PerfilComponent,
    PerfilIndependienteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderModule,
    RegisterModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    RegisterIndependienteModule,
    RegisterUsuarioGeneralModule,
    BrowserAnimationsModule,
    FormsModule,
    WhatsappModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage())
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
