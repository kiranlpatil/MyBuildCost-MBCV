import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseService } from '../../../framework/shared/httpservices/base.service';
import { ProfessionalData } from '../model/professional-data';
import { ProfessionalDataService } from './professional-data.service';
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { CandidateProfileService } from '../candidate-profile/candidate-profile.service';
import { Candidate, Section } from '../model/candidate';
import { FormBuilder } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'cn-professional-data',
  templateUrl: 'professional-data.component.html',
  styleUrls: ['professional-data.component.css']
 })

export class ProfessionalDataComponent extends BaseService implements OnInit {
  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  /* private professionalDetailForm : FormGroup;*/
  private realocationList = new Array();
  private showButton: boolean = true;
  private educationList = new Array();
  private experienceList = new Array();
  private salaryList = new Array();
  private noticePeriodList = new Array();
  private disableButton: boolean = true;
  /*private professionalDetails:ProfessionalData=new ProfessionalData();*/
  tooltipMessage: string =

    "<ul>" +
    "<li><h5> Ready to Relocate</h5><p>Select if you are open to relocate from your current location as per job demand.</p></li>" +
    "<li><h5> Education </h5><p>Specify your highest degree you attened.</p></li>" +
    "<li><h5> Notice Period </h5><p>Mention your notice period you have to serve before you can take up new job.</p></li>" +
    "<li><h5> Industry Exposure </h5><p>Please mention if you have experience working with local or multinational companies.</p></li>" +
    "<li><h5> Experiance </h5><p>Number of years relevent experience for your selected Industry.</p></li>" +
    "<li><h5> Current Salary </h5><p>Please mention your current salary (CTC).</p></li>" +
    "</ul>";


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
      if (this.candidate.professionalDetails.currentSalary !== '' && this.candidate.professionalDetails.education !== '' &&
        this.candidate.professionalDetails.experience !== '' && this.candidate.professionalDetails.noticePeriod !== '' && this.candidate.professionalDetails.relocate !== '') {
        this.disableButton = false;
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

    this.professionalDataService.getEducationList()
      .subscribe(
        data => {
          this.onEducationListSuccess(data);
        },
        error => {
          this.onError(error);
        });


    this.professionalDataService.getExperienceList()
      .subscribe(
        data => {
          this.onExperienceListSuccess(data);
        },
        error => {
          this.onError(error);
        });

    this.professionalDataService.getCurrentSalaryList()
      .subscribe(
        data => {
          this.onCurrentSalaryListSuccess(data);
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

  onExperienceListSuccess(data: any) {
    for (let k of data.experience) {
      this.experienceList.push(k);
    }

  }

  onEducationListSuccess(data: any) {
    for (let k of data.educated) {
      this.educationList.push(k);
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
    if (this.candidate.professionalDetails.currentSalary !== '' && this.candidate.professionalDetails.education !== '' &&
      this.candidate.professionalDetails.experience !== '' && this.candidate.professionalDetails.noticePeriod !== '' && this.candidate.professionalDetails.relocate !== '') {
      this.disableButton = false;
    }
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      });
  }

  onNext() {
    /*this.professionalDetails=this.professionalDetailForm.value;
     this.candidate.professionalDetails=this.professionalDetails;
     this.saveProfessionalData();*/
    this.onComplete.emit();
    this.highlightedSection.name = "none";
    this.highlightedSection.isDisable = false;

  }

  onSave() {
    this.onComplete.emit();
    this.highlightedSection.name = "none";
    this.highlightedSection.isDisable = false;

  }
}

