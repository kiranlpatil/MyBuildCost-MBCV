

import {Component} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from "@angular/http";
import {FormGroup, FormBuilder} from "@angular/forms";
import {TestService} from "../test.service";
import {Observable} from "rxjs";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {ProfessionalData} from "../model/professional-data";
import {ProfessionalDataService } from "./professional-data.service"
import {Message} from "../../../framework/shared/message";
import {MessageService} from "../../../framework/shared/message.service";
@Component({
  moduleId: module.id,
  selector: 'cn-professional-data',
  templateUrl: 'professional-data.component.html',
  styleUrls: ['professional-data.component.css']
})

export class ProfessionalDataComponent extends BaseService {
  userForm: FormGroup;
  private selectedProfessionalData=new ProfessionalData();
  private  realocationlist=new Array();
  private educationlist=new Array();
  private experiencelist=new Array();
  private salarylist=new Array();
  private  noticeperiodlist=new Array();
  private realocationModel:string;
  private  educationModel:string;
  private experienceModel:string;
  private salaryModel:string;
  private  noticeperiodModel:string;



  constructor(private http: Http, private testService: TestService,private professionaldataservice:ProfessionalDataService, private messageService:MessageService) {
    super();
  }

  ngOnInit() {

      this.professionaldataservice.getRealocationList()
        .subscribe(
          data=> { this.onRealocationListSuccess(data)},
          error =>{ this.onError(error);});

    this.professionaldataservice.getEducationList()
      .subscribe(
        data=> { this.onEducationListSuccess(data);},
        error =>{ this.onError(error);});


    this.professionaldataservice.getExperienceList()
      .subscribe(
        data=> { this.onExperienceListSuccess(data);},
        error =>{ this.onError(error);});

    this.professionaldataservice.getCurrentSalaryList()
      .subscribe(
        data=> { this.onCurrentSalaryListSuccess(data);},
        error =>{ this.onError(error);});


    this.professionaldataservice.getNoticePeriodList()
      .subscribe(
        data=> { this.onGetNoticePeriodListSuccess(data);},
        error =>{ this.onError(error);});


  }
  onGetNoticePeriodListSuccess(data:any){
    for(let k of data.noticeperiod){debugger
      this.noticeperiodlist.push(k);
    }

  }

  onCurrentSalaryListSuccess(data:any){
    for(let k of data.salary ){debugger
      this.salarylist.push(k);
    }

  }

  onExperienceListSuccess(data:any){
    for(let k of data.experience){debugger
      this.experiencelist.push(k);
    }

  }

  onEducationListSuccess(data:any){
    for(let k of data.educated){debugger
      this.educationlist.push(k);
    }

  }
  onRealocationListSuccess(data:any){debugger
    for(let k of data.realocate ){debugger
      this.realocationlist.push(k);
    }
  }
  onError(error:any){debugger
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }


  selectrealocationModel(newVal: any) {
    this.realocationModel = newVal;
    this.selectedProfessionalData.realocatetype=this.realocationModel;

  }

  selecteducationModel(newVal: any) {
    this.educationModel = newVal;
    this.selectedProfessionalData. educationlevel=this.educationModel;

  }

  selectexperienceModel(newVal: any) {
    this.experienceModel = newVal;
    this.selectedProfessionalData.experiencelevel=this.experienceModel;

  }

  selectsalaryModel(newVal: any) {
    this.salaryModel = newVal;

    this.selectedProfessionalData.Csalary=this.salaryModel;
  }

  selectenoticeperiodModel(newVal: any) {
    this.noticeperiodModel = newVal;
    this.selectedProfessionalData.notice=this.noticeperiodModel;

    this.professionaldataservice.addProfessionalData(this.selectedProfessionalData)
      .subscribe(
        user => console.log(user),
        error => console.log(error));

  }




}

