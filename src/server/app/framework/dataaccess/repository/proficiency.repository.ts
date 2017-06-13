import ProficiencySchema = require("../schemas/proficiency.schema");
import RepositoryBase = require("./base/repository.base");
import IProficiency = require("../mongoose/proficiency");

class ProficiencyRepository extends RepositoryBase<IProficiency> {
  constructor() {
    super(ProficiencySchema);
  }
}
Object.seal(ProficiencyRepository);
export = ProficiencyRepository;
