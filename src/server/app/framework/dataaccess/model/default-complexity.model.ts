import IComplexity = require("../mongoose/complexity");
import ComplexityModel = require("./complexity.model");

interface DefaultComplexityModel {
  complexities: ComplexityModel[];
  name: string;
}
export = DefaultComplexityModel;
