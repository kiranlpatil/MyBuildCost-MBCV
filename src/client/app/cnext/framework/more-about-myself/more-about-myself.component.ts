import {Component, OnInit, Input} from '@angular/core';
import {AboutCandidateService} from "./more-about-myself.service";
import {MessageService} from "../../../framework/shared/message.service";
import {ProfileCreatorService} from "../profile-creator/profile-creator.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage} from "../../../framework/shared/constants";
import {Message} from "../../../framework/shared/message";
import {Candidate} from "../model/candidate";
import {DisableAboutMyselfGlyphiconService} from "../disableAboutMyself.service";
import {isUndefined} from "util";
import {TestService} from "../test.service";

@Component({
  moduleId: module.id,
  selector: 'cn-more-about-myself',
  templateUrl: 'more-about-myself.component.html',
  styleUrls: ['more-about-myself.component.css']
})

export class MoreAboutMyselfComponent implements OnInit {
  @Input() candidate:Candidate;
  private  maxLength :number=250;
  private  reSize: string[];
  private aboutMyself:string;
  private spaceSplitedString:string[];
  private dotSplitedString:string[];
  private commaSplitedString:string[];
  private wordsTillNow:number;
  private remainingWords:number;
  private maxword:number;
  constructor(private aboutMyselfservice:AboutCandidateService,private messageService:MessageService,
              private disableAboutMyselfGlyphiconService:DisableAboutMyselfGlyphiconService,
              private profileCreatorService:ProfileCreatorService,private testService:TestService,) {
    this.reSize = new Array(1);
  }
  ngOnInit() {
/*
    this.remainingWords=this.maxLength-this.candidate.aboutMyself.length;
*/
     /* if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){
        this.profileCreatorService.getCandidateDetails()
          .subscribe(
            candidateData => this.OnCandidateDataSuccess(candidateData),
            error => this.onError(error));

      }*/

  }
  ngOnChanges(changes :any){
    if(this.candidate.aboutMyself !== undefined) {
      this.spaceSplitedString = this.candidate.aboutMyself.split(' ');
      this.dotSplitedString = this.candidate.aboutMyself.split('.');
      this.commaSplitedString = this.candidate.aboutMyself.split(',');
      this.wordsTillNow = this.spaceSplitedString.length + this.dotSplitedString.length + this.commaSplitedString.length;
      this.remainingWords = this.maxLength - (this.wordsTillNow - 3);
    }
    if(this.candidate.aboutMyself == undefined){
      this.candidate.aboutMyself = '';
    }
  }

  OnCandidateDataSuccess(candidateData:any){}
  onError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
  addAboutMyself() {

    this.disableAboutMyselfGlyphiconService.change(true);
   this.spaceSplitedString= this.candidate.aboutMyself.split(' ');
    this.dotSplitedString= this.candidate.aboutMyself.split('.');
    this.commaSplitedString= this.candidate.aboutMyself.split(',');
    this.wordsTillNow=this.spaceSplitedString.length+this.dotSplitedString.length+this.commaSplitedString.length;
    this.remainingWords=this.maxLength-(this.wordsTillNow-3);
    if (this.wordsTillNow-3>=this.maxLength) {
      this. maxword=this.candidate.aboutMyself.length;
    }
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      },
      error => {
        console.log(error);
      });

    if(this.candidate.aboutMyself !==" "   && this.candidate.employmentHistory !==undefined &&
       this.candidate.certifications !== undefined && this.candidate.academics !== undefined
        && this.candidate.awards !== undefined)
    {
      this.testService.change(true);
    }


  }

}
