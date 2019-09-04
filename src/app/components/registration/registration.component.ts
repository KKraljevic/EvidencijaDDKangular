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
  
  errorMessage: String;
  
  constructor(private router: Router, private formBuilder: FormBuilder, private donorService: DonorService,
    private authService: AuthenticationService) {
  }

  ngOnInit() {
   
  }

  register(user: User) {
    this.donorService.createDonor(user).subscribe(
      r => {
        console.log(r);
        this.router.navigate(['/login']);
      },
      error => this.errorMessage = "Account with this email already exicts!"
    );
  }
      
  

}
