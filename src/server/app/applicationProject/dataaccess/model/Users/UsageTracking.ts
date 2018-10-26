class UsageTracking {
  _id: string;
  userId: string;
  deviceId: string;
  platform:string;
  browser: string;
  isMobile: boolean;
  isDesktop: boolean;
  deviceOS : string;
  appType: string;
  mobileNumber: number;
  email: string;
  workItemName ?: string;
  regionName ?: string;
  isPaidWorkItem ?: boolean;

  constructor() {}
}
export = UsageTracking;

