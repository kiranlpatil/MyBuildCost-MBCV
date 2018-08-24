import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {Message} from '../../../../shared/models/message';
import {AppSettings, Messages} from '../../../../shared/constants';
import {MessageService} from '../../../../shared/services/message.service';
import {ProjectImageService} from './project-image.service';
import {ProjectService} from '../project.service';

@Component({
  moduleId: module.id,
  selector: 'bi-project-image',
  templateUrl: 'project-image.component.html',
  styleUrls: ['project-image.component.css'],
})

export class ProjectImageComponent implements OnChanges {
  @Output() onProjectImageUpload = new EventEmitter();
  @Input() projectModel: any;
  @ViewChild('fileInput')
  fileInputVariable: ElementRef;
  private filesToUpload: Array<File>;
  private image_path: string;
  private isLoading: boolean = false;


  constructor(private messageService: MessageService, private projectImageService: ProjectImageService,
              private projectService: ProjectService,) {
    this.filesToUpload = [];
  }

  ngOnChanges() {
    if (this.projectModel && this.projectModel.projectImage) {
      this.image_path = AppSettings.IP + this.projectModel.projectImage;
    }
  }

  uploadProjectImage(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
    if (this.filesToUpload === undefined || this.filesToUpload[0] === undefined || this.filesToUpload.length === 0) {
      return;
    }
    this.image_path = undefined;
    this.isLoading = true;
    this.image_path = undefined;
    if (this.projectModel) {
      if(this.projectModel._id) {
        var id = this.projectModel._id;
      }else {
        id='newUser';
      }
      if (this.projectModel.projectImage) {
        var imageName = this.projectModel.projectImage.split('/');
        imageName = imageName[imageName.length - 1];
      } else {
        imageName = 'newUser';
      }
    } else {
      imageName = 'newUser';
      id = 'newUser';
    }
    if (this.filesToUpload[0].type === 'image/jpeg' || this.filesToUpload[0].type === 'image/png'
      || this.filesToUpload[0].type === 'image/jpg' || this.filesToUpload[0].type === 'image/gif') {
      if (this.filesToUpload[0].size <= 5242880) {
        this.projectImageService.projectImageUpload(id,imageName,this.filesToUpload).then((result: any) => {
          if (result !== null) {
            this.fileInputVariable.nativeElement.value = '';
            this.uploadProjectImageSuccess(result);
          }
        }, (error: any) => {
          this.uploadOrDeleteProjectImageFail(error);
        });
      } else {
        this.isLoading = false;
        var message = new Message();
        message.isError = true;
        message.error_msg = Messages.MSG_ERROR_IMAGE_SIZE;
        this.messageService.message(message);
      }
    } else {
      this.isLoading = false;
      message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_ERROR_IMAGE_TYPE;
      this.messageService.message(message);
    }
  }

  uploadProjectImageSuccess(result: any) {
    this.onProjectImageUpload.emit(result.tempath);
    this.image_path = AppSettings.IP + result.tempath;
    setTimeout(() => {
      this.isLoading = false;
      if(this.projectModel && this.projectModel._id) {
        var message = new Message();
        message.isError = false;
        message.custom_message = Messages.MSG_IMAGE_UPDATE;
        this.messageService.message(message);
      }
    }, 2000);
  }

  removeProjectImage() {
    if (this.projectModel && this.projectModel._id && this.projectModel.projectImage) {
        var imageName = this.projectModel.projectImage.split('/');
        this.projectService.removeProjectImage(this.projectModel._id,
          imageName[imageName.length - 1], {}).subscribe(
          user => this.onDeleteProjectSuccess(),
          error => this.uploadOrDeleteProjectImageFail(error));
    } else {
      this.image_path = undefined;
      this.onProjectImageUpload.emit(undefined);
    }
  }

  onDeleteProjectSuccess() {
    this.image_path = undefined;
    this.onProjectImageUpload.emit(undefined);
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_IMAGE_DELETE;
    this.messageService.message(message);
  }

  uploadOrDeleteProjectImageFail(error: any) {
    this.isLoading = false;
    var message = new Message();
    message.isError = true;
    message.error_msg = error.err_msg;
    this.messageService.message(message);
  }
}
