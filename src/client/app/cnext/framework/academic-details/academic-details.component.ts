import {   Component  } from '@angular/core';
import {  Academicdetails  } from './academic-details';
import {  ValueConstant  } from '../../../framework/shared/constants';
import {  EducationalService  } from '../educational-service';

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
  private selectedacademicsdeatils:Academicdetails[]=new Array();
  private disbleButton:boolean=false;
  private tempSchoolName:string='';
  private tempUnivercityName:string='';
  private tempPassingYear:string='';
  private  tempSpecialization:string='';
  constructor(private educationalService : EducationalService) {

    this.tempfield = new Array(1);
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);


  }

  createYearList(year: number) {
    for (let i = 0; i < ValueConstant.MAX_ACADEMIC_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }
  }
  selectedSchoolName(schoolname:string) {
    this.tempSchoolName=schoolname;

  }

  selectedeUniversityName(universityname:string) {
    this.tempUnivercityName=universityname;

  };
  selectedPassingYear(passingyear:string) {
    this.tempPassingYear=passingyear;
  };

  selectedSpecialization(remark:string) {
    this.tempSpecialization=remark;
  };

  changeValue() {
    this.educationalService.change(true);

  }


  addAnother() {
    if(this.tempSchoolName==='' || this.tempUnivercityName==='' ||
      this.tempPassingYear==='' || this.tempSpecialization==='' ) {
      this.disbleButton=true;
    } else {
      this.disbleButton = false;
      let temp=new Academicdetails();
      temp.schoolName=this.tempSchoolName;
      temp.universityName=this.tempUnivercityName;
      temp.passingyear=this.tempPassingYear;
      temp.specialization=this.tempSpecialization;
      this.selectedacademicsdeatils.push(temp);
      console.log(this.selectedacademicsdeatils);
      this.tempfield.push('null');
      this.tempSchoolName='';
      this.tempUnivercityName='';
      this.tempPassingYear='';
      this.tempSpecialization='';
    }
  }
}
