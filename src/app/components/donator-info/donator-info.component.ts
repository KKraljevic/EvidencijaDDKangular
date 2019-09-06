import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';
import { DonorService } from 'src/app/services/donor.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-donator-info',
  templateUrl: './donator-info.component.html',
  styleUrls: ['./donator-info.component.css']
})
export class DonatorInfoComponent implements OnInit {

  @Output() validSubmit = new EventEmitter();
  //mode: 0-register, 1-edit, 2-view
  @Input() mode: number;
  @Input() user: User;
  newUser: User = new User();

  donorInfoForm: FormGroup;
  submitted = false;
  errorMessage: String;

  pol: string[] = ['Muški', 'Ženski', 'Drugo'];
  bloodTypes: string[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  constructor(private router: Router, private formBuilder: FormBuilder, private donorService: DonorService,
    private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.donorInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      parentName: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      active: [''],
      profession: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      jmb: ['', [Validators.required, , Validators.minLength(13), Validators.maxLength(13)]],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      bloodType: ['', Validators.required]
    });

    this.f.gender.setValue(this.pol[0]);
    this.f.bloodType.setValue(this.bloodTypes[0]);

    switch(this.mode) {
      case 0:
          this.donorInfoForm.enable();
          break;
      case 1:
          this.donorInfoForm.removeControl('password');
          this.currentValues(this.user);
          this.donorInfoForm.enable();
          break;
      case 2:
          this.donorInfoForm.removeControl('password');
          this.currentValues(this.user);
          this.donorInfoForm.disable();
          break;
      default:
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.donorInfoForm) {
      if (changes.mode.currentValue != 2) {
        this.donorInfoForm.enable();
      }
      else {
        this.donorInfoForm.disable();
      }
    }
  }

  get f() { return this.donorInfoForm.controls; }

  currentValues(user: User) {
    this.donorInfoForm.get('firstName').setValue(user.firstName);
    this.donorInfoForm.get('lastName').setValue(user.lastName);
    this.donorInfoForm.get('email').setValue(user.email);
    this.donorInfoForm.get('gender').setValue(user.gender.toLowerCase());
    this.donorInfoForm.get('bloodType').setValue(this.formatBloodType(user.blood));
    this.donorInfoForm.get('parentName').setValue(user.parentName);
    this.donorInfoForm.get('phone').setValue(user.phone);
    this.donorInfoForm.get('jmb').setValue(user.jmb);
    this.donorInfoForm.get('address').setValue(user.address);
    this.donorInfoForm.get('profession').setValue(user.profession);
    this.donorInfoForm.get('birthDate').setValue(user.birthDate);
  }

  formatBloodType(bt: string) {
    if (bt.endsWith('POS')) {
      return bt.replace('POS', '+')
    }
    else {
      return bt.replace('NEG', '-');
    }
  }

  getFormValidationErrors(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {

      const controlErrors: ValidationErrors = form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }



  onSubmit() {
    this.submitted = true;

    if (this.donorInfoForm.invalid) {
      this.getFormValidationErrors(this.donorInfoForm);
      return;
    }
    else {

      this.newUser.firstName = this.donorInfoForm.get('firstName').value;
      this.newUser.lastName = this.donorInfoForm.get('lastName').value;
      this.newUser.email = this.donorInfoForm.get('email').value;
      this.newUser.gender = this.donorInfoForm.get('gender').value.toUpperCase();
      this.newUser.parentName = this.donorInfoForm.get('parentName').value;
      this.newUser.phone = this.donorInfoForm.get('phone').value;
      this.newUser.profession = this.donorInfoForm.get('profession').value;

      this.newUser.birthDate = new Date(this.donorInfoForm.get('birthDate').value.toString());
      console.log(this.newUser.birthDate);
      this.newUser.jmb=this.donorInfoForm.get('jmb').value;
      this.newUser.address=this.donorInfoForm.get('address').value;

      if (this.donorInfoForm.get('bloodType').value.endsWith('+')) {
        this.newUser.blood = this.donorInfoForm.get('bloodType').value.replace('+', 'POS');
      }
      else {
        this.newUser.blood = this.donorInfoForm.get('bloodType').value.replace('-', 'NEG');
      }

      if (this.mode === 0) {
        this.newUser.password = this.donorInfoForm.get('password').value;
      }

    }
    this.validSubmit.emit(this.newUser);

  }

}