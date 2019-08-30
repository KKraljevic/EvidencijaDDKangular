import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { DonorsListComponent } from './components/donors-list/donors-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';


const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'donors', component: DonorsListComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
