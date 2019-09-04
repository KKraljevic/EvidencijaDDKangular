import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation } from '../model/donation';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  springURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getDonations(){
    return this.http.get(this.springURL+'/api/donations');
  }

  public getDonation(id: number){
    return this.http.get(this.springURL+'/api/donations/'+id);
  }
}
