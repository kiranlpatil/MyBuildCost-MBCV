import CapabilitySchema = require("../schemas/capability.schema");
import RepositoryBase = require("./base/repository.base");
import ICapability = require("../mongoose/capability");

class CapabilityRepository extends RepositoryBase<ICapability> {
  constructor() {
    super(CapabilitySchema);
  }
}
Object.seal(CapabilityRepository);
export = CapabilityRepository;
