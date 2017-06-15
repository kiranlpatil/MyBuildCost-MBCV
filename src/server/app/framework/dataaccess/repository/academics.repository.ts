import AcademicSchema = require('../schemas/academic.schema');
import RepositoryBase = require('./base/repository.base');
import IAcademic = require('../mongoose/academics');

class AcademicsRepository extends RepositoryBase<IAcademic> {
  constructor() {
    super(AcademicSchema);
  }
}
Object.seal(AcademicsRepository);
export = AcademicsRepository;
