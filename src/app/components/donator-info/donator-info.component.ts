import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';
import { DonorService } from 'src/app/services/donor.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { isNullOrUndefined } from 'util';
import { formatDate, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-donator-info',
  templateUrl: './donator-info.component.html',
  styleUrls: ['./donator-info.component.css']
})
export class DonatorInfoComponent implements OnInit {

  @Output() validSubmit = new EventEmitter();
  @Output() archiveSubmit = new EventEmitter();
  //mode: 0-register, 1-profile
  @Input() mode: number;
  @Input() donorId: number;
  @Input() errorMessage: string = '';
  @Input() hasError: boolean = false;
  user: User;
  newUser: User = new User();

  donorInfoForm: FormGroup;
  submitted = false;
  editMode: boolean = false;
  loaded: boolean = false;
  invalidDateMsg: string = "";
  errMsg: string = '';

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
      birthDate: ['', [Validators.required, Validators.pattern("^[0-3]?\\d-[0,1]?\\d-\\d{4}$")]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      profession: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      jmb: ['', [Validators.required, Validators.pattern("^\\d{13}$"), Validators.minLength(13), Validators.maxLength(13)]],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^([^a-zA-Z]*)$"), Validators.minLength(4), Validators.maxLength(50)]],
      bloodType: ['', Validators.required]
    });

    this.f.gender.setValue(this.pol[0]);
    this.f.bloodType.setValue(this.bloodTypes[0]);



    switch (this.mode) {
      case 0:
        this.donorInfoForm.enable();
        break;
      case 1:

        this.donorService.getDonor(this.donorId).subscribe(data => {
          this.user = data;
          this.currentValues(this.user);
          console.log(data);
        },
          error => {
            this.errMsg = "Traženi davalac nije pronađen!";
          });
        this.donorInfoForm.removeControl('password');
        this.editMode ? this.donorInfoForm.enable() : this.donorInfoForm.disable();
        break;
    }


  }

  changeMode() {
    this.loaded = false;
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.errMsg = '';
      this.donorInfoForm.enable();
    }
    else {
      this.donorInfoForm.disable();
    }
  }

  get f() { return this.donorInfoForm.controls; }

  currentValues(user: User) {
    this.donorInfoForm.get('firstName').setValue(user.firstName);
    this.donorInfoForm.get('lastName').setValue(user.lastName);
    this.donorInfoForm.get('email').setValue(user.email);
    this.donorInfoForm.get('gender').setValue(user.gender);
    this.donorInfoForm.get('bloodType').setValue(this.formatBloodType(user.blood));
    this.donorInfoForm.get('parentName').setValue(user.parentName);
    this.donorInfoForm.get('phone').setValue(user.phone);
    this.donorInfoForm.get('jmb').setValue(user.jmb);
    this.donorInfoForm.get('address').setValue(user.address);
    this.donorInfoForm.get('profession').setValue(user.profession);
    this.donorInfoForm.get('birthDate').setValue(formatDate(user.birthDate, 'dd-MM-yyyy', 'en-US'));

    this.editMode = false;
    this.loaded = false;
    this.errMsg = '';
    this.donorInfoForm.disable();
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

  getYears(birthDate: Date) {
    let diff = (birthDate.getTime() - Date.now()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));
  }

  validateJMB(jmb: string, date: Date, gender: boolean) {
    if (Number.parseInt(jmb.substring(0, 2)) === date.getDate() && Number.parseInt(jmb.substring(2, 4)) === (date.getMonth() + 1) && Number.parseInt(jmb.substring(4, 7)) === date.getFullYear() % 1000) {
      //true for male
      if ((gender && Number.parseInt(jmb.substring(9, 12)) < 500) || (!gender && Number.parseInt(jmb.substring(9, 12)) > 499)) {
        if (this.checkNumber(jmb) < 10 && parseInt(jmb[12]) === this.checkNumber(jmb)) {
          return true;
        }
      }
    }
    return false;
  }

  checkNumber(jmb: string) {
    var kb = 0;
    for (var i = jmb.length - 1, mnozilac = 2; i >= 0; i--) {
      kb += parseInt(jmb.charAt(i), 10) * mnozilac;
      mnozilac = mnozilac === 7 ? 2 : mnozilac + 1;
    }
    kb = 11 - (kb % 11);
    console.log("kb: " + kb);
    return kb;
  }

  changeActiveState(active: boolean) {
    this.user.active = active;
    this.currentValues(this.user);
    this.archiveSubmit.emit(this.user);
  }

  onSubmit() {
    this.submitted = true;
    let validJMB = false;

    this.donorInfoForm.updateValueAndValidity();

    let d;
    if (this.f.birthDate.valid) {
      let dmy = this.f.birthDate.value.split('-');
      d = new Date(dmy[2], (<number>dmy[1] - 1), dmy[0]);
      if (d.getFullYear() == dmy[2] && d.getMonth() == (<number>dmy[1] - 1) && d.getDate() == dmy[0] && d.getTime() < Date.now()) {
        if (this.getYears(d) > 17 && this.getYears(d) < 66) {
          this.newUser.birthDate = d;
          this.donorInfoForm.setErrors({ 'birthDate': null });
          this.donorInfoForm.updateValueAndValidity();

          if (!this.f.jmb.hasError('pattern')) {
            validJMB = this.validateJMB(this.f.jmb.value, d, (<string>this.donorInfoForm.get('gender').value).startsWith('M' || 'm'));
            /*validJMB ? this.donorInfoForm.setErrors({ 'jmb': null }) : this.donorInfoForm.controls['jmb'].setErrors({ 'los': true });
            this.donorInfoForm.get('jmb').updateValueAndValidity();
            this.donorInfoForm.updateValueAndValidity();
            console.log(this.donorInfoForm.valid);*/
          }
        }
        else {
          this.donorInfoForm.get('birthDate').setErrors({ 'age': true });
        }
      }
      else {
        this.donorInfoForm.get('birthDate').setErrors({ 'incorrect': true });
      }
    }

    this.donorInfoForm.updateValueAndValidity();

    if (!validJMB) {
      this.donorInfoForm.controls['jmb'].setErrors({ 'incorrect': true });
      this.donorInfoForm.updateValueAndValidity();
      console.log(this.donorInfoForm.valid);
      console.log(this.donorInfoForm.controls);
      console.log("jmb neispravan");
    }
    else {
      this.donorInfoForm.setErrors({ 'jmb': null });
      this.donorInfoForm.updateValueAndValidity();
    }

    if (this.donorInfoForm.invalid) {
      this.getFormValidationErrors(this.donorInfoForm);
      return;
    }

    this.newUser.firstName = this.donorInfoForm.get('firstName').value;
    this.newUser.lastName = this.donorInfoForm.get('lastName').value;
    this.newUser.email = this.donorInfoForm.get('email').value;
    this.newUser.gender = this.donorInfoForm.get('gender').value.toUpperCase();
    this.newUser.parentName = this.donorInfoForm.get('parentName').value;
    this.newUser.phone = this.donorInfoForm.get('phone').value;
    this.newUser.profession = this.donorInfoForm.get('profession').value;
    this.newUser.jmb = this.donorInfoForm.get('jmb').value;
    this.newUser.address = this.donorInfoForm.get('address').value;
    this.newUser.active = true;

    if (this.donorInfoForm.get('bloodType').value.endsWith('+')) {
      this.newUser.blood = this.donorInfoForm.get('bloodType').value.replace('+', 'POS');
    }
    else {
      this.newUser.blood = this.donorInfoForm.get('bloodType').value.replace('-', 'NEG');
    }

    if (this.mode === 0) {
      this.newUser.password = this.donorInfoForm.get('password').value;
      this.newUser.active = true;
    }
    if (validJMB) {
      this.user = this.newUser;
      this.validSubmit.emit(this.newUser);
    }
    else {
      this.donorInfoForm.controls['jmb'].setErrors({ 'los': true });
      this.donorInfoForm.updateValueAndValidity();
      console.log(this.donorInfoForm.valid);
      console.log(this.donorInfoForm.controls);
      console.log("jmb neispravan");
    }
  }

}