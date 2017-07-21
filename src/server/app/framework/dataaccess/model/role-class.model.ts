import DefaultComplexityModel = require('./default-complexity.model');
import CapabilityClassModel = require('./capability-class.model');

class RoleClassModel {
  name: string;
  sort_order: number;
  code : string;
  capabilities: CapabilityClassModel[];
  default_complexities: DefaultComplexityModel[]

  constructor(name:string, code:string, sort_order:number) {
    this.name = name;
    this.code = code;
    this.sort_order = sort_order;
  }
}
export = RoleClassModel;
