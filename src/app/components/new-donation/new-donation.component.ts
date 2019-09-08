import { Component, OnInit } from '@angular/core';
import { Donation } from 'src/app/model/donation';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationService } from 'src/app/services/donation.service';
import { User } from 'src/app/model/user';
import { DonorService } from 'src/app/services/donor.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-donation',
  templateUrl: './new-donation.component.html',
  styleUrls: ['./new-donation.component.css']
})
export class NewDonationComponent implements OnInit {

  donationForm: FormGroup;
  submitted: boolean = false;

  donorId: number;
  donors: User[] = [];
  selectedDonor: User;
  donation: Donation = new Donation();

  searchDonor: string = "";

  loaded: boolean = false;
  errMsg: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private donationsService: DonationService,
    private donorService: DonorService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.donorId = Number.parseInt(params.get("id"));
      }
    });

    this.donationForm = this.fb.group({
      donor: ['', Validators.required],
      dose: ['', [Validators.required, Validators.min(350), Validators.max(450), Validators.maxLength(3), Validators.minLength(3)]],
      tested: ['', Validators.required],
      date: ['', [Validators.required, Validators.pattern("^[0-3]?\\d-[0,1]?\\d-\\d{4}$")]],
      location: ['', [Validators.required, Validators.maxLength(250)]],
      systolic: ['', [Validators.required, Validators.min(60), Validators.max(300), Validators.maxLength(3), Validators.minLength(2)]],
      diastolic: ['', [Validators.required, Validators.min(30), Validators.max(150), Validators.maxLength(3), Validators.minLength(2)]],
      weigth: ['', [Validators.required, Validators.pattern("^\\d{2,3}$"), Validators.min(50), Validators.max(300), Validators.maxLength(3), Validators.minLength(2)]],
      additional: ['']
    });
  }
  get f() { return this.donationForm.controls; }

  chooseDonor(donor: User) {
    this.donationForm.get('donor').setValue(donor.firstName + ' ' + donor.lastName);
    this.selectedDonor = donor;
  }

  filterDonors() {
    if (this.searchDonor.trim() != "") {
      this.donorService.filterDonors(this.searchDonor.trim()).subscribe(data => {
        console.log("filter results: " + data);
        this.donors = <User[]>data;
      });
    }
  }

  onSubmit() { //mapiranje na donaciju i poziv servisa
    this.submitted = true;
    let d;
    if (this.f.date.valid) {
      let dmy = this.f.date.value.split('-');
      d = new Date(dmy[2], (<number>dmy[1] - 1), dmy[0]);
      if (d.getFullYear() == dmy[2] && d.getMonth() == (<number>dmy[1] - 1) && d.getDate() == dmy[0] && d.getTime() < Date.now()) {
        this.donation.date = d;
      }
      else {
        this.donationForm.get('date').setErrors({ 'incorrect': true });
      }
    }
    if (this.donationForm.invalid) {
      return;
    }
    this.donation.donor = this.selectedDonor;
    this.donation.dose = this.donationForm.get('dose').value;
    this.donation.tested = this.donationForm.get('tested').value;
    this.donation.systolic = this.donationForm.get('systolic').value;
    this.donation.diastolic = this.donationForm.get('diastolic').value;
    this.donation.weight = this.donationForm.get('weigth').value;
    this.donation.location = this.donationForm.get('location').value;
    this.donation.additional = this.donationForm.get('additional').value;


    this.donorService.addDonation(this.selectedDonor.id, this.donation).subscribe(data => {
      this.loaded = true;
      console.log(data);
      this.router.navigate(['/donations',(<Donation>data).id]);
    },
      error => {
        this.loaded = true;
        this.errMsg = "Nije moguće dodati donaciju! Nije prošlo dovoljno vremena od poslednje donacije.";
      });

  }

}
