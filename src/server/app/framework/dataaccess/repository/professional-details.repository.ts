import ProfessionalDetailsSchema = require("../schemas/professional-details.schema");
import RepositoryBase = require("./base/repository.base");
import IProfessionalDetails = require("../mongoose/professional-details");

class ProfessionalDetailsRepository extends RepositoryBase<IProfessionalDetails> {
  constructor() {
    super(ProfessionalDetailsSchema);
  }
}
Object.seal(ProfessionalDetailsRepository);
export = ProfessionalDetailsRepository;
