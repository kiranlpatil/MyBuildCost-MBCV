import {Component, Input, EventEmitter, Output} from "@angular/core";
import {JobQcard} from "../../model/JobQcard";
import {LocalStorage} from "../../../../framework/shared/constants";
import {LocalStorageService} from "../../../../framework/shared/localstorage.service";
import {CandiadteDashboardService} from "../candidate-dashboard.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-q-card',
  templateUrl: 'candidate-q-card.component.html',
  styleUrls: ['candidate-q-card.component.css'],
})
export class CandiadteQCardComponent {
  @Input() job:JobQcard;
  @Input() type:string;
  @Output() onAction = new EventEmitter();
  private showModalStyle:boolean = false;
  private jobId:string;

  constructor(private candidateDashboardService:CandiadteDashboardService) {
  }

  viewJob(jobId:string) {
    
    if (jobId != undefined) {
      LocalStorageService.setLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID, jobId);
      this.jobId = jobId;
    }
    this.showModalStyle = !this.showModalStyle;
  }

  blockJob(newVal:any) { //TODO prjakta 
    this.showModalStyle = !this.showModalStyle;
    this.candidateDashboardService.blockJob().subscribe(
      data => {
        console.log(data);
        this.onAction.emit('block');
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
        console.log(data);
        this.onAction.emit('apply');
      },
      error => (console.log(error)));//TODO remove on error
  }

  closeJob(){
    this.showModalStyle = !this.showModalStyle;
  }

}
