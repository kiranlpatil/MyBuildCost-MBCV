import { QuantityItem } from './quantity-item';

export class QuantityDetails {
  id : number;
  name: string;
  total: number;
  quantityItems : Array<QuantityItem>;

  constructor() {
    this.id = 0;
    this.total = 0;
    this.quantityItems = new Array<QuantityItem>();
  }
}
