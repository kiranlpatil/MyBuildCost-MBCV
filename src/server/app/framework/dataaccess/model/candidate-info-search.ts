import LocationModel = require("./location.model");
class CandidateInfoSearch {
  id:string;
  first_name:string;
  last_name:string;
  display_string:string;
  currentCompany:string;
  designation:string;
  location:LocationModel;
}
export = CandidateInfoSearch;
