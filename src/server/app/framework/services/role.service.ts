import * as fs from 'fs';
var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import RoleRepository = require("../dataaccess/repository/role.repository");
class RoleService {
  private roleRepository:RoleRepository;
  APP_NAME:string;

  constructor() {
    this.roleRepository = new RoleRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.roleRepository.retrieveAll(field,{}, callback);
  }

  create(item:any, callback:(error:any, result:any) => void) {
    this.roleRepository.create(item, (err, res) => {
      if (err) {
        callback(new Error("Problem in Creating role model"), null);
      }
      else {
        callback(null, res);
      }
    });
  }

  retrieveByMultiIds(item:any, callback:(error:any, result:any) => void) {
     this.roleRepository.retrieveByMultiIds(item,{  _id: 0 ,capabilities :0 }, callback);
  }

  retrieveByMultiIdsWithCapability(item:any,names:any, callback:(error:any, result:any) => void) {
    this.roleRepository.retrieveByMultiIdsAndNames(item,names,{  _id: 0  }, callback);
  }

}

Object.seal(RoleService);
export = RoleService;
