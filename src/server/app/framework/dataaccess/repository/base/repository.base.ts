import IRead = require('./read');
import IWrite = require('./write');
import mongoose = require('mongoose');
import CostControllException = require('../../../../applicationProject/exception/CostControllException');

class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

  private _model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  create (item: T, callback: (error: any, result: any) => void) {
    this._model.create(item, (error :Error, result: T) => {
      if(error) {
        callback(new CostControllException('Create Failed. '+error.message, error, 500), null);
      }else {
        callback(null, result);
      }
    });

  }

  retrieve (field:any, callback: (error: any, result: any) => void) {
    this._model.find(field, (error :Error, result: T) => {
      if(error) {
        callback(new CostControllException('retrieve Failed. '+error.message, error, 500), null);
      } else {
        callback(null, result);
      }
    });
  }

  update (_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    this._model.update({_id: _id}, item, (error :Error, result: T) => {
      if(error) {
        callback(new CostControllException('update Failed. '+error.message, error, 500), null);
      } else {
        callback(null, result);
      }
    });

  }

  delete (_id: string, callback:(error: any, result: any) => void) {
    this._model.remove({_id: this.toObjectId(_id)}, (error :Error) => {
      if(error) {
        callback(new CostControllException('Delete Failed. '+error.message, error, 500), null);
      } else {
        callback(null, 'Done.');
      }
    });

  }

  findById (_id: string, callback: (error: any, result: T) => void) {
    this._model.findById( _id, (error :Error, result: T) => {
      if(error) {
        callback(new CostControllException('findById Failed. '+error.message, error, 500), null);
      } else {
        callback(null, result);
      }
    });
  }


  toObjectId (_id: string) : mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id);
  }

  findAndPopulate(searchField: any, populateField :any, callback:(err: any, result: any)=>void) {
    this._model.find(searchField).populate(populateField).exec((error :Error, result: T) => {
      if(error) {
        callback(new CostControllException('findAndPopulate Failed. '+error.message, error, 500), null);
      } else {
        callback(null, result);
      }
    });
  }

  findOneAndUpdate(query: any, newData: any, options: any, callback:(err: any, result: any)=>void) {
    this._model.findOneAndUpdate(query, newData, options, (error :Error, result: T) => {
      if(error) {
        callback(new CostControllException('findAndUpdate Failed. '+error.message, error, 500), null);
      }else {
        callback(null, result);
      }
    });
  }

  insertMany(data: any, callback:(err: any, result : any)=> void) {
    console.log('Inserting into base repo : '+JSON.stringify(data));
    this._model.insertMany(data, (error :Error, result: T) => {
      if(error) {
        callback(new CostControllException('InsertMany Failed. '+error.message, error, 500), null);
      } else {
        callback(null, result);
      }
    });
  }

  aggregate(field :any, callback: (error:any, result : any)=> void ) {
    this._model.aggregate( field).exec((error, result) => {
      if(error) {
        callback(new CostControllException('aggregate Failed. '+error.message, error, 500), null);
      } else {
        callback(null, result);
      }
    });
  }

  findByIdWithProjection(_id: string, projection: any, callback: (error: any, result: any) => void) {
    this._model.findById(_id, projection).exec((error, result:T)=> {
      if(error) {
        callback(new CostControllException('retrieveByProjection Failed. '+error.message, error, 500), null);
      } else {
        callback(null, result);
      }
    });
  }
  /*create(item: T, callback: (error: any, result: any) => void) {
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
    this._model.find(field, projection).lean().exec((err, res) => {
      callback(err, res);
    });
  }
  countWithLean(field: any,projection:any, callback: (error: any, result: any) => void) {
    console.time('count time');
    this._model.find(field, projection).lean().exec((err, res) => {
      console.timeEnd('count time');
      callback(err, res);
    });*/

 /* update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    this._model.update({_id: _id}, item, callback);
  }

  updateWithQuery(query: any, item: T, options: any, callback: (error: any, result: any) => void) {
    this._model.findOneAndUpdate(query, item, options, function (err, result) {
      callback(err, result);
    });
  }

//TODO:CODE MOVE TO CANDIDATE REPOSITEORY
  updateByUserId(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    this._model.update({'userId': _id}, item, callback);

  }

  retrieveAll(excluded: any, callback: (error: any, result: any) => void) {
    this._model.find({}, excluded).lean().exec((err, res) => {
      callback(err, res);
    });
  }

  retrieveByMultiIds(query: any, excluded: any, callback: (error: any, result: T) => void) {
    this._model.find(query, excluded, callback);
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
//TODO: MOVE CODE TO ITS RELEATED REPOSITEORY
  findByName(name: string, callback: (error: any, result: T) => void) {
    this._model.find({'name': name}, callback);
  }

  toObjectId(_id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id);
  }

  findAndPopulate(searchField: any, populateField: any, callback: (err: any, result: any) => void) {
    this._model.find(searchField).populate(populateField).exec(function (err, items) {
      callback(err, items);
    });
  }
//TODO: MOVE CODE TO ITS RELEATED REPOSITEORY
  retrieveByMultiIdsAndPopulate(ids: string[], excluded: any, callback: (error: any, result: any) => void) {
    this._model.find({_id: {$in: ids}}, excluded).populate('userId').exec(function (err, items) {
      callback(err, items);
    });
  }

  retrieveAndPopulate(query : Object,included : Object, callback:(error : any, result : any) => void) {
    this._model.find(query, included).populate('userId').lean().exec(function (err, items) {
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

//TODO: MOVE CODE TO ITS RELEATED REPOSITEORY
  pushElementInArray(value: string, callback: (error: any, result: any) => void) {
    this._model.update({$push: {'proficiencies': value}}, callback);
  }
//TODO: MOVE CODE TO ITS RELEATED REPOSITEORY
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

  getCount(query: any,  callback: (error: any, result: any) => void) {
    this._model.find(query).count().lean().exec(function (err, items) {
      callback(err, items);
    });
  }*/
}

export = RepositoryBase;
