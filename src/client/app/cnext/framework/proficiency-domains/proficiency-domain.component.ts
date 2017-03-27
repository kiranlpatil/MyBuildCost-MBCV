import {Component, OnInit, Input} from '@angular/core';
import {VALUE_CONSTANT} from "../../../framework/shared/constants";
import {ProficiencyService} from "../proficience.service";
import {MessageService} from "../../../framework/shared/message.service";
import {Message} from "../../../framework/shared/message";
import {proficiencyDomainService} from "./proficiency-domain.service";

@Component({
  moduleId: module.id,
  selector: 'cn-proficiencydoamin',
  templateUrl: 'proficiency-domain.component.html',
  styleUrls: ['proficiency-domain.component.css']
})

export class proficiencyDomainComponent implements OnInit {
  @Input('type') type : string;
  private selectedproficiencies=new Array();
  private storedProficiency = new Array();
  private showAlert: boolean=false;
  private proficiencyType: boolean=false;
  private domainType: boolean=false;
  private placeHolderName:string;
  private isProficiencyShow:boolean =false;

  constructor(private proficiencyService: ProficiencyService,
              private proficiencydoaminService: proficiencyDomainService,
              private messageService:MessageService) {

    proficiencyService.showTest$.subscribe(
      data=>{
        this.isProficiencyShow=data;
      }
    );
  }

  ngOnInit() {
    if(this.type==="profeciency"){
      this.proficiencyType=true;
      this.placeHolderName="proficiency"

      this.proficiencydoaminService.getProficiency()
        .subscribe(
          data => this.onProficiencySuccess(data),
          error => this.onError(error));


  }
    if(this.type==="domain"){
      this.domainType=true;
      this.placeHolderName="domain"

      this.proficiencydoaminService.getDomain()
        .subscribe(
          data => this.onGetDomainSuccess(data),
          error => this.onError(error));
    }

  }

  onProficiencySuccess(data:any){
    for(let proficiency of data.proficiency){
      this.selectedproficiencies.push(proficiency);
    }

  }
  onGetDomainSuccess(data:any){
    for(let domain of data.domains){
      this.selectedproficiencies.push(domain);
    }

  }

  onError(error:any){
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  selectedProficiencyModel(newVal: any) {
    if(this.storedProficiency.length < VALUE_CONSTANT.MAX_PROFECIENCES) {
      this.showAlert=false;
      this.storedProficiency.push(newVal);
      this.deleteSelectedProfeciency(newVal);
      console.log(this.storedProficiency);
    }
    else{
      this.showAlert=true;
    }
    document.getElementById(this.type).value = "";
  }

  deleteItem(newVal: any) {
    this.showAlert=false;
    for (let i = 0; i < this.storedProficiency.length; i++) {
      if (this.storedProficiency[i] === newVal.currentTarget.innerText.trim()) {
        if (i > -1) {
          this.storedProficiency.splice(i, 1);
        }
      }
    }
    this.selectedproficiencies.push(newVal.currentTarget.innerText);
  }

  deleteSelectedProfeciency(newVal: any) {
    for (let i = 0; i < this.selectedproficiencies.length; i++) {
      if (this.selectedproficiencies[i] === newVal) {
        if (i > -1) {
          this.selectedproficiencies.splice(i, 1);
        }
      }
    }
  }
}
