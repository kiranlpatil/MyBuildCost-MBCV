import Rate = require('../project/building/Rate');
import ContractingAddOn = require('../project/building/ContractingAddOn');


class RAWorkItem {
  name: string;
  unit: string;
  rateAnalysisId: number;
  rate: Rate;
  regionName ?: string;
  isFree:boolean;
  contractingAddOns :Array<ContractingAddOn> = new Array<ContractingAddOn>();

  constructor(name:string, id:number) {
    this.name = name;
    this.rateAnalysisId = id;
    this.rate = new Rate();
  }
}
export = RAWorkItem;

