import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tfa',
  templateUrl: './tfa.component.html',
  styleUrls: ['./tfa.component.scss'],
})
export class TfaComponent {
  constructor(private user: UserService, private router: Router) {}

  invalid: boolean = false;
  otp: string = '';

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
    } else this.router.navigateByUrl('');
  }

  receiveOtp(event: any) {
    this.otp = event;
    console.log(this.otp);
  }

  validate() {
    if (this.otp.length !== 6) {
      this.invalid = true;
    } else {
      const data = { totp: this.otp };

      this.user.twoFactorValidate(data).subscribe({
        next: (res: any) => {
          localStorage.setItem('tk', res.token);
          this.router.navigateByUrl('/admin');
        },
        error: () => (this.invalid = true),
      });
    }
  }

  logout() {
    localStorage.removeItem('tk');
    this.router.navigateByUrl('');
  }
}
