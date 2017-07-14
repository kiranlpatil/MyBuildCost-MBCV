import ICapability = require("../mongoose/capability");
import DefaultComplexityModel = require("./default-complexity.model");
import CapabilityClassModel = require("./capability-class.model");

class RoleClassModel {
  name: string;
  sort_order: number;
  code : string;
  capabilities: CapabilityClassModel[];
  default_complexities: DefaultComplexityModel[]
}
export = RoleClassModel;
