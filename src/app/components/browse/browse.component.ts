import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FilesService } from 'src/app/services/files.service';
import { ToastrService } from 'ngx-toastr';
import { IpfsService } from 'src/app/services/ipfs.service';

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
    private toastr: ToastrService,
    private ipfs: IpfsService
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

  humanFileSize(bytes: number) {
    if (bytes == 0) {
      return '0.00 B';
    }
    var e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (
      (bytes / Math.pow(1024, e)).toFixed(2) + ' ' + ' KMGTP'.charAt(e) + 'B'
    );
  }

  async onDownload(hash: string) {
    this.ipfs.downloadFile(hash).subscribe({
      next: (res: any) => {
        this.toastr.success('Starting download...');

        // Download file to system
        let fName = res.headers
          .get('Content-Disposition')
          ?.split(';')[1]
          .split('=')[1];
        let blob: Blob = res.body as Blob;
        let a = document.createElement('a');
        a.download = fName;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }
}
