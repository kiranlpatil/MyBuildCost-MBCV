import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Router} from "@angular/router";
import {Industry} from "../model/industry";
import {Candidate, Section} from "../model/candidate";
import {AppSettings} from "../../../framework/shared/constants";
import {DashboardService} from "../../../framework/dashboard/dashboard.service";
import {CandidateDetail} from "../../../framework/registration/candidate/candidate";
import {JobPosterModel} from "../model/jobPoster";
import {JobLocation} from "../model/job-location";
import {JobInformation} from "../model/job-information";
import {JobRequirement} from "../model/job-requirement";

@Component({
  moduleId: module.id,
  selector: 'cn-basic-job-information',
  templateUrl: 'basic-job-information.component.html',
  styleUrls: ['basic-job-information.component.css']
})

export class  BasicJobInformationComponent{
  @Input() jobPosterModel:JobPosterModel = new JobPosterModel();
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();


  constructor() {
  }

  selectJobInformation(jobInformation:JobInformation) {
    this.jobPosterModel.jobTitle = jobInformation.jobTitle;
    this.jobPosterModel.hiringManager = jobInformation.hiringManager;
    this.jobPosterModel.department = jobInformation.department;
  }

  selectJobLocation(jobLocation:JobLocation) {
    this.jobPosterModel.location = jobLocation;
  }

  selectJobRequirement(jobRequirement:JobRequirement) {debugger
    this.jobPosterModel.education = jobRequirement.education;
    this.jobPosterModel.experience = jobRequirement.experience;
    this.jobPosterModel.joiningPeriod = jobRequirement.noticeperiod;
    this.jobPosterModel.salary = jobRequirement.salary;
  }

  selectIndustry(industry:Industry) {
    this.jobPosterModel.industry = industry;
  }
  onNext() {
    this.highlightedSection.name = "Work-Area";
    this.onComplete.emit(this.jobPosterModel);
  }
}


