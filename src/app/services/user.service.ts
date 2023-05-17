import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private url = 'http://localhost:3000';

  saveUser(data: any) {
    return this.http.post(`${this.url}/identity/register`, data);
  }

  loginUser(data: any) {
    return this.http.post(`${this.url}/identity/login`, data);
  }

  validateUser(header: any) {
    return this.http.get(`${this.url}/identity/validate`, header);
  }

  validateAccess(header: any) {
    return this.http.get(`${this.url}/identity/access`, header);
  }

  validateAdmin(header: any) {
    return this.http.get(`${this.url}/identity/admin`, header);
  }

  twoFactorQR(header: any) {
    return this.http.get(`${this.url}/identity/2fa`, header);
  }

  twoFactorValidate(data: any) {
    const bearerToken = localStorage.getItem('tk');

    // Check validity of token
    const header = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${bearerToken}`),
    };
    return this.http.post(`${this.url}/identity/2faverify`, data, header);
  }
}
