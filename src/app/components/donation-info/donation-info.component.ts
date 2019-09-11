import { Component, OnInit, SimpleChanges } from '@angular/core';
import { DonationService } from 'src/app/services/donation.service';
import { ActivatedRoute } from '@angular/router';
import { Donation } from 'src/app/model/donation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { DonorService } from 'src/app/services/donor.service';

@Component({
  selector: 'app-donation-info',
  templateUrl: './donation-info.component.html',
  styleUrls: ['./donation-info.component.css']
})
export class DonationInfoComponent implements OnInit {

  donationId: number;
  donation: Donation;
  newDonation: Donation = new Donation();

  donationForm: FormGroup;
  submitted: boolean = false;

  editMode: boolean = false;
  loaded: boolean = false;
  invalidDateMsg: string = "Datum nije odgovarajući! Razmak između donacija mora biti 3 ili 4 mjeseca.";
  errMsg: string = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private donorService: DonorService, private donationsService: DonationService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.donationId = Number.parseInt(params.get("id"));
      this.donationsService.getDonation(this.donationId).subscribe(data => {
        this.donation = <Donation>data;
        this.currentValues();
      });
    });

    this.donationForm = this.fb.group({
      dose: ['', [Validators.required, Validators.min(350), Validators.max(450), Validators.maxLength(3), Validators.minLength(3)]],
      tested: ['', Validators.required],
      date: ['', [Validators.required, Validators.pattern("^[0-3]?\\d-[0,1]?\\d-\\d{4}$")]],
      location: ['', [Validators.required, Validators.maxLength(250)]],
      systolic: ['', [Validators.required, Validators.min(60), Validators.max(300), Validators.maxLength(3), Validators.minLength(2)]],
      diastolic: ['', [Validators.required, Validators.min(30), Validators.max(150), Validators.maxLength(3), Validators.minLength(2)]],
      weight: ['', [Validators.required, Validators.pattern("^\\d{2,3}$"), Validators.min(50), Validators.max(300), Validators.maxLength(3), Validators.minLength(2)]],
      additional: ['']
    });

    this.editMode ? this.donationForm.enable() : this.donationForm.disable();
  }

  changeMode() {
    this.loaded = false;
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.errMsg = '';
      this.donationForm.enable();
    }
    else {
      this.donationForm.disable();
    }
  }

  get f() { return this.donationForm.controls; }

  formatBloodType(bt: string) {
    if (bt.endsWith('POS')) {
      return bt.replace('POS', '+')
    }
    else {
      return bt.replace('NEG', '-');
    }
  }

  currentValues() {
    this.donationForm.get('dose').setValue(this.donation.dose);
    this.donationForm.get('date').setValue(formatDate(this.donation.date, 'dd-MM-yyyy', 'en-US'));
    this.donationForm.get('tested').setValue(this.donation.tested);
    this.donationForm.get('location').setValue(this.donation.location);
    this.donationForm.get('systolic').setValue(this.donation.systolic);
    this.donationForm.get('diastolic').setValue(this.donation.diastolic);
    this.donationForm.get('weight').setValue(this.donation.weight);
    this.donationForm.get('additional').setValue(this.donation.additional);

    this.editMode = false;
    this.loaded = false;
    this.errMsg = '';
    this.donationForm.disable();
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.donationForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  onSubmit() {
    this.submitted = true;
    let d;
    if (this.f.date.valid) {
      let dmy = this.f.date.value.split('-');
      d = new Date(dmy[2], (<number>dmy[1] - 1), dmy[0]);
      if (d.getFullYear() == dmy[2] && d.getMonth() == (<number>dmy[1] - 1) && d.getDate() == dmy[0] && d.getTime() < Date.now()) {
        this.newDonation.date = d;
        this.donationForm.setErrors({ 'date': null });
        this.donationForm.updateValueAndValidity();

        /*this.donorService.getDonationsInDateRange(this.donation.id, this.donation.donor.id, this.donation.donor.gender.startsWith('M'), this.newDonation.date).subscribe(data => {
          console.log(data);
          if ((<Donation[]>data).length) {
            this.donationForm.get('date').setErrors({ 'unavailable': true });
          }
          else {
            this.donationForm.setErrors({ 'date': null });
            this.donationForm.updateValueAndValidity();
          }
        });*/
      }
      else {
        this.donationForm.get('date').setErrors({ 'incorrect': true });
      }
    }

    if (this.donationForm.invalid) {
      console.log(this.donationForm.errors);
      console.log(this.donationForm);
      this.findInvalidControls();
      return;
    }

    this.newDonation.id = this.donation.id;
    this.newDonation.donor = this.donation.donor;
    this.newDonation.dose = this.donationForm.get('dose').value;
    this.newDonation.tested = this.donationForm.get('tested').value;
    this.newDonation.systolic = this.donationForm.get('systolic').value;
    this.newDonation.diastolic = this.donationForm.get('diastolic').value;
    this.newDonation.weight = this.donationForm.get('weight').value;
    this.newDonation.location = this.donationForm.get('location').value;
    this.newDonation.additional = this.donationForm.get('additional').value;

    console.log(this.newDonation);
    this.loaded = false;

    this.donationsService.updateDonation(this.donation.donor.gender.startsWith('M'), this.newDonation).subscribe(data => {
      this.loaded = true;
      console.log(data);
      if (data != null) {
        this.donation = <Donation>data;
        this.errMsg = '';
        this.currentValues();
      }
    },
      error => {
        this.errMsg = this.invalidDateMsg;
      });

  }

}
