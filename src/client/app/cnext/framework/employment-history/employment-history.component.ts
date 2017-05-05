import {Component, EventEmitter, Input, Output} from "@angular/core";
import {EmployementHistory} from "../model/employment-history";
import {ValueConstant} from "../../../framework/shared/constants";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../model/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-employment-history',
  templateUrl: 'employment-history.component.html',
  styleUrls: ['employment-history.component.css']
})

export class EmploymentHistoryComponent {
  @Input() candidate:Candidate;
  @Input() highlightedSection:Section;
  @Output() onComplete = new EventEmitter();


  public monthList:string[] = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  error_msg:string;
  private tempfield:string[];
  private year:any;
  private currentDate:any;
  private yearList = new Array();
  private checkFields:boolean = true;
  private chkEmployeeHistory:boolean = false;
  private sendPostCall:boolean = false;
  private isShowError:boolean = false;
  private hideDiv:boolean[] = new Array();
  private isButtonShow:boolean = false;
  private isShowDateErrorMessage:boolean = false;


  constructor(private profileCreatorService:CandidateProfileService) {
    this.tempfield = new Array(1);
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year); //TODO use the service for date list

  }

  ngOnChanges(changes:any) {
    if (this.candidate.employmentHistory.length == 0) {
      this.candidate.employmentHistory.push(new EmployementHistory());
    }
    else {
      this.isButtonShow = true;
    }
    if (changes.candidate.currentValue != undefined) {debugger
      this.candidate = changes.candidate.currentValue;
      this.isShowError = false;
    }
  }

  createYearList(year:any) {
    for (let i = 0; i < ValueConstant.MAX_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }

  }

  addAnother() {

    for (let item of this.candidate.employmentHistory) {
      var indexOfFromMonth = this.monthList.indexOf(item.from.month);
      var indexToMonth = this.monthList.indexOf(item.to.month);

      if ((item.companyName === "" || item.designation === "" || item.from.month === "" ||
        item.from.year === "" || item.to.month === "" || item.to.year === "") ||

        (indexOfFromMonth === indexToMonth && item.from.year >= item.to.year) || (item.from.year > item.to.year) ||

        (indexOfFromMonth >= indexToMonth && item.from.year === item.to.year)) {
        this.checkFields = false;
        this.isShowError = true;
      }
    }
    if (this.checkFields === true) {
      this.candidate.employmentHistory.push(new EmployementHistory());
    }
    this.checkFields = true;
  }

  postEmploymentHistoy() {
    this.isShowError = false;
    for (let item of this.candidate.employmentHistory) {
      if ((item.companyName !== "" || item.designation !== "" || item.from.month !== "" ||
        item.from.year !== "" || item.to.month !== "" || item.to.year !== "")) {
        this.isButtonShow = true;
      }
    }


    for (let item of this.candidate.employmentHistory) {
      var indexOfFromMonth = this.monthList.indexOf(item.from.month);
      var indexToMonth = this.monthList.indexOf(item.to.month);
      if (((indexOfFromMonth === indexToMonth && item.from.year >= item.to.year) || (item.from.year > item.to.year) ||

        (indexOfFromMonth >= indexToMonth && item.from.year === item.to.year)) &&

        (item.companyName !== "" && item.designation !== "" && item.from.month !== "" &&
        item.from.year !== "" && item.to.month !== "" && item.to.year !== "")) {
        this.isShowDateErrorMessage = true;
      }
      else {
        this.isShowDateErrorMessage = false;
      }
    }

    for (let item of this.candidate.employmentHistory) {
      var indexOfFromMonth = this.monthList.indexOf(item.from.month);
      var indexToMonth = this.monthList.indexOf(item.to.month);
      if ((item.companyName === "" || item.designation === "" || item.from.month === "" ||
        item.from.year === "" || item.to.month === "" || item.to.year === "") ||

        (indexOfFromMonth === indexToMonth && item.from.year >= item.to.year) || (item.from.year > item.to.year) ||

        (indexOfFromMonth >= indexToMonth && item.from.year === item.to.year)) {
        this.sendPostCall = false;
      }
    }


    if (this.sendPostCall === true) {
      this.postData();
    }
    this.sendPostCall = true;
  }

  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = "AcademicDetails";
  }

  deleteItem(i:number) {
    this.hideDiv[i] = true;
    this.candidate.employmentHistory.splice(i, 1);
    this.postData();
    this.hideDiv[i]=false;
  }

  postData() {
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      });
  }

  setCurrentDate(newval:EmployementHistory){
    newval.to.month=this.monthList[this.currentDate.getUTCMonth()-1];
      newval.to.year=this.year;
    console.log(newval);
  }

  hideEmployeeHistory(){
    this.chkEmployeeHistory=true;
   this.onNext();
  }
}



