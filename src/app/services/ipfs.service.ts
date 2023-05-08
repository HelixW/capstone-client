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

    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${bearerToken}`)
        .append('alevel', data.access),
    };
    return this.http.post(`${this.url}/ipfs/upload`, formData, header);
  }

  fetchFile(data: any) {
    const bearerToken = localStorage.getItem('tk');

    const header = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${bearerToken}`),
    };

    return this.http.post(`${this.url}/ipfs/fetch`, data, header);
  }
}
