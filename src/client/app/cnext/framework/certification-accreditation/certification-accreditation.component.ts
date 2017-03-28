
import {  Component } from '@angular/core';
import {certifications} from "../model/certification-accreditation";

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
  constructor() {

    this.tempfield = new Array(1);
  }


  addedCertification(certificate:any){
    this.selectedcertificate.certificationdetails=certificate;

  }





  addAnother() {
this.selectedcertificates.push(  this.selectedcertificate);
    console.log(this.selectedcertificates);
    this.tempfield.push("null");

  }
}
