import SteelQuantityItem = require('./SteelQuantityItem');

class SteelQuantityItems {
  totalWeightOfDiameter : any;
  unit : string;
  steelQuantityItem = Array<SteelQuantityItem>();
  constructor() {
    this.totalWeightOfDiameter = {};
    this.unit =null;
    this.steelQuantityItem= [];
  }
}
export = SteelQuantityItems;
