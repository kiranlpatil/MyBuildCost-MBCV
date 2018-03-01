import User = require('../../../../framework/dataaccess/mongoose/user');
import Project = require('../../mongoose/Project');
import Subscription = require('../../mongoose/Subscription');

class Company {
  _id?:string;
  name: string;
  address: string;
  subscription: Subscription;
  dateOfSubscription: Date;
  users : Array<User>;
  projects : Array<Project>;
}
export = Company;
