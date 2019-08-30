import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';
import { DonorService } from 'src/app/services/donor.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Role } from 'src/app/model/role';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  errorMessage: String;
  user: User;

  pol: string[] = ['Muški','Ženski','Drugo'];
  bloodTypes: string[] = ['-O','+O','-A','+A','-B','+B','-AB','+AB'];

  constructor(private router: Router, private formBuilder: FormBuilder, private donorService: DonorService,
    private authService: AuthenticationService) {
    this.user = new User();
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      parentName: ['', Validators.required, Validators.minLength(3)],
      birthDate: ['', Validators.required],
      address: ['', Validators.required, Validators.minLength(3), Validators.maxLength(150)],
      active: ['', Validators.required],
      profession: ['', Validators.required, Validators.minLength(4), Validators.maxLength(100)],
      jmb: ['', Validators.required, , Validators.minLength(13), Validators.maxLength(13)],
      gender:  ['', Validators.required],
      phone: ['', Validators.required, Validators.minLength(4), Validators.maxLength(50)],
      bloodType:  ['', Validators.required]
    });

    this.f.gender.setValue(this.pol[0]);
    this.f.bloodType.setValue(this.bloodTypes[0]);
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    else {
      this.user.firstName = this.registerForm.get('firstName').value;
      this.user.lastName = this.registerForm.get('lastName').value;
      this.user.email = this.registerForm.get('email').value;
      this.user.password = this.registerForm.get('password').value;
      this.user.gender=this.registerForm.get('gender').value;
      this.user.bloodType=this.registerForm.get('bloodType').value;
      this.user.parentName=this.registerForm.get('parentName').value;
      this.user.phone=this.registerForm.get('phone').value;
      this.user.profession=this.registerForm.get('profession').value;
      this.user.birthDate=this.registerForm.get('birthDate').value;
      /*this.userService.save(this.user).subscribe(
        r => {
          this.user.id = r.id;
        },
        error => this.errorMessage = "Account with this email already exicts!"
      );
      this.router.navigate(['/login']);*/
    }
  }

}
