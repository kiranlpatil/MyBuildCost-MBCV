import {Component, EventEmitter, Input, OnChanges, Output, OnInit} from "@angular/core";
import {JobCompareService} from "./job-compare-view.service";
import {Capability} from "../../../../user/models/capability";
import {Candidate} from "../../../../user/models/candidate";
import {CandidateDetail} from "../../../../user/models/candidate-details";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {RecruiterDashboardService} from "../../recruiter-dashboard/recruiter-dashboard.service";
import {Recruiter} from "../../../../user/models/recruiter";
import {AppSettings, Headings, ImagePath, Label, LocalStorage, Messages} from "../../../../shared/constants";
import {GuidedTourService} from "../../guided-tour.service";
import {LocalStorageService} from "../../../../shared/services/localstorage.service";
import {ErrorService} from "../../../../shared/services/error.service";
import {JobPosterModel} from "../../../../user/models/jobPoster";

@Component({
  moduleId: module.id,
  selector: 'cn-job-compare-view',
  templateUrl: 'job-compare-view.component.html',
  styleUrls: ['job-compare-view.component.css']
})

export class JobCompareViewComponent implements OnChanges,OnInit {
  @Input() candiadteId: string;
  @Input() jobId: string;
  @Input() jobCompareIdForPrint: string;
  capabilities: Capability[];
  gotItMessage:string= Headings.GOT_IT;
  candidate : Candidate= new Candidate();
  candidateDetails : CandidateDetail = new CandidateDetail();
  private isCandidateHaveExtraKeySkill: boolean=false;
  @Input() typeOfView : string ='compact';
  @Output() close : EventEmitter<boolean> = new EventEmitter();
  private recruiterId: string;
  data: any;
  recruiter : Recruiter;//TODO remove this
  job : JobPosterModel;
  private secondaryCapabilities: string[] = new Array(0);
  private guidedTourImgOverlayScreensStackViewPath:string;
  guidedTourImgOverlayScreensStackView:string;
  guidedTourStatus:string[] = new Array(0);
  isCandidate: boolean = false;
  constructor(private jobCompareService: JobCompareService,
              private errorService: ErrorService,
              private profileCreatorService : CandidateProfileService,
              private recruiterDashboardService: RecruiterDashboardService,
              private guidedTourService:GuidedTourService) {
  }

  ngOnChanges(changes:any) {
    if (changes.candiadteId !== undefined && changes.candiadteId.currentValue !== undefined) {
      this.candiadteId = changes.candiadteId.currentValue;
      this.getCandidateProfile(this.candiadteId);
    }
    if (changes.jobId !== undefined && changes.jobId.currentValue !== undefined) {
      this.recruiterId = changes.jobId.currentValue;
      this.recruiterDashboardService.getPostedJobDetails(this.jobId)
        .subscribe(
          data => {
            this.OnRecruiterDataSuccess(data.result);
          },error => this.errorService.onError(error));
    }
    if (this.candiadteId !== undefined && this.recruiterId !== undefined && this.typeOfView ) {
      this.candiadteId = changes.candiadteId.currentValue;
      this.getCompareDetail(this.candiadteId, this.recruiterId);

      if(!this.isCandidate) {
        this.recruiterDashboardService.getRecruiterDetails()
          .subscribe(
            recruiterData => {
              this.recruiter = recruiterData.data;
            },error => this.errorService.onError(error));
      }
    }
  }

  ngOnInit() {
    this.guidedTourImgOverlayScreensStackViewPath = ImagePath.BASE_ASSETS_PATH_DESKTOP + ImagePath.CANDIDATE_OERLAY_SCREENS_STACK_VIEW;
    this.guidedTourImgOverlayScreensStackView = ImagePath.CANDIDATE_OERLAY_SCREENS_STACK_VIEW;
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }

  isGuidedTourImgRequire() {
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
  }

  onGotItGuideTour() {
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_STACK_VIEW,true);
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
    this.guidedTourService.updateProfileField(this.guidedTourStatus)
      .subscribe(
        (res:any) => {
          LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR, JSON.stringify(res.data.guide_tour));
          this.isGuidedTourImgRequire();
        },
        error => this.errorService.onError(error)
      );
  }

  OnRecruiterDataSuccess(data: any) {
    this.job = data;
    this.recruiter = data.recruiterId;
  }

  getCandidateProfile(candidateId: string) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidateId)
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData),
        error => this.errorService.onError(error));
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
        data => this.OnCompareSuccess(data.data)
        ,error => this.errorService.onError(error));
  }

  OnCompareSuccess(data: any) {
    this.data = data;
    this.isCandidateHaveExtraKeySkill = false;
    for (let proficiency of this.data.proficiencies) {
      if (this.data.proficienciesMatch.indexOf(proficiency) == -1) {
        this.data.proficienciesUnMatch.push(proficiency);
        this.isCandidateHaveExtraKeySkill = true;
      }
    }
    this.capabilities= this.jobCompareService.getStandardMatrix(this.data.match_map);
  }

  getImagePath(imagePath: string) {
    if (imagePath !== undefined) {
      return AppSettings.IP + imagePath.replace('"', '');
    }
    return null;
  }
  closeThis() {
    this.close.emit(true);
  }

  getMessage() {
    return Messages;
  }

  getLabel() {
    return Label;
  }

}
