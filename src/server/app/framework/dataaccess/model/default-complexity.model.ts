import IComplexity = require("../mongoose/complexity");
import ComplexityModel = require("./complexity.model");

class DefaultComplexityModel {
  complexities: ComplexityModel[];
  name: string;
  code: string;
  sort_order: number;
}
export = DefaultComplexityModel;
