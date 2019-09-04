import { Component, OnInit } from '@angular/core';
import { DonationService } from 'src/app/services/donation.service';
import { ActivatedRoute } from '@angular/router';
import { Donation } from 'src/app/model/donation';

@Component({
  selector: 'app-donation-info',
  templateUrl: './donation-info.component.html',
  styleUrls: ['./donation-info.component.css']
})
export class DonationInfoComponent implements OnInit {

  donationId: number;
  donation: Donation;

  constructor(private route: ActivatedRoute, private donationsService: DonationService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.donationId = Number.parseInt(params.get("id"));
      this.donationsService.getDonation(this.donationId).subscribe(data => {
        this.donation=<Donation>data;
      });
    });
  }

}
