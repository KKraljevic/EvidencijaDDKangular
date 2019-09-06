import { Component, OnInit } from '@angular/core';
import { DonorService } from 'src/app/services/donor.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-donors-list',
  templateUrl: './donors-list.component.html',
  styleUrls: ['./donors-list.component.css']
})
export class DonorsListComponent implements OnInit {

  donors: User[] = [];

  bloodTypes: string[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  selectedBloodType: string;
  sortTypes: string[] = ['Ime', 'Prezime', 'Godine', 'Prebivalište', 'Krvna grupa'];
  selectedSorting: string;
  selectedDirection: string;

  totalPages: number;
  currentPage: number = 0;

  notFoundMsg: string;

  constructor(private donorService: DonorService) { }

  ngOnInit() {
    this.loadDonors();
  }

  formatBloodType(bt: string) {
    if (bt.endsWith('POS')) {
      return bt.replace('POS', '+')
    }
    else {
      return bt.replace('NEG', '-');
    }
  }

  changeSortOrder(newSorting: string) {
    if (newSorting != this.selectedSorting) {
      this.selectedSorting = newSorting;
      if (this.sortTypes.indexOf(newSorting) < 3) {
        this.loadDonors(0, newSorting);
      }
    }
  }
  chooseBloodType(bt: string) {
    if(bt!=this.selectedBloodType) {
      this.selectedBloodType=bt;
      this.loadDonors(0,this.selectedSorting,bt);
    }
  }

  loadDonors(page?: number, sort?: string, bloodType?: string) {
    let sortNumber = undefined;
    if (sort != null || sort != undefined) {
      sortNumber = this.sortTypes.indexOf(sort);
    }
    this.donorService.getDonors(page, sortNumber, bloodType).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Davaoci nisu pronađeni!";
      }
      this.donors = data['content'];
      this.totalPages = data['totalPages'];
      this.currentPage = data['number'];
    });
  }

}
