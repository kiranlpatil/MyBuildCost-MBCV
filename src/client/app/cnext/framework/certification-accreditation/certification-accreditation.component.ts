
import {   Component  } from '@angular/core';
import { certifications } from '../model/certification-accreditation';
import { DateService } from '../date.service';

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
  private selectedcertificates:certifications[]=new Array();
  private yearList:string[]=this.dateservice.yearList;
  private disbleButton:boolean=false;


  constructor(private dateservice:DateService) {

    this.tempfield = new Array(1);

  }
  selectedCertificate(certificatename:string)
  {
this.tempCertificateName=certificatename;
  }
  selectedCompanyName(companyname:string)
  {
this.tempCompanyName=companyname;
  }


  selectedYearModel(year:string)
  {
    this.tempYear=year;
  }

  addedCertification(certificate:any) {
    this.tempdetails=certificate;

  }





  addAnother() {

    if(this.tempCertificateName==='' || this.tempCompanyName==='' ||
      this.tempYear===''|| this.tempdetails==='')
    {

      this.disbleButton=true;
    }
    else {
      this.disbleButton = false;
      let temp=new certifications();
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
