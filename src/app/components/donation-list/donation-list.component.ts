import { Component, OnInit, Input } from '@angular/core';
import { Donation } from 'src/app/model/donation';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css']
})
export class DonationListComponent implements OnInit {

  @Input() donations: Donation[] = [];
  @Input() currentPage: number = 0;

  constructor( ) { }

  ngOnInit() {
    
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
