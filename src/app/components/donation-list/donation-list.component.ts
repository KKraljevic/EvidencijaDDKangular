import { Component, OnInit } from '@angular/core';
import { DonationService } from 'src/app/services/donation.service';
import { Donation } from 'src/app/model/donation';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css']
})
export class DonationListComponent implements OnInit {

  donations: Donation[] = [];

  constructor( private donationService: DonationService) { }

  ngOnInit() {
    this.donationService.getDonations().subscribe(data => {
      if(data!=null) {
          this.donations=<Donation[]>data;
      }
    });
  }

}
