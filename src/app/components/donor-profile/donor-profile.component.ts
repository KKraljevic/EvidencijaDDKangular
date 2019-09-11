import { Component, OnInit } from '@angular/core';
import { DonorService } from 'src/app/services/donor.service';
import { User } from 'src/app/model/user';
import { ActivatedRoute } from '@angular/router';
import { Donation } from 'src/app/model/donation';
import { Role } from 'src/app/model/role';

@Component({
  selector: 'app-donor-profile',
  templateUrl: './donor-profile.component.html',
  styleUrls: ['./donor-profile.component.css']
})
export class DonorProfileComponent implements OnInit {

  activeTab: number = 0;

  errorMessage: string;
  hasError: boolean = false;

  donorId: number;
  donor: User;
  editMode: boolean = false;

  donations: Donation[] = [];

  notFoundMsg: string;
  errorMsg: string;
  totalPages: number;
  currentPage: number = 0;
  loaded: boolean;

  constructor(private route: ActivatedRoute, private donorService: DonorService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.donorId = Number.parseInt(params.get("id"));
      if (params.has('tab')) {
        let tab = params.get('tab');
        if (tab === 'info') {
          this.activeTab = 0;
        }
        else if (tab === 'donacije') {
          this.activeTab = 1;
        }
      }
      else {
        this.activeTab = 0;
      }
      if (this.activeTab === 1) {
        this.loadUserDonations(0);
      }
    });

  }

  loadUserDonations(page: number) {
    this.activeTab = 1;

    this.loaded = false;

    this.donorService.getDonationsByDonor(this.donorId, page).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Nema ostvarenih donacija!";
      }
      this.donations = data['content'];
      this.totalPages = data['totalPages'];
      this.currentPage = data['number'];

      this.loaded = true;
    });
  }

  submit(userInfo: User) {
    console.log(userInfo);
    userInfo.id = this.donorId;
    if (userInfo.roles === null) {
      let role = new Role();
      role.id = 0;
      role.name = 'ROLE_USER'
      userInfo.roles.push(role);
    }
    this.loaded=false;
    this.donorService.updateDonor(userInfo).subscribe(data => {
      console.log('Update resp:' + data);
      this.loaded=true;
      this.hasError=false;
    },
      error => {
        this.errorMsg = error.error.message;
        this.hasError=true;
      });
  }

  archive(userInfo: User) {
    this.submit(userInfo);
  }
}
