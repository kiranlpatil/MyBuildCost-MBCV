import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ElementRef, ViewChild} from "@angular/core";
import {QCardsortBy} from "../../model/q-cardview-sortby";
import {Router} from "@angular/router";
import {RecruiterHeaderDetails} from "../../model/recuirterheaderdetails";
import {ReferenceService} from "../../model/newClass";
import {RecruiterDashboard} from "../../model/recruiter-dashboard";
import {Button, Headings, ImagePath, Label, Messages, Tooltip} from "../../../../shared/constants";
import {RenewJobPostService} from "../../../../user/services/renew-jobpost.service";
import {Message} from "../../../../shared/models/message";
import {MessageService} from "../../../../shared/services/message.service";


@Component({
  moduleId: module.id,
  selector: 'cn-job-lister',
  templateUrl: 'job-lister.component.html',
  styleUrls: ['job-lister.component.css'],
 })

export class JobListerComponent implements  OnDestroy {
  @Input() jobListInput: any[] = new Array(0);
  @Input() headerInfoForJob: RecruiterHeaderDetails;
  @Input() screenType:string;
  @Input() recruiter: RecruiterDashboard;
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
  private showClosedJobs: boolean = true;

  constructor(private _router: Router, public refrence: ReferenceService,
              private renewJobPostService: RenewJobPostService, private messageService: MessageService) {
    this.qCardModel.name = 'Date';

  }



  ngOnDestroy() {
    this.refrence.data = this.headerInfoForJob;
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
      this._router.navigate(['jobdashboard/', item]);
    } else {
      this.jobPostEventEmitter.emit(item);
    }
  }

  onJobEdit(item: any,isJobSubmit:boolean) {
    if (isJobSubmit) {
      this.jobPostEventEmitter.emit(item);
    }
  }

  onJobCloned(event:any) {
    this.jobPostEventEmitter.emit(event);
    this.jobListCloneSuccessEmitter.emit();
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
}
