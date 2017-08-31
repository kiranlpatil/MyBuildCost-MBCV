import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {JobQcard} from "../../model/JobQcard";
import {AppSettings, LocalStorage} from "../../../../framework/shared/constants";
import {LocalStorageService} from "../../../../framework/shared/localstorage.service";
import {CandidateDashboardService} from "../candidate-dashboard.service";
import {Message} from "../../../../framework/shared/message";
import {MessageService} from "../../../../framework/shared/message.service";
import {JobCompareViewComponent} from "../../single-page-compare-view/job-compare-view/job-compare-view.component";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-q-card',
  templateUrl: 'candidate-q-card.component.html',
  styleUrls: ['candidate-q-card.component.css'],
})
export class CandidateQCardComponent {
  @Input() job: JobQcard;
  @Input() type: string;
  @Output() onAction = new EventEmitter();
  @Input() progress_bar_color : string='#0d75fa';
  candidateId: string;
  private showModalStyle: boolean = false;
  private hideButton: boolean = true;

  private jobId: string;
  @ViewChild(JobCompareViewComponent) checkForGuidedTour: JobCompareViewComponent;

  constructor(private candidateDashboardService: CandidateDashboardService,private messageService: MessageService) {
  }

  ngOnChanges(changes: any) {
    if (changes.type !== undefined) {
      this.type = changes.type.currentValue;
      if (this.type === 'none') {
        this.hideButton = false;
      }
    }
  }

  viewJob(jobId: string) {
    if (this.type !== 'searchView') {
      if (jobId !== undefined) {
        this.checkForGuidedTour.isGuidedTourImgRequire();
        LocalStorageService.setLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID, jobId);
        this.jobId = jobId;
        this.candidateId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
      }
      this.showModalStyle = !this.showModalStyle;
    }
  }


  blockJob(newVal: any) { //TODO prjakta
    this.showModalStyle = !this.showModalStyle;
    this.candidateDashboardService.blockJob().subscribe(
      data => {
        this.onAction.emit('block');
        this.displayMsg('REJECT');
      });
  }

  getStyleModal() {//TODO remove this from all model
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  applyJob() {
    this.showModalStyle = !this.showModalStyle;
    this.candidateDashboardService.applyJob().subscribe(
      data => {
        this.onAction.emit('apply');
        this.displayMsg('APPLY');
      },
      error => (console.log(error)));//TODO remove on error
  }

  displayMsg(condition: string) {
    var message = new Message();
    message.isError = false;
    if(condition==='APPLY') {message.custom_message = 'You have applied for a job as '+this.job.jobTitle+' at '+this.job.company_name;}
    if(condition==='REJECT') {message.custom_message = 'Your matching job as '+this.job.jobTitle+' at '+this.job.company_name+' is marked as Not interested.';}
    if(condition==='DELETE') {message.custom_message = 'Job marked as not interested is moved back to matching section. ';}
    this.messageService.message(message);
  }

  closeJob(isHide : boolean) {
    this.showModalStyle = !this.showModalStyle;
  }

  deleteItem(jobId: string) {
    this.showModalStyle=true;
    LocalStorageService.setLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID, jobId);
    this.candidateDashboardService.removeBlockJob().subscribe(
      data => {
        this.onAction.emit('delete');
        this.displayMsg('DELETE');
      });
  }

  getImagePath(imagePath: string) {
    if (imagePath !== undefined) {
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }
    return null;
  }

}
