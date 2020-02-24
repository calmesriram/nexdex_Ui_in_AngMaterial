import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 404 page
import { PageNotFoundComponent } from './pages/not-found/not-found.component';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthguardGuard, Auth1Guard } from './shared';
import { GetkeysComponent } from './pages/getkeys/getkeys.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NotehashComponent } from './pages/notehash/notehash.component';




// Routing
const appRoutes: Routes = [
   
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: SignupComponent},
  { path: 'login', component: LoginComponent,canActivate:[Auth1Guard]},
  { path: 'home', component: HomeComponent,canActivate:[AuthguardGuard] },
  { path: 'about', component: AboutMeComponent,canActivate:[AuthguardGuard] },
  { path: 'contact', component: ContactComponent,canActivate:[AuthguardGuard] },
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthguardGuard]},
  { path:'getkeys',component:GetkeysComponent,canActivate:[AuthguardGuard] },
  { path:'joinsplit',component:NotehashComponent,canActivate:[AuthguardGuard] },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
