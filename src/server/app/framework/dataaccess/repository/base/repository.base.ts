import IRead = require("./read");
import IWrite = require("./write");
import * as mongoose from "mongoose";

class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

  private _model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  create(item: T, callback: (error: any, result: any) => void) {
    this._model.create(item, callback);
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this._model.find(field, {}).lean().exec((err, res) => {
      callback(err, res);
    });
  }

  retrieveWithIncluded(field: any,included: any, callback: (error: any, result: any) => void) {
    this._model.find(field, included).lean().exec((err, res) => {
      callback(err, res);
    });
  }

  retrieveWithoutLean(field: any, callback: (error: any, result: any) => void) {
    this._model.find(field, {}).exec((err, res) => {
      callback(err, res);
    });
  }

  retrieveWithLean(field: any, projection: any, callback: (error: any, result: any) => void) {
    console.time('repo2 time');
    this._model.find(field, projection).lean().exec((err, res) => {
      console.timeEnd('repo2 time');
      callback(err, res);
    });
  }


  update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    this._model.update({_id: _id}, item, callback);
  }
  
  updateByUserId(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    this._model.update({'userId': _id}, item, callback);

  }

  retrieveAll(excluded: any, callback: (error: any, result: any) => void) {
    this._model.find({}, excluded).lean().exec((err, res) => {
      callback(err, res);
    });
  }

  retrieveByMultiIds(ids: string[], excluded: any, callback: (error: any, result: T) => void) {
    this._model.find({_id: {$in: ids}}, excluded, callback);
  }

  retrieveByMultiIdsForComplexity(ids: string[], excluded: any, callback: (error: any, result: T) => void) {
    this._model.find({_id: {$in: ids}}, excluded, callback);
  }

  retrieveByMultiIdsAndNames(field: any[], names: any, excluded: any, callback: (error: any, result: T) => void) {
    this._model.find({$and: [{_id: {$in: field}}, {name: {$in: JSON.parse(names)}}]}, excluded, callback);
  }

  delete(_id: string, callback: (error: any, result: any) => void) {
    this._model.remove({_id: this.toObjectId(_id)}, (err) => callback(err, null));
  }

  findById(_id: string, callback: (error: any, result: T) => void) {
    this._model.findById(_id, callback);
  }

  findByIdwithExclude(_id: string, exclude: any, callback: (error: any, result: T) => void) {
    this._model.findById(_id, exclude, callback);
  }

  findByName(name: string, callback: (error: any, result: T) => void) {
    this._model.find({"name": name}, callback);
  }

  toObjectId(_id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id);
  }

  findAndPopulate(searchField: any, populateField: any, callback: (err: any, result: any) => void) {
    this._model.find(searchField).populate(populateField).exec(function (err, items) {
      callback(err, items);
    });
  }

  retrieveByMultiIdsAndPopulate(ids: string[], excluded: any, callback: (error: any, result: any) => void) {
    this._model.find({_id: {$in: ids}}, excluded).populate('userId').exec(function (err, items) {
      callback(err, items);
    });
  }

  findOneAndUpdate(query: any, newData: any, options: any, callback: (err: any, result: any) => void) {
    this._model.findOneAndUpdate(query, newData, options, function (err, result) {
      callback(err, result);
    });
  }

  findOneAndUpdateIndustry(query: any, newData: any, options: any, callback: (err: any, result: any) => void) {
    this._model.findOneAndUpdate(query, newData, options, function (err, result) {
      callback(err, result);
    });
  }

  //custom API created for C-next Roles capabilities and complexities

  //change the any data type to model

  pushInJobpost(id: string, value: any, callback: (error: any, result: any) => void) {
    this._model.update({_id: id}, {$push: {"postedJobs": value.postedJobs}}, callback);
  }

  pushElementInArray(value: string, callback: (error: any, result: any) => void) {
    this._model.update({$push: {"proficiencies": value}}, callback);
  }

  //in below query we use userId for search as refrence id
  retrieveByMultiRefrenceIdsAndPopulate(ids: string[], excluded: any, callback: (error: any, result: any) => void) {
    this._model.find({'userId': {$in: ids}}, excluded).populate('userId').exec(function (err, items) {
      callback(err, items);
    });
  }

  retrieveBySortedOrder(query: any, projection: any, sortingQuery: any, callback: (error: any, result: any) => void) {
    this._model.find(query, projection).sort(sortingQuery).lean().exec(function (err, items) {
      callback(err, items);
    });
  }

  getCount(query: any, callback: (error: any, result: any) => void) {
    this._model.find(query).count().lean().exec(function (err, items) {
      callback(err, items);
    });
  }

}

export = RepositoryBase;
