import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {

  loggedUserId: number;

  constructor() { }

  ngOnInit() {
    if(sessionStorage.getItem('id')){
      this.loggedUserId=Number.parseInt(sessionStorage.getItem('id'));
    }
    else{
      this.loggedUserId=null;
    }
  }

}
