import { HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private user: UserService, private router: Router) {}

  ngOnInit() {
    const bearerToken = localStorage.getItem('tk');

    // Check validity of token
    if (bearerToken) {
      var header = {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${bearerToken}`
        ),
      };

      this.user.validateUser(header).subscribe({
        next: () => console.log('User validated.'),
        error: () => this.router.navigateByUrl(''),
      });
    } else this.router.navigateByUrl('');
  }

  private file: File | undefined;
  fileName = '';
  fileDrag: boolean = false;

  @ViewChild('fileUpload', { static: false })
  fileInput: ElementRef | undefined;

  removeFile() {
    if (this.fileInput) this.fileInput.nativeElement.value = '';
    this.file = undefined;
    this.fileName = '';
    console.log(this.file);
  }

  getFile(event: any) {
    this.file = event.target.files[0];
    if (this.file) this.fileName = this.file.name;
    this.fileDrag = false;
  }

  onDragOver() {
    this.fileDrag = true;
  }

  onDragLeave() {
    this.fileDrag = false;
  }
}
