let config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import EmployeeHistoryRepository = require("../dataaccess/repository/employee-history.repository");
import ProfessionalDetailsRepository = require("../dataaccess/repository/professional-details.repository");
class ProfessionalDetailsService {
  private professionalDetailsRepository: ProfessionalDetailsRepository;
  APP_NAME: string;

  constructor() {
    this.professionalDetailsRepository = new ProfessionalDetailsRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.professionalDetailsRepository.retrieveAll({}, callback);
  }

  create(item: any, callback: (error: any, result: any) => void) {
    this.professionalDetailsRepository.create(item, (err, res) => {
      if (err) {
        callback(err, null);
      }
      else {
        callback(null, res);
      }
    });
  }

  retrieveByMultiIds(item: any, callback: (error: any, result: any) => void) {
    this.professionalDetailsRepository.retrieveByMultiIds(item, {}, callback);
  }

}

Object.seal(ProfessionalDetailsService);
export = ProfessionalDetailsService;
