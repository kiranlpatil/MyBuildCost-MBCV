
import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { BaseService } from '../../../framework/shared/httpservices/base.service';
import { ProfessionalData } from '../model/professional-data';
import { ProfessionalDataService } from './professional-data.service';
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { ProfessionalService } from '../professional-service';
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../model/candidate";
import { FormBuilder, FormGroup,Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'cn-professional-data',
  templateUrl: 'professional-data.component.html',
  styleUrls: ['professional-data.component.css']
})

export class ProfessionalDataComponent extends BaseService implements OnInit {
  @Input() candidate:Candidate;
  @Input() highlightedSection :Section;
  @Output() onComplete = new EventEmitter();

 /* private professionalDetailForm : FormGroup;*/
  private realocationlist=new Array();
  private educationlist=new Array();
  private experiencelist=new Array();
  private salarylist=new Array();
  private noticeperiodlist=new Array();
  private disableButton:boolean=true;
  /*private professionalDetails:ProfessionalData=new ProfessionalData();*/

  constructor(private professionaldataservice:ProfessionalDataService,
              private messageService:MessageService,
              private professionalService : ProfessionalService,
              private formBuilder: FormBuilder,
              private profileCreatorService:CandidateProfileService) {
    super();
    /*this.professionalDetailForm=this.formBuilder.group({
      'education':['', Validators.required],
      'experience':['', Validators.required],
      'currentSalary':['', Validators.required],
      'noticePeriod':['', Validators.required],
      'relocate': ['', Validators.required],
    });*/
  }

  ngOnChanges(changes :any){
        if(this.candidate.professionalDetails===undefined){
          this.candidate.professionalDetails=new ProfessionalData();
        }
    /*if(this.candidate.professionalDetails!==undefined){
      this.professionalDetailForm.education.value=this.candidate.professionalDetails;
    }*/
    if(changes.candidate !=undefined && changes.candidate.professionalDetails !=undefined){
      if(this.candidate.professionalDetails.currentSalary !='' && this.candidate.professionalDetails.education!= '' &&
        this.candidate.professionalDetails.experience != '' && this.candidate.professionalDetails.noticePeriod != '' && this.candidate.professionalDetails.relocate != '' ){
        this.disableButton=false;
      }
    }
  }

  ngOnInit() {

      this.professionaldataservice.getRealocationList()
        .subscribe(
          data => { this.onRealocationListSuccess(data); },
          error => { this.onError(error);});

    this.professionaldataservice.getEducationList()
      .subscribe(
        data=> { this.onEducationListSuccess(data);},
        error => { this.onError(error);});


    this.professionaldataservice.getExperienceList()
      .subscribe(
        data=> { this.onExperienceListSuccess(data);},
        error => { this.onError(error);});

    this.professionaldataservice.getCurrentSalaryList()
      .subscribe(
        data=> { this.onCurrentSalaryListSuccess(data);},
        error => { this.onError(error);});


    this.professionaldataservice.getNoticePeriodList()
      .subscribe(
        data=> { this.onGetNoticePeriodListSuccess(data);},
        error => { this.onError(error);});



  }


  onGetNoticePeriodListSuccess(data:any) {
    for(let k of data.noticeperiod) {
      this.noticeperiodlist.push(k);
    }

  }

  onCurrentSalaryListSuccess(data:any) {
    for(let k of data.salary ) {
      this.salarylist.push(k);
    }

  }

  onExperienceListSuccess(data:any) {
    for(let k of data.experience) {
      this.experiencelist.push(k);
    }

  }

  onEducationListSuccess(data:any) {
    for(let k of data.educated) {
      this.educationlist.push(k);
    }

  }
  onRealocationListSuccess(data:any) {
    for(let k of data.realocate ) {
      this.realocationlist.push(k);
    }
  }
  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  changeValue() {
    this.professionalService.change(true);

  }

  saveProfessionalData() {
    this.professionalService.change(true);
    if(this.candidate.professionalDetails.currentSalary !='' && this.candidate.professionalDetails.education!= '' && 
      this.candidate.professionalDetails.experience != '' && this.candidate.professionalDetails.noticePeriod != '' && this.candidate.professionalDetails.relocate != '' ){
      this.disableButton=false;
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
    this.highlightedSection.name = "EmploymentHistory";
  }
}

