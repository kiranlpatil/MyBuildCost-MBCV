import {  Component } from '@angular/core';
import { FormGroup} from '@angular/forms';
import {academicdetails} from "./academic-details";
import {VALUE_CONSTANT} from "../../../framework/shared/constants";

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


  constructor() {

    this.tempfield = new Array(1);
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);


  }

  createYearList(year: any) {
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




  addAnother() {
    this. selectedacademicsdeatils.push(this.selectedacademic);

    this.tempfield.push("null");

  }
}
