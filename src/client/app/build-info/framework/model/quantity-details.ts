import { QuantityItem } from './quantity-item';
import { SteelQuantityItems} from "./SteelQuantityItems";

export class QuantityDetails {
  id : number;
  name: string;
  total: number;
  isDirectQuantity : boolean;
  quantityItems ?: Array<QuantityItem>;
  steelQuantityItems?: SteelQuantityItems;
  constructor() {
    this.total = 0;
    //his.quantityItems = new Array<QuantityItem>();
  }
}
