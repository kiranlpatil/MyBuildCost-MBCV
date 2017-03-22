

import {Component} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from "@angular/http";
import {FormGroup, FormBuilder} from "@angular/forms";
import {TestService} from "../test.service";
import {Observable} from "rxjs";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {ProfessionalData} from "../model/professional-data";
import {ProfessionalDataService } from "./professional-data.service"
@Component({
  moduleId: module.id,
  selector: 'cn-professional-data',
  templateUrl: 'professional-data.component.html',
  styleUrls: ['professional-data.component.css']
})

export class ProfessionalDataComponent extends BaseService {
  userForm: FormGroup;
  private selectedProfessionalData=new ProfessionalData();
  private  realocationlist: string[];
  private educationlist: string[];
  private experiencelist:string[];
  private salarylist:string[];
  private  noticeperiodlist:string[];
  private realocationModel:string;
  private  educationModel:string;
  private experienceModel:string;
  private salaryModel:string;
  private  noticeperiodModel:string;



  constructor(private http: Http, private testService: TestService,private professionaldataservice:ProfessionalDataService) {
    super();
  }

  ngOnInit() {

    if (this.realocationlist === undefined) {
      this.http.get("realocation")
        .map((res: Response) => res.json())
        .subscribe(
          data => {
            this.realocationlist = data.realocate;
          },
          err => console.error(err),
          () => console.log()
        );

    }
    this.http.get("education")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.educationlist = data.educated;
        },
        err => console.error(err),
        () => console.log()
      );

    this.http.get("experience")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.experiencelist= data.experiencelist;
        },
        err => console.error(err),
        () => console.log()
      );

    this.http.get("currentsalary")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.salarylist = data.salary;
        },
        err => console.error(err),
        () => console.log()
      );
    this.http.get("noticeperiod")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.noticeperiodlist = data.noticeperiod;
        },
        err => console.error(err),
        () => console.log()
      );

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

