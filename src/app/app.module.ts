import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router'
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';

import { MainMenuComponent } from './main-menu/main-menu.component';
import { ContattiComponent } from './contatti/contatti.component';
import { HomeComponent } from './home/home.component';
import { CatalogoLibriComponent } from './catalogo-libri/catalogo-libri.component';
import { LoginComponent } from './login/login.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { LibroComponent } from './libro/libro.component';
import { InfoLibroComponent } from './info-libro/info-libro.component';

const appRoutes: Routes =[
  {path: "", component: HomeComponent},
  {path: "catalogo", component: CatalogoLibriComponent},
  {path: "contatti", component: ContattiComponent},
  {path: "login", component: LoginComponent},
  {path: "registrazione", component: RegistrazioneComponent},
  {path: "infoLibro", component: InfoLibroComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ContattiComponent,
    HomeComponent,
    CatalogoLibriComponent,
    LoginComponent,
    RegistrazioneComponent,
    LibroComponent,
    InfoLibroComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    MatCardModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
