
import {  Component } from '@angular/core';
import {certifications} from "../model/certification-accreditation";
import {DateService} from "../date.service";

@Component({
  moduleId: module.id,
  selector: 'cn-certification-accreditation',
  templateUrl: 'certification-accreditation.component.html',
  styleUrls: ['certification-accreditation.component.css']
})

export class CertificationAccreditationComponent {

  private tempfield: string[];
  private selectedcertificate=new certifications();
  private selectedcertificates:certifications[]=new Array();
  private monthList:string[]=this.dateservice.monthList;
  private yearList:string[]=this.dateservice.yearList;
  private disbleButton:boolean=false;


  constructor(private dateservice:DateService) {

    this.tempfield = new Array(1);

  }
  selectedCertificate(certificatename:string)
  {
this.selectedcertificate.certificateName=certificatename;
  }
  selectedCompanyName(companyname:string)
  {
this.selectedcertificate.compaName=companyname;
  }
  selectedworkfromMonthModel(frommonth:string)
{
this.selectedcertificate.fromMonth=frommonth;
}

  selectedworkfromYearModel(fromyear:string)
  {
this.selectedcertificate.fromYear=fromyear;
  }
  selectedworktoMonthModel(toyear:string)
  {
    this.selectedcertificate.toMonth=toyear;
  }
  selectedworktoYearModel(toyear:string)
  {
    this.selectedcertificate.toYear=toyear;
  }

  addedCertification(certificate:any){
    this.selectedcertificate.certificationdetails=certificate;

  }





  addAnother() {

    if(this.selectedcertificate.certificateName==="" || this.selectedcertificate.compaName==="" ||
      this.selectedcertificate.fromYear==="" || this.selectedcertificate.fromMonth==="" ||
      this.selectedcertificate.toMonth==="" ||this.selectedcertificate.toYear===""||
      this.selectedcertificate.certificationdetails==="")
    {

      this.disbleButton=true;
    }
    else {
      this.disbleButton = false;
      this.selectedcertificates.push(this.selectedcertificate);
      console.log(this.selectedcertificates);
      this.tempfield.push("null");
    }
  }
}
