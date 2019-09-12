import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { DonorsListComponent } from './components/donors-list/donors-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DonorProfileComponent } from './components/donor-profile/donor-profile.component';
import { DonationInfoComponent } from './components/donation-info/donation-info.component';
import { DonationsComponent } from './components/donations/donations.component';
import { NewDonationComponent } from './components/new-donation/new-donation.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { DonorsComponent } from './components/donors/donors.component';
import { NotificationInfoComponent } from './components/notification-info/notification-info.component';
import { UsersComponent } from './components/users/users.component';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'donors/search/:search', component: DonorsListComponent },
  { path: 'donors/:id/:tab', component: DonorProfileComponent },
  { path: 'donors/:id', component: DonorProfileComponent },
  { path: 'donors', component: DonorsComponent },
  { path: 'donations/search/:search', component: DonationsComponent },
  { path: 'donations/new', component: NewDonationComponent },
  { path: 'donations/:id', component: DonationInfoComponent },
  { path: 'donations', component: DonationsComponent },
  { path: 'notifications/new', component: NotificationInfoComponent },
  { path: 'notifications/:id', component: NotificationInfoComponent },
  { path: 'users', component: UsersComponent },
  { path: 'archive', component: ArchiveComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
