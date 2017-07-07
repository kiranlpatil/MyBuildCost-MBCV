import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import { JobCompareService } from './job-compare-view.service';
import {Capability} from '../../model/capability';
import {Candidate} from '../../model/candidate';
import {CandidateDetail} from '../../../../framework/registration/candidate/candidate';
import {CandidateProfileService} from '../../candidate-profile/candidate-profile.service';
import {RecruiterDashboardService} from '../../recruiter-dashboard/recruiter-dashboard.service';
import {Recruiter} from '../../../../framework/registration/recruiter/recruiter';
import {AppSettings} from "../../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-job-compare-view',
  templateUrl: 'job-compare-view.component.html',
  styleUrls: ['job-compare-view.component.css']
})

export class JobCompareViewComponent implements OnChanges {
  @Input() candiadteId: string;
  @Input() jobId: string;
  capabilities: Capability[];
  candidate : Candidate= new Candidate();
  candidateDetails : CandidateDetail = new CandidateDetail();
  @Input() typeOfView : string ='compact';
  @Output() close : EventEmitter<boolean> = new EventEmitter();
  private recruiterId: string;
  private data: any;
  private recruiter : Recruiter;
  private secondaryCapabilities: string[] = new Array(0);
  constructor(private jobCompareService: JobCompareService,
              private profileCreatorService : CandidateProfileService,
              private recruiterDashboardService: RecruiterDashboardService) {
  }

  ngOnChanges(changes: any) {
    if (changes.candiadteId != undefined && changes.candiadteId.currentValue != undefined) {
      this.candiadteId = changes.candiadteId.currentValue;
    }
    if (changes.jobId != undefined && changes.jobId.currentValue != undefined) {
      this.recruiterId = changes.jobId.currentValue;
    }
    if (this.candiadteId != undefined && this.recruiterId != undefined && this.typeOfView ) {
      this.getCompareDetail(this.candiadteId, this.recruiterId);
      this.candiadteId = changes.candiadteId.currentValue;
      switch (this.typeOfView) {
        case 'spa_candidate' :
          this.getCandidateProfile(this.candiadteId)
          break;
        case 'spa_job' :
          this.recruiterDashboardService.getPostedJobDetails(this.jobId)
            .subscribe(
              data => {
                this.OnRecruiterDataSuccess(data.data.industry);
              });
          break;
      }
    }
  }

  OnRecruiterDataSuccess(data: any) {
    this.recruiter = data;
  }

  getCandidateProfile(candidateId: string) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidateId)
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData));
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData.data;
    this.candidateDetails = candidateData.metadata;
    this.getSecondaryData();
  }

  getSecondaryData() {
    for (let role of this.candidate.industry.roles) {
      for (let capability of role.capabilities) {
        if (capability.isSecondary) {
          this.secondaryCapabilities.push(capability.name);
        }
      }
    }
  }

  getCompareDetail(candidateId: string, recruiterId: string) {
    this.jobCompareService.getCompareDetail(candidateId, recruiterId)
      .subscribe(
        data => this.OnCompareSuccess(data),
        error => console.log(error));
  }

  OnCompareSuccess(data: any) {
    this.data = data.data;
    this.capabilities= this.jobCompareService.getStandardMatrix(this.data.match_map);
  }

  getImagePath(imagePath: string) {
    if (imagePath !== undefined) {
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }
    return null;
  }
  closeThis() {
    this.close.emit(true);
  }

}
