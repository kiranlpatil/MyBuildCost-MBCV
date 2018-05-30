import ThumbRule = require('../building/ThumbRule');
import Estimate = require('../building/Estimate');

class BuildingReport {
  _id?:string;
  name:string;
  area:number;
  thumbRule : ThumbRule;
  estimate: Estimate;

}
export = BuildingReport;
