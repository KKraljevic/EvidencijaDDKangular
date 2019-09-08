import { Component, OnInit } from '@angular/core';
import { DonorService } from 'src/app/services/donor.service';
import { User } from 'src/app/model/user';
import { ActivatedRoute } from '@angular/router';
import { Donation } from 'src/app/model/donation';
import { ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';
import { Role } from 'src/app/model/role';

@Component({
  selector: 'app-donor-profile',
  templateUrl: './donor-profile.component.html',
  styleUrls: ['./donor-profile.component.css']
})
export class DonorProfileComponent implements OnInit {

  activeTab: number = 0;

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
        if(tab==='info'){
          this.activeTab=0;
        }
        else if(tab === 'donacije') {
          this.activeTab=1;
        }
      }
      else {
        this.activeTab=0;
      }

      this.donorService.getDonor(this.donorId).subscribe(data => {
        this.donor = data;
        console.log(data);

        if(this.activeTab===1){
          this.loadUserDonations(0);
        }
      },
        error => {
          this.notFoundMsg = "Traženi davalac nije pronađen!";
        });

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
    userInfo.roles=this.donor.roles;
    if(userInfo.roles===null || !userInfo.roles.length) {
      let role=new Role();
      role.id=0;
      role.name='ROLE_USER'
      userInfo.roles.push(role);
    }
    this.donorService.updateDonor(userInfo).subscribe(data => {
      console.log('Update resp:' + data);
    },
      error => {
        this.errorMsg = error.error.message;
      });

  }
}
