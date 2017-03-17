import {Component} from '@angular/core';
import {Http, Response} from "@angular/http";
import {FormGroup, FormBuilder} from "@angular/forms";
import {IndustryService} from "./industryList.service";
import { industryProfile} from "./industry";
import {Router} from "@angular/router";
import {LoaderService} from "../../../framework/shared/loader/loader.service";
import {TestService} from "../test.service";
@Component({
  moduleId: module.id,
  selector: 'cn-industry',
  templateUrl: 'industryList.component.html',
  styleUrls: ['industryList.component.css']
})

export class IndustryComponent {
  storedIndustry:string;
  userForm: FormGroup;
  model=new industryProfile();
  industries: string[];
  storedRoles=new Array();
  industryModel = "";
  roleModel = "";
  isIndustrySelected : boolean= false;
  isRoleSelected : boolean= false;
  temproles : string[];
  maxRoles : number =3;
  roles : string[];
  key:number;
  showModalStyle: boolean = false;
  disbleRole: boolean = false;


  constructor(private industryService: IndustryService,private http: Http , private testService : TestService) {

  }

  ngOnInit(){
    this.temproles= new Array(1);
    if (this.industries === undefined) {
      this.http.get("industry")
        .map((res: Response) => res.json())
        .subscribe(
          data => {
            this.industries = data.industry;
          },
          err => console.error(err),
          () => console.log()
        );
    }
  }

  selectIndustryModel(newVal: any) {
    this.storedIndustry=newVal;
    this.industryModel = newVal;
    this.http.get("role")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.roles = data.roles;
        },
        err => console.error(err),
        () => console.log()
      );
  }


  selectRolesModel(newVal: any) {
    this.storedRoles.push(newVal);
    this.deleteSelectedRole(newVal);
    this.isRoleSelected=true;
    if(this.isRoleSelected===true)
      this.roleModel="";
    else
  this.roleModel=newVal;


  }

  deleteSelectedRole(newVal: any){
    for (let  i = 0; i < this.roles.length; i++)
    {
      if (this.roles[i]===newVal)
      {
        if (i > -1) {
          this.roles.splice(i, 1);
        }
      }

    }
  }



  addNewRole(){
    if(this.temproles.length<this.maxRoles){
      this.temproles.push("null");
    }
  }

  createAndSave()
  {
    this.industryService.addIndustryProfile(this.model).subscribe(
      user => {

      },
      error => {

      });
  };


    showHideModal() {
        this.showModalStyle = !this.showModalStyle;
    }


  disableRole(){debugger
    this.testService.change(true);
    this.showModalStyle = !this.showModalStyle;
    this.disbleRole=true;
  }

    getStyleModal() {
        if (this.showModalStyle) {
            return 'block';
        } else {
            return 'none';
        }
    }
}


