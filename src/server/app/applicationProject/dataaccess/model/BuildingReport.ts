import ThumbRuleReport = require('./ThumbRuleReport');
import EstimateReport = require('./EstimateReport');
import ThumbRule = require('./ThumbRule');
import Estimated = require('./Estimated');

class BuildingReport {
  _id:string;
  name:string;
  area:number;
  thumbRule : ThumbRule;
  estimated: Estimated;

}
export = BuildingReport;
