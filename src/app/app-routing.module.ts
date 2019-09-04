import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { DonorsListComponent } from './components/donors-list/donors-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DonorProfileComponent } from './components/donor-profile/donor-profile.component';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { DonationInfoComponent } from './components/donation-info/donation-info.component';
import { DonationsComponent } from './components/donations/donations.component';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'donors', component: DonorsListComponent },
  { path: 'donations', component: DonationsComponent},
  { path: 'donations/:id', component: DonationInfoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'donors/:id', component: DonorProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
