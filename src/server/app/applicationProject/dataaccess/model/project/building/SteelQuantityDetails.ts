import SteelQuantityItems = require('./SteelQuantityItems');

class SteelQuantityDetails {
  id : number;
  name:string;
  isDirectQuantity : boolean;
  total: number;
  steelQuantityItems: Array<SteelQuantityItems>;
  constructor() {
    this.id = 0;
    this.isDirectQuantity = false;
    this.total = 0;
  }
}
export = SteelQuantityDetails;
