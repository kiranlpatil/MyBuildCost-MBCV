import RoleClassModel = require("../dataaccess/model/role-class.model");
let config = require('config');
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

  addRole(currentRow:any, roles:any) {

    if (roles.length != 0) {
      let isRoleFound : boolean=false;
      for (let i = 0; i < roles.length; i++) {
        if (currentRow.area_of_work == roles[i].name) {
          isRoleFound = true;
        }
      }
      if (!isRoleFound) {
        let newRole = new RoleClassModel(currentRow.area_of_work, currentRow.area_of_work_code, currentRow.area_of_work_display_sequence);
        roles.push(newRole);
      }
      return roles;
    }
    else {
      let newRole = new RoleClassModel(currentRow.area_of_work, currentRow.area_of_work_code, currentRow.area_of_work_display_sequence);
      roles.push(newRole);
      return roles;
    }
  }

}

Object.seal(RoleService);
export = RoleService;
