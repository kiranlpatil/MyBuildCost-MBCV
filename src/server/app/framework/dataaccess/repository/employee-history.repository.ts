import EmploymentHistorySchema = require("../schemas/employment-history.schema");
import RepositoryBase = require("./base/repository.base");
import IEmploymentHistory = require("../mongoose/employment-history");

class EmployeeHistoryRepository extends RepositoryBase<IEmploymentHistory> {
  constructor() {
    super(EmploymentHistorySchema);
  }
}
Object.seal(EmployeeHistoryRepository);
export = EmployeeHistoryRepository;
