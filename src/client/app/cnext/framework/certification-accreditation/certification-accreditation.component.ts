
import {   Component  } from '@angular/core';
import { Certifications } from '../model/certification-accreditation';

@Component({
  moduleId: module.id,
  selector: 'cn-certification-accreditation',
  templateUrl: 'certification-accreditation.component.html',
  styleUrls: ['certification-accreditation.component.css']
})

export class CertificationAccreditationComponent {

  private tempfield: string[];
  private tempCertificateName:string='';
  private tempCompanyName:string='';
  private tempYear:string='';
  private tempdetails:string='';
  private selectedcertificates:Certifications[]=new Array();
  private disbleButton:boolean=false;


  constructor() {

    this.tempfield = new Array(1);

  }
  selectedCertificate(certificatename:string) {
this.tempCertificateName=certificatename;
  }
  selectedCompanyName(companyname:string) {
this.tempCompanyName=companyname;
  }


  selectedYearModel(year:string) {
    this.tempYear=year;
  }

  addedCertification(certificate:any) {
    this.tempdetails=certificate;
  }





  addAnother() {
    if(this.tempCertificateName==='' || this.tempCompanyName==='' ||
      this.tempYear===''|| this.tempdetails==='') {

      this.disbleButton=true;
    } else {
      this.disbleButton = false;
      let temp=new Certifications();
      temp.certificateName=this.tempCertificateName;
      temp.compaName=this.tempCompanyName;
      temp.yearOfCertification=this.tempYear;
      temp.certificationdetails=this.tempdetails;
      this.selectedcertificates.push(temp);
      console.log(this.selectedcertificates);
      this.tempfield.push('null');
      this.tempCertificateName='';
      this.tempCompanyName='' ;
      this.tempYear='';
      this.tempdetails='';
    }
  }
}
