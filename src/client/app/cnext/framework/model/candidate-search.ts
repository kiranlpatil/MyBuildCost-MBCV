export class CandidateSearch {
  id:string;
  first_name:string;
  last_name:string;
  display_string:string;
  currentCompany:string;
  designation:string;
  location:LocationModel;
}

export class LocationModel {
  city:string;
  state:string;
  country:string;
  pin:string;
}

