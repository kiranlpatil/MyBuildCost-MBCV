import IRead = require("./read");
import IWrite = require("./write");
import * as mongoose from "mongoose";

class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

  private _model:mongoose.Model<mongoose.Document>;

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

  retrieveAll( excluded:any, callback:(error:any, result:T) => void) {
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

  findOneAndUpdateIndustry(query:any, newData:any, options:any, callback:(err:any, result:any)=>void) {
    this._model.findOneAndUpdate(query, newData, options, function (err, result) {
      callback(err, result);
    });
  }

  //custom API created for C-next Roles capabilities and complexities

  pushInJobpost(id:string, value:any, callback:(error:any, result:any) => void) {
    this._model.update({_id: id}, { $push:{ "postedJobs":value.postedJobs } }, callback);
  }

  pushElementInArray( value:string, callback:(error:any, result:any) => void) {
/*
    this._model.update({name: name}, { $push:{ "proficiencies":value } }, callback);
*/
    this._model.update({ $push:{ "proficiencies":value } }, callback);
  }

}

export = RepositoryBase;
