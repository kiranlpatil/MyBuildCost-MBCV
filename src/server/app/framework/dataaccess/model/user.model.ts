interface UserModel {
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: number;
    password: string;
    isActivated: boolean;
    opt: number;
    picture: string;
    document1: Array<any>;
    document2:string;
    document3:string;
    social_profile_picture:string;
    current_theme: string;
    notifications: Array<any>;
}
export = UserModel;
