import IndustrySchema = require("../schemas/industry.schema");
import RepositoryBase = require("./base/repository.base");
import IIndustry = require("../mongoose/industry");
import RoleModel = require("../model/role.model");

class IndustryRepository extends RepositoryBase<IIndustry> {
  private items: RoleModel[];

  constructor() {
    super(IndustrySchema);
  }

  findRoles(name: string, callback: (error: any, result: any) => void) {
    this.items = new Array(0);
    IndustrySchema.find({'name': name}).lean().exec((err: any, industry: any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (industry.length <= 0) {
          callback(new Error("Records are not found"), null);
        } else {
          for (let role of industry[0].roles) {
            let obj: any = {
              "industryName": industry[0].name,
              "_id": role._id,
              "name": role.name,
              "code": role.code,
            };
            this.items.push(obj);
          }
          callback(null, this.items);
        }
      }
    });
  }

  findCapabilities(item: any, callback: (error: any, result: any) => void) {
    this.items = new Array(0);
    IndustrySchema.find({'name': item.name}).lean().exec((err: any, industry: any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (industry.length <= 0) {
          callback(new Error("Records are not found"), null);
        } else {
          for (let role of industry[0].roles) {
            for (let o of item.roles) {
              if (o == role.name) {
                let role_object: any = {
                  name: role.name,
                  code: role.code,
                  capabilities: [],
                  default_complexities: role.default_complexities
                };
                role_object.capabilities = new Array(0);
                for (let capability of role.capabilities) {
                  let obj: any = {
                    "industryName": industry[0].name,
                    "roleName": role.name,
                    "_id": capability._id,
                    "name": capability.name,
                    'code': capability.code
                  };
                  role_object.capabilities.push(obj);
                }
                this.items.push(role_object);
              }
            }
          }
          callback(null, this.items);
        }
      }
    });
  }

  findComplexities(item: any, callback: (error: any, result: any) => void) {
    this.items = new Array(0);
    IndustrySchema.find({'name': item.name}).lean().exec((err: any, industry: any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (industry.length <= 0) {
          callback(new Error("Records are not found"), null);
        } else {
          for (let role of industry[0].roles) {
            for (let o of item.roles) {
              if (o == role.name) {
                let role_object: any = {
                  name: role.name,
                  code: role.code,
                  capabilities: [],
                  default_complexities: role.default_complexities
                };
                for (let capability of role.capabilities) {
                  for (let ob of item.capabilities) {
                    if (ob == capability.name) {
                      let capability_object: any = {
                        name: capability.name,
                        code: capability.code,
                        complexities: []
                      };
                      for (let complexity of capability.complexities) {
                        let complexity_object: any = {
                          name: complexity.name,
                          code: complexity.code,
                          questionForCandidate: complexity.questionForCandidate,
                          questionForRecruiter: complexity.questionForRecruiter,
                          scenarios: complexity.scenarios
                        };
                        capability_object.complexities.push(complexity_object);
                      }
                      role_object.capabilities.push(capability_object);
                    }
                  }
                }
                this.items.push(role_object);
              }
            }
          }
          callback(null, this.items);
        }
      }
    });
  }

  retriveIndustriesWithSortedOrder(excluded: any, callback: (error: any, result: any) => void) {
    IndustrySchema.find().sort({'sort_order': -1, 'name': 1}).exec(function (err: any, items: any) {
      callback(err, items);
    });
  }

}
Object.seal(IndustryRepository);
export = IndustryRepository;
