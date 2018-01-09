import Building = require('./Building');
import Category = require('./Category');
import Rate = require('./Rate');

class Project {
  name: string;
  region: string;
  plotPeriphery: number;
  projectDuration: number;
  plotArea: number;
  building: Array<Building>;
  category: Array<Category>;
  rate: Array<Rate>;
}
export = Project;
