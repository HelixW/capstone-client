import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  title = 'Dashboard';

  constructor(private http: HttpClient) {}

  file: File | undefined;
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
