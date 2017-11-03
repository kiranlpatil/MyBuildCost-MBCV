import IndustrySchema = require('../schemas/industry.schema');
import RepositoryBase = require('./base/repository.base');
import IIndustry = require('../mongoose/industry');
import RoleModel = require('../model/role.model');
import CapabilityModel = require("../model/capability.model");
import ComplexityModel = require("../model/complexity.model");

class IndustryRepository extends RepositoryBase<IIndustry> {
  private items: RoleModel[];

  constructor() {
    super(IndustrySchema);
  }

  findRoles(code: string, callback: (error: any, result: any) => void) {
    this.items = new Array(0);
    console.time('findRole');
      IndustrySchema.find({'code': code},{'roles.capabilities.complexities':0,'roles.default_complexities':0}).lean().exec((err: any, industry: any)=> {
        if (err) {
          callback(err, null);
        } else {
          if (industry.length <= 0) {
            callback(new Error('Records are not found'), null);
          } else {
            industry[0].roles.sort((r1 : RoleModel, r2 : RoleModel) : number => {
              if(!r1.sort_order){
                r1.sort_order=999;
              }
              if(!r2.sort_order){
                r2.sort_order=999;
              }
              if(r1.sort_order < r2.sort_order) {
                return -1;
              }
              if(r1.sort_order > r2.sort_order) {
                return 1;
              }
              return -1;
            });
            for (let role of industry[0].roles) {
              let obj: any = {
                'industryName': industry[0].name,
                '_id': role._id,
                'sort_order': role.sort_order,
                'name': role.name,
                'code': role.code,
                'allcapabilities': role.capabilities.map((capability:any)=> capability.name)
              };
              this.items.push(obj);
            }
            console.timeEnd('findRole');
            callback(null, this.items);
          }
        }
      });
  }

  findCapabilities(item: any, callback: (error: any, result: any) => void) {
    this.items = new Array(0);
    console.time('findCapability');

    IndustrySchema.find({'code': item.code},{'roles.capabilities.complexities.scenarios':0}).lean().exec((err: any, industry: any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (industry.length <= 0) {
          callback(new Error('Records are not found'), null);
        } else {
          industry[0].roles.sort((r1 : RoleModel, r2 : RoleModel) : number => {
            if(!r1.sort_order){
              r1.sort_order=999;
            }
            if(!r2.sort_order) {
              r2.sort_order = 999;
            }
            if(r1.sort_order < r2.sort_order) {
              return -1;
            }
            if(r1.sort_order > r2.sort_order) {
              return 1;
            }
            return -1;
          });
          for (let role of industry[0].roles) {
            for (let code of item.roles) {
              if (code == role.code) {
                let role_object: any = {
                  name: role.name,
                  code: role.code,
                  capabilities: [],
                  sort_order: role.sort_order,
                  default_complexities: role.default_complexities
                };
                role_object.capabilities = new Array(0);
                role.capabilities.sort((r1 : CapabilityModel, r2 : CapabilityModel) : number => {
                  if(!r1.sort_order){
                    r1.sort_order=999;
                  }
                  if(!r2.sort_order){
                    r2.sort_order=999;
                  }
                  if(r1.sort_order < r2.sort_order) {
                    return -1;
                  }
                  if(r1.sort_order > r2.sort_order) {
                    return 1;
                  }
                  return -1;
                });
                for (let capability of role.capabilities) {
                  if(capability.complexities && capability.complexities.length > 0) {
                    let obj: any = {
                      'industryName': industry[0].name,
                      'roleName': role.name,
                      '_id': capability._id,
                      'name': capability.name,
                      'code': capability.code,
                      sort_order: capability.sort_order,
                      'allcomplexities': capability.complexities.map((complexity:any)=> complexity.name)
                    };
                    if(this.items.length > 0) {
                      if(this.removeDuplicateCapbility(this.items,obj)) {
                        role_object.capabilities.push(obj);
                      }
                    }else {
                      role_object.capabilities.push(obj);
                    }
                  }
                }
                this.items.push(role_object);
              }
            }
          }
          console.timeEnd('findCapability');
          callback(null, this.items);
        }
      }
    });
  }
  removeDuplicateCapbility(roles:any,obj:any):boolean {
        for(let k of roles) {
          if(k.capabilities.findIndex((x:any) => x.code === obj.code) >= 0) {
            return false;
          }
        }
    return true;
  }
  findComplexities(item: any, callback: (error: any, result: any) => void) {
    this.items = new Array(0);
    console.time('findComplexity');
    IndustrySchema.find({'code': item.code}).lean().exec((err: any, industry: any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (industry.length <= 0) {
          callback(new Error('Records are not found'), null);
        } else {
          industry[0].roles.sort((r1 : RoleModel, r2 : RoleModel) : number => {
            if(!r1.sort_order){
              r1.sort_order=999;
            }
            if(!r2.sort_order){
              r2.sort_order=999;
            }
            if(r1.sort_order < r2.sort_order) {
              return -1;
            }
            if(r1.sort_order > r2.sort_order) {
              return 1;
            }
            return -1;
          });
          for (let role of industry[0].roles) {
            for (let code of item.roles) {
              if (code == role.code) {
                let role_object: any = {
                  name: role.name,
                  code: role.code,
                  capabilities: [],
                  sort_order: role.sort_order,
                  default_complexities: role.default_complexities
                };
                role.capabilities.sort((r1 : CapabilityModel, r2 : CapabilityModel) : number => {
                  if(!r1.sort_order){
                    r1.sort_order=999;
                  }
                  if(!r2.sort_order){
                    r2.sort_order=999;
                  }
                  if(r1.sort_order < r2.sort_order) {
                    return -1;
                  }
                  if(r1.sort_order > r2.sort_order) {
                    return 1;
                  }
                  return -1;
                });
                for (let capability of role.capabilities) {
                  for (let ob of item.capabilities) {
                    if (ob == capability.code) {
                      let capability_object: any = {
                        name: capability.name,
                        code: capability.code,
                        sort_order: capability.sort_order,
                        complexities: []
                      };
                      capability.complexities.sort((r1 : ComplexityModel, r2 : ComplexityModel) : number => {
                        if(!r1.sort_order){
                          r1.sort_order=999;
                        }
                        if(!r2.sort_order){
                          r2.sort_order=999;
                        }
                        if(r1.sort_order < r2.sort_order) {
                          return -1;
                        }
                        if(r1.sort_order > r2.sort_order) {
                          return 1;
                        }
                        return -1;
                      });
                      for (let complexity of capability.complexities) {
                        let complexity_object: any = {
                          name: complexity.name,
                          code: complexity.code,
                          sort_order: complexity.sort_order,
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
          console.timeEnd('findComplexity');
          callback(null, this.items);
        }
      }

    });
  }

  retriveIndustriesWithSortedOrder(excluded: any, callback: (error: any, result: any) => void) {
    IndustrySchema.find({}, excluded).lean().exec(function (err: any, items: any) {
      items.sort((r1: any, r2: any): number => {
        if (!r1.sort_order) {
          r1.sort_order = 999;
        }
        if (!r2.sort_order) {
          r2.sort_order = 999;
        }
        if (Number(r1.sort_order) < Number(r2.sort_order)) {
          return -1;
        }
        if (Number(r1.sort_order) > Number(r2.sort_order)) {
          return 1;
        }
        return -1;
      });
      callback(err, items);
    });
  }

}
Object.seal(IndustryRepository);
export = IndustryRepository;
