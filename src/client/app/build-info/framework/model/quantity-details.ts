import { QuantityItem } from './quantity-item';

export class QuantityDetails {
  id : number;
  name: string;
  total: number;
  isDirectQuantity : boolean;
  quantityItems : Array<QuantityItem>;

  constructor() {
    this.total = 0;
    this.quantityItems = new Array<QuantityItem>();
  }
}
