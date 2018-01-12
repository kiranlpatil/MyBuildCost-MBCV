import ThumbRuleReport = require('./ThumbRuleReport');
import EstimateReport = require('./EstimateReport');

class BuildingReport {
  _id:string;
  name: string;
  area: number;
  thumbRuleReport: Array<ThumbRuleReport>;
  //thumbRuleReport: Map<string, ThumbRuleReport>;
  estimatedCost: Map<string, EstimateReport>;
  /*costHead: Array<any>;*/

  constructor() {
    /*this.costHead = [];*/
    this.thumbRuleReport = new Array<ThumbRuleReport>(0);
    this.estimatedCost = new Map<string, EstimateReport>();
  }
}
export = BuildingReport;
