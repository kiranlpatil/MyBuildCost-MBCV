import {Component, EventEmitter, Input, Output, ViewChild, OnInit} from "@angular/core";
import {JobQcard} from "../../model/JobQcard";
import {AppSettings, LocalStorage, ValueConstant} from "../../../../shared/constants";
import {LocalStorageService} from "../../../../shared/services/localstorage.service";
import {CandidateDashboardService} from "../candidate-dashboard.service";
import {Message} from "../../../../shared/models/message";
import {MessageService} from "../../../../shared/services/message.service";
import {JobCompareViewComponent} from "../../single-page-compare-view/job-compare-view/job-compare-view.component";
import {CandidateList} from "../../model/candidate-list";
import {ErrorService} from "../../error.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-q-card',
  templateUrl: 'candidate-q-card.component.html',
  styleUrls: ['candidate-q-card.component.css'],
})
export class CandidateQCardComponent implements OnInit {
  @Input() job: JobQcard;
  @Input() type: string;
  @Output() onAction = new EventEmitter();
  @Output() searchViewAction = new EventEmitter();
  @Output() jobComapare = new EventEmitter();
  @Input() progress_bar_color : string='#0d75fa';
  @Input() candidateIDFromSearchView:string;
  candidateId: string;
  private showModalStyle: boolean = false;
  private hideButton: boolean = true;

  inCartListedStatusForSearchView:boolean = false;
  inRejectListedStatusForSearchView:boolean = false;
  inShortListedStatusForSearchView:boolean = false;
  inAppliedListedStatusForSearchView:boolean = false;

  private jobId: string;
  @ViewChild(JobCompareViewComponent) checkForGuidedTour: JobCompareViewComponent;

  constructor(private candidateDashboardService: CandidateDashboardService,private messageService: MessageService,private errorService:ErrorService) {
  }

  ngOnChanges(changes: any) {
    if (changes.type !== undefined) {
      this.type = changes.type.currentValue;
      if (this.type === 'none') {
        this.hideButton = false;
      }
    }
    if (this.type == 'searchView') {
      if (this.candidateIDFromSearchView !== undefined) {
        this.findOutQCardStatus();
      }
    }
  }

  ngOnInit() {

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
    if (this.type == 'searchView') {
      var data = {
        'jobId': jobId,
        'inCartStatus': this.inCartListedStatusForSearchView,
        'inRejectedStatus': this.inRejectListedStatusForSearchView
      };
      this.jobComapare.emit(data);
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
      error => (this.errorService.onError(error)));//TODO remove on error
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

  actionForSearchView(value:string, jobId:string) {
    var data = {'name': value, 'jobId': jobId};
    this.searchViewAction.emit(data);
  }

  findOutQCardStatus() {
    this.candidateIDFromSearchView;
    this.job.candidate_list;
    this.calculateQCardStatus(this.candidateIDFromSearchView, this.job.candidate_list);
  }

  calculateQCardStatus(candidateIDFromSearchView:string, candidate_list:CandidateList[]) {

    for (let item of candidate_list) {
      switch (item.name) {
        case ValueConstant.APPLIED_CANDIDATE:
          if (item.ids.indexOf(candidateIDFromSearchView) !== -1) {
            this.inAppliedListedStatusForSearchView = true;
          }
          /*else {
           this.inAppliedListedStatusForSearchView = false;
           }*/
          break;

        case ValueConstant.CART_LISTED_CANDIDATE:


          if (item.ids.indexOf(candidateIDFromSearchView) !== -1) {
            this.inCartListedStatusForSearchView = true;
          }
          /*else {
           this.inCartListedStatusForSearchView = false;
           }*/

          break;

        case ValueConstant.REJECTED_LISTED_CANDIDATE:

          if (item.ids.indexOf(candidateIDFromSearchView) !== -1) {
            this.inRejectListedStatusForSearchView = true;
          }
          /*else {
           this.inRejectListedStatusForSearchView = false;
           }*/
          break;

        case ValueConstant.SHORT_LISTED_CANDIDATE:

          if (item.ids.indexOf(candidateIDFromSearchView) !== -1) {
            this.inShortListedStatusForSearchView = true;
          }
          /*else {
           this.inShortListedStatusForSearchView = false;
           }*/
          break;
      }
    }
    if (this.inCartListedStatusForSearchView && this.inRejectListedStatusForSearchView == false) {
      this.progress_bar_color = "#7264b5";
    }
    if (this.inRejectListedStatusForSearchView) {
      this.progress_bar_color = "#ff5722";
    }
    if (this.inShortListedStatusForSearchView) {
      //this.progress_bar_color="'#7264b5'"
    }
    if (this.inAppliedListedStatusForSearchView && this.inCartListedStatusForSearchView == false) {
      this.progress_bar_color = "#f7c72d";
    }
  }

  setClasses() {
    let classes = {
      inCartClass: (this.inCartListedStatusForSearchView && this.inRejectListedStatusForSearchView == false),
      inRejectClass: this.inRejectListedStatusForSearchView,
      inAppliedClass: (this.inAppliedListedStatusForSearchView)
    };
    return classes;
  }
}
