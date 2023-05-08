import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private http: HttpClient) {}

  private url = 'http://localhost:3000';

  viewFiles() {
    const bearerToken = localStorage.getItem('tk');
    const header = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${bearerToken}`),
    };

    return this.http.get(`${this.url}/ipfs/browse`, header);
  }
}
