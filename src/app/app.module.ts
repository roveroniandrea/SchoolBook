import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatDialogModule, MatPaginatorModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router'
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from "@angular/material/divider";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { AngularFireStorageModule } from "angularfire2/storage";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularFireAuthModule } from "angularfire2/auth";

import { MainMenuComponent } from './main-menu/main-menu.component';
import { ContattiComponent } from './contatti/contatti.component';
import { HomeComponent } from './home/home.component';
import { CatalogoLibriComponent } from './catalogo-libri/catalogo-libri.component';
import { LoginComponent } from './login/login.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { LibroComponent } from './libro/libro.component';
import { InfoLibroComponent } from './info-libro/info-libro.component';
import { CutTextPipe } from './pipes/cut-text.pipe';
import { AccountComponent } from './account/account.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NuovoLibroComponent } from './nuovo-libro/nuovo-libro.component';
import { PerditaModificheComponent } from './perdita-modifiche/perdita-modifiche.component';
import { PreferitiComponent } from './preferiti/preferiti.component';
import { AuthGuard, AuthGuardLoginRegister} from './servizi/auth-guard.service';
import { UserService } from './servizi/utente.service';
import { CanDeactivateGuard } from './servizi/canDeactivate-guard.service';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';


const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "catalogo", component: CatalogoLibriComponent },
  { path: "preferiti", canActivate: [AuthGuard], component: PreferitiComponent },
  { path: "contatti/:id_libro", canActivate: [AuthGuard], component: ContattiComponent },
  { path: "login", canActivate: [AuthGuardLoginRegister],component: LoginComponent },
  { path: "registrazione", canActivate: [AuthGuardLoginRegister],component: RegistrazioneComponent },
  { path: "infoLibro/:id", component: InfoLibroComponent },
  { path: "account", canActivate: [AuthGuard], component: AccountComponent },
  { path: "not-found", component: NotFoundComponent },
  { path: "new-book", canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard], component: NuovoLibroComponent },
  //lasciare per ultimo il path: "**"!
  { path: "**", redirectTo: "not-found" },
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
    InfoLibroComponent,
    CutTextPipe,
    AccountComponent,
    NotFoundComponent,
    NuovoLibroComponent,
    PerditaModificheComponent,
    PreferitiComponent,
    FooterComponent
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
    MatGridListModule,
    MatTooltipModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    AngularFireStorageModule,
    MatDialogModule,
    MatSnackBarModule,
    AngularFireAuthModule,
    HttpClientModule,
    MatPaginatorModule
  ],
  providers: [AuthGuard, AuthGuardLoginRegister, UserService, CanDeactivateGuard],
  bootstrap: [AppComponent],
  entryComponents: [
    PerditaModificheComponent
  ]
})
export class AppModule { }
