import { SteelQuantityItem} from './SteelQuantityItem';

export class SteelQuantityItems {
  totalWeight: number ;
  totalWeightOf6mm : number ;
  totalWeightOf8mm : number ;
  totalWeightOf10mm : number ;
  totalWeightOf12mm : number ;
  totalWeightOf16mm : number ;
  totalWeightOf20mm : number ;
  totalWeightOf25mm : number ;
  totalWeightOf30mm : number ;
  steelQuantityItem = Array<SteelQuantityItem>();
  constructor(totalWeight: number, totalWeightOf6mm: number, totalWeightOf8mm: number, totalWeightOf10mm: number, totalWeightOf12mm: number, totalWeightOf16mm: number, totalWeightOf20mm: number, totalWeightOf25mm: number, totalWeightOf30mm: number) {
    this.totalWeight = totalWeight;
    this.totalWeightOf6mm = totalWeightOf6mm;
    this.totalWeightOf8mm = totalWeightOf8mm;
    this.totalWeightOf10mm = totalWeightOf10mm;
    this.totalWeightOf12mm = totalWeightOf12mm;
    this.totalWeightOf16mm = totalWeightOf16mm;
    this.totalWeightOf20mm = totalWeightOf20mm;
    this.totalWeightOf25mm = totalWeightOf25mm;
    this.totalWeightOf30mm = totalWeightOf30mm;
  }
}

