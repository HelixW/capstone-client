import { HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IpfsService } from 'src/app/services/ipfs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(
    private user: UserService,
    private ipfs: IpfsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

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
    } else this.router.navigateByUrl('');
  }

  private file: File | undefined;
  fileName = '';
  fileDrag: boolean = false;
  fileType = '';
  textFile = false;
  zipFile = false;

  uploadComplete = false;
  successUpload = false;
  failureUpload = false;
  successHash = '';
  uploadMessage = '';

  fetchComplete = false;
  successFetch = false;
  failureFetch = false;
  fetchMessage = '';
  fetchName = '';
  fetchSize = '';
  fetchHash = '';

  version = false;
  allVersions = [];

  @ViewChild('fileUpload', { static: false })
  fileInput: ElementRef | undefined;

  removeFile() {
    if (this.fileInput) this.fileInput.nativeElement.value = '';
    this.file = undefined;
    this.fileName = '';
    this.fileType = '';
    this.textFile = false;
    this.zipFile = false;
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

  getFile(event: any) {
    this.file = event.target.files[0];

    if (this.file) {
      this.fileName = this.file.name;
      this.fileType = this.file.type;
    }

    this.fileDrag = false;

    // Set file type
    if (this.fileType === 'text/plain') this.textFile = true;
    else if (this.fileType === 'application/zip') this.zipFile = true;
  }

  onDragOver() {
    this.fileDrag = true;
  }

  onDragLeave() {
    this.fileDrag = false;
  }

  onSubmit(data: any) {
    const formData = new FormData();
    if (!this.file) return;

    formData.append('file', this.file);

    // Upload file to server
    this.ipfs.uploadFile(data, formData).subscribe({
      next: (res: any) => {
        this.uploadComplete = true;
        this.successHash = res.hash;
        this.successUpload = true;

        if (res.version === true)
          this.uploadMessage =
            'A new version of your file has been uploaded to the network!';
        else this.uploadMessage = 'File successfully uploaded to the network!';
      },
      error: (err) => {
        {
          console.log(err.error);
          this.uploadComplete = true;
          this.failureUpload = true;
          this.uploadMessage = 'Identical file already exists in network!';
        }
      },
    });
  }

  onFetch(data: NgForm) {
    this.ipfs.fetchFile(data).subscribe({
      next: (res: any) => {
        this.fetchComplete = true;
        this.successFetch = true;
        this.fetchMessage =
          'Your file with the given hash was found. Download the latest version below.';
        this.fetchName = res.name;
        this.fetchSize = this.humanFileSize(res.size);
        this.fetchHash = res.hash;

        if (this.fetchName.split('.')[1].toLowerCase() === 'txt')
          this.textFile = true;
        else this.zipFile = true;

        // Show versions
        if (res.version) {
          this.version = true;
          this.allVersions = res.allVersions;
        }
      },
      error: (err) => {
        this.fetchComplete = true;
        this.failureFetch = true;
        this.fetchMessage = 'Your file could not be fetched.';
        console.log(err.error);
      },
    });
  }

  onDownloadVersion(hash: string) {
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
        this.restart();
        this.fetchComplete = true;
        this.failureFetch = true;
        this.fetchMessage = 'Your file could not be downloaded.';
        console.log(err.error);
      },
    });
  }

  onDownload() {
    this.ipfs.downloadFile(this.fetchHash).subscribe({
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
        this.restart();
        this.fetchComplete = true;
        this.failureFetch = true;
        this.fetchMessage = 'Your file could not be downloaded.';
        console.log(err.error);
      },
    });
  }

  restart() {
    this.fileName = '';
    this.fileType = '';
    this.textFile = false;
    this.zipFile = false;

    this.uploadComplete = false;
    this.successUpload = false;
    this.failureUpload = false;
    this.successHash = '';
    this.uploadMessage = '';

    this.fetchComplete = false;
    this.successFetch = false;
    this.failureFetch = false;
    this.fetchMessage = '';
    this.fetchName = '';
    this.fetchSize = '';
    this.fetchHash = '';

    this.version = false;
    this.allVersions = [];
  }

  logout() {
    localStorage.removeItem('tk');
    this.router.navigateByUrl('');
  }
}
