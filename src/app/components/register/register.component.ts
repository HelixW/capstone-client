import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private user: UserService) {}

  submitted: boolean = false;
  success: boolean = false;

  register(data: NgForm) {
    this.user.saveUser(data).subscribe({
      next: (res) => this.regSuccess(res),
      error: (err) => this.regFailure(err),
    });
  }

  private regSuccess(data: any) {
    this.submitted = true;
    this.success = true;
    console.log(data.message);

    localStorage.setItem('tk', data.token);
  }

  private regFailure(data: any) {
    this.submitted = true;
    this.success = false;
    console.log(data.error.message);

    localStorage.removeItem('tk');
  }
}
