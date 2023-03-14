import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  saveUser(data: any) {
    return this.http.post(`http://localhost:3000/identity/register`, data);
  }

  validateUser(header: any) {
    return this.http.get(`http://localhost:3000/identity/validate`, header);
  }
}
