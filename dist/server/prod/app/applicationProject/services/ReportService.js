"use strict";
var ProjectRepository = require("../dataaccess/repository/ProjectRepository");
var BuildingRepository = require("../dataaccess/repository/BuildingRepository");
var UserService = require("./../../framework/services/UserService");
var ProjectAsset = require("../../framework/shared/projectasset");
var BuildingReport = require("../dataaccess/model/project/reports/BuildingReport");
var ThumbRuleReport = require("../dataaccess/model/project/reports/ThumbRuleReport");
var AuthInterceptor = require("../../framework/interceptor/auth.interceptor");
var EstimateReport = require("../dataaccess/model/project/reports/EstimateReport");
var ProjectReport = require("../dataaccess/model/project/reports/ProjectReport");
var ThumbRule = require("../dataaccess/model/project/building/ThumbRule");
var Estimate = require("../dataaccess/model/project/building/Estimate");
var RateAnalysisService = require("./RateAnalysisService");
var alasql = require("alasql");
var Constants = require("../shared/constants");
var ProjectService = require("./ProjectService");
var MaterialTakeOffFlatDetailsDTO = require("../dataaccess/dto/Report/MaterialTakeOffFlatDetailsDTO");
var MaterialTakeOffFiltersListDTO = require("../dataaccess/dto/Report/MaterialTakeOffFiltersListDTO");
var MaterialTakeOffReport = require("../dataaccess/model/project/reports/MaterialTakeOffReport");
var MaterialTakeOffTableView = require("../dataaccess/model/project/reports/MaterialTakeOffTableView");
var MaterialTakeOffTableViewContent = require("../dataaccess/model/project/reports/MaterialTakeOffTableViewContent");
var MaterialTakeOffTableViewSubContent = require("../dataaccess/model/project/reports/MaterialTakeOffTableViewSubContent");
var MaterialTakeOffTableViewHeaders = require("../dataaccess/model/project/reports/MaterialTakeOffTableViewHeaders");
var MaterialTakeOffTableViewFooter = require("../dataaccess/model/project/reports/MaterialTakeOffTableViewFooter");
var CostControllException = require("../exception/CostControllException");
var MaterialTakeOffView = require("../dataaccess/model/project/reports/MaterialTakeOffView");
var showHideCostHeadButton_1 = require("../dataaccess/model/project/reports/showHideCostHeadButton");
var config = require('config');
var log4js = require('log4js');
var logger = log4js.getLogger('Report Service');
var ReportService = (function () {
    function ReportService() {
        this.costHeadsList = new Array();
        this.projectRepository = new ProjectRepository();
        this.buildingRepository = new BuildingRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
        this.authInterceptor = new AuthInterceptor();
        this.userService = new UserService();
        this.rateAnalysisService = new RateAnalysisService();
    }
    ReportService.prototype.getReport = function (projectId, reportType, rateUnit, areaType, user, callback) {
        var _this = this;
        logger.info('Report Service, getReport has been hit');
        var query = { _id: projectId };
        var populate = { path: 'buildings' };
        this.projectRepository.findAndPopulate(query, populate, function (error, result) {
            logger.info('Report Service, findAndPopulate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var buildings = result[0].buildings;
                var typeOfArea;
                var totalArea = void 0;
                var choice = areaType;
                switch (choice) {
                    case Constants.SLAB_AREA:
                        {
                            typeOfArea = Constants.TOTAL_SLAB_AREA;
                            break;
                        }
                    case Constants.SALEABLE_AREA:
                        {
                            typeOfArea = Constants.TOTAL_SALEABLE_AREA;
                            break;
                        }
                    case Constants.CARPET_AREA:
                        {
                            typeOfArea = Constants.TOTAL_CARPET_AREA;
                            break;
                        }
                    default: callback(error, null);
                }
                var totalOfArea = alasql('VALUE OF SELECT ROUND(SUM(' + typeOfArea + '),2) FROM ?', [buildings]);
                if (rateUnit === Constants.SQUREMETER_UNIT) {
                    totalArea = totalOfArea * config.get(Constants.SQUARE_METER);
                }
                else {
                    totalArea = totalOfArea;
                }
                var projectReport = new ProjectReport();
                projectReport.buildings = _this.generateReportByCostHeads(buildings, typeOfArea, rateUnit);
                var projectCostHeads = result[0].projectCostHeads;
                var projectRates = result[0].rates;
                if (projectCostHeads !== null) {
                    projectReport.commonAmenities = _this.generateReportForProjectCostHeads(projectCostHeads, projectRates, totalArea, rateUnit);
                }
                else {
                    callback(null, error);
                }
                projectReport.showHideCostHeadButtons = _this.costHeadsList;
                projectReport.totalAreaOfBuildings = totalArea;
                callback(null, { data: projectReport, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ReportService.prototype.generateReportByCostHeads = function (buildings, typeOfArea, rateUnit) {
        var buildingsReport = new Array();
        for (var _i = 0, buildings_1 = buildings; _i < buildings_1.length; _i++) {
            var building = buildings_1[_i];
            var buildingReport = new BuildingReport;
            buildingReport.name = building.name;
            buildingReport._id = building._id;
            if (rateUnit === Constants.SQUREMETER_UNIT) {
                buildingReport.area = building[typeOfArea] * config.get(Constants.SQUARE_METER);
            }
            else {
                buildingReport.area = building[typeOfArea];
            }
            var thumbRule = new ThumbRule();
            var estimate = new Estimate();
            var thumbRuleReports = new Array();
            var estimatedReports = new Array();
            this.getThumbRuleAndEstimatedReport(building, buildingReport, thumbRuleReports, estimatedReports, rateUnit);
            var totalRates = alasql('SELECT ROUND(SUM(amount),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?', [thumbRuleReports]);
            thumbRule.totalRate = totalRates[0].totalRate;
            thumbRule.totalBudgetedCost = Math.round(totalRates[0].totalAmount);
            thumbRule.thumbRuleReports = thumbRuleReports;
            var totalEstimatedRates = alasql('SELECT ROUND(SUM(total),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?', [estimatedReports]);
            estimate.totalRate = totalEstimatedRates[0].totalRate;
            estimate.totalEstimatedCost = totalEstimatedRates[0].totalAmount;
            estimate.estimatedCosts = estimatedReports;
            buildingReport.thumbRule = thumbRule;
            buildingReport.estimate = estimate;
            buildingsReport.push(buildingReport);
        }
        console.log('SHow Hide List : ' + JSON.stringify(this.costHeadsList));
        return (buildingsReport);
    };
    ReportService.prototype.getThumbRuleAndEstimatedReport = function (building, buildingReport, thumbRuleReports, estimatedReports, rateUnit) {
        var costHeadButtonForBuilding = new showHideCostHeadButton_1.AddCostHeadButton();
        costHeadButtonForBuilding.buildingName = building.name;
        for (var _i = 0, _a = building.costHeads; _i < _a.length; _i++) {
            var costHead = _a[_i];
            if (costHead.active) {
                var thumbRuleReport = new ThumbRuleReport();
                thumbRuleReport.name = costHead.name;
                thumbRuleReport.rateAnalysisId = costHead.rateAnalysisId;
                thumbRuleReport.amount = Math.round(costHead.budgetedCostAmount);
                thumbRuleReport.costHeadActive = costHead.active;
                thumbRuleReport.rate = thumbRuleReport.amount / buildingReport.area;
                thumbRuleReports.push(thumbRuleReport);
                var estimateReport = new EstimateReport();
                estimateReport = this.getEstimatedReport(building.rates, costHead, buildingReport.area, rateUnit);
                estimatedReports.push(estimateReport);
            }
            else {
                costHeadButtonForBuilding.showHideAddCostHeadButton = false;
            }
        }
        this.costHeadsList.push(costHeadButtonForBuilding);
    };
    ReportService.prototype.getEstimatedReport = function (centralizedRates, costHead, area, rateUnit) {
        var estimateReport = new EstimateReport();
        estimateReport.name = costHead.name;
        estimateReport.rateAnalysisId = costHead.rateAnalysisId;
        var costHeadCategories = costHead.categories;
        var projectService = new ProjectService();
        var categoriesObj = projectService.getCategoriesListWithCentralizedRates(costHeadCategories, centralizedRates);
        estimateReport.total = categoriesObj.categoriesAmount;
        estimateReport.rate = estimateReport.total / area;
        return estimateReport;
    };
    ReportService.prototype.getEstimatedReportForNonCategories = function (thumbRuleReport) {
        var estimateReport = new EstimateReport();
        estimateReport.name = thumbRuleReport.name;
        estimateReport.rateAnalysisId = thumbRuleReport.rateAnalysisId;
        estimateReport.total = thumbRuleReport.amount;
        estimateReport.disableCostHeadView = true;
        estimateReport.rate = thumbRuleReport.rate;
        return estimateReport;
    };
    ReportService.prototype.generateReportForProjectCostHeads = function (projectCostHeads, projectRates, totalArea, rateUnit) {
        var commonAmenitiesReport = new Array();
        var projectReport = new BuildingReport;
        projectReport.name = Constants.AMENITIES;
        projectReport.area = totalArea;
        var thumbRule = new ThumbRule();
        var estimate = new Estimate();
        var thumbRuleReports = new Array();
        var estimatedReports = new Array();
        this.getThumbRuleAndEstimatedReportForProjectCostHead(projectCostHeads, projectRates, projectReport, thumbRuleReports, estimatedReports, totalArea, rateUnit);
        var totalRates = alasql('SELECT ROUND(SUM(amount),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?', [thumbRuleReports]);
        thumbRule.totalRate = totalRates[0].totalRate;
        thumbRule.totalBudgetedCost = Math.round(totalRates[0].totalAmount);
        thumbRule.thumbRuleReports = thumbRuleReports;
        var totalEstimatedRates = alasql('SELECT ROUND(SUM(total),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?', [estimatedReports]);
        estimate.totalRate = totalEstimatedRates[0].totalRate;
        estimate.totalEstimatedCost = totalEstimatedRates[0].totalAmount;
        estimate.estimatedCosts = estimatedReports;
        projectReport.thumbRule = thumbRule;
        projectReport.estimate = estimate;
        commonAmenitiesReport.push(projectReport);
        console.log('SHow Hide List : ' + JSON.stringify(this.costHeadsList));
        return (commonAmenitiesReport);
    };
    ReportService.prototype.getThumbRuleAndEstimatedReportForProjectCostHead = function (projectCostHead, projectRates, projectReport, thumbRuleReports, estimatedReports, totalArea, rateUnit) {
        var costHeadButtonForBuilding = new showHideCostHeadButton_1.AddCostHeadButton();
        costHeadButtonForBuilding.buildingName = projectReport.name;
        for (var _i = 0, projectCostHead_1 = projectCostHead; _i < projectCostHead_1.length; _i++) {
            var costHead = projectCostHead_1[_i];
            if (costHead.active) {
                var thumbRuleReport = new ThumbRuleReport();
                thumbRuleReport.name = costHead.name;
                thumbRuleReport.rateAnalysisId = costHead.rateAnalysisId;
                thumbRuleReport.amount = Math.round(costHead.budgetedCostAmount);
                thumbRuleReport.costHeadActive = costHead.active;
                thumbRuleReport.rate = thumbRuleReport.amount / totalArea;
                thumbRuleReports.push(thumbRuleReport);
                var estimateReport = new EstimateReport();
                if (costHead.categories.length > 0) {
                    estimateReport = this.getEstimatedReport(projectRates, costHead, totalArea, rateUnit);
                }
                else {
                    estimateReport = this.getEstimatedReportForNonCategories(thumbRuleReport);
                }
                estimatedReports.push(estimateReport);
            }
            else {
                costHeadButtonForBuilding.showHideAddCostHeadButton = false;
            }
        }
        this.costHeadsList.push(costHeadButtonForBuilding);
    };
    ReportService.prototype.getCostHeads = function (url, user, callback) {
        var _this = this;
        logger.info('Report Service, getCostHeads has been hit');
        this.rateAnalysisService.getCostHeads(url, user, function (error, result) {
            if (error) {
                console.log('error : ' + JSON.stringify(error));
                callback(error, null);
            }
            else {
                callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ReportService.prototype.getWorkItems = function (url, user, callback) {
        var _this = this;
        logger.info('Report Service, getWorkItems has been hit');
        this.rateAnalysisService.getWorkItems(url, user, function (error, result) {
            if (error) {
                console.log('error : ' + JSON.stringify(error));
                callback(error, null);
            }
            else {
                callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ReportService.prototype.getMaterialDetails = function (projectId, user, callback) {
        var _this = this;
        logger.info('Report Service, getMaterialDetails has been hit');
        var query = { _id: projectId };
        var populate = { path: 'buildings' };
        this.projectRepository.findAndPopulate(query, populate, function (error, result) {
            logger.info('Report Service, findAndPopulate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, _this.getBuildingMaterialDetails(result[0].buildings));
            }
        });
    };
    ReportService.prototype.getBuildingMaterialDetails = function (buildings) {
        var materialTakeOffFlatDetailsArray = new Array();
        var buildingName;
        for (var _i = 0, buildings_2 = buildings; _i < buildings_2.length; _i++) {
            var building = buildings_2[_i];
            buildingName = building.name;
            this.addMaterialDTOForActiveCostHeadInDTOArray(building, buildingName, materialTakeOffFlatDetailsArray);
        }
        return materialTakeOffFlatDetailsArray;
    };
    ReportService.prototype.getMaterialFilters = function (projectId, user, callback) {
        var _this = this;
        logger.info('Report Service, getMaterialFilters has been hit');
        var query = { _id: projectId };
        var populate = { path: 'buildings' };
        this.projectRepository.findAndPopulate(query, populate, function (error, result) {
            logger.info('Report Service, findAndPopulate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, _this.getMaterialTakeOffFilterObject(result[0].buildings));
            }
        });
    };
    ReportService.prototype.getMaterialTakeOffReport = function (projectId, building, elementWiseReport, element, user, callback) {
        var _this = this;
        logger.info('Report Service, getMaterialTakeOffReport has been hit');
        var query = { _id: projectId };
        var populate = { path: 'buildings' };
        if (building !== Constants.STR_ALL_BUILDING) {
            populate = { path: 'buildings', match: { name: building } };
        }
        this.projectRepository.findAndPopulate(query, populate, function (error, result) {
            logger.info('Report Service, findAndPopulate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                if (result[0].buildings.length === 0) {
                    callback(new CostControllException('Unable to find Building', null), null);
                }
                var materialTakeOffFlatDetailsArray = _this.getBuildingMaterialDetails(result[0].buildings);
                var materialReportRowData = _this.getMaterialDataFromFlatDetailsArray(elementWiseReport, element, building, materialTakeOffFlatDetailsArray);
                if (materialReportRowData.length > 0 && materialReportRowData[0].header !== undefined) {
                    var materialTakeOffReport = new MaterialTakeOffReport(null, null, null);
                    materialTakeOffReport.secondaryView = {};
                    _this.populateMaterialTakeOffReportFromRowData(materialReportRowData, materialTakeOffReport, elementWiseReport, building);
                    _this.calculateTotalOfMaterialTakeReport(materialTakeOffReport, elementWiseReport, building);
                    var responseData = {};
                    responseData[element] = materialTakeOffReport;
                    callback(null, responseData);
                }
                else {
                    callback(new CostControllException(Constants.MESSAGE_FOR_COSTHEADS_MISSING_COST_ESTIMATION + element, null), null);
                }
            }
        });
    };
    ReportService.prototype.calculateTotalOfMaterialTakeReport = function (materialTakeOffReport, elementWiseReport, building) {
        var reportTotal = 0;
        var recordUnit;
        var secondaryViewMaterialData = materialTakeOffReport.secondaryView;
        for (var _i = 0, _a = Object.keys(secondaryViewMaterialData); _i < _a.length; _i++) {
            var secondaryViewData = _a[_i];
            var contentTotal = 0;
            var table = secondaryViewMaterialData[secondaryViewData].table;
            for (var _b = 0, _c = Object.keys(table.content); _b < _c.length; _b++) {
                var content = _c[_b];
                if (Object.keys(table.content[content].subContent).length > 0) {
                    table.content[content].columnTwo = 0;
                    var tableSubContent = table.content[content].subContent;
                    for (var _d = 0, _e = Object.keys(tableSubContent); _d < _e.length; _d++) {
                        var subContent = _e[_d];
                        if (Object.keys(tableSubContent[subContent].subContent).length > 0) {
                            tableSubContent[subContent].columnTwo = 0;
                            for (var _f = 0, _g = Object.keys(tableSubContent[subContent].subContent); _f < _g.length; _f++) {
                                var innerSubContent = _g[_f];
                                tableSubContent[subContent].columnTwo =
                                    (parseFloat(tableSubContent[subContent].columnTwo) +
                                        parseFloat(tableSubContent[subContent].subContent[innerSubContent].columnTwo)).toFixed(Constants.NUMBER_OF_FRACTION_DIGIT);
                            }
                        }
                        tableSubContent[subContent].columnTwo =
                            Math.ceil(tableSubContent[subContent].columnTwo);
                        table.content[content].columnTwo = (parseFloat(table.content[content].columnTwo) +
                            parseFloat(tableSubContent[subContent].columnTwo)).toFixed(Constants.NUMBER_OF_FRACTION_DIGIT);
                    }
                    table.content[content].columnTwo = Math.ceil(table.content[content].columnTwo);
                    contentTotal = contentTotal + table.content[content].columnTwo;
                }
                table.footer.columnTwo = contentTotal;
                secondaryViewMaterialData[secondaryViewData].title = contentTotal + ' ' + table.footer.columnThree;
            }
            reportTotal = reportTotal + contentTotal;
            recordUnit = table.footer.columnThree;
            if (elementWiseReport === Constants.STR_MATERIAL && building === Constants.STR_ALL_BUILDING) {
                materialTakeOffReport.subTitle.columnTwo = reportTotal;
                materialTakeOffReport.subTitle.columnThree = recordUnit;
                materialTakeOffReport.subTitle.columnOne = ': ' + reportTotal + ' ' + materialTakeOffReport.subTitle.columnThree;
            }
        }
    };
    ReportService.prototype.populateMaterialTakeOffReportFromRowData = function (materialReportRowData, materialTakeOffReport, elementWiseReport, building) {
        for (var _i = 0, materialReportRowData_1 = materialReportRowData; _i < materialReportRowData_1.length; _i++) {
            var record = materialReportRowData_1[_i];
            if (materialTakeOffReport.secondaryView[record.header] === undefined ||
                materialTakeOffReport.secondaryView[record.header] === null) {
                materialTakeOffReport.title = building;
                if (materialTakeOffReport.subTitle === null || materialTakeOffReport.subTitle === undefined) {
                    var materialTakeOffReportSubTitle = new MaterialTakeOffView('', 0, '');
                    materialTakeOffReport.subTitle = materialTakeOffReportSubTitle;
                }
                materialTakeOffReport.secondaryView[record.header] = {};
            }
            var materialTakeOffSecondaryView = materialTakeOffReport.secondaryView[record.header];
            if (materialTakeOffSecondaryView.table === undefined || materialTakeOffSecondaryView.table === null) {
                materialTakeOffSecondaryView.table = new MaterialTakeOffTableView(null, null, null);
            }
            var table = materialTakeOffSecondaryView.table;
            if (table.content === null) {
                table.content = {};
            }
            if (table.header === null) {
                var columnOne = 'Item';
                var columnTwo = 'Quantity';
                var columnThree = 'Unit';
                if (elementWiseReport === Constants.STR_COSTHEAD && building === Constants.STR_ALL_BUILDING) {
                    columnOne = 'Building';
                }
                table.header = new MaterialTakeOffTableViewHeaders(columnOne, columnTwo, columnThree);
            }
            var materialTakeOffTableViewSubContent = null;
            if (record.subValue && record.subValue !== 'default' && record.subValue !== 'Direct') {
                materialTakeOffTableViewSubContent =
                    new MaterialTakeOffTableViewSubContent(record.subValue, record.Total, record.unit);
            }
            if (table.content[record.costHeadName] === undefined || table.content[record.costHeadName] === null) {
                table.content[record.costHeadName] = new MaterialTakeOffTableViewContent(record.costHeadName, 0, record.unit, {});
            }
            if (table.content[record.costHeadName].subContent[record.rowValue] === undefined ||
                table.content[record.costHeadName].subContent[record.rowValue] === null) {
                table.content[record.costHeadName].subContent[record.rowValue] =
                    new MaterialTakeOffTableViewContent(record.rowValue, 0, record.unit, {});
            }
            var tableViewSubContent = table.content[record.costHeadName].subContent[record.rowValue];
            tableViewSubContent.columnTwo = tableViewSubContent.columnTwo + record.Total;
            var tableViewContent = table.content[record.costHeadName];
            tableViewContent.columnTwo = tableViewContent.columnTwo + record.Total;
            if (materialTakeOffTableViewSubContent) {
                materialTakeOffTableViewSubContent.columnTwo = parseFloat(materialTakeOffTableViewSubContent.columnTwo).toFixed(Constants.NUMBER_OF_FRACTION_DIGIT);
                tableViewContent.subContent[record.rowValue].subContent[record.subValue] = materialTakeOffTableViewSubContent;
            }
            var materialTakeOffTableViewFooter = null;
            if (table.footer === undefined || table.footer === null) {
                table.footer =
                    new MaterialTakeOffTableViewFooter('Total', 0, record.unit);
            }
        }
    };
    ReportService.prototype.getMaterialDataFromFlatDetailsArray = function (elementWiseReport, element, building, materialTakeOffFlatDetailsArray) {
        var sqlQuery;
        switch (elementWiseReport) {
            case Constants.STR_COSTHEAD:
                sqlQuery = this.alasqlQueryForMaterialTakeOffDataCostHeadWise(building);
                break;
            case Constants.STR_MATERIAL:
                sqlQuery = this.alasqlQueryForMaterialTakeOffDataMaterialWise(building);
                break;
        }
        var materialReportRowData = alasql(sqlQuery, [materialTakeOffFlatDetailsArray, element]);
        return materialReportRowData;
    };
    ReportService.prototype.alasqlQueryForMaterialTakeOffDataMaterialWise = function (building) {
        var select = Constants.STR_EMPTY;
        var from = Constants.ALASQL_FROM;
        var where = Constants.STR_EMPTY;
        var groupBy = Constants.ALASQL_GROUP_BY_MATERIAL_TAKEOFF_MATERIAL_WISE;
        var orderBy = Constants.ALASQL_ORDER_BY_MATERIAL_TAKEOFF_MATERIAL_WISE;
        var sqlQuery;
        if (building !== Constants.STR_ALL_BUILDING) {
            select = Constants.ALASQL_SELECT_MATERIAL_TAKEOFF_MATERIAL_WISE + Constants.STR_COMMA_SPACE +
                Constants.ALASQL_SELECT_QUANTITY_NAME_AS;
            where = Constants.ALASQL_WHERE_MATERIAL_NAME_EQUALS_TO +
                Constants.STR_AND + Constants.ALASQL_SELECT_BUILDING_NAME + building + Constants.STR_DOUBLE_INVERTED_COMMA;
        }
        else {
            select = Constants.ALASQL_SELECT_MATERIAL_TAKEOFF_MATERIAL_WISE;
            where = Constants.ALASQL_WHERE_MATERIAL_NAME_EQUALS_TO;
        }
        where = where + Constants.ALASQL_AND_MATERIAL_NOT_LABOUR;
        sqlQuery = select + from + where + groupBy + orderBy;
        return sqlQuery;
    };
    ReportService.prototype.alasqlQueryForMaterialTakeOffDataCostHeadWise = function (building) {
        var select = Constants.STR_EMPTY;
        var from = Constants.ALASQL_FROM;
        var where = Constants.STR_EMPTY;
        var groupBy = Constants.STR_EMPTY;
        var orderBy = Constants.STR_EMPTY;
        var sqlQuery;
        if (building !== Constants.STR_ALL_BUILDING) {
            select = Constants.ALASQL_SELECT_MATERIAL_TAKEOFF_COSTHEAD_WISE + Constants.STR_COMMA_SPACE +
                Constants.ALASQL_SELECT_QUANTITY_NAME_AS;
            where = Constants.ALASQL_WHERE_COSTHEAD_NAME_EQUALS_TO
                + Constants.STR_AND + Constants.ALASQL_SELECT_BUILDING_NAME + building + Constants.STR_DOUBLE_INVERTED_COMMA;
            groupBy = Constants.ALASQL_GROUP_MATERIAL_WORKITEM_QUANTITY_MATERIAL_TAKEOFF_COSTHEAD_WISE;
            orderBy = Constants.ALASQL_ORDER_BY_MATERIAL_WORKITEM_COSTHEAD_WISE;
        }
        else {
            select = Constants.ALASQL_SELECT_MATERIAL_TAKEOFF_COSTHEAD_WISE_FOR_ALL_BUILDINGS;
            where = Constants.ALASQL_WHERE_COSTHEAD_NAME_EQUALS_TO;
            groupBy = Constants.ALASQL_GROUP_MATERIAL_BUILDING_QUANTITY_MATERIAL_TAKEOFF_COSTHEAD_WISE_FOR_ALL_BUILDINGS;
            orderBy = Constants.ALASQL_ORDER_BY_MATERIAL_BUILDING_MATERIAL_TAKEOFF_COSTHEAD_WISE;
        }
        where = where + Constants.ALASQL_AND_MATERIAL_NOT_LABOUR;
        sqlQuery = select + from + where + groupBy + orderBy;
        return sqlQuery;
    };
    ReportService.prototype.getMaterialTakeOffFilterObject = function (buildings) {
        var materialTakeOffFlatDetailsArray = this.getBuildingMaterialDetails(buildings);
        var column = Constants.STR_BUILDING_NAME;
        var buildingList = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray);
        column = Constants.STR_COSTHEAD_NAME;
        var costHeadList = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray);
        column = Constants.STR_Material_NAME;
        var materialList = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray, Constants.ALASQL_MATERIAL_NOT_LABOUR_NO_LIKE);
        var materialTakeOffFiltersObject = new MaterialTakeOffFiltersListDTO(buildingList, costHeadList, materialList);
        return materialTakeOffFiltersObject;
    };
    ReportService.prototype.getDistinctArrayOfStringFromAlasql = function (column, materialTakeOffFlatDetailsArray, notLikeOptional) {
        var sqlQuery = 'SELECT DISTINCT flatData.' + column + ' FROM ? AS flatData';
        var where = ' where ' + notLikeOptional;
        if (notLikeOptional) {
            sqlQuery = sqlQuery + where;
        }
        var distinctObjectArray = alasql(sqlQuery, [materialTakeOffFlatDetailsArray]);
        var distinctNameStringArray = new Array();
        for (var _i = 0, distinctObjectArray_1 = distinctObjectArray; _i < distinctObjectArray_1.length; _i++) {
            var distinctObject = distinctObjectArray_1[_i];
            distinctNameStringArray.push(distinctObject[column]);
        }
        return distinctNameStringArray;
    };
    ReportService.prototype.addMaterialDTOForActiveCostHeadInDTOArray = function (building, buildingName, materialTakeOffFlatDetailsArray) {
        var costHeadName;
        for (var _i = 0, _a = building.costHeads; _i < _a.length; _i++) {
            var costHead = _a[_i];
            if (costHead.active) {
                costHeadName = costHead.name;
                this.addMaterialDTOForActiveCategoryInDTOArray(costHead, buildingName, costHeadName, materialTakeOffFlatDetailsArray);
            }
        }
    };
    ReportService.prototype.addMaterialDTOForActiveCategoryInDTOArray = function (costHead, buildingName, costHeadName, materialTakeOffFlatDetailsArray) {
        var categoryName;
        for (var _i = 0, _a = costHead.categories; _i < _a.length; _i++) {
            var category = _a[_i];
            if (category.active) {
                categoryName = category.name;
                this.addMaterialDTOForActiveWorkitemInDTOArray(category, buildingName, costHeadName, categoryName, materialTakeOffFlatDetailsArray);
            }
        }
    };
    ReportService.prototype.addMaterialDTOForActiveWorkitemInDTOArray = function (category, buildingName, costHeadName, categoryName, materialTakeOffFlatDetailsArray) {
        var workItemName;
        for (var _i = 0, _a = category.workItems; _i < _a.length; _i++) {
            var workItem = _a[_i];
            if (workItem.active) {
                workItemName = workItem.name;
                this.addEstimatedQuantityAndRateMaterialItemInDTOArray(workItem, buildingName, costHeadName, categoryName, workItemName, materialTakeOffFlatDetailsArray);
            }
        }
    };
    ReportService.prototype.addEstimatedQuantityAndRateMaterialItemInDTOArray = function (workItem, buildingName, costHeadName, categoryName, workItemName, materialTakeOffFlatDetailsArray) {
        var quantityName;
        if (workItem.quantity.isDirectQuantity && workItem.rate.isEstimated) {
            quantityName = Constants.STR_DIRECT;
            this.createAndAddMaterialDTOObjectInDTOArray(workItem, buildingName, costHeadName, categoryName, workItemName, quantityName, materialTakeOffFlatDetailsArray, workItem.quantity.total);
        }
        else if (workItem.quantity.isEstimated && workItem.rate.isEstimated) {
            for (var _i = 0, _a = workItem.quantity.quantityItemDetails; _i < _a.length; _i++) {
                var quantity = _a[_i];
                quantityName = quantity.name;
                this.createAndAddMaterialDTOObjectInDTOArray(workItem, buildingName, costHeadName, categoryName, workItemName, quantityName, materialTakeOffFlatDetailsArray, quantity.total);
            }
        }
    };
    ReportService.prototype.createAndAddMaterialDTOObjectInDTOArray = function (workItem, buildingName, costHeadName, categoryName, workItemName, quantityName, materialTakeOffFlatDetailsArray, quantity) {
        if (categoryName === Constants.STEEL) {
            for (var _i = 0, _a = workItem.quantity.quantityItemDetails; _i < _a.length; _i++) {
                var quantityItem = _a[_i];
                for (var _b = 0, _c = Object.keys(quantityItem.steelQuantityItems.totalWeightOfDiameter); _b < _c.length; _b++) {
                    var material = _c[_b];
                    var materialTakeOffFlatDetailDTO = new MaterialTakeOffFlatDetailsDTO(buildingName, costHeadName, categoryName, workItemName, material, quantityName, quantityItem.steelQuantityItems.totalWeightOfDiameter[material], quantityItem.steelQuantityItems.unit);
                    materialTakeOffFlatDetailsArray.push(materialTakeOffFlatDetailDTO);
                }
            }
        }
        else {
            for (var _d = 0, _e = workItem.rate.rateItems; _d < _e.length; _d++) {
                var rateItem = _e[_d];
                var materialTakeOffFlatDetailDTO = new MaterialTakeOffFlatDetailsDTO(buildingName, costHeadName, categoryName, workItemName, rateItem.itemName, quantityName, (quantity / workItem.rate.quantity) * rateItem.quantity, rateItem.unit);
                materialTakeOffFlatDetailsArray.push(materialTakeOffFlatDetailDTO);
            }
        }
    };
    return ReportService;
}());
Object.seal(ReportService);
module.exports = ReportService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmVwb3J0U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEVBQWlGO0FBQ2pGLGdGQUFtRjtBQUNuRixvRUFBdUU7QUFDdkUsa0VBQXFFO0FBR3JFLG1GQUFzRjtBQUN0RixxRkFBd0Y7QUFDeEYsOEVBQWlGO0FBRWpGLG1GQUFzRjtBQUN0RixpRkFBb0Y7QUFDcEYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSwyREFBOEQ7QUFFOUQsK0JBQWtDO0FBQ2xDLCtDQUFrRDtBQUNsRCxpREFBb0Q7QUFHcEQsc0dBQXlHO0FBQ3pHLHNHQUF5RztBQUN6RyxpR0FBb0c7QUFDcEcsdUdBQTBHO0FBRTFHLHFIQUF3SDtBQUN4SCwySEFBOEg7QUFDOUgscUhBQXdIO0FBQ3hILG1IQUFzSDtBQUN0SCwwRUFBNkU7QUFDN0UsNkZBQWdHO0FBQ2hHLHFHQUErRjtBQUUvRixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUU5QztJQVlFO1FBVEEsa0JBQWEsR0FBOEIsSUFBSSxLQUFLLEVBQXFCLENBQUM7UUFVeEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxtQkFBbUIsR0FB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QUFJLDRCQUE0QixHQUFHLElBQUksNkJBQTZCLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQzNHLFlBQVksRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsRUFDckcsWUFBWSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN4QywrQkFBK0IsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztpQkFDcEU7YUFDSjtRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEdBQUcsQ0FBQyxDQUFpQixVQUF1QixFQUF2QixLQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUF2QixjQUF1QixFQUF2QixJQUF1QjtnQkFBdkMsSUFBSSxRQUFRLFNBQUE7Z0JBQ2YsSUFBSSw0QkFBNEIsR0FBRyxJQUFJLDZCQUE2QixDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUMzRyxZQUFZLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsUUFBUSxFQUN0RyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pCLCtCQUErQixDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2FBQ3BFO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDSCxvQkFBQztBQUFELENBN29CQSxBQTZvQkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0IsaUJBQVMsYUFBYSxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmVwb3J0U2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9qZWN0UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9Qcm9qZWN0UmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgQnVpbGRpbmdSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L0J1aWxkaW5nUmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvQnVpbGRpbmcnKTtcclxuaW1wb3J0IEJ1aWxkaW5nUmVwb3J0ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvQnVpbGRpbmdSZXBvcnQnKTtcclxuaW1wb3J0IFRodW1iUnVsZVJlcG9ydCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL1RodW1iUnVsZVJlcG9ydCcpO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IENvc3RIZWFkID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb25nb29zZS9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgRXN0aW1hdGVSZXBvcnQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvcmVwb3J0cy9Fc3RpbWF0ZVJlcG9ydCcpO1xyXG5pbXBvcnQgUHJvamVjdFJlcG9ydCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL1Byb2plY3RSZXBvcnQnKTtcclxuaW1wb3J0IFRodW1iUnVsZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9UaHVtYlJ1bGUnKTtcclxuaW1wb3J0IEVzdGltYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0VzdGltYXRlJyk7XHJcbmltcG9ydCBSYXRlQW5hbHlzaXNTZXJ2aWNlID0gcmVxdWlyZSgnLi9SYXRlQW5hbHlzaXNTZXJ2aWNlJyk7XHJcbmltcG9ydCBDYXRlZ29yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9DYXRlZ29yeScpO1xyXG5pbXBvcnQgYWxhc3FsID0gcmVxdWlyZSgnYWxhc3FsJyk7XHJcbmltcG9ydCBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvY29uc3RhbnRzJyk7XHJcbmltcG9ydCBQcm9qZWN0U2VydmljZSA9IHJlcXVpcmUoJy4vUHJvamVjdFNlcnZpY2UnKTtcclxuaW1wb3J0IENlbnRyYWxpemVkUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9DZW50cmFsaXplZFJhdGUnKTtcclxuaW1wb3J0IFdvcmtJdGVtID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1dvcmtJdGVtJyk7XHJcbmltcG9ydCBNYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvZHRvL1JlcG9ydC9NYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTycpO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmRmlsdGVyc0xpc3REVE8gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL2R0by9SZXBvcnQvTWF0ZXJpYWxUYWtlT2ZmRmlsdGVyc0xpc3REVE8nKTtcclxuaW1wb3J0IE1hdGVyaWFsVGFrZU9mZlJlcG9ydCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL01hdGVyaWFsVGFrZU9mZlJlcG9ydCcpO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Jyk7XHJcbmltcG9ydCBNYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvTWF0ZXJpYWxUYWtlT2ZmU2Vjb25kYXJ5VmlldycpO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Q29udGVudCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL01hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0NvbnRlbnQnKTtcclxuaW1wb3J0IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld1N1YkNvbnRlbnQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvcmVwb3J0cy9NYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50Jyk7XHJcbmltcG9ydCBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdIZWFkZXJzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3SGVhZGVycycpO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyJyk7XHJcbmltcG9ydCBDb3N0Q29udHJvbGxFeGNlcHRpb24gPSByZXF1aXJlKCcuLi9leGNlcHRpb24vQ29zdENvbnRyb2xsRXhjZXB0aW9uJyk7XHJcbmltcG9ydCBNYXRlcmlhbFRha2VPZmZWaWV3ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvTWF0ZXJpYWxUYWtlT2ZmVmlldycpO1xyXG5pbXBvcnQgeyBBZGRDb3N0SGVhZEJ1dHRvbiB9IGZyb20gJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL3Nob3dIaWRlQ29zdEhlYWRCdXR0b24nO1xyXG5cclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbnZhciBsb2dnZXI9bG9nNGpzLmdldExvZ2dlcignUmVwb3J0IFNlcnZpY2UnKTtcclxuXHJcbmNsYXNzIFJlcG9ydFNlcnZpY2Uge1xyXG4gIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgY29zdEhlYWRzTGlzdDogQXJyYXk8QWRkQ29zdEhlYWRCdXR0b24+ID0gIG5ldyBBcnJheTxBZGRDb3N0SGVhZEJ1dHRvbj4oKTtcclxuICBwcml2YXRlIHByb2plY3RSZXBvc2l0b3J5OiBQcm9qZWN0UmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGJ1aWxkaW5nUmVwb3NpdG9yeTogQnVpbGRpbmdSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgYXV0aEludGVyY2VwdG9yOiBBdXRoSW50ZXJjZXB0b3I7XHJcbiAgcHJpdmF0ZSB1c2VyU2VydmljZSA6IFVzZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgcmF0ZUFuYWx5c2lzU2VydmljZSA6IFJhdGVBbmFseXNpc1NlcnZpY2U7XHJcbiAgcHJpdmF0ZSBwcm9qZWN0U2VydmljZSA6IFByb2plY3RTZXJ2aWNlO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeSA9IG5ldyBCdWlsZGluZ1JlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XHJcbiAgICB0aGlzLmF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHRoaXMudXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHRoaXMucmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgfVxyXG5cclxuICBnZXRSZXBvcnQoIHByb2plY3RJZCA6IGFueSwgcmVwb3J0VHlwZSA6IHN0cmluZywgcmF0ZVVuaXQgOiBzdHJpbmcsIGFyZWFUeXBlIDogc3RyaW5nLOKAguKAgnVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRSZXBvcnQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5ncyd9O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUmVwb3J0IFNlcnZpY2UsIGZpbmRBbmRQb3B1bGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5ncyA9IHJlc3VsdFswXS5idWlsZGluZ3M7XHJcbiAgICAgICAgdmFyIHR5cGVPZkFyZWE6IHN0cmluZztcclxuICAgICAgICBsZXQgdG90YWxBcmVhOiBudW1iZXI7XHJcbiAgICAgICAgbGV0IGNob2ljZSA9IGFyZWFUeXBlO1xyXG4gICAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5TTEFCX0FSRUE6XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGVPZkFyZWEgPSBDb25zdGFudHMuVE9UQUxfU0xBQl9BUkVBO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5TQUxFQUJMRV9BUkVBOlxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlT2ZBcmVhID0gQ29uc3RhbnRzLlRPVEFMX1NBTEVBQkxFX0FSRUE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNhc2UgIENvbnN0YW50cy5DQVJQRVRfQVJFQSA6XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGVPZkFyZWEgPSBDb25zdGFudHMuVE9UQUxfQ0FSUEVUX0FSRUE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGVmYXVsdCA6ICBjYWxsYmFjayhlcnJvcixudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgIGxldCB0b3RhbE9mQXJlYSA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTSgnK3R5cGVPZkFyZWErJyksMikgRlJPTSA/JyxbYnVpbGRpbmdzXSk7XHJcbiAgICAgICAgaWYocmF0ZVVuaXQgPT09IENvbnN0YW50cy5TUVVSRU1FVEVSX1VOSVQpIHtcclxuICAgICAgICAgdG90YWxBcmVhID10b3RhbE9mQXJlYSAqIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlNRVUFSRV9NRVRFUik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRvdGFsQXJlYSA9IHRvdGFsT2ZBcmVhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJvamVjdFJlcG9ydCA6IFByb2plY3RSZXBvcnQgPSBuZXcgUHJvamVjdFJlcG9ydCgpO1xyXG5cclxuICAgICAgICBwcm9qZWN0UmVwb3J0LmJ1aWxkaW5ncyA9IHRoaXMuZ2VuZXJhdGVSZXBvcnRCeUNvc3RIZWFkcyhidWlsZGluZ3MsIHR5cGVPZkFyZWEsIHJhdGVVbml0KTtcclxuXHJcbiAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSByZXN1bHRbMF0ucHJvamVjdENvc3RIZWFkcztcclxuICAgICAgICBsZXQgcHJvamVjdFJhdGVzID0gcmVzdWx0WzBdLnJhdGVzO1xyXG4gICAgICAgIGlmKHByb2plY3RDb3N0SGVhZHMhPT0gbnVsbCkge1xyXG4gICAgICAgICAgcHJvamVjdFJlcG9ydC5jb21tb25BbWVuaXRpZXMgPSB0aGlzLmdlbmVyYXRlUmVwb3J0Rm9yUHJvamVjdENvc3RIZWFkcyhwcm9qZWN0Q29zdEhlYWRzLCBwcm9qZWN0UmF0ZXMsIHRvdGFsQXJlYSwgcmF0ZVVuaXQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvamVjdFJlcG9ydC5zaG93SGlkZUNvc3RIZWFkQnV0dG9ucyA9IHRoaXMuY29zdEhlYWRzTGlzdDtcclxuICAgICAgICBwcm9qZWN0UmVwb3J0LnRvdGFsQXJlYU9mQnVpbGRpbmdzID0gdG90YWxBcmVhO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwseyBkYXRhOiBwcm9qZWN0UmVwb3J0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVSZXBvcnRCeUNvc3RIZWFkcyggYnVpbGRpbmdzOiAgQXJyYXk8QnVpbGRpbmc+ICwgdHlwZU9mQXJlYTogc3RyaW5nLCByYXRlVW5pdDogc3RyaW5nKSB7XHJcblxyXG4gICAgbGV0IGJ1aWxkaW5nc1JlcG9ydCA6IEFycmF5PEJ1aWxkaW5nUmVwb3J0PiA9IG5ldyBBcnJheTxCdWlsZGluZ1JlcG9ydD4oKTtcclxuICAgIGZvciAobGV0IGJ1aWxkaW5nIG9mIGJ1aWxkaW5ncykge1xyXG4gICAgICBsZXQgYnVpbGRpbmdSZXBvcnQgPSBuZXcgQnVpbGRpbmdSZXBvcnQ7XHJcbiAgICAgIGJ1aWxkaW5nUmVwb3J0Lm5hbWUgPSBidWlsZGluZy5uYW1lO1xyXG4gICAgICBidWlsZGluZ1JlcG9ydC5faWQgPSBidWlsZGluZy5faWQ7XHJcbiAgICAgIGlmKHJhdGVVbml0ID09PSBDb25zdGFudHMuU1FVUkVNRVRFUl9VTklUKSB7XHJcbiAgICAgICAgYnVpbGRpbmdSZXBvcnQuYXJlYSA9ICBidWlsZGluZ1t0eXBlT2ZBcmVhXSAqIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlNRVUFSRV9NRVRFUik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnVpbGRpbmdSZXBvcnQuYXJlYSA9IGJ1aWxkaW5nW3R5cGVPZkFyZWFdO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCB0aHVtYlJ1bGUgID0gbmV3IFRodW1iUnVsZSgpO1xyXG4gICAgICBsZXQgZXN0aW1hdGUgID0gbmV3IEVzdGltYXRlKCk7XHJcbiAgICAgIGxldCB0aHVtYlJ1bGVSZXBvcnRzID0gbmV3IEFycmF5PFRodW1iUnVsZVJlcG9ydD4oKTtcclxuICAgICAgbGV0IGVzdGltYXRlZFJlcG9ydHMgPSBuZXcgQXJyYXk8RXN0aW1hdGVSZXBvcnQ+KCk7XHJcblxyXG5cclxuICAgICAgdGhpcy5nZXRUaHVtYlJ1bGVBbmRFc3RpbWF0ZWRSZXBvcnQoYnVpbGRpbmcsIGJ1aWxkaW5nUmVwb3J0LCB0aHVtYlJ1bGVSZXBvcnRzLFxyXG4gICAgICAgIGVzdGltYXRlZFJlcG9ydHMsIHJhdGVVbml0KTtcclxuXHJcbiAgICAgIGxldCB0b3RhbFJhdGVzID0gYWxhc3FsKCdTRUxFQ1QgUk9VTkQoU1VNKGFtb3VudCksMikgQVMgdG90YWxBbW91bnQsIFJPVU5EKFNVTShyYXRlKSwyKSBBUyB0b3RhbFJhdGUgRlJPTSA/JyxbdGh1bWJSdWxlUmVwb3J0c10pO1xyXG4gICAgICB0aHVtYlJ1bGUudG90YWxSYXRlID0gdG90YWxSYXRlc1swXS50b3RhbFJhdGU7XHJcbiAgICAgIHRodW1iUnVsZS50b3RhbEJ1ZGdldGVkQ29zdCA9IE1hdGgucm91bmQodG90YWxSYXRlc1swXS50b3RhbEFtb3VudCk7XHJcbiAgICAgIHRodW1iUnVsZS50aHVtYlJ1bGVSZXBvcnRzID0gdGh1bWJSdWxlUmVwb3J0cztcclxuXHJcbiAgICAgIGxldCB0b3RhbEVzdGltYXRlZFJhdGVzID0gYWxhc3FsKCdTRUxFQ1QgUk9VTkQoU1VNKHRvdGFsKSwyKSBBUyB0b3RhbEFtb3VudCwgUk9VTkQoU1VNKHJhdGUpLDIpIEFTIHRvdGFsUmF0ZSBGUk9NID8nLFxyXG4gICAgICAgIFtlc3RpbWF0ZWRSZXBvcnRzXSk7XHJcbiAgICAgIGVzdGltYXRlLnRvdGFsUmF0ZSA9IHRvdGFsRXN0aW1hdGVkUmF0ZXNbMF0udG90YWxSYXRlO1xyXG4gICAgICBlc3RpbWF0ZS50b3RhbEVzdGltYXRlZENvc3QgPSB0b3RhbEVzdGltYXRlZFJhdGVzWzBdLnRvdGFsQW1vdW50O1xyXG4gICAgICBlc3RpbWF0ZS5lc3RpbWF0ZWRDb3N0cyA9IGVzdGltYXRlZFJlcG9ydHM7XHJcblxyXG4gICAgICBidWlsZGluZ1JlcG9ydC50aHVtYlJ1bGUgPSB0aHVtYlJ1bGU7XHJcbiAgICAgIGJ1aWxkaW5nUmVwb3J0LmVzdGltYXRlID0gZXN0aW1hdGU7XHJcbiAgICAgIGJ1aWxkaW5nc1JlcG9ydC5wdXNoKGJ1aWxkaW5nUmVwb3J0KTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdTSG93IEhpZGUgTGlzdCA6ICcrSlNPTi5zdHJpbmdpZnkodGhpcy5jb3N0SGVhZHNMaXN0KSk7XHJcbiAgICByZXR1cm4oYnVpbGRpbmdzUmVwb3J0KTtcclxuICB9XHJcblxyXG5cclxuICBnZXRUaHVtYlJ1bGVBbmRFc3RpbWF0ZWRSZXBvcnQoYnVpbGRpbmcgOkJ1aWxkaW5nLCBidWlsZGluZ1JlcG9ydDogQnVpbGRpbmdSZXBvcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRodW1iUnVsZVJlcG9ydHM6IFRodW1iUnVsZVJlcG9ydFtdLCBlc3RpbWF0ZWRSZXBvcnRzOiBFc3RpbWF0ZVJlcG9ydFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlVW5pdDpzdHJpbmcpIHtcclxuXHJcbiAgICBsZXQgY29zdEhlYWRCdXR0b25Gb3JCdWlsZGluZyA9IG5ldyBBZGRDb3N0SGVhZEJ1dHRvbigpO1xyXG4gICAgY29zdEhlYWRCdXR0b25Gb3JCdWlsZGluZy5idWlsZGluZ05hbWUgPSBidWlsZGluZy5uYW1lO1xyXG4gICAgZm9yIChsZXQgY29zdEhlYWQgb2YgYnVpbGRpbmcuY29zdEhlYWRzKSB7XHJcblxyXG4gICAgICBpZihjb3N0SGVhZC5hY3RpdmUpIHtcclxuICAgICAgICAvL1RodW1iUnVsZSBSZXBvcnRcclxuICAgICAgICBsZXQgdGh1bWJSdWxlUmVwb3J0ID0gbmV3IFRodW1iUnVsZVJlcG9ydCgpO1xyXG4gICAgICAgIHRodW1iUnVsZVJlcG9ydC5uYW1lID0gY29zdEhlYWQubmFtZTtcclxuICAgICAgICB0aHVtYlJ1bGVSZXBvcnQucmF0ZUFuYWx5c2lzSWQgPSBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgICB0aHVtYlJ1bGVSZXBvcnQuYW1vdW50ID0gTWF0aC5yb3VuZChjb3N0SGVhZC5idWRnZXRlZENvc3RBbW91bnQpO1xyXG4gICAgICAgIHRodW1iUnVsZVJlcG9ydC5jb3N0SGVhZEFjdGl2ZSA9IGNvc3RIZWFkLmFjdGl2ZTtcclxuICAgICAgICB0aHVtYlJ1bGVSZXBvcnQucmF0ZSA9IHRodW1iUnVsZVJlcG9ydC5hbW91bnQgLyBidWlsZGluZ1JlcG9ydC5hcmVhO1xyXG4gICAgICAgIHRodW1iUnVsZVJlcG9ydHMucHVzaCh0aHVtYlJ1bGVSZXBvcnQpO1xyXG5cclxuICAgICAgICAvL0VzdGltYXRlZCBjb3N0IFJlcG9ydFxyXG4gICAgICAgIGxldCBlc3RpbWF0ZVJlcG9ydCA9IG5ldyBFc3RpbWF0ZVJlcG9ydCgpO1xyXG4gICAgICAgIGVzdGltYXRlUmVwb3J0ID0gdGhpcy5nZXRFc3RpbWF0ZWRSZXBvcnQoYnVpbGRpbmcucmF0ZXMsIGNvc3RIZWFkLCBidWlsZGluZ1JlcG9ydC5hcmVhLCByYXRlVW5pdCk7XHJcbiAgICAgICAgZXN0aW1hdGVkUmVwb3J0cy5wdXNoKGVzdGltYXRlUmVwb3J0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb3N0SGVhZEJ1dHRvbkZvckJ1aWxkaW5nLnNob3dIaWRlQWRkQ29zdEhlYWRCdXR0b24gPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5jb3N0SGVhZHNMaXN0LnB1c2goY29zdEhlYWRCdXR0b25Gb3JCdWlsZGluZyk7XHJcbiAgfVxyXG5cclxuICBnZXRFc3RpbWF0ZWRSZXBvcnQoY2VudHJhbGl6ZWRSYXRlczpBcnJheTxDZW50cmFsaXplZFJhdGU+LCBjb3N0SGVhZDogYW55LCBhcmVhOm51bWJlciwgcmF0ZVVuaXQ6c3RyaW5nKSB7XHJcblxyXG4gICAgbGV0IGVzdGltYXRlUmVwb3J0ID0gbmV3IEVzdGltYXRlUmVwb3J0KCk7XHJcbiAgICBlc3RpbWF0ZVJlcG9ydC5uYW1lID0gY29zdEhlYWQubmFtZTtcclxuICAgIGVzdGltYXRlUmVwb3J0LnJhdGVBbmFseXNpc0lkID0gY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+ID0gY29zdEhlYWQuY2F0ZWdvcmllcztcclxuICAgIGxldCBwcm9qZWN0U2VydmljZSA6IFByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICBsZXQgY2F0ZWdvcmllc09iaiA9IHByb2plY3RTZXJ2aWNlLmdldENhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoY29zdEhlYWRDYXRlZ29yaWVzLCBjZW50cmFsaXplZFJhdGVzKTtcclxuICAgIGVzdGltYXRlUmVwb3J0LnRvdGFsID0gY2F0ZWdvcmllc09iai5jYXRlZ29yaWVzQW1vdW50O1xyXG4gICAgZXN0aW1hdGVSZXBvcnQucmF0ZSA9IGVzdGltYXRlUmVwb3J0LnRvdGFsIC8gYXJlYTtcclxuICAgIHJldHVybiBlc3RpbWF0ZVJlcG9ydDtcclxuICB9XHJcblxyXG4gIGdldEVzdGltYXRlZFJlcG9ydEZvck5vbkNhdGVnb3JpZXModGh1bWJSdWxlUmVwb3J0OiBUaHVtYlJ1bGVSZXBvcnQpIHtcclxuICAgIGxldCBlc3RpbWF0ZVJlcG9ydCA9IG5ldyBFc3RpbWF0ZVJlcG9ydCgpO1xyXG4gICAgZXN0aW1hdGVSZXBvcnQubmFtZSA9IHRodW1iUnVsZVJlcG9ydC5uYW1lO1xyXG4gICAgZXN0aW1hdGVSZXBvcnQucmF0ZUFuYWx5c2lzSWQgPSB0aHVtYlJ1bGVSZXBvcnQucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICBlc3RpbWF0ZVJlcG9ydC50b3RhbCA9IHRodW1iUnVsZVJlcG9ydC5hbW91bnQ7XHJcbiAgICBlc3RpbWF0ZVJlcG9ydC5kaXNhYmxlQ29zdEhlYWRWaWV3ID0gdHJ1ZTtcclxuICAgIGVzdGltYXRlUmVwb3J0LnJhdGUgPSB0aHVtYlJ1bGVSZXBvcnQucmF0ZTtcclxuICAgIHJldHVybiBlc3RpbWF0ZVJlcG9ydDtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlUmVwb3J0Rm9yUHJvamVjdENvc3RIZWFkcyhwcm9qZWN0Q29zdEhlYWRzOiAgQXJyYXk8Q29zdEhlYWQ+LCBwcm9qZWN0UmF0ZXM6IEFycmF5PENlbnRyYWxpemVkUmF0ZT4sIHRvdGFsQXJlYTogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0ZVVuaXQ6IHN0cmluZykge1xyXG4gICAgbGV0IGNvbW1vbkFtZW5pdGllc1JlcG9ydCA6IEFycmF5PEJ1aWxkaW5nUmVwb3J0PiA9IG5ldyBBcnJheTxCdWlsZGluZ1JlcG9ydD4oKTtcclxuICAgICAgbGV0IHByb2plY3RSZXBvcnQgPSBuZXcgQnVpbGRpbmdSZXBvcnQ7XHJcbiAgICAgIHByb2plY3RSZXBvcnQubmFtZSA9IENvbnN0YW50cy5BTUVOSVRJRVM7XHJcbiAgICAgIHByb2plY3RSZXBvcnQuYXJlYSA9IHRvdGFsQXJlYTtcclxuXHJcbiAgICAgIGxldCB0aHVtYlJ1bGUgID0gbmV3IFRodW1iUnVsZSgpO1xyXG4gICAgICBsZXQgZXN0aW1hdGUgID0gbmV3IEVzdGltYXRlKCk7XHJcbiAgICAgIGxldCB0aHVtYlJ1bGVSZXBvcnRzID0gbmV3IEFycmF5PFRodW1iUnVsZVJlcG9ydD4oKTtcclxuICAgICAgbGV0IGVzdGltYXRlZFJlcG9ydHMgPSBuZXcgQXJyYXk8RXN0aW1hdGVSZXBvcnQ+KCk7XHJcblxyXG5cclxuICAgICAgdGhpcy5nZXRUaHVtYlJ1bGVBbmRFc3RpbWF0ZWRSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQocHJvamVjdENvc3RIZWFkcywgcHJvamVjdFJhdGVzLFxyXG4gICAgICAgIHByb2plY3RSZXBvcnQsIHRodW1iUnVsZVJlcG9ydHMsIGVzdGltYXRlZFJlcG9ydHMsIHRvdGFsQXJlYSwgcmF0ZVVuaXQpO1xyXG5cclxuICAgIGxldCB0b3RhbFJhdGVzID0gYWxhc3FsKCdTRUxFQ1QgUk9VTkQoU1VNKGFtb3VudCksMikgQVMgdG90YWxBbW91bnQsIFJPVU5EKFNVTShyYXRlKSwyKSBBUyB0b3RhbFJhdGUgRlJPTSA/JyxbdGh1bWJSdWxlUmVwb3J0c10pO1xyXG4gICAgICB0aHVtYlJ1bGUudG90YWxSYXRlID0gdG90YWxSYXRlc1swXS50b3RhbFJhdGU7XHJcbiAgICAgIHRodW1iUnVsZS50b3RhbEJ1ZGdldGVkQ29zdCA9IE1hdGgucm91bmQodG90YWxSYXRlc1swXS50b3RhbEFtb3VudCk7XHJcbiAgICAgIHRodW1iUnVsZS50aHVtYlJ1bGVSZXBvcnRzID0gdGh1bWJSdWxlUmVwb3J0cztcclxuXHJcbiAgICBsZXQgdG90YWxFc3RpbWF0ZWRSYXRlcyA9IGFsYXNxbCgnU0VMRUNUIFJPVU5EKFNVTSh0b3RhbCksMikgQVMgdG90YWxBbW91bnQsIFJPVU5EKFNVTShyYXRlKSwyKSBBUyB0b3RhbFJhdGUgRlJPTSA/JyxcclxuICAgICAgW2VzdGltYXRlZFJlcG9ydHNdKTtcclxuICAgICAgZXN0aW1hdGUudG90YWxSYXRlID0gdG90YWxFc3RpbWF0ZWRSYXRlc1swXS50b3RhbFJhdGU7XHJcbiAgICAgIGVzdGltYXRlLnRvdGFsRXN0aW1hdGVkQ29zdCA9IHRvdGFsRXN0aW1hdGVkUmF0ZXNbMF0udG90YWxBbW91bnQ7XHJcbiAgICAgIGVzdGltYXRlLmVzdGltYXRlZENvc3RzID0gZXN0aW1hdGVkUmVwb3J0cztcclxuXHJcbiAgICAgIHByb2plY3RSZXBvcnQudGh1bWJSdWxlID0gdGh1bWJSdWxlO1xyXG4gICAgICBwcm9qZWN0UmVwb3J0LmVzdGltYXRlID0gZXN0aW1hdGU7XHJcbiAgICBjb21tb25BbWVuaXRpZXNSZXBvcnQucHVzaChwcm9qZWN0UmVwb3J0KTtcclxuICAgIGNvbnNvbGUubG9nKCdTSG93IEhpZGUgTGlzdCA6ICcrSlNPTi5zdHJpbmdpZnkodGhpcy5jb3N0SGVhZHNMaXN0KSk7XHJcbiAgICByZXR1cm4oY29tbW9uQW1lbml0aWVzUmVwb3J0KTtcclxuICB9XHJcblxyXG4gIGdldFRodW1iUnVsZUFuZEVzdGltYXRlZFJlcG9ydEZvclByb2plY3RDb3N0SGVhZChwcm9qZWN0Q29zdEhlYWQ6IEFycmF5PENvc3RIZWFkPiwgcHJvamVjdFJhdGVzOiBBcnJheTxDZW50cmFsaXplZFJhdGU+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0UmVwb3J0OiBCdWlsZGluZ1JlcG9ydCwgdGh1bWJSdWxlUmVwb3J0czogVGh1bWJSdWxlUmVwb3J0W10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVzdGltYXRlZFJlcG9ydHM6IEVzdGltYXRlUmVwb3J0W10sIHRvdGFsQXJlYTpudW1iZXIsIHJhdGVVbml0OnN0cmluZykge1xyXG5cclxuICAgIGxldCBjb3N0SGVhZEJ1dHRvbkZvckJ1aWxkaW5nID0gbmV3IEFkZENvc3RIZWFkQnV0dG9uKCk7XHJcbiAgICBjb3N0SGVhZEJ1dHRvbkZvckJ1aWxkaW5nLmJ1aWxkaW5nTmFtZSA9IHByb2plY3RSZXBvcnQubmFtZTtcclxuXHJcbiAgICBmb3IgKGxldCBjb3N0SGVhZCAgb2YgcHJvamVjdENvc3RIZWFkKSB7XHJcbiAgICBpZiAoY29zdEhlYWQuYWN0aXZlKSB7XHJcbiAgICAgIC8vVGh1bWJSdWxlIFJlcG9ydFxyXG4gICAgICBsZXQgdGh1bWJSdWxlUmVwb3J0ID0gbmV3IFRodW1iUnVsZVJlcG9ydCgpO1xyXG4gICAgICB0aHVtYlJ1bGVSZXBvcnQubmFtZSA9IGNvc3RIZWFkLm5hbWU7XHJcbiAgICAgIHRodW1iUnVsZVJlcG9ydC5yYXRlQW5hbHlzaXNJZCA9IGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICB0aHVtYlJ1bGVSZXBvcnQuYW1vdW50ID0gTWF0aC5yb3VuZChjb3N0SGVhZC5idWRnZXRlZENvc3RBbW91bnQpO1xyXG4gICAgICB0aHVtYlJ1bGVSZXBvcnQuY29zdEhlYWRBY3RpdmUgPSBjb3N0SGVhZC5hY3RpdmU7XHJcbiAgICAgIHRodW1iUnVsZVJlcG9ydC5yYXRlID0gdGh1bWJSdWxlUmVwb3J0LmFtb3VudCAvIHRvdGFsQXJlYTtcclxuICAgICAgdGh1bWJSdWxlUmVwb3J0cy5wdXNoKHRodW1iUnVsZVJlcG9ydCk7XHJcblxyXG4gICAgICAvL0VzdGltYXRlZCBjb3N0IFJlcG9ydFxyXG4gICAgICBsZXQgZXN0aW1hdGVSZXBvcnQgPSBuZXcgRXN0aW1hdGVSZXBvcnQoKTtcclxuICAgICAgaWYoY29zdEhlYWQuY2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZXN0aW1hdGVSZXBvcnQgPSB0aGlzLmdldEVzdGltYXRlZFJlcG9ydChwcm9qZWN0UmF0ZXMsIGNvc3RIZWFkLCB0b3RhbEFyZWEsIHJhdGVVbml0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlc3RpbWF0ZVJlcG9ydCA9IHRoaXMuZ2V0RXN0aW1hdGVkUmVwb3J0Rm9yTm9uQ2F0ZWdvcmllcyh0aHVtYlJ1bGVSZXBvcnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlc3RpbWF0ZWRSZXBvcnRzLnB1c2goZXN0aW1hdGVSZXBvcnQpO1xyXG4gICAgfWVsc2Uge1xyXG4gICAgICBjb3N0SGVhZEJ1dHRvbkZvckJ1aWxkaW5nLnNob3dIaWRlQWRkQ29zdEhlYWRCdXR0b249ZmFsc2U7XHJcbiAgICB9XHJcbiAgIH10aGlzLmNvc3RIZWFkc0xpc3QucHVzaChjb3N0SGVhZEJ1dHRvbkZvckJ1aWxkaW5nKTtcclxuICB9XHJcblxyXG5cclxuICBnZXRDb3N0SGVhZHMoICB1cmw6IHN0cmluZyAsIHVzZXI6IFVzZXIsY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1NlcnZpY2UuZ2V0Q29zdEhlYWRzKCB1cmwsIHVzZXIsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwseyBkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXMoIHVybDogc3RyaW5nICwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRXb3JrSXRlbXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1NlcnZpY2UuZ2V0V29ya0l0ZW1zKCB1cmwsIHVzZXIsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwseyBkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXRlcmlhbERldGFpbHMoIHByb2plY3RJZCA6IGFueSzigIJ1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdSZXBvcnQgU2VydmljZSwgZ2V0TWF0ZXJpYWxEZXRhaWxzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQ6IHByb2plY3RJZH07XHJcbiAgICBsZXQgcG9wdWxhdGUgPSB7cGF0aCA6ICdidWlsZGluZ3MnfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBmaW5kQW5kUG9wdWxhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuZ2V0QnVpbGRpbmdNYXRlcmlhbERldGFpbHMocmVzdWx0WzBdLmJ1aWxkaW5ncykpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nTWF0ZXJpYWxEZXRhaWxzKGJ1aWxkaW5ncyA6IEFycmF5PEJ1aWxkaW5nPik6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPiB7XHJcbiAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSA6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPj0gbmV3IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPigpO1xyXG4gICAgbGV0IGJ1aWxkaW5nTmFtZTogc3RyaW5nO1xyXG4gICAgZm9yKGxldCBidWlsZGluZzogQnVpbGRpbmcgb2YgYnVpbGRpbmdzKSB7XHJcbiAgICAgIGJ1aWxkaW5nTmFtZSA9IGJ1aWxkaW5nLm5hbWU7XHJcbiAgICAgIHRoaXMuYWRkTWF0ZXJpYWxEVE9Gb3JBY3RpdmVDb3N0SGVhZEluRFRPQXJyYXkoYnVpbGRpbmcsIGJ1aWxkaW5nTmFtZSwgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSk7XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXRlcmlhbEZpbHRlcnMoIHByb2plY3RJZCA6IGFueSzigIJ1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdSZXBvcnQgU2VydmljZSwgZ2V0TWF0ZXJpYWxGaWx0ZXJzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQ6IHByb2plY3RJZH07XHJcbiAgICBsZXQgcG9wdWxhdGUgPSB7cGF0aCA6ICdidWlsZGluZ3MnfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBmaW5kQW5kUG9wdWxhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuZ2V0TWF0ZXJpYWxUYWtlT2ZmRmlsdGVyT2JqZWN0KHJlc3VsdFswXS5idWlsZGluZ3MpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXRlcmlhbFRha2VPZmZSZXBvcnQoIHByb2plY3RJZCA6IGFueSwgYnVpbGRpbmc6IHN0cmluZywgZWxlbWVudFdpc2VSZXBvcnQ6IHN0cmluZywgZWxlbWVudDogc3RyaW5nLOKAgnVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRNYXRlcmlhbFRha2VPZmZSZXBvcnQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5ncyd9O1xyXG4gICAgaWYoYnVpbGRpbmcgIT09IENvbnN0YW50cy5TVFJfQUxMX0JVSUxESU5HKSB7XHJcbiAgICAgIHBvcHVsYXRlID0ge3BhdGggOiAnYnVpbGRpbmdzJywgbWF0Y2g6e25hbWU6IGJ1aWxkaW5nfX07XHJcbiAgICB9XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRBbmRQb3B1bGF0ZShxdWVyeSwgcG9wdWxhdGUsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdSZXBvcnQgU2VydmljZSwgZmluZEFuZFBvcHVsYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZihyZXN1bHRbMF0uYnVpbGRpbmdzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbignVW5hYmxlIHRvIGZpbmQgQnVpbGRpbmcnLG51bGwpLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPiA9IHRoaXMuZ2V0QnVpbGRpbmdNYXRlcmlhbERldGFpbHMocmVzdWx0WzBdLmJ1aWxkaW5ncyk7XHJcbiAgICAgICAgbGV0IG1hdGVyaWFsUmVwb3J0Um93RGF0YSA9XHJcbiAgICAgICAgICB0aGlzLmdldE1hdGVyaWFsRGF0YUZyb21GbGF0RGV0YWlsc0FycmF5KGVsZW1lbnRXaXNlUmVwb3J0LCBlbGVtZW50LCBidWlsZGluZywgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSk7XHJcbiAgICAgICAgaWYobWF0ZXJpYWxSZXBvcnRSb3dEYXRhLmxlbmd0aD4wICYmIG1hdGVyaWFsUmVwb3J0Um93RGF0YVswXS5oZWFkZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgbGV0IG1hdGVyaWFsVGFrZU9mZlJlcG9ydDogTWF0ZXJpYWxUYWtlT2ZmUmVwb3J0ID0gbmV3IE1hdGVyaWFsVGFrZU9mZlJlcG9ydCggbnVsbCwgbnVsbCwgbnVsbCk7XHJcbiAgICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQuc2Vjb25kYXJ5VmlldyA9IHt9O1xyXG4gICAgICAgICAgdGhpcy5wb3B1bGF0ZU1hdGVyaWFsVGFrZU9mZlJlcG9ydEZyb21Sb3dEYXRhKG1hdGVyaWFsUmVwb3J0Um93RGF0YSwgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LCBlbGVtZW50V2lzZVJlcG9ydCwgYnVpbGRpbmcpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUb3RhbE9mTWF0ZXJpYWxUYWtlUmVwb3J0KG1hdGVyaWFsVGFrZU9mZlJlcG9ydCwgZWxlbWVudFdpc2VSZXBvcnQsIGJ1aWxkaW5nKTtcclxuICAgICAgICAgIGxldCByZXNwb25zZURhdGEgPSB7fTtcclxuICAgICAgICAgIHJlc3BvbnNlRGF0YVtlbGVtZW50XT0gbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0O1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzcG9uc2VEYXRhKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKENvbnN0YW50cy5NRVNTQUdFX0ZPUl9DT1NUSEVBRFNfTUlTU0lOR19DT1NUX0VTVElNQVRJT04gKyBlbGVtZW50ICwgbnVsbCksIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjYWxjdWxhdGVUb3RhbE9mTWF0ZXJpYWxUYWtlUmVwb3J0KG1hdGVyaWFsVGFrZU9mZlJlcG9ydCA6IGFueSwgZWxlbWVudFdpc2VSZXBvcnQgOiBzdHJpbmcsIGJ1aWxkaW5nIDogc3RyaW5nKSB7XHJcblxyXG4gICAgbGV0IHJlcG9ydFRvdGFsID0gMDtcclxuICAgIGxldCByZWNvcmRVbml0O1xyXG5cclxuICAgICAgICBsZXQgc2Vjb25kYXJ5Vmlld01hdGVyaWFsRGF0YSA9IG1hdGVyaWFsVGFrZU9mZlJlcG9ydC5zZWNvbmRhcnlWaWV3O1xyXG4gICAgZm9yIChsZXQgc2Vjb25kYXJ5Vmlld0RhdGEgb2YgT2JqZWN0LmtleXMoc2Vjb25kYXJ5Vmlld01hdGVyaWFsRGF0YSkpIHtcclxuXHJcbiAgICAgIC8vY29udGVudFxyXG4gICAgICBsZXQgY29udGVudFRvdGFsID0gMDtcclxuICAgICAgbGV0IHRhYmxlID0gc2Vjb25kYXJ5Vmlld01hdGVyaWFsRGF0YVtzZWNvbmRhcnlWaWV3RGF0YV0udGFibGU7XHJcblxyXG4gICAgICBmb3IgKGxldCBjb250ZW50IG9mIE9iamVjdC5rZXlzKHRhYmxlLmNvbnRlbnQpKSB7XHJcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRhYmxlLmNvbnRlbnRbY29udGVudF0uc3ViQ29udGVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgdGFibGUuY29udGVudFtjb250ZW50XS5jb2x1bW5Ud28gPSAwO1xyXG4gICAgICAgICAgbGV0IHRhYmxlU3ViQ29udGVudCA9IHRhYmxlLmNvbnRlbnRbY29udGVudF0uc3ViQ29udGVudDtcclxuICAgICAgICAgIGZvciAobGV0IHN1YkNvbnRlbnQgb2YgT2JqZWN0LmtleXModGFibGVTdWJDb250ZW50KSkgeyAgIC8vIFN1YiBjb250ZW50XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRhYmxlU3ViQ29udGVudFtzdWJDb250ZW50XS5zdWJDb250ZW50KS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgdGFibGVTdWJDb250ZW50W3N1YkNvbnRlbnRdLmNvbHVtblR3byA9IDA7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaW5uZXJTdWJDb250ZW50IG9mIE9iamVjdC5rZXlzKHRhYmxlU3ViQ29udGVudFtzdWJDb250ZW50XS5zdWJDb250ZW50KSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW5uZXIgU3ViIGNvbnRlbnRcclxuICAgICAgICAgICAgICAgIHRhYmxlU3ViQ29udGVudFtzdWJDb250ZW50XS5jb2x1bW5Ud28gPVxyXG4gICAgICAgICAgICAgICAgICAocGFyc2VGbG9hdCh0YWJsZVN1YkNvbnRlbnRbc3ViQ29udGVudF0uY29sdW1uVHdvKSArXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCh0YWJsZVN1YkNvbnRlbnRbc3ViQ29udGVudF0uc3ViQ29udGVudFtpbm5lclN1YkNvbnRlbnRdLmNvbHVtblR3bylcclxuICAgICAgICAgICAgICAgICAgKS50b0ZpeGVkKENvbnN0YW50cy5OVU1CRVJfT0ZfRlJBQ1RJT05fRElHSVQpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIHRhYmxlU3ViQ29udGVudFtzdWJDb250ZW50XS5jb2x1bW5Ud28gPVxyXG4gICAgICAgICAgICAgIE1hdGguY2VpbCh0YWJsZVN1YkNvbnRlbnRbc3ViQ29udGVudF0uY29sdW1uVHdvKTtcclxuICAgICAgICAgICAgdGFibGUuY29udGVudFtjb250ZW50XS5jb2x1bW5Ud28gPSAocGFyc2VGbG9hdCh0YWJsZS5jb250ZW50W2NvbnRlbnRdLmNvbHVtblR3bykgK1xyXG4gICAgICAgICAgICAgIHBhcnNlRmxvYXQodGFibGVTdWJDb250ZW50W3N1YkNvbnRlbnRdLmNvbHVtblR3bykpLnRvRml4ZWQoQ29uc3RhbnRzLk5VTUJFUl9PRl9GUkFDVElPTl9ESUdJVCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0YWJsZS5jb250ZW50W2NvbnRlbnRdLmNvbHVtblR3byA9IE1hdGguY2VpbCh0YWJsZS5jb250ZW50W2NvbnRlbnRdLmNvbHVtblR3byk7XHJcbiAgICAgICAgICBjb250ZW50VG90YWwgPSBjb250ZW50VG90YWwgKyB0YWJsZS5jb250ZW50W2NvbnRlbnRdLmNvbHVtblR3bztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vZm9vdGVyXHJcbiAgICAgICAgdGFibGUuZm9vdGVyLmNvbHVtblR3byA9IGNvbnRlbnRUb3RhbDtcclxuICAgICAgICBzZWNvbmRhcnlWaWV3TWF0ZXJpYWxEYXRhW3NlY29uZGFyeVZpZXdEYXRhXS50aXRsZSA9IGNvbnRlbnRUb3RhbCArICcgJyArIHRhYmxlLmZvb3Rlci5jb2x1bW5UaHJlZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVwb3J0VG90YWwgPSByZXBvcnRUb3RhbCArIGNvbnRlbnRUb3RhbDtcclxuICAgICAgcmVjb3JkVW5pdCA9IHRhYmxlLmZvb3Rlci5jb2x1bW5UaHJlZTtcclxuXHJcbiAgICAgIGlmIChlbGVtZW50V2lzZVJlcG9ydCA9PT0gQ29uc3RhbnRzLlNUUl9NQVRFUklBTCAmJiBidWlsZGluZyA9PT0gQ29uc3RhbnRzLlNUUl9BTExfQlVJTERJTkcpIHtcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQuc3ViVGl0bGUuY29sdW1uVHdvID0gcmVwb3J0VG90YWw7XHJcbiAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnN1YlRpdGxlLmNvbHVtblRocmVlID0gcmVjb3JkVW5pdDtcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQuc3ViVGl0bGUuY29sdW1uT25lID0gJzogJyArIHJlcG9ydFRvdGFsICsgJyAnICsgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnN1YlRpdGxlLmNvbHVtblRocmVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBvcHVsYXRlTWF0ZXJpYWxUYWtlT2ZmUmVwb3J0RnJvbVJvd0RhdGEobWF0ZXJpYWxSZXBvcnRSb3dEYXRhOiBhbnksIG1hdGVyaWFsVGFrZU9mZlJlcG9ydDogTWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50V2lzZVJlcG9ydDogc3RyaW5nLCBidWlsZGluZzogc3RyaW5nKSB7XHJcbiAgICBmb3IgKGxldCByZWNvcmQgb2YgbWF0ZXJpYWxSZXBvcnRSb3dEYXRhKSB7XHJcbiAgICAgIGlmIChtYXRlcmlhbFRha2VPZmZSZXBvcnQuc2Vjb25kYXJ5Vmlld1tyZWNvcmQuaGVhZGVyXSA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnNlY29uZGFyeVZpZXdbcmVjb3JkLmhlYWRlcl0gPT09IG51bGwpIHtcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQudGl0bGUgPSBidWlsZGluZztcclxuICAgICAgICBpZihtYXRlcmlhbFRha2VPZmZSZXBvcnQuc3ViVGl0bGUgPT09IG51bGwgfHwgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnN1YlRpdGxlID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgbGV0IG1hdGVyaWFsVGFrZU9mZlJlcG9ydFN1YlRpdGxlOiBNYXRlcmlhbFRha2VPZmZWaWV3ID0gbmV3IE1hdGVyaWFsVGFrZU9mZlZpZXcoJycsIDAsICcnKTtcclxuICAgICAgICAgIG1hdGVyaWFsVGFrZU9mZlJlcG9ydC5zdWJUaXRsZSA9IG1hdGVyaWFsVGFrZU9mZlJlcG9ydFN1YlRpdGxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyp9Ki9cclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQuc2Vjb25kYXJ5Vmlld1tyZWNvcmQuaGVhZGVyXSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBtYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3OiBNYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3ID0gbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnNlY29uZGFyeVZpZXdbcmVjb3JkLmhlYWRlcl07XHJcbiAgICAgIGlmKG1hdGVyaWFsVGFrZU9mZlNlY29uZGFyeVZpZXcudGFibGUgPT09IHVuZGVmaW5lZCB8fCBtYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3LnRhYmxlID09PSBudWxsKSB7XHJcbiAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmU2Vjb25kYXJ5Vmlldy50YWJsZSA9IG5ldyBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXcobnVsbCwgbnVsbCwgbnVsbCk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHRhYmxlOiBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXcgPSBtYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3LnRhYmxlO1xyXG4gICAgICBpZih0YWJsZS5jb250ZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgdGFibGUuY29udGVudCA9IHt9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZih0YWJsZS5oZWFkZXIgPT09IG51bGwpIHtcclxuICAgICAgICBsZXQgY29sdW1uT25lOiBzdHJpbmcgPSAnSXRlbSc7XHJcbiAgICAgICAgbGV0IGNvbHVtblR3bzogc3RyaW5nID0gJ1F1YW50aXR5JztcclxuICAgICAgICBsZXQgY29sdW1uVGhyZWU6IHN0cmluZyA9ICAnVW5pdCc7XHJcbiAgICAgICAgaWYoZWxlbWVudFdpc2VSZXBvcnQgPT09IENvbnN0YW50cy5TVFJfQ09TVEhFQUQgJiYgYnVpbGRpbmcgPT09IENvbnN0YW50cy5TVFJfQUxMX0JVSUxESU5HKSB7XHJcbiAgICAgICAgICBjb2x1bW5PbmUgPSAnQnVpbGRpbmcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YWJsZS5oZWFkZXIgPSBuZXcgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3SGVhZGVycyhjb2x1bW5PbmUsIGNvbHVtblR3bywgY29sdW1uVGhyZWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3U3ViQ29udGVudCA9IG51bGw7XHJcbiAgICAgIGlmIChyZWNvcmQuc3ViVmFsdWUgJiYgcmVjb3JkLnN1YlZhbHVlICE9PSAnZGVmYXVsdCcgJiYgcmVjb3JkLnN1YlZhbHVlICE9PSAnRGlyZWN0Jykge1xyXG4gICAgICAgIG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld1N1YkNvbnRlbnQgPVxyXG4gICAgICAgICAgbmV3IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld1N1YkNvbnRlbnQocmVjb3JkLnN1YlZhbHVlLCByZWNvcmQuVG90YWwsIHJlY29yZC51bml0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYodGFibGUuY29udGVudFtyZWNvcmQuY29zdEhlYWROYW1lXSA9PT0gdW5kZWZpbmVkIHx8IHRhYmxlLmNvbnRlbnRbcmVjb3JkLmNvc3RIZWFkTmFtZV0gPT09IG51bGwpIHtcclxuICAgICAgICB0YWJsZS5jb250ZW50W3JlY29yZC5jb3N0SGVhZE5hbWVdID0gbmV3IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0NvbnRlbnQocmVjb3JkLmNvc3RIZWFkTmFtZSwgMCwgcmVjb3JkLnVuaXQsIHt9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGlmKHRhYmxlLmNvbnRlbnRbcmVjb3JkLmNvc3RIZWFkTmFtZV0uc3ViQ29udGVudFtyZWNvcmQucm93VmFsdWVdID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICB0YWJsZS5jb250ZW50W3JlY29yZC5jb3N0SGVhZE5hbWVdLnN1YkNvbnRlbnRbcmVjb3JkLnJvd1ZhbHVlXSA9PT0gbnVsbCkge1xyXG4gICAgICAgIHRhYmxlLmNvbnRlbnRbcmVjb3JkLmNvc3RIZWFkTmFtZV0uc3ViQ29udGVudFtyZWNvcmQucm93VmFsdWVdID1cclxuICAgICAgICAgIG5ldyBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdDb250ZW50KHJlY29yZC5yb3dWYWx1ZSwgMCwgcmVjb3JkLnVuaXQsIHt9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHRhYmxlVmlld1N1YkNvbnRlbnQ6IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0NvbnRlbnQgPSB0YWJsZS5jb250ZW50W3JlY29yZC5jb3N0SGVhZE5hbWVdLnN1YkNvbnRlbnRbcmVjb3JkLnJvd1ZhbHVlXTtcclxuICAgICAgdGFibGVWaWV3U3ViQ29udGVudC5jb2x1bW5Ud28gPSB0YWJsZVZpZXdTdWJDb250ZW50LmNvbHVtblR3byArIHJlY29yZC5Ub3RhbDsgICAvLyB1cGRhdGUgdG90YWxcclxuXHJcbiAgICAgIGxldCB0YWJsZVZpZXdDb250ZW50OiBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdDb250ZW50ID0gdGFibGUuY29udGVudFtyZWNvcmQuY29zdEhlYWROYW1lXTtcclxuICAgICAgdGFibGVWaWV3Q29udGVudC5jb2x1bW5Ud28gPSB0YWJsZVZpZXdDb250ZW50LmNvbHVtblR3byArIHJlY29yZC5Ub3RhbDsgICAvLyB1cGRhdGUgdG90YWxcclxuXHJcbiAgICAgIGlmKG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld1N1YkNvbnRlbnQpIHtcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50LmNvbHVtblR3byA9IHBhcnNlRmxvYXQoXHJcbiAgICAgICAgICBtYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50LmNvbHVtblR3bykudG9GaXhlZChDb25zdGFudHMuTlVNQkVSX09GX0ZSQUNUSU9OX0RJR0lUKTtcclxuICAgICAgICB0YWJsZVZpZXdDb250ZW50LnN1YkNvbnRlbnRbcmVjb3JkLnJvd1ZhbHVlXS5zdWJDb250ZW50W3JlY29yZC5zdWJWYWx1ZV0gPSBtYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLy9cclxuXHJcbiAgICAgIC8qbGV0IG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld1N1YkNvbnRlbnQgPSBudWxsO1xyXG4gICAgICBpZiAocmVjb3JkLnN1YlZhbHVlICYmIHJlY29yZC5zdWJWYWx1ZSAhPT0gJ2RlZmF1bHQnICYmIHJlY29yZC5zdWJWYWx1ZSAhPT0gJ0RpcmVjdCcpIHtcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50ID1cclxuICAgICAgICAgIG5ldyBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50KHJlY29yZC5zdWJWYWx1ZSwgcmVjb3JkLlRvdGFsLCByZWNvcmQudW5pdCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKHRhYmxlLmNvbnRlbnRbcmVjb3JkLnJvd1ZhbHVlXSA9PT0gdW5kZWZpbmVkIHx8IHRhYmxlLmNvbnRlbnRbcmVjb3JkLnJvd1ZhbHVlXSA9PT0gbnVsbCkge1xyXG4gICAgICAgIHRhYmxlLmNvbnRlbnRbcmVjb3JkLnJvd1ZhbHVlXSA9IG5ldyBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdDb250ZW50KHJlY29yZC5yb3dWYWx1ZSwgMCwgcmVjb3JkLnVuaXQsIHt9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHRhYmxlVmlld0NvbnRlbnQ6IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0NvbnRlbnQgPSB0YWJsZS5jb250ZW50W3JlY29yZC5yb3dWYWx1ZV07XHJcbiAgICAgIHRhYmxlVmlld0NvbnRlbnQuY29sdW1uVHdvID0gdGFibGVWaWV3Q29udGVudC5jb2x1bW5Ud28gKyByZWNvcmQuVG90YWw7ICAgLy8gdXBkYXRlIHRvdGFsXHJcblxyXG4gICAgICBpZihtYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50KSB7XHJcbiAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3U3ViQ29udGVudC5jb2x1bW5Ud28gPSBwYXJzZUZsb2F0KFxyXG4gICAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3U3ViQ29udGVudC5jb2x1bW5Ud28pLnRvRml4ZWQoQ29uc3RhbnRzLk5VTUJFUl9PRl9GUkFDVElPTl9ESUdJVCk7XHJcbiAgICAgICAgdGFibGVWaWV3Q29udGVudC5zdWJDb250ZW50W3JlY29yZC5zdWJWYWx1ZV0gPSBtYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50O1xyXG4gICAgICB9Ki9cclxuICAgICAgLy8vXHJcblxyXG4gICAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyOiBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdGb290ZXIgPSBudWxsO1xyXG4gICAgICBpZih0YWJsZS5mb290ZXIgPT09IHVuZGVmaW5lZCB8fCB0YWJsZS5mb290ZXIgPT09IG51bGwpIHtcclxuICAgICAgICB0YWJsZS5mb290ZXIgPVxyXG4gICAgICAgICAgbmV3IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0Zvb3RlcignVG90YWwnLCAwLCByZWNvcmQudW5pdCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0TWF0ZXJpYWxEYXRhRnJvbUZsYXREZXRhaWxzQXJyYXkoZWxlbWVudFdpc2VSZXBvcnQ6IHN0cmluZywgZWxlbWVudDogc3RyaW5nLCBidWlsZGluZzogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+KSB7XHJcbiAgICBsZXQgc3FsUXVlcnk6IHN0cmluZztcclxuICAgIHN3aXRjaChlbGVtZW50V2lzZVJlcG9ydCkge1xyXG4gICAgICBjYXNlIENvbnN0YW50cy5TVFJfQ09TVEhFQUQ6XHJcbiAgICAgICAgc3FsUXVlcnkgPSB0aGlzLmFsYXNxbFF1ZXJ5Rm9yTWF0ZXJpYWxUYWtlT2ZmRGF0YUNvc3RIZWFkV2lzZShidWlsZGluZyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgQ29uc3RhbnRzLlNUUl9NQVRFUklBTDpcclxuICAgICAgICBzcWxRdWVyeSA9IHRoaXMuYWxhc3FsUXVlcnlGb3JNYXRlcmlhbFRha2VPZmZEYXRhTWF0ZXJpYWxXaXNlKGJ1aWxkaW5nKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGxldCBtYXRlcmlhbFJlcG9ydFJvd0RhdGEgPSBhbGFzcWwoc3FsUXVlcnksIFttYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5LGVsZW1lbnRdKTtcclxuICAgIHJldHVybiBtYXRlcmlhbFJlcG9ydFJvd0RhdGE7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFsYXNxbFF1ZXJ5Rm9yTWF0ZXJpYWxUYWtlT2ZmRGF0YU1hdGVyaWFsV2lzZShidWlsZGluZzogc3RyaW5nKSB7XHJcbiAgICBsZXQgc2VsZWN0OiBzdHJpbmcgPSBDb25zdGFudHMuU1RSX0VNUFRZO1xyXG4gICAgbGV0IGZyb206IHN0cmluZyA9IENvbnN0YW50cy5BTEFTUUxfRlJPTTtcclxuICAgIGxldCB3aGVyZTogc3RyaW5nID0gQ29uc3RhbnRzLlNUUl9FTVBUWTtcclxuICAgIGxldCBncm91cEJ5OiBzdHJpbmcgPSBDb25zdGFudHMuQUxBU1FMX0dST1VQX0JZX01BVEVSSUFMX1RBS0VPRkZfTUFURVJJQUxfV0lTRTtcclxuICAgIGxldCBvcmRlckJ5OiBzdHJpbmcgPSBDb25zdGFudHMuQUxBU1FMX09SREVSX0JZX01BVEVSSUFMX1RBS0VPRkZfTUFURVJJQUxfV0lTRTtcclxuICAgIGxldCBzcWxRdWVyeTogc3RyaW5nO1xyXG4gICAgaWYgKGJ1aWxkaW5nICE9PSBDb25zdGFudHMuU1RSX0FMTF9CVUlMRElORykge1xyXG4gICAgICBzZWxlY3QgPSBDb25zdGFudHMuQUxBU1FMX1NFTEVDVF9NQVRFUklBTF9UQUtFT0ZGX01BVEVSSUFMX1dJU0UgKyBDb25zdGFudHMuU1RSX0NPTU1BX1NQQUNFICtcclxuICAgICAgICBDb25zdGFudHMuQUxBU1FMX1NFTEVDVF9RVUFOVElUWV9OQU1FX0FTO1xyXG4gICAgICB3aGVyZSA9IENvbnN0YW50cy5BTEFTUUxfV0hFUkVfTUFURVJJQUxfTkFNRV9FUVVBTFNfVE8gICtcclxuICAgICAgICBDb25zdGFudHMuU1RSX0FORCArIENvbnN0YW50cy5BTEFTUUxfU0VMRUNUX0JVSUxESU5HX05BTUUgKyBidWlsZGluZyArIENvbnN0YW50cy5TVFJfRE9VQkxFX0lOVkVSVEVEX0NPTU1BO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZWN0ID0gQ29uc3RhbnRzLkFMQVNRTF9TRUxFQ1RfTUFURVJJQUxfVEFLRU9GRl9NQVRFUklBTF9XSVNFIDtcclxuICAgICAgd2hlcmUgPSBDb25zdGFudHMuQUxBU1FMX1dIRVJFX01BVEVSSUFMX05BTUVfRVFVQUxTX1RPIDtcclxuICAgIH1cclxuICAgIHdoZXJlID0gd2hlcmUgKyBDb25zdGFudHMuQUxBU1FMX0FORF9NQVRFUklBTF9OT1RfTEFCT1VSO1xyXG4gICAgc3FsUXVlcnkgPSBzZWxlY3QgKyBmcm9tICsgd2hlcmUgKyBncm91cEJ5ICsgb3JkZXJCeTtcclxuICAgIHJldHVybiBzcWxRdWVyeTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWxhc3FsUXVlcnlGb3JNYXRlcmlhbFRha2VPZmZEYXRhQ29zdEhlYWRXaXNlKGJ1aWxkaW5nOiBzdHJpbmcpIHtcclxuICAgIGxldCBzZWxlY3Q6IHN0cmluZyA9IENvbnN0YW50cy5TVFJfRU1QVFk7XHJcbiAgICBsZXQgZnJvbTogc3RyaW5nID0gQ29uc3RhbnRzLkFMQVNRTF9GUk9NO1xyXG4gICAgbGV0IHdoZXJlOiBzdHJpbmcgPSBDb25zdGFudHMuU1RSX0VNUFRZO1xyXG4gICAgbGV0IGdyb3VwQnk6IHN0cmluZyA9IENvbnN0YW50cy5TVFJfRU1QVFk7XHJcbiAgICBsZXQgb3JkZXJCeTogc3RyaW5nID0gQ29uc3RhbnRzLlNUUl9FTVBUWTtcclxuICAgIGxldCBzcWxRdWVyeTogc3RyaW5nO1xyXG4gICAgaWYgKGJ1aWxkaW5nICE9PSBDb25zdGFudHMuU1RSX0FMTF9CVUlMRElORykge1xyXG4gICAgICBzZWxlY3QgPSBDb25zdGFudHMuQUxBU1FMX1NFTEVDVF9NQVRFUklBTF9UQUtFT0ZGX0NPU1RIRUFEX1dJU0UgKyBDb25zdGFudHMuU1RSX0NPTU1BX1NQQUNFICtcclxuICAgICAgICBDb25zdGFudHMuQUxBU1FMX1NFTEVDVF9RVUFOVElUWV9OQU1FX0FTO1xyXG4gICAgICB3aGVyZSA9IENvbnN0YW50cy5BTEFTUUxfV0hFUkVfQ09TVEhFQURfTkFNRV9FUVVBTFNfVE9cclxuICAgICAgICArIENvbnN0YW50cy5TVFJfQU5EICsgQ29uc3RhbnRzLkFMQVNRTF9TRUxFQ1RfQlVJTERJTkdfTkFNRSArIGJ1aWxkaW5nICsgQ29uc3RhbnRzLlNUUl9ET1VCTEVfSU5WRVJURURfQ09NTUE7XHJcbiAgICAgIGdyb3VwQnkgPSBDb25zdGFudHMuQUxBU1FMX0dST1VQX01BVEVSSUFMX1dPUktJVEVNX1FVQU5USVRZX01BVEVSSUFMX1RBS0VPRkZfQ09TVEhFQURfV0lTRTtcclxuICAgICAgb3JkZXJCeSA9IENvbnN0YW50cy5BTEFTUUxfT1JERVJfQllfTUFURVJJQUxfV09SS0lURU1fQ09TVEhFQURfV0lTRTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNlbGVjdCA9IENvbnN0YW50cy5BTEFTUUxfU0VMRUNUX01BVEVSSUFMX1RBS0VPRkZfQ09TVEhFQURfV0lTRV9GT1JfQUxMX0JVSUxESU5HUztcclxuICAgICAgd2hlcmUgPSBDb25zdGFudHMuQUxBU1FMX1dIRVJFX0NPU1RIRUFEX05BTUVfRVFVQUxTX1RPO1xyXG4gICAgICBncm91cEJ5ID0gQ29uc3RhbnRzLkFMQVNRTF9HUk9VUF9NQVRFUklBTF9CVUlMRElOR19RVUFOVElUWV9NQVRFUklBTF9UQUtFT0ZGX0NPU1RIRUFEX1dJU0VfRk9SX0FMTF9CVUlMRElOR1M7XHJcbiAgICAgIG9yZGVyQnkgPSBDb25zdGFudHMuQUxBU1FMX09SREVSX0JZX01BVEVSSUFMX0JVSUxESU5HX01BVEVSSUFMX1RBS0VPRkZfQ09TVEhFQURfV0lTRTtcclxuICAgIH1cclxuICAgIHdoZXJlID0gd2hlcmUgKyBDb25zdGFudHMuQUxBU1FMX0FORF9NQVRFUklBTF9OT1RfTEFCT1VSO1xyXG4gICAgc3FsUXVlcnkgPSBzZWxlY3QgKyBmcm9tICsgd2hlcmUgKyBncm91cEJ5ICsgb3JkZXJCeTtcclxuICAgIHJldHVybiBzcWxRdWVyeTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0TWF0ZXJpYWxUYWtlT2ZmRmlsdGVyT2JqZWN0KGJ1aWxkaW5nczogQXJyYXk8QnVpbGRpbmc+KSB7XHJcbiAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+ID0gdGhpcy5nZXRCdWlsZGluZ01hdGVyaWFsRGV0YWlscyhidWlsZGluZ3MpO1xyXG4gICAgbGV0IGNvbHVtbjogc3RyaW5nID0gQ29uc3RhbnRzLlNUUl9CVUlMRElOR19OQU1FO1xyXG4gICAgbGV0IGJ1aWxkaW5nTGlzdDogQXJyYXk8c3RyaW5nPiA9IHRoaXMuZ2V0RGlzdGluY3RBcnJheU9mU3RyaW5nRnJvbUFsYXNxbChjb2x1bW4sIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkpO1xyXG4gICAgY29sdW1uID0gQ29uc3RhbnRzLlNUUl9DT1NUSEVBRF9OQU1FO1xyXG4gICAgbGV0IGNvc3RIZWFkTGlzdDogQXJyYXk8c3RyaW5nPiA9IHRoaXMuZ2V0RGlzdGluY3RBcnJheU9mU3RyaW5nRnJvbUFsYXNxbChjb2x1bW4sIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkpO1xyXG4gICAgY29sdW1uID0gQ29uc3RhbnRzLlNUUl9NYXRlcmlhbF9OQU1FO1xyXG4gICAgbGV0IG1hdGVyaWFsTGlzdDogQXJyYXk8c3RyaW5nPiA9IHRoaXMuZ2V0RGlzdGluY3RBcnJheU9mU3RyaW5nRnJvbUFsYXNxbChjb2x1bW4sIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXksXHJcbiAgICAgIENvbnN0YW50cy5BTEFTUUxfTUFURVJJQUxfTk9UX0xBQk9VUl9OT19MSUtFKTtcclxuICAgIGxldCBtYXRlcmlhbFRha2VPZmZGaWx0ZXJzT2JqZWN0OiBNYXRlcmlhbFRha2VPZmZGaWx0ZXJzTGlzdERUTyA9IG5ldyBNYXRlcmlhbFRha2VPZmZGaWx0ZXJzTGlzdERUTyhidWlsZGluZ0xpc3QsIGNvc3RIZWFkTGlzdCxcclxuICAgICAgbWF0ZXJpYWxMaXN0KTtcclxuICAgIHJldHVybiBtYXRlcmlhbFRha2VPZmZGaWx0ZXJzT2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXREaXN0aW5jdEFycmF5T2ZTdHJpbmdGcm9tQWxhc3FsKGNvbHVtbjogc3RyaW5nLCBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5OiBBcnJheTxNYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTz4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdExpa2VPcHRpb25hbD86IHN0cmluZykge1xyXG4gICAgbGV0IHNxbFF1ZXJ5OiBzdHJpbmcgPSAnU0VMRUNUIERJU1RJTkNUIGZsYXREYXRhLicgKyBjb2x1bW4gKyAnIEZST00gPyBBUyBmbGF0RGF0YSc7XHJcbiAgICBsZXQgd2hlcmUgPSAnIHdoZXJlICcrIG5vdExpa2VPcHRpb25hbDtcclxuICAgIGlmKG5vdExpa2VPcHRpb25hbCkge1xyXG4gICAgICBzcWxRdWVyeSA9IHNxbFF1ZXJ5ICsgd2hlcmU7XHJcbiAgICB9XHJcbiAgICBsZXQgZGlzdGluY3RPYmplY3RBcnJheSA9IGFsYXNxbChzcWxRdWVyeSwgW21hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXldKTtcclxuICAgIGxldCBkaXN0aW5jdE5hbWVTdHJpbmdBcnJheTogQXJyYXk8c3RyaW5nPiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICBmb3IobGV0IGRpc3RpbmN0T2JqZWN0IG9mIGRpc3RpbmN0T2JqZWN0QXJyYXkpIHtcclxuICAgICAgZGlzdGluY3ROYW1lU3RyaW5nQXJyYXkucHVzaChkaXN0aW5jdE9iamVjdFtjb2x1bW5dKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkaXN0aW5jdE5hbWVTdHJpbmdBcnJheTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkTWF0ZXJpYWxEVE9Gb3JBY3RpdmVDb3N0SGVhZEluRFRPQXJyYXkoYnVpbGRpbmc6IEJ1aWxkaW5nLCBidWlsZGluZ05hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPikge1xyXG4gICAgbGV0IGNvc3RIZWFkTmFtZTtcclxuICAgIGZvciAobGV0IGNvc3RIZWFkOiBDb3N0SGVhZCBvZiBidWlsZGluZy5jb3N0SGVhZHMpIHtcclxuICAgICAgaWYgKGNvc3RIZWFkLmFjdGl2ZSkge1xyXG4gICAgICAgIGNvc3RIZWFkTmFtZSA9IGNvc3RIZWFkLm5hbWU7XHJcbiAgICAgICAgdGhpcy5hZGRNYXRlcmlhbERUT0ZvckFjdGl2ZUNhdGVnb3J5SW5EVE9BcnJheShjb3N0SGVhZCwgYnVpbGRpbmdOYW1lLCBjb3N0SGVhZE5hbWUsIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZE1hdGVyaWFsRFRPRm9yQWN0aXZlQ2F0ZWdvcnlJbkRUT0FycmF5KGNvc3RIZWFkOiBDb3N0SGVhZCwgYnVpbGRpbmdOYW1lOiBzdHJpbmcsIGNvc3RIZWFkTmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+KSB7XHJcbiAgICBsZXQgY2F0ZWdvcnlOYW1lOiBzdHJpbmc7XHJcbiAgICBmb3IgKGxldCBjYXRlZ29yeSBvZiBjb3N0SGVhZC5jYXRlZ29yaWVzKSB7XHJcbiAgICAgIGlmIChjYXRlZ29yeS5hY3RpdmUpIHtcclxuICAgICAgICBjYXRlZ29yeU5hbWUgPSBjYXRlZ29yeS5uYW1lO1xyXG4gICAgICAgIHRoaXMuYWRkTWF0ZXJpYWxEVE9Gb3JBY3RpdmVXb3JraXRlbUluRFRPQXJyYXkoY2F0ZWdvcnksIGJ1aWxkaW5nTmFtZSwgY29zdEhlYWROYW1lLCBjYXRlZ29yeU5hbWUsIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZE1hdGVyaWFsRFRPRm9yQWN0aXZlV29ya2l0ZW1JbkRUT0FycmF5KGNhdGVnb3J5OiBDYXRlZ29yeSwgYnVpbGRpbmdOYW1lOiBzdHJpbmcsIGNvc3RIZWFkTmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlOYW1lOiBzdHJpbmcsIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPikge1xyXG4gICAgbGV0IHdvcmtJdGVtTmFtZTogc3RyaW5nO1xyXG4gICAgZm9yIChsZXQgd29ya0l0ZW0gb2YgY2F0ZWdvcnkud29ya0l0ZW1zKSB7XHJcbiAgICAgIGlmICh3b3JrSXRlbS5hY3RpdmUpIHtcclxuICAgICAgICB3b3JrSXRlbU5hbWUgPSB3b3JrSXRlbS5uYW1lO1xyXG4gICAgICAgIHRoaXMuYWRkRXN0aW1hdGVkUXVhbnRpdHlBbmRSYXRlTWF0ZXJpYWxJdGVtSW5EVE9BcnJheSh3b3JrSXRlbSwgYnVpbGRpbmdOYW1lLCBjb3N0SGVhZE5hbWUsIGNhdGVnb3J5TmFtZSxcclxuICAgICAgICAgIHdvcmtJdGVtTmFtZSwgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkRXN0aW1hdGVkUXVhbnRpdHlBbmRSYXRlTWF0ZXJpYWxJdGVtSW5EVE9BcnJheSh3b3JrSXRlbTogV29ya0l0ZW0sIGJ1aWxkaW5nTmFtZTogc3RyaW5nLCBjb3N0SGVhZE5hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlOYW1lIDogc3RyaW5nLCB3b3JrSXRlbU5hbWU6IHN0cmluZywgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+KSB7XHJcbiAgICBsZXQgcXVhbnRpdHlOYW1lOiBzdHJpbmc7XHJcbiAgICBpZih3b3JrSXRlbS5xdWFudGl0eS5pc0RpcmVjdFF1YW50aXR5ICYmIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQpIHtcclxuICAgICAgcXVhbnRpdHlOYW1lID0gQ29uc3RhbnRzLlNUUl9ESVJFQ1Q7XHJcbiAgICAgIHRoaXMuY3JlYXRlQW5kQWRkTWF0ZXJpYWxEVE9PYmplY3RJbkRUT0FycmF5KHdvcmtJdGVtLCBidWlsZGluZ05hbWUsIGNvc3RIZWFkTmFtZSwgY2F0ZWdvcnlOYW1lLCB3b3JrSXRlbU5hbWUsIHF1YW50aXR5TmFtZSxcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5LCB3b3JrSXRlbS5xdWFudGl0eS50b3RhbCk7XHJcbiAgICB9IGVsc2UgaWYgKHdvcmtJdGVtLnF1YW50aXR5LmlzRXN0aW1hdGVkICYmIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQpIHtcclxuICAgICAgICBmb3IgKGxldCBxdWFudGl0eSBvZiB3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzKSB7XHJcbiAgICAgICAgICBxdWFudGl0eU5hbWUgPSBxdWFudGl0eS5uYW1lO1xyXG4gICAgICAgICAgdGhpcy5jcmVhdGVBbmRBZGRNYXRlcmlhbERUT09iamVjdEluRFRPQXJyYXkod29ya0l0ZW0sIGJ1aWxkaW5nTmFtZSwgY29zdEhlYWROYW1lLCBjYXRlZ29yeU5hbWUsIHdvcmtJdGVtTmFtZSwgcXVhbnRpdHlOYW1lLFxyXG4gICAgICAgICAgICBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5LCBxdWFudGl0eS50b3RhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVBbmRBZGRNYXRlcmlhbERUT09iamVjdEluRFRPQXJyYXkod29ya0l0ZW06IFdvcmtJdGVtLCBidWlsZGluZ05hbWU6IHN0cmluZywgY29zdEhlYWROYW1lOiBzdHJpbmcsIGNhdGVnb3J5TmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3b3JrSXRlbU5hbWU6IHN0cmluZywgcXVhbnRpdHlOYW1lOiBzdHJpbmcsIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogbnVtYmVyKSB7XHJcbiAgICBpZihjYXRlZ29yeU5hbWUgPT09IENvbnN0YW50cy5TVEVFTCkge1xyXG4gICAgICBmb3IgKGxldCBxdWFudGl0eUl0ZW0gb2Ygd29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscykge1xyXG4gICAgICAgICAgZm9yKGxldCBtYXRlcmlhbCBvZiBPYmplY3Qua2V5cyhxdWFudGl0eUl0ZW0uc3RlZWxRdWFudGl0eUl0ZW1zLnRvdGFsV2VpZ2h0T2ZEaWFtZXRlcikpIHtcclxuICAgICAgICAgICAgbGV0IG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxEVE8gPSBuZXcgTWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8oYnVpbGRpbmdOYW1lLCBjb3N0SGVhZE5hbWUsIGNhdGVnb3J5TmFtZSxcclxuICAgICAgICAgICAgICB3b3JrSXRlbU5hbWUsIG1hdGVyaWFsLCBxdWFudGl0eU5hbWUsIHF1YW50aXR5SXRlbS5zdGVlbFF1YW50aXR5SXRlbXMudG90YWxXZWlnaHRPZkRpYW1ldGVyW21hdGVyaWFsXSxcclxuICAgICAgICAgICAgICBxdWFudGl0eUl0ZW0uc3RlZWxRdWFudGl0eUl0ZW1zLnVuaXQpO1xyXG4gICAgICAgICAgICBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5LnB1c2gobWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbERUTyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAobGV0IHJhdGVJdGVtIG9mIHdvcmtJdGVtLnJhdGUucmF0ZUl0ZW1zKSB7XHJcbiAgICAgICAgbGV0IG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxEVE8gPSBuZXcgTWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8oYnVpbGRpbmdOYW1lLCBjb3N0SGVhZE5hbWUsIGNhdGVnb3J5TmFtZSxcclxuICAgICAgICAgIHdvcmtJdGVtTmFtZSwgcmF0ZUl0ZW0uaXRlbU5hbWUsIHF1YW50aXR5TmFtZSwgKHF1YW50aXR5IC8gd29ya0l0ZW0ucmF0ZS5xdWFudGl0eSkgKiByYXRlSXRlbS5xdWFudGl0eSxcclxuICAgICAgICAgIHJhdGVJdGVtLnVuaXQpO1xyXG4gICAgICAgIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkucHVzaChtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsRFRPKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoUmVwb3J0U2VydmljZSk7XHJcbmV4cG9ydCA9IFJlcG9ydFNlcnZpY2U7XHJcblxyXG4iXX0=
