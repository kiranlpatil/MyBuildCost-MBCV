import {Component, OnInit, Input} from '@angular/core';
import {ValueConstant, LocalStorage} from '../../../framework/shared/constants';
import {ProficiencyService} from '../proficience.service';
import {MessageService} from '../../../framework/shared/message.service';
import {Message} from '../../../framework/shared/message';
import {ProficiencyDomainService} from './proficiency-domain.service';
import {JobPostProficiencyService} from '../jobPostProficiency.service';
import {ProfileCreatorService} from "../profile-creator/profile-creator.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {MyIndustryService} from "../industry-service";

@Component({
  moduleId: module.id,
  selector: 'cn-proficiency-doamin',
  templateUrl: 'proficiency-domain.component.html',
  styleUrls: ['proficiency-domain.component.css']
})

export class ProficiencyDomainComponent implements OnInit {
  @Input('type') type: string;
  private selectedproficiencies = new Array();
  private storedProficiency: string[] = new Array();
  private masterDataproficiency: string[] = new Array();
  private showAlert: boolean = false;
  private proficiencyType: boolean = false;
  private placeHolderName: string;
  private isProficiencyShow: boolean = false;
  private isShow: boolean =true;
  private addProficiency:string="";
  private addOther:string="addId";
  private selectedIndustry: string;

  constructor(private proficiencyService: ProficiencyService,
              private proficiencydoaminService: ProficiencyDomainService,
              private messageService: MessageService,
              private myindustryService : MyIndustryService,
              private JobPostProficiency: JobPostProficiencyService,
              private profileCreatorService:ProfileCreatorService) {
    myindustryService.showTest$.subscribe(
      data=>{
         this.selectedIndustry=data;
        this.proficiencydoaminService.getProficiency( this.selectedIndustry)
          .subscribe(
            data => this.onProficiencySuccess(data),
            error => this.onError(error));
      }
    );

    proficiencyService.showTest$.subscribe(
      data => {
        this.isProficiencyShow = data;
      }
    );
  }

  ngOnInit() {

    this.proficiencyType = true;
    this.placeHolderName = 'proficiency';
      if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==="true"){
        this.profileCreatorService.getCandidateDetails()
          .subscribe(
            candidateData => this.OnCandidateDataSuccess(candidateData),
            error => this.onError(error));


    }

  }


  OnCandidateDataSuccess(candidateData:any){}

  onProficiencySuccess(data: any) {

    for (let proficiency of data.data.names) {
      this.selectedproficiencies.push(proficiency);
      this.masterDataproficiency.push(proficiency);
    }

  }


  onError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  selectedProficiencyModel(newVal: any) {

      if (this.storedProficiency.length < ValueConstant.MAX_PROFECIENCES) {
        this.storedProficiency.push(newVal);
        this.deleteSelectedProfeciency(newVal);
        this.proficiencydoaminService.addCandidateProficiency(this.storedProficiency).subscribe(
          data => {
            console.log(data);
          },
          error => {
            console.log(error);
          });
        console.log(this.storedProficiency);

        this.JobPostProficiency.change(this.storedProficiency);
      } else {
        this.showAlert = true;
      }

    let typeTemp: any = document.getElementById(this.type);
    typeTemp.value = '';

  }

  deleteItem(newVal: any) {
    this.showAlert = false;
    for (let i = 0; i < this.storedProficiency.length; i++) {
      if (this.storedProficiency[i] === newVal.currentTarget.innerText.trim()) {
        if (i > -1) {
          this.storedProficiency.splice(i, 1);
          for(let item of this.masterDataproficiency) {
            if(item===newVal.currentTarget.innerText.trim()) {
              this.selectedproficiencies.push(newVal.currentTarget.innerText.trim());
            }
          }
        }
      }

    }
    this.proficiencydoaminService.addCandidateProficiency(this.storedProficiency).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      });
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
  onSelect() {
    this.isShow=false;
  }
  enterProficiency(newVal:string){
    this.addProficiency=newVal;
  }
  selectedProficiency() {
    this.selectedProficiencyModel(this.addProficiency);
    let typeTemp: any = document.getElementById(this.addOther);
    typeTemp.value = '';

  }

}
