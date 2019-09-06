import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation } from '../model/donation';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  springURL: string = 'http://localhost:8080';
  sortCriterias = ["donor.firstName", "donor.lastName", "donor.birthDate", "location", "donor.bloodType"];
  sortDirections = [",desc", ",asc"];

  constructor(private http: HttpClient) { }

  public getDonation(id: number) {
    return this.http.get(this.springURL + '/api/donations/' + id);
  }

  public getDonations(tab: number, active: boolean, page?: number, sort?: number, direction?: number, bloodType?: string) {
    let params = new HttpParams();
    params = Number.isInteger(page) ? params.append('page', page.toString()) : params;
    params = params.append('active', active.toString());
    switch (tab) {
      case 0:
        break;
      case 1:
        params = params.append('tested', 'true');
        break;
      case 2:
        params = params.append('tested', 'false');
        break;
    }

    if (sort < 4 || sort === null || sort === undefined) {
      if (direction != null && direction != undefined) {
        params = Number.isInteger(sort) ? params.append('sort', this.sortCriterias[sort] + this.sortDirections[direction - 1]) : params;
      }
      else {
        params = Number.isInteger(sort) ? params.append('sort', this.sortCriterias[sort]) : params;
      }
      return this.http.get(this.springURL + '/api/donations', { params: params });
    }
    else {
      if (bloodType.endsWith('+')) {
        bloodType = bloodType.replace('+', 'POS');
      }
      else {
        bloodType = bloodType.replace('-', 'NEG');
      }
      return this.http.get(this.springURL + '/api/donations/bloodType/' + bloodType, { params: params });
    }

  }

  public findDonations(search: string, page?: number, sort?: number) {
    let params = new HttpParams();
    params = Number.isInteger(page) ? params.append('page', page.toString()) : params;
    params = Number.isInteger(sort) ? params.append('sort', this.sortCriterias[sort]) : params;

    if (search != '' && search != null) {
      params = params.append('search', search);
      return this.http.get(this.springURL + '/api/donations/search', { params: params })
    }
    else {
      return this.http.get(this.springURL + '/api/donations', { params: params })
    }
  }
}
