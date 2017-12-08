import RepositoryBase = require("./base/repository.base");
import RecruiterCandidates = require("../mongoose/recruiter-candidates");
import RecruiterCandidatesSchema = require("../schemas/recruiter-candidates.schema");

class RecruiterCandidatesRepository extends RepositoryBase<RecruiterCandidates> {
  constructor() {
    super(RecruiterCandidatesSchema);
  }
}
Object.seal(RecruiterCandidatesRepository);
export = RecruiterCandidatesRepository;
