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

  workItemId :number;
  private filesToUpload: Array<File>;
  private fileExtension: string;
  private message = new Message();
  private fileName: string;
  private assignedFileName: any;
  private path: any;
  private fileNamesList: Array<AttachmentDetailsModel>;
  private attachmentFiles: Array<AttachmentDetailsModel>;
  private enableUploadOption: boolean = false;
  private excludedFileExtension = FileAttachment.EXTENSIONS_FOR_FILE;

  constructor( private costSummaryService: CostSummaryService, private messageService : MessageService,
               private loaderService : LoaderService) { }

  onFileSelect(fileInput: any) {
    this.filesToUpload = fileInput.target.files;
    this.fileExtension = this.filesToUpload[0].name.substring(this.filesToUpload[0].name.lastIndexOf('.') + 1).toLowerCase();

       if (this.excludedFileExtension.indexOf(this.fileExtension) >= 0) {
          this.message.custom_message = Messages.MSG_ERROR_VALIDATION_OF_FILE_EXTENSION;
          this.messageService.message(this.message);
          } else {
              if (this.filesToUpload[0].size <= ValueConstant.FILE_SIZE) {
                  this.fileName = this.filesToUpload[0].name;
                  this.enableUploadOption = true;
                  this.addAttachment();
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
     this.attachmentFiles =  this.fileNamesList;
     for(let index in  this.attachmentFiles) {
           if( this.attachmentFiles[index].fileName === this.fileName) {
             return false;
           }
      }
     return true;
   }
  addAttachment() {
    if (this.validFile()) {
        this.loaderService.start();
        this.costSummaryService.addAttachment(this.baseUrl, this.costHeadId, this.categoryId, this.workItemId, this.filesToUpload).then(
          success => this.onAddAttachmentSuccess(success),
          error => this.onAddAttachmentFailure(error)
        );
    } else {
        this.enableUploadOption = false;
        this.message.custom_message = Messages.MSG_ERROR_VALIDATION_OF_FILE_ALREADY_EXITS;
        this.messageService.message(this.message);
    }
  }

  onAddAttachmentSuccess(success: any) {
    this.loaderService.stop();
    this.message.isError = false;
    this.message.custom_message = Messages.MSG_ERROR_VALIDATION_OF_FILE_UPLOADED_SUCCESSFUL;
    this.messageService.message(this.message);
    this.enableUploadOption = false;
    this.getPresentFilesForWorkItem();
  }

  onAddAttachmentFailure(error: any) {
    console.log(error);
  }

  setNameOfAttachment(assignedFileName: any) {
    this.assignedFileName = assignedFileName;
  }
  removeAttachment() {
    this.loaderService.start();
    this.costSummaryService.removeAttachment(this.baseUrl, this.costHeadId,this.categoryId,this.workItemId,
      this.assignedFileName).subscribe(
      success => this.onRemoveAttachmentSuccess(success,this.assignedFileName),
      error => this.onRemoveAttachmentFailure(error)
    );
  }

  onRemoveAttachmentSuccess(success: any, assignedFileName:any) {
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
  onRemoveAttachmentFailure(error: any) {
    console.log(error);
  }

  closeAttachmentView() {
   this.showAttachmentView.emit();
  }
  getButton() {
    return Button;
  }
}
