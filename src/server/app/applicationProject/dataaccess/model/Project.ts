import Building = require('./Building');

class Project {
  name: string;
  region: string;
  plotPeriphery: number;
  projectDuration: number;
  plotArea: number;
  building: Array<Building>;
}
export = Project;
