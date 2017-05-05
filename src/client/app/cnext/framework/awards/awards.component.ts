import {Component, Input, EventEmitter, Output} from "@angular/core";
import {Award} from "../model/award";
import {AwardService} from "../award-service";
import {ValueConstant, LocalStorage} from "../../../framework/shared/constants";
import {CandidateAwardService} from "./awards.service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {MessageService} from "../../../framework/shared/message.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {Message} from "../../../framework/shared/message";
import {Candidate, Section} from "../model/candidate";



@Component({
  moduleId: module.id,
  selector: 'cn-awards',
  templateUrl: 'awards.component.html',
  styleUrls: ['awards.component.css']
})

export class AwardsComponent {
  @Input() candidate:Candidate;
  @Input() highlightedSection:Section;
  @Output() onComplete = new EventEmitter();

  public monthList = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  private tempfield:string[];
  private year:any;
  private currentDate:any;
  private yearList = new Array();
  private disableAddAnother:boolean = true;
  private sendPostCall:boolean = false;
  private isShowError:boolean = false;
  private isHiddenAwrard:boolean = false;
  private hideDiv:boolean[] = new Array();


  constructor(private awardService:AwardService,
              private messageService:MessageService,
              private profileCreatorService:CandidateProfileService) {
    this.tempfield = new Array(1);
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);
  }

  createYearList(year:number) {
    for (let i = 0; i < ValueConstant.MAX_ACADEMIC_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }
  }

  changeValue() {
    this.awardService.change(true);
  }

  ngOnChanges(changes:any) {
    if (this.candidate.awards.length === 0) {
      this.candidate.awards.push(new Award());
    }
    else{
      this.isHiddenAwrard=true;
    }
  }


  addAnother() {


    for (let item of this.candidate.awards) {
      if (item.name === "" || item.issuedBy === "" || item.year === "") {
        this.disableAddAnother = false;
        this.isShowError = true;

      }
    }
    if (this.disableAddAnother === true) {

      this.candidate.awards.push(new Award());
    }
    this.disableAddAnother = true;

  }

  postAwardDetails() {
    this.isShowError = false;
    for (let item of this.candidate.awards) {
      if (item.name !== "" || item.issuedBy !== "" || item.year !== "") {
        this.isHiddenAwrard=true;
      }
    }
    for (let item of this.candidate.awards) {
      if (item.name === "" || item.issuedBy === "" || item.year === "") {
        this.sendPostCall = false;

      }
    }
    if (this.sendPostCall === true) {
      this.postData();
    }
    this.sendPostCall = true;


  }

  deleteItem(i:number) {
    this.hideDiv[i] = true;
    this.candidate.awards.splice(i, 1);
    this.postData();
    this.hideDiv[i]=false;
  }

  postData(){
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      });
  }

  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = "AboutMySelf";
  }
}
