import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
  path: string;
  title: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard'},
  { path: '/icons', title: 'Icons'},
  { path: '/maps', title: 'Maps'},
  { path: '/notifications', title: 'Notifications'},

  { path: '/user-profile', title: 'User Profile'},
  { path: '/table-list', title: 'Table List'},
  { path: '/typography', title: 'Typography'},
  { path: '/upgrade', title: 'Upgrade to PRO'}

];

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };

}
