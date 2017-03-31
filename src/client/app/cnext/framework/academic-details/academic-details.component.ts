import {  Component } from '@angular/core';
import { FormGroup} from '@angular/forms';
import {academicdetails} from "./academic-details";
import {VALUE_CONSTANT} from "../../../framework/shared/constants";
import {EducationalService} from "../educational-service";

@Component({
  moduleId: module.id,
  selector: 'cn-academic-details',
  templateUrl: 'academic-details.component.html',
  styleUrls: ['academic-details.component.css']
})

export class AcademicDetailComponent {

 private  tempfield: string[];
 private year: any;
 private currentDate: any;
 private yearList = new Array();
 private selectedacademic= new academicdetails();
 private selectedacademicsdeatils:academicdetails[]=new Array();
  private disbleButton:boolean=false;


  constructor(private educationalService : EducationalService) {

    this.tempfield = new Array(1);
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);


  }

  createYearList(year: number) {
    for (let i = 0; i < VALUE_CONSTANT.MAX_ACADEMIC_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }
  }
  selectedSchoolName(schoolname:string){
this.selectedacademic.schoolName=schoolname;

  }

  selectedeUniversityName(universityname:string){
    this.selectedacademic.universityName=universityname;

  };
  selectedPassingYear(passingyear:string){
    this.selectedacademic.passingyear=passingyear;
  };

  selectedSpecialization(remark:string){
    this.selectedacademic.specialization=remark;
  };

  changeValue(){
    this.educationalService.change(true);

  }


  addAnother() {

      if(this.selectedacademic.schoolName==="" || this.selectedacademic.universityName==="" ||
        this.selectedacademic.passingyear==="" || this.selectedacademic.specialization==="" )
      {

        this.disbleButton=true;
      }
      else {
        this.disbleButton = false;
        this.selectedacademicsdeatils.push(this.selectedacademic);
        this.tempfield.push("null");
      }
  }
}
