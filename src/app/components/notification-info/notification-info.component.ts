import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from 'src/app/model/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-notification-info',
  templateUrl: './notification-info.component.html',
  styleUrls: ['./notification-info.component.css']
})
export class NotificationInfoComponent implements OnInit {

  notificationForm: FormGroup;
  submitted: boolean = false;

  titles: string[] = ["Novo obavještenje", "Detalji o obavještenju"];

  notification: Notification;
  newNotification: Notification = new Notification();

  @ViewChild('profilePhoto', { static: true }) fileInput: ElementRef;
  uploader: FileUploader;
  notifPhoto: any;

  loaded: boolean = false;
  errMsg: string;
  photoErrMsg: string;
  placeholderPhoto: string = 'https://cns.utexas.edu/components/com_easyblog/themes/wireframe/images/placeholder-image.png';
  notificationId: number;
  editMode: boolean = false;
  savedMsg: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private notifService: NotificationService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.notifPhoto = this.placeholderPhoto;

    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.editMode = true;
        this.notificationId = Number.parseInt(params.get("id"));
        this.notifService.getNotification(this.notificationId).subscribe(data => {
          this.notification = <Notification>data;
          this.currentValues();
        },
        error => {
          this.loaded=true;
          this.errMsg=error.error.message;
        }
        );
      }
      else {
        this.editMode = false;
      }
    });

    this.notificationForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(80), Validators.minLength(3)]],
      date: ['', [Validators.required, Validators.pattern("^[0-3]?\\d-[0,1]?\\d-\\d{4}$")]],
      location: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['', [Validators.required, Validators.maxLength(250)]]
    });
    const headers = [{ name: 'Accept', value: 'application/json' }];
    this.uploader = new FileUploader({
      url: '/api/uploadImage', autoUpload: false, headers: headers,
      allowedMimeType: ['image/jpeg', 'image/png'], maxFileSize: 1048000
    });
    this.uploader.onAfterAddingFile = (item) => {
      this.uploader.clearQueue();
      this.uploader.queue.push(item);
      this.notifPhoto = this.preview(item);
      this.photoErrMsg = ""
    }
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);

  }

  preview(fileItem): SafeUrl {
    fileItem.withCredentials = false;
    return this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
  }

  currentValues() {
    this.notificationForm.get('title').setValue(this.notification.title);
    this.notificationForm.get('date').setValue(formatDate(this.notification.date, 'dd-MM-yyyy', 'en-US'));
    this.notificationForm.get('description').setValue(this.notification.description);
    this.notificationForm.get('location').setValue(this.notification.location);
    this.notifPhoto = this.notification.photo;
    this.newNotification.photo = this.notification.photo;
    this.uploader.clearQueue();

    // this.editMode = false;
    this.loaded = false;
    this.errMsg = '';
    this.savedMsg = '';
    // this.notificationForm.disable();
  }

  get f() { return this.notificationForm.controls; }

  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
    switch (filter.name) {
      case 'fileSize':
        this.photoErrMsg = `Prevelika slika! (${item.size}>10MB)`;
        break;
      case 'mimeType':
        this.photoErrMsg = `Neispravan tip fajla. Dozvoljeni tipovi: .jpeg, .png`;
        break;
      case 'queueLimit':
        this.photoErrMsg = `Moguće je dodati samo jednu sliku`;
        break;
      default:
        this.photoErrMsg = `Nepoznata greška (opis: ${filter.name})`;
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errMsg = '';
    this.savedMsg = '';

    let d;
    if (this.f.date.valid) {
      let dmy = this.f.date.value.split('-');
      d = new Date(dmy[2], (<number>dmy[1] - 1), dmy[0]);
      if (d.getFullYear() == dmy[2] && d.getMonth() == (<number>dmy[1] - 1) && d.getDate() == dmy[0]) {
        this.newNotification.date = d;
      }
      else {
        this.notificationForm.get('date').setErrors({ 'incorrect': true });
      }
    }
    if (this.notificationForm.invalid) {
      return;
    }

    if (this.editMode) {
      this.updateNotification();
    }
    else {
      this.createNotification();
    }

  }

  createNotification() {
    if (this.uploader.queue.length === 0) {
      this.photoErrMsg = "Dodajte sliku!"
      return;
    }
    else {
      let data = new FormData();
      let fileItem = this.uploader.queue[0]._file;
      console.log(fileItem.name);
      data.append('file', fileItem);
      this.notifService.uploadPhoto(data).subscribe(data => {
        console.log("Photo url: " + data);
        this.newNotification.photo = data.toString();
        this.uploader.clearQueue();

        this.newNotification.title = this.notificationForm.get('title').value;
        this.newNotification.location = this.notificationForm.get('location').value;
        this.newNotification.description = this.notificationForm.get('description').value;
        if (this.newNotification.photo === null || this.newNotification.photo === '') {
          this.newNotification.photo = this.placeholderPhoto;
        }
        console.log(this.newNotification);
        this.notifService.createNotification(this.newNotification).subscribe(data => {
          this.loaded = true;
          console.log(data);
          this.router.navigate(['/']);
        },
          error => {
            this.loaded = true;
            this.errMsg = "Nije moguće dodati obavještenje!";
          });

      },
        error => {
          this.errMsg = "Greška pri dodavanju slike! Postavljena je prethodna slika."
          this.uploader.clearQueue();
        });
    }
  }

  updateNotification() {
    if (this.uploader.queue.length > 0) {
      let data = new FormData();
      let fileItem = this.uploader.queue[0]._file;
      console.log(fileItem.name);
      data.append('file', fileItem);
      this.notifService.uploadPhoto(data).subscribe(data => {
        console.log("Photo url: " + data);
        this.newNotification.photo = data.toString();
        this.uploader.clearQueue();

        this.newNotification.id = this.notification.id;
        this.newNotification.title = this.notificationForm.get('title').value;
        this.newNotification.location = this.notificationForm.get('location').value;
        this.newNotification.description = this.notificationForm.get('description').value;
        if (this.newNotification.photo === null || this.newNotification.photo === '') {
          this.newNotification.photo = this.placeholderPhoto;
        }
        console.log(this.newNotification);
        this.notifService.updateNotification(this.newNotification).subscribe(data => {
          this.loaded = true;
          this.savedMsg = "Promjene su sačuvane!";
          console.log(data);
          this.router.navigate(['/']);
        },
          error => {
            this.loaded = true;
            this.errMsg = "Nije moguće izmjeniti obavještenje!";
          });
      },
        error => {
          this.errMsg = "Greška pri dodavanju slike! Postavljena je prethodna slika."
          this.uploader.clearQueue();
        });
    }

  }

  deleteNotification() {
    if (this.editMode) {
      this.notifService.deleteNotification(this.notification.id).subscribe(data => {
        console.log(data);
        this.router.navigate(['/']);
      }
      );
    }
  }

}
