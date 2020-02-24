import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from './shared/pipes/pipes.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";

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
import { DataTablesModule } from 'angular-datatables';
// Main
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// Pages
import { PageNotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { GetkeysComponent } from './pages/getkeys/getkeys.component';
import { SignupComponent } from './pages/signup/signup.component';
import { JoinsplitComponent } from './pages/joinsplit/joinsplit.component';
import { JoinsplitTransferComponent } from './pages/joinsplit_transfer/joinsplit_transfer.component';
import { JoinsplitapproveComponent } from './pages/joinsplit_approve/joinsplit_approve.component';
import { ConfirmationDialogComponent } from './pages/confirmation-dialog/confirmation-dialog.component';
import { BilateralComponent } from './pages/bilateral/bilateral.component';
import { bilateralReqdialogComponent } from './pages/bilateralReqdialog/bilateralReqdialog.component';
import { NoteVerification } from './pages/noteverification/noteverification.component';
import { MaterialModule } from './appMaterial.module';
import { MintComponent } from './pages/mint/mint.component';
import {AddaddressComponent} from './pages/addaddress/addaddress.component';
import { TradeComponent } from './pages/trade/trade.component';
import { DialogtradeComponent } from './pages/dialogtrade/dialogtrade.component';
import { DialogorderComponent } from './pages/dialogorder/dialogorder.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoginComponent,
    GetkeysComponent,
    SignupComponent,
    JoinsplitComponent,
    JoinsplitTransferComponent,
    JoinsplitapproveComponent,
    BilateralComponent,
    ConfirmationDialogComponent,
    bilateralReqdialogComponent,
    NoteVerification,
    MintComponent,
    AddaddressComponent,
    TradeComponent,
    DialogtradeComponent,
    DialogorderComponent
  ],
  entryComponents: [
    DialogtradeComponent,
    DialogorderComponent,
    bilateralReqdialogComponent,
    ConfirmationDialogComponent,
    JoinsplitTransferComponent
    ],
  imports: [
    BrowserModule,
    DataTablesModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MaterialModule,
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
