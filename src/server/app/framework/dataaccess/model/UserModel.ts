import Project = require('../../../applicationProject/dataaccess/model/project/Project');
import UserSubscription = require('../../../applicationProject/dataaccess/model/project/Subscription/UserSubscription');
import UserSubscriptionForRA = require('../../../applicationProject/dataaccess/model/project/Subscription/UserSubscriptionForRA');

interface UserModel {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  typeOfApp: string;
  mobile_number: number;
  password: string;
  isActivated: boolean;
  opt: number;
  picture: string;
  social_profile_picture: string;
  activation_date: Date;
  projects: Array<Project>;
  subscription: Array<UserSubscription>;
  paymentStatus: string;
  subscriptionForRA: UserSubscriptionForRA;
}

export = UserModel;
