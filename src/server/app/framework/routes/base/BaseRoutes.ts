import express = require("express");
import UserRoutes = require("./../UserRoutes");
import sharedService = require("../../shared/logger/shared.service");

var app = express();
class BaseRoutes {

    get routes() {
        app.use("/api/user/", new UserRoutes().routes);
        app.use(sharedService.errorHandler);
        return app;
    }
}
export = BaseRoutes;
