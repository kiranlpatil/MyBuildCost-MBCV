import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import RoleRepository = require("../dataaccess/repository/role.repository");
import IndustryRepository = require("../dataaccess/repository/industry.repository");
import ProficiencyRepository = require("../dataaccess/repository/proficiency.repository");
class ProficiencyService {
  private proficiencyRepository:ProficiencyRepository;
  APP_NAME:string;

  constructor() {
    this.proficiencyRepository = new ProficiencyRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.proficiencyRepository.retrieveAll({}, callback);
  }

  create(item:any, callback:(error:any, result:any) => void) {
    this.proficiencyRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error("Problem in Creating proficiency model"), null);
      }
      else {
        callback(null, res);
      }
    });
  }

  pushIntoArray( value:string,callback:(error:any, result:any) => void) {
    this.proficiencyRepository.pushElementInArray(value,callback);
  }
}

Object.seal(ProficiencyService);
export = ProficiencyService;
