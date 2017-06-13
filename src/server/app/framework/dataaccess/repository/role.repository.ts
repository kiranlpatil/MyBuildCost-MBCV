import RoleSchema = require("../schemas/role.schema");
import RepositoryBase = require("./base/repository.base");
import IRole = require("../mongoose/role");

class RoleRepository extends RepositoryBase<IRole> {
  constructor() {
    super(RoleSchema);
  }
}
Object.seal(RoleRepository);
export = RoleRepository;
