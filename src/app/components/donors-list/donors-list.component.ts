import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donors-list',
  templateUrl: './donors-list.component.html',
  styleUrls: ['./donors-list.component.css']
})
export class DonorsListComponent implements OnInit {

  bloodTypes: string[] = ['-O', '+O', '-A', '+A', '-B', '+B', '-AB', '+AB'];
  selectedBloodType: string;
  sortTypes: string[] = ['Ime', 'Prezime', 'Godine', 'Prebivalište', 'Krvna grupa'];
  selectedSorting: string;
  selectedDirection: string;

  constructor() { }

  ngOnInit() {
    this.selectedBloodType = this.bloodTypes[0];
  }

}
