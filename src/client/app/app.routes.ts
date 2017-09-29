import {Routes} from "@angular/router";
import {DashboardRoutes} from "./framework/dashboard/index";
import {StartRoutes} from "./framework/start/start.routes";
import {AboutRoutes} from "./framework/dashboard/about/index";
import {ActivateUserRoutes} from "./framework/registration/activate-user/activate-user.routes";
import {RecruiterDashboard} from "./cnext/framework/recruiter-dashboard/recruiter-dashboard.routes";
import {CandidateSummary} from "./cnext/framework/one-page-summary/candidate-summary/candidate-summary.routes";
import {ProfileCreator} from "./cnext/framework/candidate-profile/candidate-profile.routes";
import {RecruiterSummary} from "./cnext/framework/one-page-summary/recruiter-job-summary/recruiter-job-summary.routes";
import {CandidateDashboard} from "./cnext/framework/candidate-dashboard/candidate-dashboard.routes";
import {JobDashboardRoutes} from "./cnext/framework/recruiter-dashboard/job-dashboard/job-dashboard.routes";
import {CandidateCompare} from "./cnext/framework/single-page-compare-view/candidate-compare-view/candidate-compare-view.routes";
import {JobCompare} from "./cnext/framework/single-page-compare-view/job-compare-view/job-compare-view.routes";
import {JobPosterRoutes} from "./cnext/framework/job-poster/job-poster.routes";
import {ValuePortrait} from "./cnext/framework/value-portrait/value-portrait-container.routes";
import {LandingPageRoutes} from "./framework/landing-page/landing-page.routes";
import {ShareContainerRoutes} from "./cnext/framework/share-container/share-container.routes";


export const routes: Routes = [
  {
    path: 'signin',
    loadChildren: '/app/user/user.module#UserModule'
  },
  ...LandingPageRoutes,
  ...ActivateUserRoutes,
  ...DashboardRoutes,
  ...CandidateDashboard,
  ...RecruiterDashboard,
  ...RecruiterSummary,
  ...CandidateCompare,
  ...JobCompare,
  ...AboutRoutes,
  ...ProfileCreator,
  ...CandidateSummary,
  ...ValuePortrait,
  ...JobDashboardRoutes,
  ...JobPosterRoutes,
  ...ShareContainerRoutes,
  ...StartRoutes
];
