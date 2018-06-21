import express = require('express');
import UserRoutes = require('./../UserRoutes');
import sharedService = require('../../shared/logger/shared.service');
import ProjectRoutes = require('./../../../applicationProject/routes/ProjectRoutes');
import ReportRoutes = require('./../../../applicationProject/routes/ReportRoutes');
import RateAnalysisRoutes = require('./../../../applicationProject/routes/RateAnalysisRoutes');
import SubscriptionRout = require("../../../applicationProject/routes/SubscriptionRoutes");

var app = express();

class BaseRoutes {

  get routes() {
    app.use('/api/user/', new UserRoutes().routes);
    app.use('/api/project/', new ProjectRoutes().routes);
    app.use('/api/report/', new ReportRoutes().routes);
    app.use('/api/rateAnalysis/', new RateAnalysisRoutes().routes);
    app.use('/api/subscription/', new SubscriptionRout().routes);
    app.use(sharedService.errorHandler);
    return app;
  }
}
export = BaseRoutes;
