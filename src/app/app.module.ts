import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { DonorsListComponent } from './components/donors-list/donors-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AuthenticationService } from './services/authentication.service';
import { httpInterceptorProviders } from './services/auth-http-interceptor.service';
import { DonatorInfoComponent } from './components/donator-info/donator-info.component';
import { DonationInfoComponent } from './components/donation-info/donation-info.component';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { DonorProfileComponent } from './components/donor-profile/donor-profile.component';
import { DonationsComponent } from './components/donations/donations.component';
import { NewDonationComponent } from './components/new-donation/new-donation.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { DonorsComponent } from './components/donors/donors.component';
import { NotificationInfoComponent } from './components/notification-info/notification-info.component';
import { UsersComponent } from './components/users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    SidemenuComponent,
    DonorsListComponent,
    DonatorInfoComponent,
    DonationInfoComponent,
    DonationListComponent,
    DonorProfileComponent,
    DonationsComponent,
    NewDonationComponent,
    ArchiveComponent,
    DonorsComponent,
    NotificationInfoComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FileUploadModule,
    AngularFontAwesomeModule,
    AppRoutingModule
  ],
  providers: [AuthenticationService,httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
