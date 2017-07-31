import ProficiencyModel = require('./proficiency.model');
import RoleClassModel = require('./role-class.model');
class IndustryClassModel {
  code: string;
  sort_order: string;
  name: string;
  roles: RoleClassModel[];
  proficiencies: ProficiencyModel

  constructor (name:string, code : string,sort_order : number,roles:any){
    this.name = name;
    this.roles = roles;
    this.code='4';
    this.sort_order='1';
  }
}
export = IndustryClassModel;
