import CentralizedRate = require('../project/CentralizedRate');
import CostHead = require('../project/building/CostHead');


class RateAnalysis {
  _id : string;
  region : string;
  buildingRates : Array<CentralizedRate>;
  buildingCostHeads: Array<CostHead>;
  projectRates : Array<CentralizedRate>;
  projectCostHeads: Array<CostHead>;
  fixedAmountCostHeads ?: Array<CostHead>;
  appType: string;

  constructor(buildingCostHeads: Array<CostHead>, buildingRates: Array<CentralizedRate>,
              projectCostHeads: Array<CostHead>, projectRates: Array<CentralizedRate>) {
    this.buildingRates = buildingRates;
    this.buildingCostHeads = buildingCostHeads;
    this.projectRates = projectRates;
    this.projectCostHeads = projectCostHeads;
  }
}
export = RateAnalysis;
