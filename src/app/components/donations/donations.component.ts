import { Component, OnInit } from '@angular/core';
import { Donation } from 'src/app/model/donation';
import { DonationService } from 'src/app/services/donation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit {

  donations: Donation[] = [];

  bloodTypes: string[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  selectedBloodType: string;
  sortTypes: string[] = ['Ime', 'Prezime', 'Godine', 'Lokacija', 'Krvna grupa'];
  selectedSorting: string;
  selectedDirection: string;

  activeTab: number = 0;
  currentPage: number = 0;
  totalPages: number;

  searchForm: FormGroup;
  submitted: boolean = false;

  notFoundMsg: string;
  loaded: boolean = false;

  constructor(private router: Router, private donationService: DonationService, private fb: FormBuilder) { }

  ngOnInit() {

    this.searchForm = this.fb.group({
      search: ['', [Validators.maxLength(30)]]
    });

    this.selectedSorting = this.sortTypes[0];
    this.selectedDirection = 'Opadajući';
    this.loadDonations(0, this.currentPage, this.selectedSorting, this.selectedDirection);
  }

  changeSortOrder(newSorting: string) {

    this.searchForm.get('search').setValue('');

    if (newSorting != this.selectedSorting) {
      this.selectedSorting = newSorting;
      this.selectedDirection = 'Opadajući';
      if (this.sortTypes.indexOf(newSorting) != 4) {
        this.selectedBloodType = undefined;
        this.loadDonations(this.activeTab, 0, newSorting, this.selectedDirection);
      }
    }
  }

  changeSortDirection(newDirection: string) {

    this.searchForm.get('search').setValue('');

    if (newDirection != this.selectedDirection) {
      this.selectedSorting = newDirection;
      this.loadDonations(this.activeTab, 0, this.selectedSorting, this.selectedDirection);
    }
  }

  chooseBloodType(bt: string) {
    if (bt != this.selectedBloodType) {
      this.selectedBloodType = bt;
      this.selectedDirection = 'Opadajući';
      this.loadDonations(this.activeTab, 0, this.selectedSorting, this.selectedDirection, bt);
    }
  }

  convertDirection(direction: string): number {
    if (direction.startsWith('Opad')) {
      return 1;
    }
    else if (direction.startsWith('Rast')) {
      return 2;
    }
    console.log("Neispravan smjer sortiranja! Vracen podrazumijevani smjer - opadajuci.");
    this.selectedDirection = 'Opadajući';
    return 1;
  }

  loadDonations(tab: number, page?: number, sort?: string, direction?: string, bloodType?: string) {
    this.activeTab = (tab !== undefined) ? tab : this.activeTab;
    this.activeTab = this.activeTab > 2 ? 0 : this.activeTab;

    this.searchForm.get('search').setValue('');

    let sortNumber = undefined;
    if (sort != null && sort != undefined) {
      sortNumber = this.sortTypes.indexOf(sort);
    }
    else {
      sortNumber = this.sortTypes.indexOf(this.selectedSorting);
    }

    this.loaded = false;

    console.log("Kriteri: \n" + tab + ',' + page + ',' + sortNumber + ',' + direction + ',' + bloodType);

    this.donationService.getDonations(this.activeTab, true, page, sortNumber, this.convertDirection(direction), bloodType).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Donacije nisu pronađene!";
      }
      this.donations = data['content'];
      this.totalPages = data['totalPages'];
      this.currentPage = data['number'];

      this.loaded = true;
    });
  }

  searchItems() {

    this.submitted = true;

    if (this.searchForm.invalid) {
      return;
    }
    //this.router.navigate(['/donations/search/', this.searchForm.get('search').value]);

    this.selectedSorting = this.sortTypes[0];
    this.selectedDirection = 'Opadajući';
    this.selectedBloodType = undefined;

    this.loaded = false;

    this.donationService.findDonations(this.searchForm.get('search').value, 0, 0).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Donacije nisu pronađene!";
      }
      this.donations = data['content'];
      this.totalPages = data['totalPages'];
      this.currentPage = data['number'];

      this.activeTab = 0;
      this.loaded = true;
    });
  }

}
