import { SteelQuantityItem } from './SteelQuantityItem';

export class SteelQuantityItems {
  totalWeightOfDiameter: any;
  steelQuantityItem = Array<SteelQuantityItem>();
  unit: string;
  constructor() {
    this.totalWeightOfDiameter = {};
    this.unit =null;
    this.steelQuantityItem= [];
  }
}
