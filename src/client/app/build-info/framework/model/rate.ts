import { RateItem } from './RateItem';

export class Rate {
  total: number;
  quantity: number;
  unit :string;
  item: RateItem[] = new Array(0);
}
