import { Component, OnInit } from '@angular/core';
import { Donation } from 'src/app/model/donation';
import { ActivatedRoute } from '@angular/router';
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

  donorId: number;
  donors: User[] = [];
  selectedDonor: User;
  donation: Donation = new Donation();

  searchDonor: string = "";

  constructor( private fb: FormBuilder, private route: ActivatedRoute, private donationsService: DonationService, private donorService: DonorService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.donorId = Number.parseInt(params.get("id"));
      }

      //get exicting donors list
    });

    this.donationForm = this.fb.group({
      donor: ['',Validators.required],
      dose: ['', [Validators.required, Validators.min(350), Validators.max(450), Validators.maxLength(3), Validators.minLength(3)]],
      tested: ['',Validators.required],
      date: ['',Validators.required],
      location: ['', [Validators.required, Validators.maxLength(250)]],
      systolic: ['',[Validators.required,Validators.min(60),Validators.max(300),Validators.maxLength(3),Validators.minLength(2)]],
      diastolic: ['',[Validators.required,Validators.min(30),Validators.max(150),Validators.maxLength(3),Validators.minLength(2)]],
      weigth: ['',[Validators.required,Validators.min(50),Validators.max(300),Validators.maxLength(3),Validators.minLength(2)]],
      additional: ['']
    });
    }

  chooseDonor(donor: User){
    this.donationForm.get('donor').setValue(donor.firstName+' '+donor.lastName);
    this.selectedDonor=donor;
  }

  filterDonors() {
    if (this.searchDonor.trim() != "") {
      this.donorService.filterDonors(this.searchDonor.trim()).subscribe( data => {
        console.log("filter results: " + data);
        this.donors=<User[]>data;
      });
    }
  }

}
