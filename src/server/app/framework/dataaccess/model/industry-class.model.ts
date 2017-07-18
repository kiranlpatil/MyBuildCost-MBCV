import IRole = require("../mongoose/role");
import ProficiencyModel = require("./proficiency.model");
import RoleClassModel = require("./role-class.model");
class IndustryClassModel {
  code: string;
  sort_order: number;
  name: string;
  roles: RoleClassModel[];
  proficiencies: ProficiencyModel
}
export = IndustryClassModel;
