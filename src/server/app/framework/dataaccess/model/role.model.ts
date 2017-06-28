import ICapability = require("../mongoose/capability");
import CapabilityModel = require("./capability.model");
import DefaultComplexityModel = require("./default-complexity.model");

interface RoleModel {
  name: string;
  code : string;
  capabilities: CapabilityModel[];
  default_complexities: DefaultComplexityModel[]
}
export = RoleModel;
