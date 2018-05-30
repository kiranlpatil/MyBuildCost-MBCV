import { ThumbRule } from './thumbrule';
import { Estimate }  from './estimate';


export class BuildingReport {
  _id?:string;
  name:string;
  area:number;
  thumbRule : ThumbRule;
  estimate: Estimate;

}
