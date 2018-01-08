import { Building } from './building';

export class Project {
  name: string = '';
  region: string = '';
  plotArea: number;
  projectDuration: number;
  plotPeriphery: number;
  building: Building[] = new Array(0);
}
