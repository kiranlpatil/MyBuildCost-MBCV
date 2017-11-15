import {
  Component, EventEmitter, OnDestroy, Output, OnInit
} from '@angular/core';
import { QCardsortBy } from '../../model/q-cardview-sortby';
import { Router } from '@angular/router';
import { RecruiterDashboard } from '../../model/recruiter-dashboard';
import { Button, Headings, ImagePath, Label, Messages, Tooltip} from '../../../../shared/constants';
import {RenewJobPostService} from '../../../../user/services/renew-jobpost.service';
import {Message} from '../../../../shared/models/message';
import {MessageService} from '../../../../shared/services/message.service';
import {RecruiterDashboardService} from '../recruiter-dashboard.service';
import {ErrorService} from '../../../../shared/services/error.service';
import {JobPosterModel} from '../../../../user/models/jobPoster';


@Component({
  moduleId: module.id,
  selector: 'cn-job-lister',
  templateUrl: 'job-lister.component.html',
  styleUrls: ['job-lister.component.css'],
 })

export class JobListerComponent implements  OnInit, OnDestroy {
  screenType:string;
  recruiter: RecruiterDashboard = new RecruiterDashboard();
  jobs: JobPosterModel[] = new Array(0);
  @Output() jobPostEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output() jobListCloneSuccessEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output() selectedJobProfileEmitter: EventEmitter<string> = new EventEmitter();
  private selectedJobId:string;
  private selectedJobTitle:string;
  private selectedJobProfile: any;
  private isCloneButtonClicked:boolean;
  private isJobCloseButtonClicked:boolean;
  private toggle: boolean = false;
  private qCardModel: QCardsortBy = new QCardsortBy();
  private showClosedJobs: boolean = false;
  private jobId: string;

  constructor(private _router: Router,
              private renewJobPostService: RenewJobPostService, private messageService: MessageService,
              private recruiterDashboardService: RecruiterDashboardService,
              private errorService:ErrorService
  ) {
    this.qCardModel.name = 'Date';

  }


  getRecruiterData() {
    this.recruiterDashboardService.getJobsByRecruiterIdAndItsCount()
      .subscribe(
        (response: any) => {
          this.jobs = response.data.jobs;
          if(response.data.jobs && response.data.jobs.length > 0 ){
            this.recruiter =  response.data.jobs[0].recruiterId;
          }
          for(let postedJob of this.jobs) {
            let currentDate = Number(new Date());
            let expiringDate = Number(new Date(postedJob.expiringDate));
            let daysRemainingForExpiring = Math.round(Number(new Date(expiringDate - currentDate))/(1000*60*60*24));
            postedJob.daysRemainingForExpiring = daysRemainingForExpiring;
          }
          if(this.jobs !== undefined && this.jobs.length>0) {
            this.screenType='jobList';
          } else {
            this.screenType='welcomescreen';
          }

        },error => this.errorService.onError(error));
  }

  ngOnInit() {
    this.getRecruiterData();
  }


  ngOnDestroy() {
  }

  sortBy() {
    this.toggleFormat();
  }

  raiseCloneEvent(item:any) {
    this.selectedJobId=item._id;
    this.selectedJobTitle=item.jobTitle;
    this.isCloneButtonClicked=!this.isCloneButtonClicked;
  }
  onJobClicked(item: any,isJobSubmit:boolean) {
    if (isJobSubmit) {
      this._router.navigate(['recruiter/job/', item]);
    } else {
      this._router.navigate(['recruiter/jobpost/', item]);
    }
  }

  onJobEdit(item: any,isJobSubmit:boolean) {
    if (isJobSubmit) {
      this.jobPostEventEmitter.emit(item);
    }
  }

  onJobCloned(event:any) {
    //this.jobPostEventEmitter.emit(event);
    this.jobListCloneSuccessEmitter.emit();
    this._router.navigate(['/recruiter/jobpost', event]);
  }
  get format() {
    return this.toggle ? this.qCardModel.name : 'Date';
  }

  toggleFormat() {
    this.toggle = true;
  }

  getMessage() {
    return Messages;
  }

  getHeading() {
    return Headings;
  }

  getLabel() {
    return Label;
  }

  getButtonLabel() {
    return Button;
  }

  getImagePath() {
    return ImagePath;
  }

  renewJobPost(selectedJobProfile: any) {
    this.renewJobPostService.onRenewJob(selectedJobProfile);
    this.selectedJobProfileEmitter.emit(selectedJobProfile);
  }

  closeJobPost(selectedJobProfile: any) {
    this.selectedJobProfile = selectedJobProfile;
    this.selectedJobTitle = selectedJobProfile.jobTitle;
    this.isJobCloseButtonClicked=!this.isJobCloseButtonClicked;
  }

  displayClosedJobs() {
    this.showClosedJobs = !this.showClosedJobs;
  }


  jobSelected(jobId: string) {
    this.jobId = jobId;
    let matchElement: any = document.getElementById('post_job');
    matchElement.click();
  }
  OnCloneSuccessMessage()  {
    let message = new Message();
    message.custom_message=Messages.MSG_MSG_CLONED_SUCCESSFULLY;
    this.messageService.message(message);
    this.getRecruiterData();
  }

  checkJobPostExpiryDate(selectedJobProfile: string) {
    this.renewJobPostService.checkJobPostExpiryDate(selectedJobProfile);
    this.getRecruiterData();
  }

}
