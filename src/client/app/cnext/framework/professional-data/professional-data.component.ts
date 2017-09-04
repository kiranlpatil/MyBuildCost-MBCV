import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {ProfessionalData} from "../model/professional-data";
import {ProfessionalDataService} from "./professional-data.service";
import {Message} from "../../../framework/shared/message";
import {MessageService} from "../../../framework/shared/message.service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../model/candidate";
import {FormBuilder} from "@angular/forms";
import {Messages, Tooltip} from "../../../framework/shared/constants";
import {ProfessionalDetailsService} from "../professional-detail-service";
import {ErrorService} from "../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-professional-data',
  templateUrl: 'professional-data.component.html',
  styleUrls: ['professional-data.component.css']
 })

export class ProfessionalDataComponent extends BaseService implements OnChanges {
  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  tooltipMessage: string =

    '<ul>' +
    '<li><p>1. '+ Tooltip.PROFESSIONAL_DATA_TOOLTIP_1+'</p></li>' +
    '<li><p>2. '+ Tooltip.PROFESSIONAL_DATA_TOOLTIP_2+'</p></li>' +
    '<li><p>3. '+ Tooltip.PROFESSIONAL_DATA_TOOLTIP_3+'</p></li>' +

    '</ul>';
  /* private professionalDetailForm : FormGroup;*/
  showButton: boolean = true;
  private realocationList:any = [];
  private salaryList:any = [];
  private noticePeriodList:any = [];
  private industryExposureList:any = [];
  private isValid: boolean = true;
  private requiedSalaryValidationMessage = Messages.MSG_ERROR_VALIDATION_CURRENTSALARY_REQUIRED;
  private requiedRelocateValidationMessage = Messages.MSG_ERROR_VALIDATION_RELOCATE_REQUIRED;
  private requiedIndustryExposureValidationMessage = Messages.MSG_ERROR_VALIDATION_INDUSTRY_EXPOSURE_REQUIRED;
  private requiedNoticePeriodValidationMessage = Messages.MSG_ERROR_VALIDATION_NOTICEPERIOD_REQUIRED;
  /*private professionalDetails:ProfessionalData=new ProfessionalData();*/
  constructor(private professionalDataService: ProfessionalDataService,
              private professionalDetailService: ProfessionalDetailsService,
              private messageService: MessageService,
              private errorService: ErrorService,
              private formBuilder: FormBuilder,
              private profileCreatorService: CandidateProfileService) {
    super();
    /*this.professionalDetailForm=this.formBuilder.group({
     'education':['', Validators.required],
     'experience':['', Validators.required],
     'currentSalary':['', Validators.required],
     'noticePeriod':['', Validators.required],
     'relocate': ['', Validators.required],
     });*/

    this.professionalDetailService.makeCall$.subscribe(
      data => {
        if (data && this.noticePeriodList.length === 0 && this.industryExposureList.length === 0 && this.realocationList.length === 0 && this.salaryList.length === 0) {
          this.getDetailedList();
        }
      }
    );
  }

  ngOnChanges(changes: any) {
    if (this.candidate.professionalDetails === undefined) {
      this.candidate.professionalDetails = new ProfessionalData();
    }
    /*if(this.candidate.professionalDetails!==undefined){
     this.professionalDetailForm.education.value=this.candidate.professionalDetails;
     }*/
    if (changes.candidate != undefined && changes.candidate.professionalDetails != undefined) {
      if (this.candidate.professionalDetails.currentSalary !== '' && this.candidate.professionalDetails.noticePeriod !==
        '' && this.candidate.professionalDetails.relocate !== '' && this.candidate.professionalDetails.industryExposure !== '') {
        this.isValid = true;
      }
    }
  }



  onGetNoticePeriodListSuccess(data: any) {
    for (let k of data.noticeperiod) {
      this.noticePeriodList.push(k);
    }

  }
  onCurrentSalaryListSuccess(data: any) {
    for (let k of data.salary) {
      this.salaryList.push(k);
    }
  }

  onGetIndustryExposureListSuccess(data: any) {
    for (let k of data.industryexposure) {
      this.industryExposureList.push(k);
    }
  }

  onRealocationListSuccess(data: any) {
    for (let k of data.realocate) {
      this.realocationList.push(k);
    }
  }

  onError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  changeValue() {


  }

  saveProfessionalData() {
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      },error => this.errorService.onError(error));
  }

  onNext() {
    if (this.candidate.professionalDetails.currentSalary == '' ||
      this.candidate.professionalDetails.industryExposure == '' || this.candidate.professionalDetails.noticePeriod == ''
      || this.candidate.professionalDetails.relocate == '') {
      this.isValid = false;
      return;
    }
    this.onComplete.emit();
    this.highlightedSection.name = "AboutMySelf";
    this.highlightedSection.isDisable = false;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;

  }

  onSave() {
    if (this.candidate.professionalDetails.currentSalary == '' ||
      this.candidate.professionalDetails.industryExposure == '' || this.candidate.professionalDetails.noticePeriod == ''
      || this.candidate.professionalDetails.relocate == '') {
      this.isValid = false;
      return;
    }
    this.onComplete.emit();
    this.highlightedSection.name = "none";
    this.highlightedSection.isDisable = false;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;

  }

  getDetailedList() {
    this.professionalDataService.getRealocationList()
      .subscribe(
        data => {
          this.onRealocationListSuccess(data);
        },error => this.errorService.onError(error));
    this.professionalDataService.getNoticePeriodList()
      .subscribe(
        data => {
          this.onGetNoticePeriodListSuccess(data);
        },error => this.errorService.onError(error));
    this.professionalDataService.getIndustryExposureList()
      .subscribe(
        data => {
          this.onGetIndustryExposureListSuccess(data);
        },error => this.errorService.onError(error));
    this.professionalDataService.getCurrentSalaryList()
      .subscribe(
        data => {
          this.onCurrentSalaryListSuccess(data);
        },error => this.errorService.onError(error));
  }

  onPrevious() {
    this.highlightedSection.name = 'IndustryExposure';
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onEdit() {
    this.highlightedSection.name = 'Professional-Details';
    this.highlightedSection.isDisable = true;
    this.isValid = true;
    this.showButton = false;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }
}

