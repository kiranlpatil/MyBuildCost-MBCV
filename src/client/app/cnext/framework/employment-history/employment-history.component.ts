
import {Component, Input} from '@angular/core';
import { EmployementHistory } from '../model/employment-history';
import {ValueConstant, LocalStorage} from '../../../framework/shared/constants';
import {EmploymentHistoryService} from "./employment-history.service";
import {MessageService} from "../../../framework/shared/message.service";
import {ProfileCreatorService} from "../profile-creator/profile-creator.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {Message} from "../../../framework/shared/message";
import {Candidate} from "../model/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-employment-history',
  templateUrl: 'employment-history.component.html',
  styleUrls: ['employment-history.component.css']
})

export class EmploymentHistoryComponent {
  @Input() candidate:Candidate;

  public monthList:string[]= new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  error_msg: string;
  private tempCompanyName:string='';
  private toYearModel:string;
  private isShowYearMessage:boolean=false;
  private tempDesignation:string='';
  private tempWorkedToMonth:string='';
  private tempWorkedToYear:string='';
  private tempWorkedFromMonth:string='';
  private tempWorkedFromYear:string='';
  private tempRemarks:string='';
  private disbleButton:boolean=false;
  private tempfield: string[];
  private selectedEmploymentHistory = new EmployementHistory();
  private selectedEmploysHistory :EmployementHistory[]=new Array();
  private year: any;
  private currentDate: any;
  private yearList = new Array();


  constructor(private employmentHistroyservice:EmploymentHistoryService,
              private messageService:MessageService,
              private profileCreatorService:ProfileCreatorService) {
    this.tempfield = new Array(1);
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);

  }

  ngOnInit(){
    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){
      this.profileCreatorService.getCandidateDetails()
        .subscribe(
          candidateData => this.OnCandidateDataSuccess(candidateData),
          error => this.onError(error));

    }
  }

  ngOnChanges(changes :any){
    if(this.candidate.employmentHistory.length == 0){
      this.candidate.employmentHistory.push(new EmployementHistory());
    }
  }

  OnCandidateDataSuccess(candidateData:any){}

  onError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
  createYearList(year: any) {
    for (let i = 0; i < ValueConstant.MAX_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }

  }

  comPanyName(companyname:string) {
    this.tempCompanyName=companyname;
    this.selectedEmploymentHistory.companyName=this.tempCompanyName;
    this.postEmploymentHistoy();
  }

  deSignation(designation:string) {
    this.tempDesignation=designation;
    this.selectedEmploymentHistory.designation=this.tempDesignation;
    this.postEmploymentHistoy();

  }



  reMark(remark:string) {
    this.tempRemarks=remark;
    this.selectedEmploymentHistory.remarks=this.tempRemarks;
    this.postEmploymentHistoy();

  }

  selectedworkfromMonthModel(newval: any) {
    this.isShowYearMessage=false;
    this.tempWorkedFromMonth=newval;
    this.selectedEmploymentHistory.from.month=this.tempWorkedFromMonth;
    this.postEmploymentHistoy();

  }

  selectedworkfromYearModel(newval: any) {
    this.isShowYearMessage=false;
    this.tempWorkedFromYear=newval;
    this.selectedEmploymentHistory.from.year=this.tempWorkedFromYear;
    this.postEmploymentHistoy();

  }

  selectedworktoMonthModel(newval: any) {
    this.isShowYearMessage=false;
    this.tempWorkedToMonth=newval;
    this.selectedEmploymentHistory.to.month=this.tempWorkedToMonth;
    this.postEmploymentHistoy();


  }

  selectedworktoYearModel(newval: any) {
    this.isShowYearMessage=false;
       this.tempWorkedToYear=newval;
       this.selectedEmploymentHistory.to.year=this.tempWorkedToYear;
        this.postEmploymentHistoy();

  }
  addAnother() {
    /*if(this.tempCompanyName==='' || this.tempDesignation==='' ||
      this.tempWorkedToMonth==='' || this.tempWorkedToYear==='' ||
      this.tempWorkedFromMonth===''||this.tempWorkedFromYear===''||
      this.tempRemarks==='' ) {
      this.disbleButton=true;
    } else {
      if (this.tempWorkedToYear < this.selectedEmploymentHistory.from.year ||
        (this.selectedEmploymentHistory.from.month === this.selectedEmploymentHistory.to.month
        &&
        (this.tempWorkedToYear === this.selectedEmploymentHistory.from.year)) || (this.tempWorkedToYear === this.selectedEmploymentHistory.from.year &&
        (this.monthList.indexOf(this.tempWorkedToMonth) < this.monthList.indexOf(this.tempWorkedFromMonth) ))) {
        this.isShowYearMessage = true;
        this.toYearModel = '';

      } else {
        this.disbleButton = false;
        this.isShowYearMessage = false;
        let temp = new EmployementHistory();
        temp.companyName = this.tempCompanyName;
        temp.designation = this.tempDesignation;
        temp.remarks = this.tempRemarks;
        temp.from.month = this.tempWorkedFromMonth;
        temp.from.year = this.tempWorkedFromYear;
        temp.to.month = this.tempWorkedToMonth;
        temp.to.year = this.tempWorkedToYear;
        this.selectedEmploysHistory.push(temp);
        console.log(this.selectedEmploysHistory);

        this.tempCompanyName = '';
        this.tempDesignation = '';
        this.tempWorkedToMonth = '';
        this.tempWorkedToYear = '';
        this.tempWorkedFromMonth = '';
        this.tempWorkedFromYear = '';
        this.tempRemarks = '';
        this.tempfield.push('null');
        this.selectedEmploymentHistory = new EmployementHistory()

      }}*/
    this.candidate.employmentHistory.push(new EmployementHistory());
  }
      postEmploymentHistoy()
      {

        /*if (this.selectedEmploymentHistory.companyName !== '' && this.selectedEmploymentHistory.designation !== '' &&
          this.selectedEmploymentHistory.from.month !== '' && this.selectedEmploymentHistory.from.year !== '' &&
          this.selectedEmploymentHistory.to.month !== '' && this.selectedEmploymentHistory.to.year !== '' && this.selectedEmploymentHistory.remarks !== '') {
          this.candidate.employmentHistory.push(this.selectedEmploymentHistory);*/
          this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
            user => {
              console.log(user);
            },
            error => {
              console.log(error);
            });
        /*}*/
      }

    }



