/**
 * Created by techprime002 on 7/11/2017.
 */
import ImportIndustrySchema = require("../schemas/import-industry.schema");
import RepositoryBase = require("./base/repository.base");
import IImportIndustry = require("../mongoose/import-industry");


class IndustryRepository extends RepositoryBase<IImportIndustry> {

  constructor() {
    super(ImportIndustrySchema);
  }

}
Object.seal(IndustryRepository);
export = IndustryRepository;
