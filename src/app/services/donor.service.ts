import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { Donation } from '../model/donation';

@Injectable({
  providedIn: 'root'
})
export class DonorService {

  springURL: string = 'http://localhost:8080';
  sortCriterias = ["firstName", "lastName", "birthDate", "bloodType"];

  constructor(private http: HttpClient) { }

  public getDonor(id: number): Observable<User> {
    return this.http.get<User>(this.springURL + '/api/donators/' + id);
  }

  public createDonor(donor: User): Observable<User> {
    return this.http.post<User>(this.springURL + '/api/auth/signup', donor);
  }

  public getDonors(page?: number, sort?: number, bloodType?: string) {
    let params = new HttpParams();
    params = Number.isInteger(page) ? params.append('page', page.toString()) : params;
    if (sort < 3 || sort === null || sort === undefined) {
      params = Number.isInteger(sort) ? params.append('sort', this.sortCriterias[sort]) : params;
      return this.http.get(this.springURL + '/api/donators', { params: params });
    }
    else {
      if (bloodType.endsWith('+')) {
        bloodType = bloodType.replace('+', 'POS');
      }
      else {
        bloodType = bloodType.replace('-', 'NEG');
      }
      return this.http.get(this.springURL + '/api/donators/bloodType/' + bloodType, { params: params });
    }
  }

  public getActiveDonorsByBloodType(bloodType: string) {
    return this.http.get(this.springURL + '/api/donators/bloodType/' + bloodType + '/active');
  }

  public getDonationsByDonor(donorId: number, page: number) {
    let params = new HttpParams();
    params = Number.isInteger(page) ? params.append('page', page.toString()) : params;
    return this.http.get(this.springURL + '/api/donators/' + donorId + '/donations', { params: params });
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
