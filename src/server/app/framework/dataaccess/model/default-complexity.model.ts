import IComplexity = require("../mongoose/complexity");
import ComplexityModel = require("./complexity.model");
import ComplexityClassModel = require("./complexity-class.model");

class DefaultComplexityModel {
  complexities: ComplexityClassModel[];
  name: string;
  code: string;
  sort_order: number;
}
export = DefaultComplexityModel;
