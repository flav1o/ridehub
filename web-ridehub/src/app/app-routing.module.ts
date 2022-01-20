import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVehicleComponent } from './modals/add-vehicle/add-vehicle.component';
import { CreateRideModalComponent } from './modals/create-ride-modal/create-ride-modal.component';
import { DepositModalComponent } from './modals/deposit-modal/deposit-modal.component';
import { DriverMapComponent } from './modals/driver-map/driver-map.component';
import { ReportModalComponent } from './modals/report-modal/report-modal.component';
import { EvaluateRideModalComponent } from './modals/evaluate-ride-modal/evaluate-ride-modal.component';
import { ForgetPasswordModalComponent } from './modals/forget-password-modal/forget-password-modal.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CurrentListedComponent } from './pages/current-listed/current-listed.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RideLobbyComponent } from './pages/ride-lobby/ride-lobby.component';
import { ProfileSettingsComponent } from './pages/settings/profile-settings/profile-settings.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SearchUsersComponent } from './pages/search-users/search-users.component';
import { PdfWindowComponent } from './modals/user-transactions-modal/pdf-window/pdf-window.component';
import { FourOFourComponent } from './pages/four-o-four/four-o-four.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'creater', component: CreateRideModalComponent },
  { path: 'current-listed', component: CurrentListedComponent },
  { path: 'ride-lobby/:id', component: RideLobbyComponent },
  { path: 'driver-map', component: DriverMapComponent },
  { path: 'forget-password', component: ForgetPasswordModalComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'add-vehicle', component: AddVehicleComponent },
  { path: 'deposit-modal', component: DepositModalComponent },
  { path: 'evaluate-modal', component: EvaluateRideModalComponent },
  {
    path: 'settings', component: SettingsComponent,
    children: [
      { path: 'profile-settings', component: ProfileSettingsComponent }
    ]
  },
  { path: 'search-users', component: SearchUsersComponent },
  { path: 'pdf', component: PdfWindowComponent},
  { path: '404', component: FourOFourComponent},
  { path: '**', redirectTo: '404' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
