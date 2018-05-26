import QuantityItem = require('./QuantityItem');
import SteelQuantityItems = require('./SteelQuantityItems');

class QuantityDetails {
  id : number;
  name:string;
  total: number;
  isDirectQuantity : boolean;
  quantityItems ?: Array<QuantityItem>;
  steelQuantityItems?: SteelQuantityItems;
  constructor() {
    this.id = 0;
    this.total = 0;
    this.isDirectQuantity = false;
  }
}
export = QuantityDetails;
