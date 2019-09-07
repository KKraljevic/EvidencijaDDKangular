import { Component, OnInit } from '@angular/core';
import { DonorService } from 'src/app/services/donor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonationService } from 'src/app/services/donation.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  bloodTypes: string[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  selectedBloodType: string;
  sortTypes: string[] = ['Ime', 'Prezime', 'Godine', 'Prebivalište', 'Krvna grupa'];
  selectedSorting: string;
  selectedDirection: string;

  activeTab: number = 0;
  totalPages: number;
  currentPage: number = 0;

  searchForm: FormGroup;
  submitted: boolean = false;
  loaded: boolean;
  donors: any;
  notFoundMsg: string;
  donations: any;

  constructor(private donorService: DonorService, private donationService: DonationService, private fb: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      search: ['', [Validators.maxLength(30)]]
    });

    this.selectedSorting = this.sortTypes[0];
    this.selectedDirection = 'Opadajući';
    this.loadData(0, 0, this.selectedSorting, this.selectedDirection);
  }

  changeSortOrder(newSorting: string) {

    this.searchForm.get('search').setValue('');

    if (newSorting != this.selectedSorting) {
      this.selectedSorting = newSorting;
      this.selectedDirection = 'Opadajući';
      if (this.sortTypes.indexOf(newSorting) != 4) {
        this.selectedBloodType = undefined;
        this.loadData(this.activeTab, 0, newSorting, this.selectedDirection);
      }
    }
  }

  chooseBloodType(bt: string) {
    if (bt != this.selectedBloodType) {
      this.selectedBloodType = bt;
      this.loadData(0, 0, this.selectedSorting, this.selectedDirection, bt);
    }
  }

  changeSortDirection(newDirection: string) {

    this.searchForm.get('search').setValue('');

    if (newDirection != this.selectedDirection) {
      this.selectedDirection = newDirection;
      this.loadData(this.activeTab, 0, this.selectedSorting, this.selectedDirection);
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


  loadData(tab: number, page?: number, sort?: string, direction?: string, bloodType?: string) {
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

    if (this.activeTab === 0) {
      this.donorService.getDonors(this.activeTab, false, page, sortNumber, this.convertDirection(this.selectedDirection), bloodType).subscribe(data => {
        if (data['totalElements'] === 0) {
          this.notFoundMsg = "Davaoci nisu pronađeni!";
        }
        this.donors = data['content'];
        this.totalPages = data['totalPages'];
        this.currentPage = data['number'];

        this.loaded = true;
      });
    }
    else if (this.activeTab === 1) {
      this.donationService.getDonations(this.activeTab, false, page, sortNumber, this.convertDirection(direction), bloodType).subscribe(data => {
        if (data['totalElements'] === 0) {
          this.notFoundMsg = "Donacije nisu pronađene!";
        }
        this.donations = data['content'];
        this.totalPages = data['totalPages'];
        this.currentPage = data['number'];

        this.loaded = true;
      });
    }

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

    switch (this.activeTab) {
      case 0:
          this.donorService.findDonors(this.searchForm.get('search').value,false, 0, 0).subscribe(data => {
            if (data['totalElements'] === 0) {
              this.notFoundMsg = "Davaoci nisu pronađene!";
            }
            this.donors = data['content'];
            this.totalPages = data['totalPages'];
            this.currentPage = data['number'];
      
            this.activeTab = 0;
            this.loaded = true;
          });
        break;
      case 1:
          this.donationService.findDonations(this.searchForm.get('search').value,false, 0, 0).subscribe(data => {
            if (data['totalElements'] === 0) {
              this.notFoundMsg = "Donacije nisu pronađene!";
            }
            this.donations = data['content'];
            this.totalPages = data['totalPages'];
            this.currentPage = data['number'];
      
            this.activeTab = 0;
            this.loaded = true;
          });
        break;
    }

    /*this.donorService.find(this.searchForm.get('search').value, 0, 0).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Donacije nisu pronađene!";
      }
      this.donations = data['content'];
      this.totalPages = data['totalPages'];
      this.currentPage = data['number'];

      this.activeTab = 0;
      this.loaded = true;
    });*/
  }

  formatBloodType(bt: string) {
    if (bt.endsWith('POS')) {
      return bt.replace('POS', '+')
    }
    else {
      return bt.replace('NEG', '-');
    }
  }
}
