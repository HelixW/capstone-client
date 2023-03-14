import { HttpClient } from '@angular/common/http';
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
}
