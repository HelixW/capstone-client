import { HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router
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
  pngFile = false;

  uploadComplete = false;
  successUpload = false;
  failureUpload = false;
  successHash = '';
  uploadMessage = '';

  fetchComplete = false;
  successFetch = false;
  failureFetch = false;
  fetchMessage = '';
  fetchContent = '';

  @ViewChild('fileUpload', { static: false })
  fileInput: ElementRef | undefined;

  removeFile() {
    if (this.fileInput) this.fileInput.nativeElement.value = '';
    this.file = undefined;
    this.fileName = '';
    this.fileType = '';
    this.textFile = false;
    this.pngFile = false;
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
    else if (this.fileType === 'image/png') this.pngFile = true;
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
        this.uploadMessage = 'File successfully uploaded to the network!';
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
        this.fetchMessage = 'Your file has been fetched successfully.';
        this.fetchContent = res.data;
      },
      error: (err) => {
        this.fetchComplete = true;
        this.failureFetch = true;
        this.fetchMessage = 'Your file could not be fetched.';
        console.log(err.error);
      },
    });
  }

  restart() {
    this.uploadComplete = false;
    this.successUpload = false;
    this.failureUpload = false;
    this.successHash = '';
    this.uploadMessage = '';

    this.fetchComplete = false;
    this.successFetch = false;
    this.failureFetch = false;
    this.fetchMessage = '';
    this.fetchContent = '';
  }

  logout() {
    localStorage.removeItem('tk');
    this.router.navigateByUrl('');
  }
}
