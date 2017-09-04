interface UserModel {
  user_id:string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: number;
  isCandidate: boolean;
  password: string;
  isActivated: boolean;
  isAdmin: boolean;
  opt: number;
  picture: string;
  social_profile_picture: string;
  current_theme: string;
  notifications: Array<any>;
  guide_tour:Array<string>;
}
export = UserModel;
