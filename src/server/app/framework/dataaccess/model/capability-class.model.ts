import IComplexity = require("../mongoose/complexity");
import ComplexityClassModel = require("./complexity-class.model");

class CapabilityClassModel {
  complexities: ComplexityClassModel[];
  name: string;
  code : string;
  sort_order: number;
  isPrimary: boolean;
  isSecondary: boolean

  constructor (capabitity:any){
    this.name=capabitity.capability;
    this.code=capabitity.capability_code;
    this.sort_order=capabitity.capability_display_sequence;
  }

}
export = CapabilityClassModel;
