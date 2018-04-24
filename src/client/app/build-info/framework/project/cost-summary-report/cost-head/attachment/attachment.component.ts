import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  AppSettings, LoaderService, Message, MessageService, SessionStorage,
  SessionStorageService
} from '../../../../../../shared/index';
import { CostSummaryService } from '../../cost-summary.service';
import { Button, FileAttachment, Messages, ValueConstant } from '../../../../../../shared/constants';
import { AttachmentDetailsModel } from '../../../../model/attachment-details';

@Component({
  moduleId: module.id,
  selector: 'bi-attachment',
  templateUrl: 'attachment.component.html',
  styleUrls: ['attachment.component.css']
})

export class AttachmentComponent implements OnInit {
  @Input() costHeadId: number;
  @Input() categoryId: number;
  @Input() baseUrl: any;
  @Input() workItem: any;

  @Output() showAttachmentView = new EventEmitter();
  @ViewChild('myInput')
  myInputVar : any;
  workItemId :number;
  private filesToUpload: Array<File>;
  private fileExtension: string;
  private message = new Message();
  private fileName: string;
  private path: any;
  private fileNamesList: Array<AttachmentDetailsModel>;
  private enableUploadOption: boolean = false;
  private validFileExtension = FileAttachment.EXTENSIONS_FOR_FILE;

  constructor( private costSummaryService: CostSummaryService, private messageService : MessageService,
               private loaderService : LoaderService) { }

  onFileSelect(fileInput: any) {
    this.filesToUpload = fileInput.target.files;
    this.fileExtension = this.filesToUpload[0].name.substring(this.filesToUpload[0].name.lastIndexOf('.') + 1).toLowerCase();

       if (this.validFileExtension.indexOf(this.fileExtension) >= 0) {
          this.message.custom_message = Messages.MSG_ERROR_VALIDATION_OF_FILE_EXTENSION;
          this.messageService.message(this.message);
          } else {
              if (this.filesToUpload[0].size <= ValueConstant.FILE_SIZE) {
                  this.fileName = this.filesToUpload[0].name;
                  this.enableUploadOption = true;
                 } else {
                  this.message.custom_message = Messages.MSG_ERROR_VALIDATION_OF_FILE_SIZE;
                  this.messageService.message(this.message);
              }
          }
    }

  ngOnInit() {
     this.workItemId = this.workItem.rateAnalysisId;
     this.path = AppSettings.IP + AppSettings.PUBLIC + AppSettings.ATTACHMENT_FILES;
     this.getPresentFilesForWorkItem();
  }

  getPresentFilesForWorkItem() {
    this.costSummaryService.getPresentFilesForWorkItem(this.baseUrl,this.costHeadId,this.categoryId,this.workItemId).subscribe(
      fileNamesList => this.onGetPresentFilesForWorkItemSuccess(fileNamesList),
      error => this.onGetPresentFilesForWorkItemFailure(error)
    );
}
  onGetPresentFilesForWorkItemSuccess(fileNamesList : any) {
  this.fileNamesList = fileNamesList.response.data;
  }
  onGetPresentFilesForWorkItemFailure(error: any) {
    console.log(error);
  }
   validFile() {
     let attchmentFiles = this.workItem.attachmentDetails;
     for(let index in attchmentFiles) {
           if(attchmentFiles[index].fileName === this.fileName) {
             return false;
           }
      }
     return true;
   }
  addAttachment() {
    if (this.enableUploadOption) {
      if(this.validFile()) {
        this.loaderService.start();
        this.costSummaryService.addAttachment(this.baseUrl, this.costHeadId, this.categoryId, this.workItemId, this.filesToUpload).then(
          success => this.onAddAttachmentSuccess(success),
          error => this.onAddAttachmentFailure(error)
        );
      } else {
        this.myInputVar.nativeElement.value = '';
        this.message.isError = false;
        this.message.custom_message = Messages.MSG_ERROR_VALIDATION_OF_FILE_ALREADY_EXITS;
        this.messageService.message(this.message);
      }
    } else {
      this.myInputVar.nativeElement.value = '';
      this.message.isError = false;
      this.message.custom_message = Messages.MSG_ERROR_VALIDATION_OF_FILE_SELECTION;
      this.messageService.message(this.message);
    }
  }

  onAddAttachmentSuccess(success: any) {
    this.loaderService.stop();
    this.message.isError = false;
    this.message.custom_message = Messages.MSG_ERROR_VALIDATION_OF_FILE_UPLOADED_SUCCESSFUL;
    this.messageService.message(this.message);
    this.myInputVar.nativeElement.value = '';
    this.getPresentFilesForWorkItem();
  }
  onAddAttachmentFailure(error: any) {
    console.log(error);
  }

  deleteAttachment(assignedFileName: any) {
    this.loaderService.start();
    this.costSummaryService.deleteAttachment(this.baseUrl, this.costHeadId,this.categoryId,this.workItemId, assignedFileName).subscribe(
      success => this.onDeleteAttachmentSuccess(success,assignedFileName),
      error => this.onDeleteAttachmentFailure(error)
    );
  }
  onDeleteAttachmentSuccess(success: any, assignedFileName:any) {
    for(let fileIndex in this.fileNamesList) {
      if(this.fileNamesList[fileIndex].assignedFileName === assignedFileName) {
        this.fileNamesList.splice(parseInt(fileIndex),1);
        break;
      }
    }
    this.loaderService.stop();
    this.message.isError = false;
    this.message.custom_message = Messages.MSG_ERROR_VALIDATION_OF_FILE_DELETED_SUCCESSFUL;
    this.messageService.message(this.message);
  }
  onDeleteAttachmentFailure(error: any) {
    console.log(error);
  }
  closeAttachmentView() {
    this.myInputVar.nativeElement.value = '';
   this.showAttachmentView.emit();
  }
  getButton() {
    return Button;
  }
}
