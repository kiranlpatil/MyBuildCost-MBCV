import IRole = require("../mongoose/role");
import RoleModel = require("./role.model");
import ProficiencyModel = require("./proficiency.model");
interface IndustryModel {
  code: string;
  sort_order: number;
  name: string;
  roles: RoleModel[];
  proficiencies: ProficiencyModel
}
export = IndustryModel;
