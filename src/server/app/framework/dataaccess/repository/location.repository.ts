import LocationSchema = require("../schemas/location.schema");
import RepositoryBase = require("./base/repository.base");
import ILocation = require("../mongoose/location");

class LocationRepository extends RepositoryBase<ILocation> {
  constructor() {
    super(LocationSchema);
  }
}
Object.seal(LocationRepository);
export = LocationRepository;
