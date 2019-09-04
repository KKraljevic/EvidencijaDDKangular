import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  korisnik: string;

  constructor(private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(data=>{
        this.korisnik=data;
        console.log("user " + data)
    });

    //this.korisnik=this.authService.currentUserValue;
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);

  }

}
