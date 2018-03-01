import ThumbRule = require('./ThumbRule');
import Estimate = require('./Estimate');

class BuildingReport {
  _id?:string;
  name:string;
  area:number;
  thumbRule : ThumbRule;
  estimate: Estimate;

}
export = BuildingReport;
