import { Building } from './building';

export class Project {
  name: string = '';
  region: string = '';
  plotArea: number;
  slabArea:number;
  podiumArea:number;
  openSpace:number;
  poolCapacity:number;
  plotPeriphery: number;
  totalNoOfBuildings:number;
  projectDuration: number;
  building: Building[] = new Array(0);
}
