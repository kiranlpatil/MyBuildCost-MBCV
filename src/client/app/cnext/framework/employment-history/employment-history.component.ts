
import {Component,EventEmitter, Input, Output} from '@angular/core';
import { EmployementHistory } from '../model/employment-history';
import {ValueConstant, LocalStorage} from '../../../framework/shared/constants';
import {MessageService} from "../../../framework/shared/message.service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {Message} from "../../../framework/shared/message";
import {Candidate, Section} from "../model/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-employment-history',
  templateUrl: 'employment-history.component.html',
  styleUrls: ['employment-history.component.css']
})

export class EmploymentHistoryComponent {
  @Input() candidate:Candidate;
  @Input() highlightedSection :Section;
  @Output() onComplete = new EventEmitter();


  public monthList:string[]= new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  error_msg: string;
  private tempfield: string[];
  private year: any;
  private currentDate: any;
  private yearList = new Array();
  private disableAddAnother:boolean=true;
  private sendPostCall:boolean=false;
  private isShowError:boolean=false;
  private isShowDateErrorMessage:boolean=false;


  constructor(private messageService:MessageService,
              private profileCreatorService:CandidateProfileService) {
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

  addAnother() {

    for(let item of this.candidate.employmentHistory) {
                  var indexOfFromMonth= this.monthList.indexOf(item.from.month);
                    var indexToMonth=this.monthList.indexOf(item.to.month);

      if ( (item.companyName ==="" || item.designation ==="" || item.from.month ==="" ||
          item.from.year ===""||item.to.month ==="" || item.to.year ==="") ||

        (indexOfFromMonth===indexToMonth && item.from.year >= item.to.year) ||(item.from.year >item.to.year)||

        (indexOfFromMonth >= indexToMonth && item.from.year===item.to.year)) {
        this.disableAddAnother=false;
        this.isShowError=true;



      }
    }
    if(this.disableAddAnother===true)
    {
      this.candidate.employmentHistory.push(new EmployementHistory());
    }
    this.disableAddAnother=true;


  }
  postEmploymentHistoy(){


    this.isShowError=false;
    for(let item of this.candidate.employmentHistory) {
      if ((item.companyName !== "" || item.designation !== "" || item.from.month !== "" ||
        item.from.year !== "" || item.to.month !== "" || item.to.year !== "")) {

      }
    }



    for(let item of this.candidate.employmentHistory) {
      var indexOfFromMonth= this.monthList.indexOf(item.from.month);
      var indexToMonth=this.monthList.indexOf(item.to.month);
      if ( ((indexOfFromMonth === indexToMonth && item.from.year >= item.to.year) || (item.from.year >item.to.year) ||

        (indexOfFromMonth >= indexToMonth && item.from.year === item.to.year)) &&

        (item.companyName !== "" && item.designation !== "" && item.from.month !== "" &&
        item.from.year !== "" && item.to.month !== "" && item.to.year !== "") ) {

        this.isShowDateErrorMessage=true;
      }
      else {
        this.isShowDateErrorMessage=false;
      }
    }



    for(let item of this.candidate.employmentHistory) {
      var indexOfFromMonth= this.monthList.indexOf(item.from.month);
      var indexToMonth=this.monthList.indexOf(item.to.month);
      if ((item.companyName === "" || item.designation === "" || item.from.month === "" ||
        item.from.year === "" || item.to.month === "" || item.to.year === "") ||

        (indexOfFromMonth === indexToMonth && item.from.year >= item.to.year) || (item.from.year >item.to.year) ||

        (indexOfFromMonth >= indexToMonth && item.from.year === item.to.year)) {
        this.sendPostCall = false;

      }
    }


    if(this.sendPostCall===true)
    {
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
          console.log(user);
        },
        error => {
          console.log(error);
        });
    }

    this.sendPostCall=true;


    }

  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = "AcademicDetails";
  }

  }



