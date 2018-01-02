import { Building } from './building';

export class Project {
  name: string = '';
  region: string = '';
  plotArea: number = '';
  projectDuration: Number = '';
  plotPeriphery: Number = '';
  building: Building[] = new Array(0);
}
