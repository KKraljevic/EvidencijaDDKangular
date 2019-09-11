import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/model/notification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  notifications: Notification[] = [];

  totalPages: number;
  currentPage: number = 0;

  searchForm: FormGroup;
  searchMode: boolean = false;
  submitted: boolean = false;

  notFoundMsg: string;
  loaded: boolean = false;

  constructor(private fb: FormBuilder, private notifService: NotificationService) { }

  ngOnInit() {

    this.searchForm = this.fb.group({
      search: ['', [Validators.maxLength(30)]]
    });

    this.loadNotifications(0);

  }

  loadNotifications(page: number) {
    
    this.searchMode=false;

    this.notifService.getNotifications(page).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Davaoci nisu pronađeni!";
      }
      this.notifications = data['content'];
      this.totalPages = data['totalPages'];
      this.currentPage = data['number'];

      this.loaded = true;
    });
  }

  searchNotifications(page: number) {

    this.submitted = true;

    if (this.searchForm.invalid) {
      return;
    }
    this.loaded = false;
    let searchInput =  <string>this.searchForm.get('search').value.toString();
    if(this.searchForm.get('search').value===null || searchInput.trim()==='') {
      this.searchMode=false;
    } 
    else {
      this.searchMode=true;
    }

    this.notifService.findNotifications(this.searchForm.get('search').value,page).subscribe(data => {
      if (data['totalElements'] === 0) {
        this.notFoundMsg = "Donacije nisu pronađene!";
      }
      this.notifications = data['content'];
      this.totalPages = data['totalPages'];
      this.currentPage = data['number'];

      this.loaded = true;
    });
  }

}
