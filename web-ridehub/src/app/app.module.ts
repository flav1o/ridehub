import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { AlertModalComponent } from './shared/alert-modal/alert-modal.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AuthInterceptor } from './interceptors/auth/token.interceptor';
import { LoadingComponent } from './shared/loading/loading.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateRideModalComponent } from './modals/create-ride-modal/create-ride-modal.component';
import { FormsModule } from '@angular/forms'
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { RideLobbyComponent } from './pages/ride-lobby/ride-lobby.component';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { CurrentListedComponent } from './pages/current-listed/current-listed.component';
import { RideChatComponent } from './modals/ride-chat/ride-chat.component';
import { DriverMapComponent } from './modals/driver-map/driver-map.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SwiperModule } from 'swiper/angular';
import { ProfileSettingsComponent } from './pages/settings/profile-settings/profile-settings.component';
import { AddVehicleComponent } from './modals/add-vehicle/add-vehicle.component'
import { DepositModalComponent } from './modals/deposit-modal/deposit-modal.component'
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfileSettingsModalComponent } from './modals/profile-settings-modal/profile-settings-modal.component';
import { DeactivateModalComponent } from './modals/deactivate-modal/deactivate-modal.component';
import { ReportModalComponent } from './modals/report-modal/report-modal.component';
import { EvaluateRideModalComponent } from './modals/evaluate-ride-modal/evaluate-ride-modal.component';
import { ForgetPasswordModalComponent } from './modals/forget-password-modal/forget-password-modal.component';
import { SearchUsersComponent } from './pages/search-users/search-users.component';
import { UserTransactionsModalComponent } from './modals/user-transactions-modal/user-transactions-modal.component';
import { PdfWindowComponent } from './modals/user-transactions-modal/pdf-window/pdf-window.component';
import { ClipboardModule } from 'ngx-clipboard';
import { FourOFourComponent } from './pages/four-o-four/four-o-four.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertModalComponent,
    RegisterComponent,
    LoadingComponent,
    HomeComponent,
    CreateRideModalComponent,
    CurrentListedComponent,
    NavBarComponent,
    RideLobbyComponent,
    RideChatComponent,
    DriverMapComponent,
    ProfileComponent,
    ProfileSettingsComponent,
    AddVehicleComponent,
    DepositModalComponent,
    SettingsComponent,
    ProfileSettingsModalComponent,
    DeactivateModalComponent,
    ReportModalComponent,
    EvaluateRideModalComponent,
    ForgetPasswordModalComponent,
    SearchUsersComponent,
    UserTransactionsModalComponent,
    PdfWindowComponent,
    FourOFourComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    TextareaAutosizeModule,
    SwiperModule,
    ClipboardModule
  ],
  providers: [AuthInterceptor],
  bootstrap: [AppComponent]
})
export class AppModule { }
