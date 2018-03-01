import Building = require('./building/Building');
import Category = require('./building/CostHead');
import Rate = require('./building/Rate');

class Project {
  _id?:string;
  name: string;
  region: string;
  plotPeriphery: number;
  projectDuration: number;
  plotArea: number;
  slabArea:number;
  podiumArea:number;
  openSpace:number;
  poolCapacity:number;
  totalNumOfBuildings:number;
  buildings: Array<Building>;
  costHeads: Array<Category>;
  rates: Array<Rate>;
}
export = Project;
