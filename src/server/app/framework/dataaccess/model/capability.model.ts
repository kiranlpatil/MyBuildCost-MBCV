import IComplexity = require("../mongoose/complexity");
import ComplexityModel = require("./complexity.model");

interface CapabilityModel {
  complexities: ComplexityModel[];
  name: string;
  code : string;
  isPrimary: boolean,
  isSecondary: boolean
}
export = CapabilityModel;
