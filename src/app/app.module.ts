import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { HeaderModule } from './shared/components/header/header.module';
import { RegisterComponent } from './shared/components/register/register.component';
import { RegisterModule } from './shared/components/register/register.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderModule,
    RegisterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
