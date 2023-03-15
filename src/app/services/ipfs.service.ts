import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IpfsService {
  constructor(private http: HttpClient) {}

  private url = 'http://localhost:3000';

  uploadFile(data: any, formData: FormData) {
    const bearerToken = localStorage.getItem('tk');

    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${bearerToken}`)
        .set('AccessLevel', data.access),
    };
    return this.http.post(`${this.url}/ipfs/upload`, formData, header);
  }

  // saveUser(data: any) {
  //   return this.http.post(`${this.url}/identity/register`, data);
  // }

  // loginUser(data: any) {
  //   return this.http.post(`${this.url}/identity/login`, data);
  // }

  // validateUser(header: any) {
  //   return this.http.get(`${this.url}/identity/validate`, header);
  // }
}
