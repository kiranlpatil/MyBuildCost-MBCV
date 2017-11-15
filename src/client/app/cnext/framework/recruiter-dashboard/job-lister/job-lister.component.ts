import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ElementRef, ViewChild,
  OnInit
} from "@angular/core";
import {QCardsortBy} from "../../model/q-cardview-sortby";
import {Router} from "@angular/router";
import {RecruiterHeaderDetails} from "../../model/recuirterheaderdetails";
import {RecruiterDashboard} from "../../model/recruiter-dashboard";
import {Button, Headings, ImagePath, Label, Messages, Tooltip} from "../../../../shared/constants";
import {RenewJobPostService} from "../../../../user/services/renew-jobpost.service";
import {Message} from "../../../../shared/models/message";
import {MessageService} from "../../../../shared/services/message.service";
import {RecruiterDashboardService} from "../recruiter-dashboard.service";
import {ErrorService} from "../../../../shared/services/error.service";


@Component({
  moduleId: module.id,
  selector: 'cn-job-lister',
  templateUrl: 'job-lister.component.html',
  styleUrls: ['job-lister.component.css'],
 })

export class JobListerComponent implements  OnInit, OnDestroy {
  jobListInput: any[] = new Array(0);
  headerInfoForJob: RecruiterHeaderDetails;
  screenType:string;
  recruiter: RecruiterDashboard;
//  @Input() showClosedJobs: boolean;
  @Output() jobPostEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output() jobListCloneSuccessEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output() selectedJobProfileEmitter: EventEmitter<string> = new EventEmitter();
  //public jobList:JobPosterModel[] = new Array(0);
  //public jobListToCheck:JobPosterModel[] = new Array(0);
  private selectedJobId:string;
  private selectedJobTitle:string;
  private selectedJobProfile: any;
  private isCloneButtonClicked:boolean;
  private isJobCloseButtonClicked:boolean;
  private toggle: boolean = false;
  private closedJobs: any[] = new Array(0);
  private isJobeditted: boolean = false;
  private isJobPostClosed: boolean;
  private initialMessageToDisplay: string= Tooltip.RECRUITER_ENTRY_MESSAGE;
  private dashboardWelcomeMessage: string= Tooltip.RECRUITER_DASHBOARD_MESSAGE;
  private qCardModel: QCardsortBy = new QCardsortBy();
  private showClosedJobs: boolean = false;

  recruiterDashboard: RecruiterDashboard = new RecruiterDashboard();
  private recruiterHeaderDetails: RecruiterHeaderDetails = new RecruiterHeaderDetails();
  private jobId: string;

  constructor(private _router: Router,
              private renewJobPostService: RenewJobPostService, private messageService: MessageService,
              private recruiterDashboardService: RecruiterDashboardService,
              private errorService:ErrorService
  ) {
    this.qCardModel.name = 'Date';

  }


  getRecruiterData() {
    this.recruiterDashboardService.getJobList()
      .subscribe(
        (data: any) => {
          this.recruiterDashboard = <RecruiterDashboard>data.data[0];
          this.recruiterHeaderDetails = <RecruiterHeaderDetails>data.jobCountModel;
          for(let postedJob of this.recruiterDashboard.postedJobs) {
            let currentDate = Number(new Date());
            let expiringDate = Number(new Date(postedJob.expiringDate));
            let daysRemainingForExpiring = Math.round(Number(new Date(expiringDate - currentDate))/(1000*60*60*24));
            postedJob.daysRemainingForExpiring = daysRemainingForExpiring;
          }
          if(this.recruiterDashboard !== undefined && this.recruiterDashboard.postedJobs !== undefined && this.recruiterDashboard.postedJobs.length>0) {
            this.screenType='jobList';
          } else {
            this.screenType='welcomescreen';
          }

          this.headerInfoForJob = this.recruiterHeaderDetails;
          this.jobListInput = this.recruiterDashboard.postedJobs;
          this.recruiter = this.recruiterDashboard;
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
