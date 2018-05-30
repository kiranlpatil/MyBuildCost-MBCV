import Building = require('../mongoose/Building');
import BuildingSchema = require('../schemas/BuildingSchema');
import RepositoryBase = require('./../../../framework/dataaccess/repository/base/repository.base');

class BuildingRepository extends RepositoryBase<Building> {
  constructor() {
    super(BuildingSchema);
  }

}

Object.seal(BuildingRepository);
export = BuildingRepository;
