import IComplexity = require("../mongoose/complexity");
import ComplexityClassModel = require("./complexity-class.model");

class CapabilityClassModel {
  complexities: ComplexityClassModel[];
  name: string;
  code : string;
  sort_order: number;
  isPrimary: boolean;
  isSecondary: boolean
}
export = CapabilityClassModel;
