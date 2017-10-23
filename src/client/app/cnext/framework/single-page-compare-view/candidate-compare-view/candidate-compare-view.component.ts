import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings, LocalStorage } from '../../../../shared/constants';
import { LocalStorageService } from '../../../../shared/services/localstorage.service';
import { CandidateCompareService } from './candidate-compare-view.service';
import { RecruiterDashboardService } from '../../recruiter-dashboard/recruiter-dashboard.service';
import {ErrorService} from "../../../../shared/services/error.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-compare-view',
  templateUrl: 'candidate-compare-view.component.html',
  styleUrls: ['candidate-compare-view.component.css']
})

export class CandidateCompareViewComponent implements OnInit, OnChanges {
  @Input() jobId: string;
  private candidateId: string;
  private recruiterId: string;
  /*private candidate:Candidate = new Candidate();*/
  recruiter: any;
  data: any;

  constructor(private _router: Router,
              private errorService:ErrorService,
              private candidateCompareService: CandidateCompareService,
              private recruiterDashboardService: RecruiterDashboardService) {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: any) {
    if (changes.jobId != undefined && changes.jobId.currentValue != undefined) {
      this.jobId = changes.jobId.currentValue;
      this.candidateId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
      /*this.recruiterId = LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID);*/
      this.recruiterId = this.jobId;
      this.getCompareDetail(this.candidateId, this.recruiterId);
      this.recruiterDashboardService.getPostedJobDetails(this.jobId)
        .subscribe(
          data => {
            this.OnRecruiterDataSuccess(data.data.industry);
          },
          error => this.errorService.onError(error));
    }
  }


  OnRecruiterDataSuccess(data: any) {
    this.recruiter = data;
  }

  getCompareDetail(candidateId: string, recruiterId: string) {
    this.candidateCompareService.getCompareDetail(candidateId, recruiterId)
      .subscribe(
        data => this.OnCompareSuccess(data),
        error => this.errorService.onError(error));
  }

  OnCompareSuccess(data: any) {
    this.data = data.data;
  }

  getImagePath(imagePath: string) {
    if (imagePath != undefined) {
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }
    return null;
  }


}
