import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 404 page
import { PageNotFoundComponent } from './pages/not-found/not-found.component';
// Pages
import { LoginComponent } from './pages/login/login.component';
import { AuthguardGuard, Auth1Guard } from './shared';
import { GetkeysComponent } from './pages/getkeys/getkeys.component';
import { SignupComponent } from './pages/signup/signup.component';
import { BilateralComponent } from './pages/bilateral/bilateral.component';
import { JoinsplitComponent } from './pages/joinsplit/joinsplit.component';
import { NoteVerification } from './pages/noteverification/noteverification.component';
import { MintComponent } from './pages/mint/mint.component';
import {AddaddressComponent} from './pages/addaddress/addaddress.component';
import {JoinsplitapproveComponent} from './pages/joinsplit_approve/joinsplit_approve.component';
import { TradeComponent } from './pages/trade/trade.component';

// Routing
const appRoutes: Routes = [
   
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: SignupComponent},
  { path: 'login', component: LoginComponent,canActivate:[Auth1Guard]},
  { path:'addaddress',component:AddaddressComponent,canActivate:[AuthguardGuard] },
  { path:'getkeys',component:GetkeysComponent,canActivate:[AuthguardGuard] },
  { path:'mint',component:MintComponent,canActivate:[AuthguardGuard] },
  { path:'joinsplit',component:JoinsplitComponent,canActivate:[AuthguardGuard] },
  { path:'bilateral',component:BilateralComponent,canActivate:[AuthguardGuard] },
  { path:'verification',component:NoteVerification,canActivate:[AuthguardGuard] },
  { path:'approve',component:JoinsplitapproveComponent,canActivate:[AuthguardGuard] },
  { path:'trade',component:TradeComponent,canActivate:[AuthguardGuard] },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
