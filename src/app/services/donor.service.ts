import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { Donation } from '../model/donation';

@Injectable({
  providedIn: 'root'
})
export class DonorService {

  springURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getDonor(id: number): Observable<User> {
    return this.http.get<User>(this.springURL + '/api/donators/' + id);
  }

  public createDonor(donor: User): Observable<User> {
    return this.http.post<User>(this.springURL + '/api/donators', donor);
  }

  public getActiveDonorsByBloodType(bloodType: string) {
    return this.http.get(this.springURL + '/api/donators/' + bloodType + '/active');
  }

  public getDonationsByDonor(donorId: number) {
    return this.http.get(this.springURL + '/api/donators/' + donorId + '/donations');
  }

  public addDonation(donorId: number, donation: Donation) {
    return this.http.post(this.springURL + '/api/donator/' + donorId + '/donations', donation);
  }

  public updateDonor(donor: User) {
    return this.http.put(this.springURL + '/api/donators/' + donor.id, donor);
  }

  public deleteDonor(donorId: number) {
    return this.http.delete(this.springURL + '/api/donators/' + donorId);
  }

}
