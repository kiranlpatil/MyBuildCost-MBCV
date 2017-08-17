import {Component, EventEmitter, Input, OnChanges, Output, OnInit} from '@angular/core';
import { JobCompareService } from './job-compare-view.service';
import {Capability} from '../../model/capability';
import {Candidate} from '../../model/candidate';
import {CandidateDetail} from '../../../../framework/registration/candidate/candidate';
import {CandidateProfileService} from '../../candidate-profile/candidate-profile.service';
import {RecruiterDashboardService} from '../../recruiter-dashboard/recruiter-dashboard.service';
import {Recruiter} from '../../../../framework/registration/recruiter/recruiter';
import {AppSettings, ImagePath, LocalStorage} from "../../../../framework/shared/constants";
import {GuidedTourService} from "../../guided-tour.service";
import {LocalStorageService} from "../../../../framework/shared/localstorage.service";

@Component({
  moduleId: module.id,
  selector: 'cn-job-compare-view',
  templateUrl: 'job-compare-view.component.html',
  styleUrls: ['job-compare-view.component.css']
})

export class JobCompareViewComponent implements OnChanges,OnInit {
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
  private guidedTourImgOverlayScreensStackViewPath:string;
  private guidedTourImgOverlayScreensStackView:string;
  private guidedTourStatus:string[] = new Array(0);
  private isCandidate: boolean = false;
  constructor(private jobCompareService: JobCompareService,
              private profileCreatorService : CandidateProfileService,
              private recruiterDashboardService: RecruiterDashboardService,
              private guidedTourService:GuidedTourService) {
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
      this.getCandidateProfile(this.candiadteId);
      this.recruiterDashboardService.getPostedJobDetails(this.jobId)
        .subscribe(
          data => {
            this.OnRecruiterDataSuccess(data.data.industry);
          });
    }
  }

  ngOnInit() {
    this.guidedTourImgOverlayScreensStackViewPath = ImagePath.BASE_ASSETS_PATH_DESKTOP + ImagePath.CANDIDATE_OERLAY_SCREENS_STACK_VIEW;
    this.guidedTourImgOverlayScreensStackView = ImagePath.CANDIDATE_OERLAY_SCREENS_STACK_VIEW;
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
    this.isGuidedTourImgRequire();
  }

  isGuidedTourImgRequire() {
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
  }

  onGotItGuideTour() {
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_STACK_VIEW,true);
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
