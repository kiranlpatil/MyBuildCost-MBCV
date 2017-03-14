import {Component} from '@angular/core';
import {Http, Response} from "@angular/http";
@Component({
  moduleId: module.id,
  selector: 'cn-industry',
  templateUrl: 'industryList.component.html',
  styleUrls: ['industryList.component.css']
})

export class IndustryComponent {

  industries: string[];
  storedRoles=new Array();
  functions: string[];
  industryModel = "";
  functionModel = "";
  roleModel = "";
  isIndustrySelected : boolean= false;
  isFunctionSelected : boolean= false;
  isRoleSelected : boolean= false;
  temproles : string[];
  maxRoles : number =3;
 static count:number=-1;
  roles : string[];
  rmainingRoles:string[];
  key:number;

  constructor(private http: Http) {

  }

  ngOnInit(){
    this.temproles= new Array(1);
  }

  selectIndustryModel(newVal: any) {debugger
    this.industryModel = newVal;
    this.http.get("role").map((res: Response) => res.json())
      .subscribe(
        data => {
          this.roles = data.roles;

       /*   this.rmainingRoles= data.roles;
          this.key=this.rmainingRoles.length;
         IndustryComponent.count=IndustryComponent.count+1;
         var k=this.key-IndustryComponent.count;
          if(k>0) {
            delete this.rmainingRoles[k];
            this.roles = this.rmainingRoles;
          }*/
        },
        err => console.error(err),
        () => console.log()
      );
  }

  selectFunctionModel(newVal: any) {
    this.functionModel = newVal;
    this.http.get("role").map((res: Response) => res.json())
      .subscribe(
        data => {
          this.roles = data.roles;
        },
        err => console.error(err),
        () => console.log()
      );
  }
  selectRolesModel(newVal: any) {debugger
    this.storedRoles.push(newVal);
    this.deleteSelectedRole(newVal);
    this.isRoleSelected=true;
    if(this.isRoleSelected===true)
      this.roleModel="";
    else
  this.roleModel=newVal;


  }

  deleteSelectedRole(newVal: any){debugger
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

    toggleRoll(event: any) {
    var roleType: string;
    roleType = event.target.id;
    if (roleType === "industry") {
      this.functionModel="";
      this.isIndustrySelected=true;
      this.isFunctionSelected=false;
      if (this.industries === undefined) {
        this.http.get(roleType).map((res: Response) => res.json())
          .subscribe(
            data => {
              this.industries = data.industry;
            },
            err => console.error(err),
            () => console.log()
          );
      }
      //this.industries =this.industryService.getIndustries(roleType);
    } else {
      this.industryModel="";
      this.isIndustrySelected=false;
      this.isFunctionSelected=true;
      if (this.functions === undefined) {
        this.http.get(roleType).map((res: Response) => res.json())
          .subscribe(
            data => {
              this.functions = data.function;
            },
            err => console.error(err),
            () => console.log()
          );
      }
    }
  }

  addNewRole(){
    if(this.temproles.length<this.maxRoles){
      this.temproles.push("null");
    }
  }
}


