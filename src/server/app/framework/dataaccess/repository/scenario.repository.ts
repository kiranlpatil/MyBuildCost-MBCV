import ScenarioSchema = require("../schemas/scenario.schema");
import RepositoryBase = require("./base/repository.base");
import IScenario = require("../mongoose/scenario");

class ScenarioRepository extends RepositoryBase<IScenario> {
  constructor() {
    super(ScenarioSchema);
  }
}
Object.seal(ScenarioRepository);
export = ScenarioRepository;
