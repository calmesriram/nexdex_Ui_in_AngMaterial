// Modules 3rd party
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatInputModule, MatSnackBarModule,
         MatToolbarModule, MatDialogModule, MatSidenavModule, MatNativeDateModule,
         MatCardModule, MatTabsModule, MatIconModule,  MatFormFieldModule,MatSelectModule,MatTableModule
        } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from './shared/pipes/pipes.module';
import { ToastrModule } from 'ngx-toastr';


// Shared
import {
  FooterComponent,
  HeaderComponent,
  AlertService,
  ApiService,
  WindowService,
  AuthguardGuard,
  Auth1Guard
} from '../app/shared';

// Main
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { GetkeysComponent } from './pages/getkeys/getkeys.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NotehashComponent } from './pages/notehash/notehash.component';
import { NotehashdialogComponent } from './pages/notehashdialog/notehashdialog.component';
import { NotehashdialogdeleteComponent } from './pages/notehashdialogdelete/notehashdialogdelete.component';
//import { NavbarComponent } from './navbar/navbar.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutMeComponent,
    ContactComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    DashboardComponent,
    LoginComponent,
    GetkeysComponent,
    SignupComponent,
    NotehashComponent,
    NotehashdialogComponent,
    NotehashdialogdeleteComponent
    ],
  entryComponents: [NotehashdialogComponent,NotehashdialogdeleteComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatMenuModule, MatInputModule, MatSnackBarModule,
    MatToolbarModule, MatDialogModule, MatSidenavModule, MatNativeDateModule,
    MatCardModule, MatTabsModule, MatIconModule,  MatFormFieldModule,MatSelectModule,MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    PipesModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
    ],
  providers: [
    AlertService,
    AuthguardGuard,
    ApiService,
    WindowService,
    Auth1Guard
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
