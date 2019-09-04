import { Component, OnInit } from '@angular/core';
import { DonorService } from 'src/app/services/donor.service';
import { User } from 'src/app/model/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-donor-profile',
  templateUrl: './donor-profile.component.html',
  styleUrls: ['./donor-profile.component.css']
})
export class DonorProfileComponent implements OnInit {

  donorId:number;
  donor: User;
  editMode: boolean = false;

  notFoundMsg: string;
  errorMsg: string;

  constructor(private route: ActivatedRoute, private donorService: DonorService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.donorId = Number.parseInt(params.get("id"));

      this.donorService.getDonor(this.donorId).subscribe(data => {
        this.donor=data;
        console.log(data);
      },
      error => {
        this.notFoundMsg="Traženi davalac nije pronađen!";
      });
    }

    )
  }

  submit(userInfo: User) {
    console.log(userInfo);
    userInfo.id=this.donorId;
    this.donorService.updateDonor(userInfo).subscribe(data => {
      console.log('Update resp:' + data);
    },
    error => {
      this.errorMsg=error.error.message;
    });

  }
}
