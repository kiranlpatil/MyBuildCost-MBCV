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
  isDirectRate : boolean;
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
    this.isDirectRate = false;
    this.active = false;
    this.unit = null;
    this.remarks = '';
  }
}
export = WorkItem;

