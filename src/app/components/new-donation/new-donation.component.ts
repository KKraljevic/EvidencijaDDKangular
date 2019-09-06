import { Component, OnInit } from '@angular/core';
import { Donation } from 'src/app/model/donation';
import { ActivatedRoute } from '@angular/router';
import { DonationService } from 'src/app/services/donation.service';

@Component({
  selector: 'app-new-donation',
  templateUrl: './new-donation.component.html',
  styleUrls: ['./new-donation.component.css']
})
export class NewDonationComponent implements OnInit {

  donationId: number;
  donation: Donation = new Donation();

  constructor(private route: ActivatedRoute, private donationsService: DonationService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if(params.has('id')){
        this.donationId = Number.parseInt(params.get("id"));
      }

      //get exicting donors list
    });
  }


}
