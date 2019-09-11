import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';
import { DonorService } from 'src/app/services/donor.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  loaded: boolean = false;
  errorMessage: string;
  hasError: boolean = false;

  constructor(private router: Router, private donorService: DonorService,
    private authService: AuthenticationService) {
  }

  ngOnInit() {

  }

  register(user: User) {

    this.loaded = false;

    this.donorService.createDonor(user).subscribe(
      r => {
        this.loaded = true;
        console.log(r);
        this.hasError= false;
        this.errorMessage='';
      },
      error => {
        this.errorMessage = "Postoji korisnik sa ovim email-om!";
        this.hasError= true;
        this.loaded = false;
      }
    );

    if(this.loaded && !this.hasError){
      this.router.navigate(['/login']);
    }
  }



}
