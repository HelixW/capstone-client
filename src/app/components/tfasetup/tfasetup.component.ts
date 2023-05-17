import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tfasetup',
  templateUrl: './tfasetup.component.html',
  styleUrls: ['./tfasetup.component.scss'],
})
export class TfasetupComponent {
  constructor(private user: UserService, private router: Router) {}

  imgSrc: string = '';

  ngOnInit() {
    const bearerToken = localStorage.getItem('tk');

    // Check validity of token
    if (bearerToken) {
      const header = {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${bearerToken}`
        ),
      };

      this.user.validateAccess(header).subscribe({
        next: () => console.log('User authorised.'),
        error: () => this.router.navigateByUrl('browse'),
      });

      this.user.twoFactorQR(header).subscribe({
        next: (res: any) => (this.imgSrc = res.qr),
        error: () => this.router.navigateByUrl('browse'),
      });
    } else this.router.navigateByUrl('');
  }

  logout() {
    localStorage.removeItem('tk');
    this.router.navigateByUrl('');
  }
}
