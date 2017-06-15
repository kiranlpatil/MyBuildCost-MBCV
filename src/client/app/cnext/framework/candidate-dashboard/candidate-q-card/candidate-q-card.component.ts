import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobQcard } from '../../model/JobQcard';
import { LocalStorage } from '../../../../framework/shared/constants';
import { LocalStorageService } from '../../../../framework/shared/localstorage.service';
import { CandidateDashboardService } from '../candidate-dashboard.service';


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
  private showModalStyle: boolean = false;
  private hideButton: boolean = true;

  private jobId: string;

  constructor(private candidateDashboardService: CandidateDashboardService) {
  }

  ngOnChanges(changes: any) {
    if (changes.type != undefined) {
      this.type = changes.type.currentValue;
      if (this.type == 'none') {
        this.hideButton = false;
      }
    }
  }

  viewJob(jobId: string) {

    if (jobId != undefined) {
      LocalStorageService.setLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID, jobId);
      this.jobId = jobId;
    }
    this.showModalStyle = !this.showModalStyle;
  }


  blockJob(newVal: any) { //TODO prjakta
    this.showModalStyle = !this.showModalStyle;
    this.candidateDashboardService.blockJob().subscribe(
      data => {
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
        this.onAction.emit('apply');
      },
      error => (console.log(error)));//TODO remove on error
  }

  closeJob() {
    this.showModalStyle = !this.showModalStyle;
  }

  deleteItem(jobId: string) {

    LocalStorageService.setLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID, jobId);
    this.candidateDashboardService.removeBlockJob().subscribe(
      data => {
        this.onAction.emit('delete');
      });
  }

}
