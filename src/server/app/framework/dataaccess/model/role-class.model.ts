import ICapability = require("../mongoose/capability");
import DefaultComplexityModel = require("./default-complexity.model");
import CapabilityClassModel = require("./capability-class.model");

class RoleClassModel {
  name: string;
  sort_order: number;
  code : string;
  capabilities: CapabilityClassModel[];
  default_complexities: DefaultComplexityModel[]

  constructor (role:any){
    this.name=role.area_of_work;
    this.code=role.area_of_work_code;
    this.sort_order=role.area_of_work_display_sequence;
  }
}
export = RoleClassModel;
