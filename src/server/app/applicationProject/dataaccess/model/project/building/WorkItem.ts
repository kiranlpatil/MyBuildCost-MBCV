import Quantity = require('./Quantity');
import Rate = require('./Rate');
import Constants = require('../../../../shared/constants');

class WorkItem {
  name: string;
  rateAnalysisId:number;
  quantity: Quantity;
  unit: string;
  rate: Rate;
  systemRate: Rate;
  amount: number;
  remarks: string;
  active: boolean;

  constructor(name:string, rateAnalysisId:number) {
    this.name = name;
    this.rateAnalysisId = rateAnalysisId;
    this.quantity = new Quantity();
    this.rate = new Rate();
    this.systemRate = new Rate();
    this.amount = 0;
    this.active = true;
    this.unit = Constants.SQUREFEET_UNIT;
    this.remarks = '';
  }
}
export = WorkItem;

