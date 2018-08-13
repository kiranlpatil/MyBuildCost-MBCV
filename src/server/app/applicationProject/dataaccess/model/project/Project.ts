import Building = require('./building/Building');
import Category = require('./building/CostHead');
import Rate = require('./building/Rate');
import CostHead = require('./building/CostHead');
import CentralizedRate = require('./CentralizedRate');

class Project {
  _id?:string;
  name: string;
  activeStatus:boolean;
  region: string;
  plotPeriphery: number;
  projectDuration: number;
  plotArea: number;
  slabArea:number;
  podiumArea:number;
  openSpace:number;
  poolCapacity:number;
  totalNumOfBuildings:number;
  projectImage:string;
  buildings: Array<Building>;
  rates: Array<CentralizedRate>;
  projectCostHeads : Array<CostHead>;
}
export = Project;
