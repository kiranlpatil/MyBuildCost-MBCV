import { Component, OnInit } from '@angular/core';
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { RoleTypeService } from './role-type.service';
import { TestService } from '../test.service';
import {MyJobPostRoleTypeService} from "../jobpost-roletype.service";
import {Candidate} from "../model/candidate";
import {ProfileCreatorService} from "../profile-creator/profile-creator.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-role-type-list',
  templateUrl: 'role-type.component.html',
  styleUrls: ['role-type.component.css']
})

export class RoleTypetListComponent implements OnInit {

  private showModalStyle: boolean = false;
  private disbleRole: boolean = true;
  private disbleButton: boolean = false;
  private roleTypes:string[]=new Array();
  private role:string;
  private showfield: boolean = false;
  private candidate:Candidate=new Candidate();
  constructor(private roleTypeService: RoleTypeService, private profileCreatorService:ProfileCreatorService, private messageService:MessageService , private testService : TestService,   private jobpostroletype:MyJobPostRoleTypeService) {
  }

  ngOnInit() {
    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){
      this.profileCreatorService.getCandidateDetails()
        .subscribe(
          candidateData => this.OnCandidateDataSuccess(candidateData),
          error => this.onError(error));

    }
    this.roleTypeService.getRoleTypes()
      .subscribe(
        data=> this.onRoleTypesSuccess(data),
        error => this.onError(error));

  }

  OnCandidateDataSuccess(candidateData:any){
    this.candidate=candidateData.data[0];
    if(this.candidate.roleType !== undefined){
      this.showfield=true;
      this.disbleButton=true;
      this.testService.change(true);
    }
  }

  selectOption(option:string) {

    if(option !== undefined)
      this.role=option;
    this.disbleButton=false;

  }
  onRoleTypesSuccess(data:any) {
    for(let proficiency of data.roletypes) {
      this.roleTypes.push(proficiency);
  }}

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }
  disableRoleltype() {
    this.showfield=true;
    this.testService.change(true);
    this.showModalStyle = !this.showModalStyle;
    this.disbleRole = true;
    this.disbleButton = true;
    this.jobpostroletype.change(this.role);
    this.createAndSave();

  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }
  selectIndustryModel(event:string) {
console.log('event');

  }

  isChecked(choice:any):boolean{
      if(this.candidate.roleType === choice){
        //this.showfield=true;
        //this.testService.change(true);
        //this.disbleButton = true;
        return true;
      }
    return false;
  }

  createAndSave() {
    this.roleTypeService.addToProfile(this.role).subscribe(
      user => {
        console.log(user);
      },
      error => {
        console.log(error);
      });
  };
}
