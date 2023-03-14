import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private user: UserService, private router: Router) {}

  submitted: boolean = false;
  success: boolean = false;

  login(data: NgForm) {
    this.user.loginUser(data).subscribe({
      next: (res) => this.loginSuccess(res),
      error: () => this.invalidLogin(),
    });
  }

  private invalidLogin() {
    this.submitted = true;
    this.success = false;

    localStorage.removeItem('tk');
  }

  private loginSuccess(data: any) {
    this.submitted = true;
    this.success = true;
    console.log(data.message);

    localStorage.setItem('tk', data.token);

    this.router.navigateByUrl('/app');
  }
}
