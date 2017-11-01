import {Component, Input, ViewChild, ElementRef} from '@angular/core';
import * as html2canvas from 'html2canvas';
import {Message} from '../../../shared/models/message';
import {Messages, UsageActions, LocalStorage, ImagePath, Button} from '../../../shared/constants';
import {MessageService} from '../../../shared/services/message.service';
import {UsageTrackingService} from '../usage-tracking.service';
import {LocalStorageService} from '../../../shared/services/localstorage.service';
import {ErrorService} from '../../../shared/services/error.service';
//import * as jsPDF from 'jspdf';

@Component({
  moduleId: module.id,
  selector: 'cn-print-screen',
  templateUrl: 'print-screen.component.html',
  styleUrls: ['print-screen.component.css']
})

export class PrintScreenComponent {
  @ViewChild('fileToDownload') fileToDownload:ElementRef;
  @Input() screenIdForPrint:string;
  @Input() fileName:string;
  @Input() candidateId:string;
  @Input() jobId:string;
  @Input() typeOfView:string;
  isShowSuggestionToasterMsg:boolean = false;
  msgCandidateIfNotInCartForPrint:string = Messages.MSG_ABOUT_SCREEN_PRINT_IF_NOT_IN_CART;
  
  constructor(private errorService:ErrorService, private messageService: MessageService,
              private usageTrackingService:UsageTrackingService) {

  }

  createFile(_value:string) {
    if(this.typeOfView == 'spa_candidate' || this.screenIdForPrint === 'printProfileComparison') {
      window.scrollTo(0, 0);
      html2canvas(document.getElementById(this.screenIdForPrint))
        .then((canvas:any) => {
          let dataURL = canvas.toDataURL('image/jpeg');
          if (_value === 'img') {
            this.fileToDownload.nativeElement.href = dataURL;
            this.fileToDownload.nativeElement.download = this.fileName;
            this.fileToDownload.nativeElement.click();
            if (this.screenIdForPrint === 'printProfileComparison') {
              this.trackUsage(UsageActions.PRINT_COMPARISON_VIEW_BY_RECRUITER, undefined, undefined);
            } else {
              this.trackUsage(UsageActions.PRINT_OVERLAY_VIEW_BY_RECRUITER, this.candidateId, this.jobId);
            }
          } else {
            //doc.setFontSize(40);
            //doc.text(35, 25, "Octonyan loves jsPDF");
            /*let doc = new jsPDF("p", "mm", "a4");
             doc.addImage(dataURL, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
             doc.save('two-by-four.pdf')*/
          }
        })
        .catch((err:any) => {
          let message = new Message();
          message.custom_message = err.message;//Messages.MSG_ON_FILE_CREATION_FAILED;
          message.isError = true;
          this.messageService.message(message);
        });
    } else {
      this.isShowSuggestionToasterMsg = true;
    }
  }
  trackUsage(action:number,candidateId:string,jobId:string) {
      let recruiterId =  LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
      this.usageTrackingService.addUsesTrackingData(action,recruiterId, jobId, candidateId).subscribe(
        data  => {
          console.log(''+data);
        }, error => this.errorService.onError(error));
   }

  getImagePath() {
    return ImagePath;
  }

  closeMessage() {
    this.isShowSuggestionToasterMsg = false;
  }

  getButton() {
    return Button;
  }
}
