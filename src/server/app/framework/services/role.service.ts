var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import RoleRepository = require("../dataaccess/repository/role.repository");
import IndustryRepository = require("../dataaccess/repository/industry.repository");
class RoleService {
  private roleRepository: RoleRepository;
  private industryRepository: IndustryRepository;
  APP_NAME: string;

  constructor() {
    this.roleRepository = new RoleRepository();
    this.industryRepository = new IndustryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.roleRepository.retrieveAll({}, callback);
  }

  create(item: any, callback: (error: any, result: any) => void) {
    this.roleRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error("Problem in Creating role model"), null);
      }
      else {
        callback(null, res);
      }
    });
  }

  retrieveByMultiIds(item: any, callback: (error: any, result: any) => void) {
    this.roleRepository.retrieveByMultiIds(item, {capabilities: 0}, callback);
  }

  retrieveByMultiIdsWithCapability(item: any, names: any, callback: (error: any, result: any) => void) {
    this.roleRepository.retrieveByMultiIdsAndNames(item, names, {_id: 0}, callback);
  }

  findByName(field: any, callback: (error: any, result: any) => void) {
    this.industryRepository.findRoles(field, callback);
  }

}

Object.seal(RoleService);
export = RoleService;
