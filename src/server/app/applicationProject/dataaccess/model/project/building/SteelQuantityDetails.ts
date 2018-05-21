import QuantityItem = require('./QuantityItem');

class SteelQuantityDetails {
  id : number;
  name:string;
  totalWeight: number;
  isDirectQuantity : boolean;
  steelQuantityItems: Array<QuantityItem>;
  totalWeightOf6mm : number = 0;
  totalWeightOf8mm : number = 0;
  totalWeightOf10mm : number = 0;
  totalWeightOf12mm : number = 0;
  totalWeightOf16mm : number = 0;
  totalWeightOf20mm : number = 0;
  totalWeightOf25mm : number = 0;
  totalWeightOf30mm : number = 0;

  constructor() {
    this.id = 0;
    this.totalWeight = 0;
    this.isDirectQuantity = false;
  }
}
export = SteelQuantityDetails;
