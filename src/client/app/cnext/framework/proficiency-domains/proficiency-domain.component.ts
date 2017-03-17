import {Component, OnInit, Input} from '@angular/core';
import {Http,Response} from "@angular/http";
import {VALUE_CONSTANT} from "../../../framework/shared/constants";
@Component({
  moduleId: module.id,
  selector: 'cn-proficiencydoamin',
  templateUrl: 'proficiency-domain.component.html',
  styleUrls: ['']
})

export class proficiencyDomainComponent implements OnInit {
  @Input('type') type : string;
  proficiencies: string[];
  storedProficiency = new Array();
  proficiencyModel: string = "";
  private showAlert: boolean=false;
  private proficiencyType: boolean=false;
  private domainType: boolean=false;
  private placeHolderName:string;

  constructor(private http: Http) {


  }

  ngOnInit() {
    if(this.type==="profeciency"){
      this.proficiencyType=true;
      this.placeHolderName="proficiency"
    if (this.proficiencies === undefined) {
      this.http.get("proficiency")
        .map((res: Response) => res.json())
        .subscribe(
          data => {
            this.proficiencies = data.proficiency;
          },
          err => console.error(err),
          () => console.log()
        );
    }
  }
    if(this.type==="domain"){
      this.domainType=true;
      this.placeHolderName="domain"
      this.http.get("proficiency")
      this.http.get("domain")
        .map((res: Response) => res.json())
        .subscribe(
          data => {
            this.proficiencies = data.domain;
          },
          err => console.error(err),
          () => console.log()
        );
    }

  }



  selectproficiencyModel(newVal: any) {
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
    this.proficiencies.push(newVal.currentTarget.innerText);
  }

  deleteSelectedProfeciency(newVal: any) {
    for (let i = 0; i < this.proficiencies.length; i++) {
      if (this.proficiencies[i] === newVal) {
        if (i > -1) {
          this.proficiencies.splice(i, 1);
        }
      }
    }
  }
}
