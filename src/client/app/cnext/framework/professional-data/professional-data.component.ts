import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {ProfessionalData} from "../model/professional-data";
import {ProfessionalDataService} from "./professional-data.service";
import {Message} from "../../../framework/shared/message";
import {MessageService} from "../../../framework/shared/message.service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../model/candidate";
import {FormBuilder} from "@angular/forms";

@Component({
  moduleId: module.id,
  selector: 'cn-professional-data',
  templateUrl: 'professional-data.component.html',
  styleUrls: ['professional-data.component.css']
 })

export class ProfessionalDataComponent extends BaseService implements OnInit,OnChanges {
  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  tooltipMessage: string =

    "<ul>" +
    "<li><p>1. Please mention your current salary (CTC).</p></li>" +
    "<li><p>2. Select if you are open to relocate from your current location as per job demand.</p></li>" +
    "<li><p>3. Mention the notice period you have to serve before you can take up new job.</p></li>" +

    "</ul>";
  /* private professionalDetailForm : FormGroup;*/
  showButton: boolean = true;
  private realocationList:any = [];
  private salaryList:any = [];
  private noticePeriodList:any = [];
  private industryExposureList:any = [];
  private isValid: boolean = true;
  /*private professionalDetails:ProfessionalData=new ProfessionalData();*/
  constructor(private professionalDataService: ProfessionalDataService,
              private messageService: MessageService,
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

  ngOnInit() {

    this.professionalDataService.getRealocationList()
      .subscribe(
        data => {
          this.onRealocationListSuccess(data);
        },
        error => {
          this.onError(error);
        });


    this.professionalDataService.getNoticePeriodList()
      .subscribe(
        data => {
          this.onGetNoticePeriodListSuccess(data);
        },
        error => {
          this.onError(error);
        });
    this.professionalDataService.getIndustryExposureList()
      .subscribe(
        data => {
          this.onGetIndustryExposureListSuccess(data);
        },
        error => {
          this.onError(error);
        });
    this.professionalDataService.getCurrentSalaryList()
      .subscribe(
        data => {
          this.onCurrentSalaryListSuccess(data);
        });

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
    console.log(this.candidate);
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      });
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

  }
}

