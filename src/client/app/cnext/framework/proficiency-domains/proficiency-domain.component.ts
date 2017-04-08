import {Component, OnInit, Input} from '@angular/core';
import {ValueConstant} from '../../../framework/shared/constants';
import {ProficiencyService} from '../proficience.service';
import {MessageService} from '../../../framework/shared/message.service';
import {Message} from '../../../framework/shared/message';
import {ProficiencyDomainService} from './proficiency-domain.service';
import {JobPostProficiencyService} from '../jobPostProficiency.service';

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

  constructor(private proficiencyService: ProficiencyService,
              private proficiencydoaminService: ProficiencyDomainService,
              private messageService: MessageService,
              private JobPostProficiency: JobPostProficiencyService) {

    proficiencyService.showTest$.subscribe(
      data => {
        this.isProficiencyShow = data;
      }
    );
  }

  ngOnInit() {
    debugger
    this.proficiencyType = true;
    this.placeHolderName = 'proficiency';

    this.proficiencydoaminService.getProficiency()
      .subscribe(
        data => this.onProficiencySuccess(data),
        error => this.onError(error));

  }

  onProficiencySuccess(data: any) {debugger
    debugger
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

  selectedProficiencyModel(newVal: any) {debugger

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
  enterProficiency(newVal:string){debugger
    this.addProficiency=newVal;
  }
  selectedProficiency() {debugger
    this.selectedProficiencyModel(this.addProficiency);
    let typeTemp: any = document.getElementById(this.addOther);
    typeTemp.value = '';

  }

}
