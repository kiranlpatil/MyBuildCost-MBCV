import IRead = require("./read");
import IWrite = require("./write");
import * as mongoose from "mongoose";

class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

  private _model:mongoose.Model<mongoose.Document>;
  private items:any[];

  constructor(schemaModel:mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  create(item:T, callback:(error:any, result:any) => void) {
    this._model.create(item, callback);
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this._model.find(field, callback)
  }

  update(_id:mongoose.Types.ObjectId, item:T, callback:(error:any, result:any) => void) {
    this._model.update({_id: _id}, item, callback);

  }

  retrieveAll(_id:string, excluded:any, callback:(error:any, result:T) => void) {
    this._model.find({}, excluded, callback);
  }

  retrieveByMultiIds(ids:string[], excluded:any, callback:(error:any, result:T) => void) {
    this._model.find({_id: {$in: ids}}, excluded, callback);
  }

  retrieveByMultiIdsForComplexity(ids:string[], excluded:any, callback:(error:any, result:T) => void) {
    this._model.find({_id: {$in: ids}}, excluded, callback);
  }

  retrieveByMultiIdsAndNames(field:any[], names:any, excluded:any, callback:(error:any, result:T) => void) {
    this._model.find({$and: [{_id: {$in: field}}, {name: {$in: JSON.parse(names)}}]}, excluded, callback);
  }

  delete(_id:string, callback:(error:any, result:any) => void) {
    this._model.remove({_id: this.toObjectId(_id)}, (err) => callback(err, null));
  }

  findById(_id:string, callback:(error:any, result:T) => void) {
    this._model.findById(_id, callback);
  }

  findByName(name:string, callback:(error:any, result:T) => void) {
    this._model.find({"name": name}, callback);
  }

  toObjectId(_id:string):mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id)
  }

  findAndPopulate(searchField:any, populateField:any, callback:(err:any, result:any)=>void) {
    this._model.find(searchField).populate(populateField).exec(function (err, items) {
      callback(err, items);
    });
  }

  findOneAndUpdate(query:any, newData:any, options:any, callback:(err:any, result:any)=>void) {
    this._model.findOneAndUpdate(query, newData, options, function (err, result) {
      callback(err, result);
    });
  }

  //custom API created for C-next Roles capabilities and complexities

  findRoles(name:string, callback:(error:any, result:any) => void) {
    this.items = new Array(0);
    this._model.find({"name": name}, (err:any, industry:any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (industry.length <= 0) {
          callback(new Error("Records are not found"), null);
        } else {
          for (let role of industry[0].roles) {
            let obj:any = {
              "_id": role._id,
              "name": role.name
            }
            this.items.push(obj);
          }
          callback(null, this.items);
        }
      }
    });
  }

  findCapabilities(item:any, callback:(error:any, result:any) => void) {
    this.items = new Array(0);
    this._model.find({"name": item.name},(err:any, industry:any)=> {
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
    this._model.find({"name": item.name},(err:any, industry:any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (industry.length <= 0) {
          callback(new Error("Records are not found"), null);
        } else {
          for (let role of industry[0].roles) {
            for(let o of item.roles){
              if(o==role.name){
                for(let capability of role.capabilities){
                  for(let ob of item.capabilities){
                    if(ob == capability.name){
                      for(let complexity of capability.complexities){
                        let obj:any = {
                          "_id": complexity._id,
                          "name": complexity.name,
                          "scenarios":complexity.scenarios
                        };
                        this.items.push(obj);
                      }
                    }
                  }
                }
              }
            }
          }
          callback(null, this.items);
        }
      }
    });
  }

}

export = RepositoryBase;
