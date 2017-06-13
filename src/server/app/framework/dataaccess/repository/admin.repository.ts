import AdminSchema = require("../schemas/admin.schema");
import RepositoryBase = require("./base/repository.base");
import Candidate = require("../mongoose/candidate");
import IAdmin = require("../mongoose/admin");

class AdminRepository extends RepositoryBase<IAdmin> {
  constructor() {
    super(AdminSchema);
  }
}
Object.seal(AdminRepository);
export = AdminRepository;
