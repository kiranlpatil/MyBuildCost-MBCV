import ComplexitySchema = require("../schemas/complexity.schema");
import RepositoryBase = require("./base/repository.base");
import IComplexity = require("../mongoose/complexity");

class ComplexityRepository extends RepositoryBase<IComplexity> {
  constructor() {
    super(ComplexitySchema);
  }
}
Object.seal(ComplexityRepository);
export = ComplexityRepository;
