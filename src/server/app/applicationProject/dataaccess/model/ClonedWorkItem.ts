import Quantity = require('./Quantity');
import Rate = require('./Rate');

class ClonedWorkItem {
  name: string;
  rateAnalysisId:number;
  active:boolean;
  quantity: Quantity;
  unit: string;
  rate: Rate;
  amount: number;
  constructor() {
    this.active = true;
  }
}
export = ClonedWorkItem;

