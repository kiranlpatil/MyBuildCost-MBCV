import ProficiencyModel = require('./proficiency.model');
import RoleClassModel = require('./role-class.model');
class IndustryClassModel {
  code: string;
  sort_order: number;
  name: string;
  roles: RoleClassModel[];
  proficiencies: ProficiencyModel

  constructor (name:string, code : string,sort_order : number,roles:any){
    this.name = name;
    this.roles = roles;
    this.code=code;
    this.sort_order=sort_order;
  }
}
export = IndustryClassModel;
