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
  sortCriterias = ["firstName", "lastName", "birthDate", "address", "bloodType"];
  sortDirections = [",desc", ",asc"];

  constructor(private http: HttpClient) { }

  public getDonor(id: number): Observable<User> {
    return this.http.get<User>(this.springURL + '/api/donators/' + id);
  }

  public getUsers(page: number) {
    let params = new HttpParams();
    params = Number.isInteger(page) ? params.append('page', page.toString()) : params;
    params = params.append('size', '1');
    return this.http.get(this.springURL + '/api/users', { params: params });
  }

  public createDonor(donor: User): Observable<User> {
    return this.http.post<User>(this.springURL + '/api/auth/signup', donor);
  }

  public getDonors(tab: number, active: boolean, page?: number, sort?: number, direction?: number, bloodType?: string) {
    let params = new HttpParams();
    params = Number.isInteger(page) ? params.append('page', page.toString()) : params;
    params = active === null ? params : params.append('active', active.toString());

    if (sort < 4 || sort === null || sort === undefined) {
      if (direction != null && direction != undefined) {
        params = Number.isInteger(sort) ? params.append('sort', this.sortCriterias[sort] + this.sortDirections[direction - 1]) : params;
      }
      else {
        params = Number.isInteger(sort) ? params.append('sort', this.sortCriterias[sort]) : params;
      }
      switch (tab) {
        case 0:
          return this.http.get(this.springURL + '/api/donators', { params: params });
        case 1:
          return this.http.get(this.springURL + '/api/donators/active/available', { params: params });
        case 2:
          return this.http.get(this.springURL + '/api/donators/active/unavailable', { params: params });
      }
    }
    else {
      if (bloodType.endsWith('+')) {
        bloodType = bloodType.replace('+', 'POS');
      }
      else {
        bloodType = bloodType.replace('-', 'NEG');
      }
      params = params.append('blood', bloodType);
      switch (tab) {
        case 0:
          return this.http.get(this.springURL + '/api/donators/bloodType/' + bloodType, { params: params });
        case 1:
          return this.http.get(this.springURL + '/api/donators/active/available', { params: params });
        case 2:
          return this.http.get(this.springURL + '/api/donators/active/unavailable', { params: params });
      }
    }
  }

  public findDonors(search: string, active: boolean, page?: number, sort?: number) {
    let params = new HttpParams();
    params = Number.isInteger(page) ? params.append('page', page.toString()) : params;
    params = Number.isInteger(sort) ? params.append('sort', this.sortCriterias[sort]) : params;
    params = active!=undefined? params.append('active', active.toString()) : params;
    if (search != '' && search != null) {
      params = params.append('search', search);
      return this.http.get(this.springURL + '/api/donators/search', { params: params })
    }
    else {
      if(active===undefined) {
        return this.getUsers(0);
      }
      return this.http.get(this.springURL + '/api/donators', { params: params })
    }
  }

  public filterDonors(search: string) {
    let params = new HttpParams();
    params = params.append('search', search);
    params = params.append('active', 'false');
    return this.http.get(this.springURL + '/api/donators/filter', { params: params })
  }

  public getActiveDonorsByBloodType(bloodType: string) {
    return this.http.get(this.springURL + '/api/donators/bloodType/' + bloodType + '/active');
  }

  public getDonationsByDonor(donorId: number, page: number) {
    let params = new HttpParams();
    params = Number.isInteger(page) ? params.append('page', page.toString()) : params;
    return this.http.get(this.springURL + '/api/donators/' + donorId + '/donations', { params: params });
  }

  public deactivateDonor(donorId: number) {
    return this.http.put(this.springURL + '/api/donators/' + donorId + '/deactivate', {});
  }

  public getDonationsInDateRange(id: number, donorId: number, gender: boolean, date: Date) {
    let params = new HttpParams();
    params = params.append('gender', gender.toString());
    params = params.append('centralDate', date.toLocaleDateString());
    return this.http.get(this.springURL + '/api/donators/' + donorId + '/donations/' + id + '/check', { params: params });
  }

  public addDonation(donorId: number, donation: Donation) {
    return this.http.post(this.springURL + '/api/donators/' + donorId + '/donations', donation);
  }

  public updateDonor(donor: User) {
    return this.http.put(this.springURL + '/api/donators/' + donor.id, donor);
  }

  public deleteDonor(donorId: number) {
    return this.http.delete(this.springURL + '/api/donators/' + donorId);
  }

}
