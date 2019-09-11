import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Notification } from 'src/app/model/notification';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  springURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getNotification(id: number) {
    return this.http.get(this.springURL + '/api/notifications/' + id);
  }

  public getNotifications(page: number) {
    let params = new HttpParams();
    params = page >= 0 ? params.append('page', page.toString()) : params.append('page', '0');
    return this.http.get(this.springURL + '/api/notifications');
  }

  public createNotification(notification: Notification) {
    return this.http.post(this.springURL + '/api/notifications', notification);
  }

  public updateNotification(notification: Notification) {
    return this.http.put(this.springURL + '/api/notifications/' + notification.id, notification);
  }

  public deleteNotification(id: number) {
    return this.http.delete(this.springURL + '/api/notifications/' + id, { responseType: 'text' as 'json' });
  }

  public uploadPhoto(file: FormData): Observable<string> {
    return this.http.post<string>(this.springURL + '/api/notifications/uploadPhoto', file, { responseType: 'text' as 'json' });
  }

  public findNotifications(search: string, page?: number) {
    let params = new HttpParams();
    params = Number.isInteger(page) ? params.append('page', page.toString()) : params;
    if (search != '' && search != null) {
      params = params.append('search', search);
      return this.http.get(this.springURL + '/api/notifications/search', { params: params });
    }
    else {
      return this.http.get(this.springURL + '/api/notifications', { params: params });
    }
  }

}
