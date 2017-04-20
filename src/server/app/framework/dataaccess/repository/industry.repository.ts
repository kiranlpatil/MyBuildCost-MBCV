import IndustrySchema = require("../schemas/industry.schema");
import RepositoryBase = require("./base/repository.base");
import IIndustry = require("../mongoose/industry");

class IndustryRepository extends RepositoryBase<IIndustry> {
  private items:any[];

  constructor () {
    super(IndustrySchema);
  }

  findRoles(name:string, callback:(error:any, result:any) => void) {
    this.items = new Array(0);
    IndustrySchema.find({"name": name}, (err:any, industry:any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (industry.length <= 0) {
          callback(new Error("Records are not found"), null);
        } else {
          for (let role of industry[0].roles) {
            let obj:any = {
              "industryName" : industry[0].name,
              "_id": role._id,
              "name": role.name
            };
            this.items.push(obj);
          }
          callback(null, this.items);
        }
      }
    });
  }
  findCapabilities(item:any, callback:(error:any, result:any) => void) {
    this.items = new Array(0);
    IndustrySchema.find({"name": item.name},(err:any, industry:any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (industry.length <= 0) {
          callback(new Error("Records are not found"), null);
        } else {
          for (let role of industry[0].roles) {
            for(let o of item.roles){
              if(o==role.name){
                let role_object :any={
                  name:role.name,
                  capabilities:[]
                };
                role_object.capabilities=new Array(0);
                for(let capability of role.capabilities){
                  let obj:any = {
                    "industryName" : industry[0].name,
                    "roleName":role.name,
                    "_id": capability._id,
                    "name": capability.name
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
  findComplexities(item:any, callback:(error:any, result:any) => void) {
    this.items = new Array(0);
    IndustrySchema.find({"name": item.name},(err:any, industry:any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (industry.length <= 0) {
          callback(new Error("Records are not found"), null);
        } else {
          for (let role of industry[0].roles) {
            for(let o of item.roles){
              if(o==role.name){
                let role_object :any={
                  name:role.name,
                  capabilities:[]
                };
                for(let capability of role.capabilities){
                  for(let ob of item.capabilities){
                    if(ob == capability.name){
                      let capability_object :any={
                        name:capability.name,
                        complexities:[]
                      };
                      for(let complexity of capability.complexities){
                        let complexity_object :any={
                          name:complexity.name,
                          scenarios:complexity.scenarios
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
}
Object.seal(IndustryRepository);
export = IndustryRepository;
