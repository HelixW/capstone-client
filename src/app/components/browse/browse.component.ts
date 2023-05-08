import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FilesService } from 'src/app/services/files.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent {
  constructor(
    private user: UserService,
    private router: Router,
    private files: FilesService,
    private toastr: ToastrService
  ) {}

  uploads: Array<any> = [];

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

      this.user.validateUser(header).subscribe({
        next: () => console.log('User validated.'),
        error: () => this.router.navigateByUrl(''),
      });

      this.files.viewFiles().subscribe({
        next: (res: any) => {
          this.uploads = res.files;
        },
        error: () => console.log('Error fetching files'),
      });
    } else this.router.navigateByUrl('');
  }

  logout() {
    localStorage.removeItem('tk');
    this.router.navigateByUrl('');
  }

  async copyToClipboard(index: number) {
    await navigator.clipboard.writeText(this.uploads[index].hash);
    this.toastr.success('Copied hash to clipboard.');
    console.log('Hash copied.');
  }
}
