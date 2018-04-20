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
var config = require('config');
var log4js = require('log4js');
var logger = log4js.getLogger('Report Service');
var ReportService = (function () {
    function ReportService() {
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
        return (buildingsReport);
    };
    ReportService.prototype.getThumbRuleAndEstimatedReport = function (building, buildingReport, thumbRuleReports, estimatedReports, rateUnit) {
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
        }
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
        return (commonAmenitiesReport);
    };
    ReportService.prototype.getThumbRuleAndEstimatedReportForProjectCostHead = function (projectCostHead, projectRates, projectReport, thumbRuleReports, estimatedReports, totalArea, rateUnit) {
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
                estimateReport = this.getEstimatedReport(projectRates, costHead, totalArea, rateUnit);
                estimatedReports.push(estimateReport);
            }
        }
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
                    var materialTakeOffReport = new MaterialTakeOffReport(null, null);
                    materialTakeOffReport.secondaryView = {};
                    _this.populateMaterialTakeOffReportFromRowData(materialReportRowData, materialTakeOffReport, elementWiseReport, building);
                    var responseData = {};
                    responseData[element] = materialTakeOffReport;
                    callback(null, responseData);
                }
                else {
                    callback(new CostControllException('Material TakeOff Report Not Found For ' + building, null), null);
                }
            }
        });
    };
    ReportService.prototype.populateMaterialTakeOffReportFromRowData = function (materialReportRowData, materialTakeOffReport, elementWiseReport, building) {
        for (var _i = 0, materialReportRowData_1 = materialReportRowData; _i < materialReportRowData_1.length; _i++) {
            var record = materialReportRowData_1[_i];
            if (materialTakeOffReport.secondaryView[record.header] === undefined ||
                materialTakeOffReport.secondaryView[record.header] === null) {
                materialTakeOffReport.title = building;
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
            if (table.content[record.rowValue] === undefined || table.content[record.rowValue] === null) {
                table.content[record.rowValue] = new MaterialTakeOffTableViewContent(record.rowValue, 0, record.unit, {});
            }
            var tableViewContent = table.content[record.rowValue];
            tableViewContent.columnTwo = tableViewContent.columnTwo + record.Total;
            if (materialTakeOffTableViewSubContent) {
                tableViewContent.subContent[record.subValue] = materialTakeOffTableViewSubContent;
            }
            var materialTakeOffTableViewFooter = null;
            if (table.footer === undefined || table.footer === null) {
                table.footer =
                    new MaterialTakeOffTableViewFooter('Total', 0, record.unit);
            }
            materialTakeOffTableViewFooter = table.footer;
            materialTakeOffTableViewFooter.columnTwo = materialTakeOffTableViewFooter.columnTwo + record.Total;
            materialTakeOffSecondaryView.title = materialTakeOffTableViewFooter.columnTwo + ' '
                + materialTakeOffTableViewFooter.columnThree;
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
        var materialList = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray, Constants.ALASQL_MATERIAL_NOT_LABOUR);
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
        for (var _i = 0, _a = workItem.rate.rateItems; _i < _a.length; _i++) {
            var rateItem = _a[_i];
            var materialTakeOffFlatDetailDTO = new MaterialTakeOffFlatDetailsDTO(buildingName, costHeadName, categoryName, workItemName, rateItem.itemName, quantityName, Math.ceil(((quantity / workItem.rate.quantity) * rateItem.quantity)), rateItem.unit);
            materialTakeOffFlatDetailsArray.push(materialTakeOffFlatDetailDTO);
        }
    };
    return ReportService;
}());
Object.seal(ReportService);
module.exports = ReportService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmVwb3J0U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEVBQWlGO0FBQ2pGLGdGQUFtRjtBQUNuRixvRUFBdUU7QUFDdkUsa0VBQXFFO0FBR3JFLG1GQUFzRjtBQUN0RixxRkFBd0Y7QUFDeEYsOEVBQWlGO0FBRWpGLG1GQUFzRjtBQUN0RixpRkFBb0Y7QUFDcEYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSwyREFBOEQ7QUFFOUQsK0JBQWtDO0FBQ2xDLCtDQUFrRDtBQUNsRCxpREFBb0Q7QUFLcEQsc0dBQXlHO0FBQ3pHLHNHQUF5RztBQUV6RyxpR0FBb0c7QUFDcEcsdUdBQTBHO0FBRTFHLHFIQUF3SDtBQUN4SCwySEFBOEg7QUFDOUgscUhBQXdIO0FBQ3hILG1IQUFzSDtBQUN0SCwwRUFBNkU7QUFDN0UsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFOUM7SUFVRTtRQUNFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRCxpQ0FBUyxHQUFULFVBQVcsU0FBZSxFQUFF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QTRCLENBQUMsQ0FBQztTQUNwRTtJQUNILENBQUM7SUFDSCxvQkFBQztBQUFELENBbmdCQSxBQW1nQkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0IsaUJBQVMsYUFBYSxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmVwb3J0U2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9qZWN0UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9Qcm9qZWN0UmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgQnVpbGRpbmdSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L0J1aWxkaW5nUmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvQnVpbGRpbmcnKTtcclxuaW1wb3J0IEJ1aWxkaW5nUmVwb3J0ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvQnVpbGRpbmdSZXBvcnQnKTtcclxuaW1wb3J0IFRodW1iUnVsZVJlcG9ydCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL1RodW1iUnVsZVJlcG9ydCcpO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IENvc3RIZWFkID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb25nb29zZS9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgRXN0aW1hdGVSZXBvcnQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvcmVwb3J0cy9Fc3RpbWF0ZVJlcG9ydCcpO1xyXG5pbXBvcnQgUHJvamVjdFJlcG9ydCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL1Byb2plY3RSZXBvcnQnKTtcclxuaW1wb3J0IFRodW1iUnVsZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9UaHVtYlJ1bGUnKTtcclxuaW1wb3J0IEVzdGltYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0VzdGltYXRlJyk7XHJcbmltcG9ydCBSYXRlQW5hbHlzaXNTZXJ2aWNlID0gcmVxdWlyZSgnLi9SYXRlQW5hbHlzaXNTZXJ2aWNlJyk7XHJcbmltcG9ydCBDYXRlZ29yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9DYXRlZ29yeScpO1xyXG5pbXBvcnQgYWxhc3FsID0gcmVxdWlyZSgnYWxhc3FsJyk7XHJcbmltcG9ydCBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvY29uc3RhbnRzJyk7XHJcbmltcG9ydCBQcm9qZWN0U2VydmljZSA9IHJlcXVpcmUoJy4vUHJvamVjdFNlcnZpY2UnKTtcclxuaW1wb3J0IENlbnRyYWxpemVkUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9DZW50cmFsaXplZFJhdGUnKTtcclxuaW1wb3J0IE1hdGVyaWFsRGV0YWlsRFRPID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9kdG8vcHJvamVjdC9NYXRlcmlhbERldGFpbERUTycpO1xyXG5pbXBvcnQgV29ya0l0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvV29ya0l0ZW0nKTtcclxuaW1wb3J0IHtRdWFudGl0eURldGFpbHN9IGZyb20gJy4uLy4uLy4uLy4uL2NsaWVudC9hcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvbW9kZWwvcXVhbnRpdHktZGV0YWlscyc7XHJcbmltcG9ydCBNYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvZHRvL1JlcG9ydC9NYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTycpO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmRmlsdGVyc0xpc3REVE8gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL2R0by9SZXBvcnQvTWF0ZXJpYWxUYWtlT2ZmRmlsdGVyc0xpc3REVE8nKTtcclxuaW1wb3J0IHtlbGVtZW50fSBmcm9tICdwcm90cmFjdG9yJztcclxuaW1wb3J0IE1hdGVyaWFsVGFrZU9mZlJlcG9ydCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL01hdGVyaWFsVGFrZU9mZlJlcG9ydCcpO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Jyk7XHJcbmltcG9ydCBNYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvTWF0ZXJpYWxUYWtlT2ZmU2Vjb25kYXJ5VmlldycpO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Q29udGVudCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL01hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0NvbnRlbnQnKTtcclxuaW1wb3J0IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld1N1YkNvbnRlbnQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvcmVwb3J0cy9NYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50Jyk7XHJcbmltcG9ydCBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdIZWFkZXJzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3SGVhZGVycycpO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyJyk7XHJcbmltcG9ydCBDb3N0Q29udHJvbGxFeGNlcHRpb24gPSByZXF1aXJlKFwiLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvblwiKTtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbnZhciBsb2dnZXI9bG9nNGpzLmdldExvZ2dlcignUmVwb3J0IFNlcnZpY2UnKTtcclxuXHJcbmNsYXNzIFJlcG9ydFNlcnZpY2Uge1xyXG4gIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBwcm9qZWN0UmVwb3NpdG9yeTogUHJvamVjdFJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBidWlsZGluZ1JlcG9zaXRvcnk6IEJ1aWxkaW5nUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGF1dGhJbnRlcmNlcHRvcjogQXV0aEludGVyY2VwdG9yO1xyXG4gIHByaXZhdGUgdXNlclNlcnZpY2UgOiBVc2VyU2VydmljZTtcclxuICBwcml2YXRlIHJhdGVBbmFseXNpc1NlcnZpY2UgOiBSYXRlQW5hbHlzaXNTZXJ2aWNlO1xyXG4gIHByaXZhdGUgcHJvamVjdFNlcnZpY2UgOiBQcm9qZWN0U2VydmljZTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeSA9IG5ldyBCdWlsZGluZ1JlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XHJcbiAgICB0aGlzLmF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHRoaXMudXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHRoaXMucmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgfVxyXG5cclxuICBnZXRSZXBvcnQoIHByb2plY3RJZCA6IGFueSwgcmVwb3J0VHlwZSA6IHN0cmluZywgcmF0ZVVuaXQgOiBzdHJpbmcsIGFyZWFUeXBlIDogc3RyaW5nLOKAguKAgnVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRSZXBvcnQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5ncyd9O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUmVwb3J0IFNlcnZpY2UsIGZpbmRBbmRQb3B1bGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5ncyA9IHJlc3VsdFswXS5idWlsZGluZ3M7XHJcbiAgICAgICAgdmFyIHR5cGVPZkFyZWE6IHN0cmluZztcclxuICAgICAgICBsZXQgdG90YWxBcmVhOiBudW1iZXI7XHJcbiAgICAgICAgbGV0IGNob2ljZSA9IGFyZWFUeXBlO1xyXG4gICAgICAgIHN3aXRjaCAoY2hvaWNlKSB7XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5TTEFCX0FSRUE6XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGVPZkFyZWEgPSBDb25zdGFudHMuVE9UQUxfU0xBQl9BUkVBO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5TQUxFQUJMRV9BUkVBOlxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlT2ZBcmVhID0gQ29uc3RhbnRzLlRPVEFMX1NBTEVBQkxFX0FSRUE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNhc2UgIENvbnN0YW50cy5DQVJQRVRfQVJFQSA6XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGVPZkFyZWEgPSBDb25zdGFudHMuVE9UQUxfQ0FSUEVUX0FSRUE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGVmYXVsdCA6ICBjYWxsYmFjayhlcnJvcixudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgIGxldCB0b3RhbE9mQXJlYSA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTSgnK3R5cGVPZkFyZWErJyksMikgRlJPTSA/JyxbYnVpbGRpbmdzXSk7XHJcbiAgICAgICAgaWYocmF0ZVVuaXQgPT09IENvbnN0YW50cy5TUVVSRU1FVEVSX1VOSVQpIHtcclxuICAgICAgICAgdG90YWxBcmVhID10b3RhbE9mQXJlYSAqIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlNRVUFSRV9NRVRFUik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRvdGFsQXJlYSA9IHRvdGFsT2ZBcmVhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJvamVjdFJlcG9ydCA6IFByb2plY3RSZXBvcnQgPSBuZXcgUHJvamVjdFJlcG9ydCgpO1xyXG5cclxuICAgICAgICBwcm9qZWN0UmVwb3J0LmJ1aWxkaW5ncyA9IHRoaXMuZ2VuZXJhdGVSZXBvcnRCeUNvc3RIZWFkcyhidWlsZGluZ3MsIHR5cGVPZkFyZWEsIHJhdGVVbml0KTtcclxuXHJcbiAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSByZXN1bHRbMF0ucHJvamVjdENvc3RIZWFkcztcclxuICAgICAgICBsZXQgcHJvamVjdFJhdGVzID0gcmVzdWx0WzBdLnJhdGVzO1xyXG4gICAgICAgIGlmKHByb2plY3RDb3N0SGVhZHMhPT0gbnVsbCkge1xyXG4gICAgICAgICAgcHJvamVjdFJlcG9ydC5jb21tb25BbWVuaXRpZXMgPSB0aGlzLmdlbmVyYXRlUmVwb3J0Rm9yUHJvamVjdENvc3RIZWFkcyhwcm9qZWN0Q29zdEhlYWRzLCBwcm9qZWN0UmF0ZXMsIHRvdGFsQXJlYSwgcmF0ZVVuaXQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7IGRhdGE6IHByb2plY3RSZXBvcnQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZW5lcmF0ZVJlcG9ydEJ5Q29zdEhlYWRzKCBidWlsZGluZ3M6ICBBcnJheTxCdWlsZGluZz4gLCB0eXBlT2ZBcmVhOiBzdHJpbmcsIHJhdGVVbml0OiBzdHJpbmcpIHtcclxuXHJcbiAgICBsZXQgYnVpbGRpbmdzUmVwb3J0IDogQXJyYXk8QnVpbGRpbmdSZXBvcnQ+ID0gbmV3IEFycmF5PEJ1aWxkaW5nUmVwb3J0PigpO1xyXG4gICAgZm9yIChsZXQgYnVpbGRpbmcgb2YgYnVpbGRpbmdzKSB7XHJcbiAgICAgIGxldCBidWlsZGluZ1JlcG9ydCA9IG5ldyBCdWlsZGluZ1JlcG9ydDtcclxuICAgICAgYnVpbGRpbmdSZXBvcnQubmFtZSA9IGJ1aWxkaW5nLm5hbWU7XHJcbiAgICAgIGJ1aWxkaW5nUmVwb3J0Ll9pZCA9IGJ1aWxkaW5nLl9pZDtcclxuICAgICAgaWYocmF0ZVVuaXQgPT09IENvbnN0YW50cy5TUVVSRU1FVEVSX1VOSVQpIHtcclxuICAgICAgICBidWlsZGluZ1JlcG9ydC5hcmVhID0gIGJ1aWxkaW5nW3R5cGVPZkFyZWFdICogY29uZmlnLmdldChDb25zdGFudHMuU1FVQVJFX01FVEVSKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBidWlsZGluZ1JlcG9ydC5hcmVhID0gYnVpbGRpbmdbdHlwZU9mQXJlYV07XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHRodW1iUnVsZSAgPSBuZXcgVGh1bWJSdWxlKCk7XHJcbiAgICAgIGxldCBlc3RpbWF0ZSAgPSBuZXcgRXN0aW1hdGUoKTtcclxuICAgICAgbGV0IHRodW1iUnVsZVJlcG9ydHMgPSBuZXcgQXJyYXk8VGh1bWJSdWxlUmVwb3J0PigpO1xyXG4gICAgICBsZXQgZXN0aW1hdGVkUmVwb3J0cyA9IG5ldyBBcnJheTxFc3RpbWF0ZVJlcG9ydD4oKTtcclxuXHJcblxyXG4gICAgICB0aGlzLmdldFRodW1iUnVsZUFuZEVzdGltYXRlZFJlcG9ydChidWlsZGluZywgYnVpbGRpbmdSZXBvcnQsIHRodW1iUnVsZVJlcG9ydHMsIGVzdGltYXRlZFJlcG9ydHMsIHJhdGVVbml0KTtcclxuXHJcbiAgICAgIGxldCB0b3RhbFJhdGVzID0gYWxhc3FsKCdTRUxFQ1QgUk9VTkQoU1VNKGFtb3VudCksMikgQVMgdG90YWxBbW91bnQsIFJPVU5EKFNVTShyYXRlKSwyKSBBUyB0b3RhbFJhdGUgRlJPTSA/JyxbdGh1bWJSdWxlUmVwb3J0c10pO1xyXG4gICAgICB0aHVtYlJ1bGUudG90YWxSYXRlID0gdG90YWxSYXRlc1swXS50b3RhbFJhdGU7XHJcbiAgICAgIHRodW1iUnVsZS50b3RhbEJ1ZGdldGVkQ29zdCA9IE1hdGgucm91bmQodG90YWxSYXRlc1swXS50b3RhbEFtb3VudCk7XHJcbiAgICAgIHRodW1iUnVsZS50aHVtYlJ1bGVSZXBvcnRzID0gdGh1bWJSdWxlUmVwb3J0cztcclxuXHJcbiAgICAgIGxldCB0b3RhbEVzdGltYXRlZFJhdGVzID0gYWxhc3FsKCdTRUxFQ1QgUk9VTkQoU1VNKHRvdGFsKSwyKSBBUyB0b3RhbEFtb3VudCwgUk9VTkQoU1VNKHJhdGUpLDIpIEFTIHRvdGFsUmF0ZSBGUk9NID8nLFxyXG4gICAgICAgIFtlc3RpbWF0ZWRSZXBvcnRzXSk7XHJcbiAgICAgIGVzdGltYXRlLnRvdGFsUmF0ZSA9IHRvdGFsRXN0aW1hdGVkUmF0ZXNbMF0udG90YWxSYXRlO1xyXG4gICAgICBlc3RpbWF0ZS50b3RhbEVzdGltYXRlZENvc3QgPSB0b3RhbEVzdGltYXRlZFJhdGVzWzBdLnRvdGFsQW1vdW50O1xyXG4gICAgICBlc3RpbWF0ZS5lc3RpbWF0ZWRDb3N0cyA9IGVzdGltYXRlZFJlcG9ydHM7XHJcblxyXG4gICAgICBidWlsZGluZ1JlcG9ydC50aHVtYlJ1bGUgPSB0aHVtYlJ1bGU7XHJcbiAgICAgIGJ1aWxkaW5nUmVwb3J0LmVzdGltYXRlID0gZXN0aW1hdGU7XHJcbiAgICAgIGJ1aWxkaW5nc1JlcG9ydC5wdXNoKGJ1aWxkaW5nUmVwb3J0KTtcclxuICAgIH1cclxuICAgIHJldHVybihidWlsZGluZ3NSZXBvcnQpO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldFRodW1iUnVsZUFuZEVzdGltYXRlZFJlcG9ydChidWlsZGluZyA6QnVpbGRpbmcsIGJ1aWxkaW5nUmVwb3J0OiBCdWlsZGluZ1JlcG9ydCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWJSdWxlUmVwb3J0czogVGh1bWJSdWxlUmVwb3J0W10sIGVzdGltYXRlZFJlcG9ydHM6IEVzdGltYXRlUmVwb3J0W10sIHJhdGVVbml0OnN0cmluZykge1xyXG5cclxuICAgIGZvciAobGV0IGNvc3RIZWFkIG9mIGJ1aWxkaW5nLmNvc3RIZWFkcykge1xyXG5cclxuICAgICAgaWYoY29zdEhlYWQuYWN0aXZlKSB7XHJcbiAgICAgICAgLy9UaHVtYlJ1bGUgUmVwb3J0XHJcbiAgICAgICAgbGV0IHRodW1iUnVsZVJlcG9ydCA9IG5ldyBUaHVtYlJ1bGVSZXBvcnQoKTtcclxuICAgICAgICB0aHVtYlJ1bGVSZXBvcnQubmFtZSA9IGNvc3RIZWFkLm5hbWU7XHJcbiAgICAgICAgdGh1bWJSdWxlUmVwb3J0LnJhdGVBbmFseXNpc0lkID0gY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgdGh1bWJSdWxlUmVwb3J0LmFtb3VudCA9IE1hdGgucm91bmQoY29zdEhlYWQuYnVkZ2V0ZWRDb3N0QW1vdW50KTtcclxuICAgICAgICB0aHVtYlJ1bGVSZXBvcnQuY29zdEhlYWRBY3RpdmUgPSBjb3N0SGVhZC5hY3RpdmU7XHJcbiAgICAgICAgdGh1bWJSdWxlUmVwb3J0LnJhdGUgPSB0aHVtYlJ1bGVSZXBvcnQuYW1vdW50IC8gYnVpbGRpbmdSZXBvcnQuYXJlYTtcclxuICAgICAgICB0aHVtYlJ1bGVSZXBvcnRzLnB1c2godGh1bWJSdWxlUmVwb3J0KTtcclxuXHJcbiAgICAgICAgLy9Fc3RpbWF0ZWQgY29zdCBSZXBvcnRcclxuICAgICAgICBsZXQgZXN0aW1hdGVSZXBvcnQgPSBuZXcgRXN0aW1hdGVSZXBvcnQoKTtcclxuICAgICAgICBlc3RpbWF0ZVJlcG9ydCA9IHRoaXMuZ2V0RXN0aW1hdGVkUmVwb3J0KGJ1aWxkaW5nLnJhdGVzLCBjb3N0SGVhZCwgYnVpbGRpbmdSZXBvcnQuYXJlYSwgcmF0ZVVuaXQpO1xyXG4gICAgICAgIGVzdGltYXRlZFJlcG9ydHMucHVzaChlc3RpbWF0ZVJlcG9ydCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEVzdGltYXRlZFJlcG9ydChjZW50cmFsaXplZFJhdGVzOkFycmF5PENlbnRyYWxpemVkUmF0ZT4sIGNvc3RIZWFkOiBhbnksIGFyZWE6bnVtYmVyLCByYXRlVW5pdDpzdHJpbmcpIHtcclxuXHJcbiAgICBsZXQgZXN0aW1hdGVSZXBvcnQgPSBuZXcgRXN0aW1hdGVSZXBvcnQoKTtcclxuICAgIGVzdGltYXRlUmVwb3J0Lm5hbWUgPSBjb3N0SGVhZC5uYW1lO1xyXG4gICAgZXN0aW1hdGVSZXBvcnQucmF0ZUFuYWx5c2lzSWQgPSBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZDtcclxuXHJcbiAgICBsZXQgY29zdEhlYWRDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4gPSBjb3N0SGVhZC5jYXRlZ29yaWVzO1xyXG4gICAgbGV0IHByb2plY3RTZXJ2aWNlIDogUHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgIGxldCBjYXRlZ29yaWVzT2JqID0gcHJvamVjdFNlcnZpY2UuZ2V0Q2F0ZWdvcmllc0xpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyhjb3N0SGVhZENhdGVnb3JpZXMsIGNlbnRyYWxpemVkUmF0ZXMpO1xyXG4gICAgZXN0aW1hdGVSZXBvcnQudG90YWwgPSBjYXRlZ29yaWVzT2JqLmNhdGVnb3JpZXNBbW91bnQ7XHJcbiAgICBlc3RpbWF0ZVJlcG9ydC5yYXRlID0gZXN0aW1hdGVSZXBvcnQudG90YWwgLyBhcmVhO1xyXG4gICAgcmV0dXJuIGVzdGltYXRlUmVwb3J0O1xyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWRzKHByb2plY3RDb3N0SGVhZHM6ICBBcnJheTxDb3N0SGVhZD4sIHByb2plY3RSYXRlczogQXJyYXk8Q2VudHJhbGl6ZWRSYXRlPiwgdG90YWxBcmVhOiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlVW5pdDogc3RyaW5nKSB7XHJcbiAgICBsZXQgY29tbW9uQW1lbml0aWVzUmVwb3J0IDogQXJyYXk8QnVpbGRpbmdSZXBvcnQ+ID0gbmV3IEFycmF5PEJ1aWxkaW5nUmVwb3J0PigpO1xyXG4gICAgICBsZXQgcHJvamVjdFJlcG9ydCA9IG5ldyBCdWlsZGluZ1JlcG9ydDtcclxuICAgICAgcHJvamVjdFJlcG9ydC5uYW1lID0gQ29uc3RhbnRzLkFNRU5JVElFUztcclxuICAgICAgcHJvamVjdFJlcG9ydC5hcmVhID0gdG90YWxBcmVhO1xyXG5cclxuICAgICAgbGV0IHRodW1iUnVsZSAgPSBuZXcgVGh1bWJSdWxlKCk7XHJcbiAgICAgIGxldCBlc3RpbWF0ZSAgPSBuZXcgRXN0aW1hdGUoKTtcclxuICAgICAgbGV0IHRodW1iUnVsZVJlcG9ydHMgPSBuZXcgQXJyYXk8VGh1bWJSdWxlUmVwb3J0PigpO1xyXG4gICAgICBsZXQgZXN0aW1hdGVkUmVwb3J0cyA9IG5ldyBBcnJheTxFc3RpbWF0ZVJlcG9ydD4oKTtcclxuXHJcblxyXG4gICAgICB0aGlzLmdldFRodW1iUnVsZUFuZEVzdGltYXRlZFJlcG9ydEZvclByb2plY3RDb3N0SGVhZChwcm9qZWN0Q29zdEhlYWRzLCBwcm9qZWN0UmF0ZXMsXHJcbiAgICAgICAgcHJvamVjdFJlcG9ydCwgdGh1bWJSdWxlUmVwb3J0cywgZXN0aW1hdGVkUmVwb3J0cywgdG90YWxBcmVhLCByYXRlVW5pdCk7XHJcblxyXG4gICAgbGV0IHRvdGFsUmF0ZXMgPSBhbGFzcWwoJ1NFTEVDVCBST1VORChTVU0oYW1vdW50KSwyKSBBUyB0b3RhbEFtb3VudCwgUk9VTkQoU1VNKHJhdGUpLDIpIEFTIHRvdGFsUmF0ZSBGUk9NID8nLFt0aHVtYlJ1bGVSZXBvcnRzXSk7XHJcbiAgICAgIHRodW1iUnVsZS50b3RhbFJhdGUgPSB0b3RhbFJhdGVzWzBdLnRvdGFsUmF0ZTtcclxuICAgICAgdGh1bWJSdWxlLnRvdGFsQnVkZ2V0ZWRDb3N0ID0gTWF0aC5yb3VuZCh0b3RhbFJhdGVzWzBdLnRvdGFsQW1vdW50KTtcclxuICAgICAgdGh1bWJSdWxlLnRodW1iUnVsZVJlcG9ydHMgPSB0aHVtYlJ1bGVSZXBvcnRzO1xyXG5cclxuICAgIGxldCB0b3RhbEVzdGltYXRlZFJhdGVzID0gYWxhc3FsKCdTRUxFQ1QgUk9VTkQoU1VNKHRvdGFsKSwyKSBBUyB0b3RhbEFtb3VudCwgUk9VTkQoU1VNKHJhdGUpLDIpIEFTIHRvdGFsUmF0ZSBGUk9NID8nLFxyXG4gICAgICBbZXN0aW1hdGVkUmVwb3J0c10pO1xyXG4gICAgICBlc3RpbWF0ZS50b3RhbFJhdGUgPSB0b3RhbEVzdGltYXRlZFJhdGVzWzBdLnRvdGFsUmF0ZTtcclxuICAgICAgZXN0aW1hdGUudG90YWxFc3RpbWF0ZWRDb3N0ID0gdG90YWxFc3RpbWF0ZWRSYXRlc1swXS50b3RhbEFtb3VudDtcclxuICAgICAgZXN0aW1hdGUuZXN0aW1hdGVkQ29zdHMgPSBlc3RpbWF0ZWRSZXBvcnRzO1xyXG5cclxuICAgICAgcHJvamVjdFJlcG9ydC50aHVtYlJ1bGUgPSB0aHVtYlJ1bGU7XHJcbiAgICAgIHByb2plY3RSZXBvcnQuZXN0aW1hdGUgPSBlc3RpbWF0ZTtcclxuICAgIGNvbW1vbkFtZW5pdGllc1JlcG9ydC5wdXNoKHByb2plY3RSZXBvcnQpO1xyXG4gICAgcmV0dXJuKGNvbW1vbkFtZW5pdGllc1JlcG9ydCk7XHJcbiAgfVxyXG5cclxuICBnZXRUaHVtYlJ1bGVBbmRFc3RpbWF0ZWRSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQocHJvamVjdENvc3RIZWFkOiBBcnJheTxDb3N0SGVhZD4sIHByb2plY3RSYXRlczogQXJyYXk8Q2VudHJhbGl6ZWRSYXRlPixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdFJlcG9ydDogQnVpbGRpbmdSZXBvcnQsIHRodW1iUnVsZVJlcG9ydHM6IFRodW1iUnVsZVJlcG9ydFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlc3RpbWF0ZWRSZXBvcnRzOiBFc3RpbWF0ZVJlcG9ydFtdLCB0b3RhbEFyZWE6bnVtYmVyLCByYXRlVW5pdDpzdHJpbmcpIHtcclxuICBmb3IgKGxldCBjb3N0SGVhZCAgb2YgcHJvamVjdENvc3RIZWFkKSB7XHJcbiAgICBpZiAoY29zdEhlYWQuYWN0aXZlKSB7XHJcbiAgICAgIC8vVGh1bWJSdWxlIFJlcG9ydFxyXG4gICAgICBsZXQgdGh1bWJSdWxlUmVwb3J0ID0gbmV3IFRodW1iUnVsZVJlcG9ydCgpO1xyXG4gICAgICB0aHVtYlJ1bGVSZXBvcnQubmFtZSA9IGNvc3RIZWFkLm5hbWU7XHJcbiAgICAgIHRodW1iUnVsZVJlcG9ydC5yYXRlQW5hbHlzaXNJZCA9IGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICB0aHVtYlJ1bGVSZXBvcnQuYW1vdW50ID0gTWF0aC5yb3VuZChjb3N0SGVhZC5idWRnZXRlZENvc3RBbW91bnQpO1xyXG4gICAgICB0aHVtYlJ1bGVSZXBvcnQuY29zdEhlYWRBY3RpdmUgPSBjb3N0SGVhZC5hY3RpdmU7XHJcbiAgICAgIHRodW1iUnVsZVJlcG9ydC5yYXRlID0gdGh1bWJSdWxlUmVwb3J0LmFtb3VudCAvIHRvdGFsQXJlYTtcclxuICAgICAgdGh1bWJSdWxlUmVwb3J0cy5wdXNoKHRodW1iUnVsZVJlcG9ydCk7XHJcblxyXG4gICAgICAvL0VzdGltYXRlZCBjb3N0IFJlcG9ydFxyXG4gICAgICBsZXQgZXN0aW1hdGVSZXBvcnQgPSBuZXcgRXN0aW1hdGVSZXBvcnQoKTtcclxuICAgICAgZXN0aW1hdGVSZXBvcnQgPSB0aGlzLmdldEVzdGltYXRlZFJlcG9ydChwcm9qZWN0UmF0ZXMsIGNvc3RIZWFkLCB0b3RhbEFyZWEsIHJhdGVVbml0KTtcclxuICAgICAgZXN0aW1hdGVkUmVwb3J0cy5wdXNoKGVzdGltYXRlUmVwb3J0KTtcclxuICAgIH1cclxuICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGdldENvc3RIZWFkcyggIHVybDogc3RyaW5nICwgdXNlcjogVXNlcixjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmVwb3J0IFNlcnZpY2UsIGdldENvc3RIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMucmF0ZUFuYWx5c2lzU2VydmljZS5nZXRDb3N0SGVhZHMoIHVybCwgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciA6ICcrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7IGRhdGE6IHJlc3VsdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtcyggdXJsOiBzdHJpbmcgLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmVwb3J0IFNlcnZpY2UsIGdldFdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMucmF0ZUFuYWx5c2lzU2VydmljZS5nZXRXb3JrSXRlbXMoIHVybCwgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciA6ICcrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7IGRhdGE6IHJlc3VsdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldE1hdGVyaWFsRGV0YWlscyggcHJvamVjdElkIDogYW55LOKAgnVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRNYXRlcmlhbERldGFpbHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5ncyd9O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUmVwb3J0IFNlcnZpY2UsIGZpbmRBbmRQb3B1bGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpcy5nZXRCdWlsZGluZ01hdGVyaWFsRGV0YWlscyhyZXN1bHRbMF0uYnVpbGRpbmdzKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmdNYXRlcmlhbERldGFpbHMoYnVpbGRpbmdzIDogQXJyYXk8QnVpbGRpbmc+KTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+IHtcclxuICAgIGxldCBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5IDogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+PSBuZXcgQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+KCk7XHJcbiAgICBsZXQgYnVpbGRpbmdOYW1lOiBzdHJpbmc7XHJcbiAgICBmb3IobGV0IGJ1aWxkaW5nOiBCdWlsZGluZyBvZiBidWlsZGluZ3MpIHtcclxuICAgICAgYnVpbGRpbmdOYW1lID0gYnVpbGRpbmcubmFtZTtcclxuICAgICAgdGhpcy5hZGRNYXRlcmlhbERUT0ZvckFjdGl2ZUNvc3RIZWFkSW5EVE9BcnJheShidWlsZGluZywgYnVpbGRpbmdOYW1lLCBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5KTtcclxuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTtcclxuICB9XHJcblxyXG4gIGdldE1hdGVyaWFsRmlsdGVycyggcHJvamVjdElkIDogYW55LOKAgnVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRNYXRlcmlhbEZpbHRlcnMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5ncyd9O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUmVwb3J0IFNlcnZpY2UsIGZpbmRBbmRQb3B1bGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpcy5nZXRNYXRlcmlhbFRha2VPZmZGaWx0ZXJPYmplY3QocmVzdWx0WzBdLmJ1aWxkaW5ncykpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldE1hdGVyaWFsVGFrZU9mZlJlcG9ydCggcHJvamVjdElkIDogYW55LCBidWlsZGluZzogc3RyaW5nLCBlbGVtZW50V2lzZVJlcG9ydDogc3RyaW5nLCBlbGVtZW50OiBzdHJpbmcs4oCCdXNlcjogVXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICBsb2dnZXIuaW5mbygnUmVwb3J0IFNlcnZpY2UsIGdldE1hdGVyaWFsVGFrZU9mZlJlcG9ydCBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHsgX2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgbGV0IHBvcHVsYXRlID0ge3BhdGggOiAnYnVpbGRpbmdzJ307XHJcbiAgICBpZihidWlsZGluZyAhPT0gQ29uc3RhbnRzLlNUUl9BTExfQlVJTERJTkcpIHtcclxuICAgICAgcG9wdWxhdGUgPSB7cGF0aCA6ICdidWlsZGluZ3MnLCBtYXRjaDp7bmFtZTogYnVpbGRpbmd9fTtcclxuICAgIH1cclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBmaW5kQW5kUG9wdWxhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmKHJlc3VsdFswXS5idWlsZGluZ3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKCdVbmFibGUgdG8gZmluZCBCdWlsZGluZycsbnVsbCksIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+ID0gdGhpcy5nZXRCdWlsZGluZ01hdGVyaWFsRGV0YWlscyhyZXN1bHRbMF0uYnVpbGRpbmdzKTtcclxuICAgICAgICBsZXQgbWF0ZXJpYWxSZXBvcnRSb3dEYXRhID1cclxuICAgICAgICAgIHRoaXMuZ2V0TWF0ZXJpYWxEYXRhRnJvbUZsYXREZXRhaWxzQXJyYXkoZWxlbWVudFdpc2VSZXBvcnQsIGVsZW1lbnQsIGJ1aWxkaW5nLCBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5KTtcclxuICAgICAgICBpZihtYXRlcmlhbFJlcG9ydFJvd0RhdGEubGVuZ3RoPjAgJiYgbWF0ZXJpYWxSZXBvcnRSb3dEYXRhWzBdLmhlYWRlciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0OiBNYXRlcmlhbFRha2VPZmZSZXBvcnQgPSBuZXcgTWF0ZXJpYWxUYWtlT2ZmUmVwb3J0KG51bGwsIG51bGwpO1xyXG4gICAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnNlY29uZGFyeVZpZXcgPSB7fTtcclxuICAgICAgICAgIHRoaXMucG9wdWxhdGVNYXRlcmlhbFRha2VPZmZSZXBvcnRGcm9tUm93RGF0YShtYXRlcmlhbFJlcG9ydFJvd0RhdGEsIG1hdGVyaWFsVGFrZU9mZlJlcG9ydCwgZWxlbWVudFdpc2VSZXBvcnQsIGJ1aWxkaW5nKTtcclxuICAgICAgICAgIGxldCByZXNwb25zZURhdGEgPSB7fTtcclxuICAgICAgICAgIHJlc3BvbnNlRGF0YVtlbGVtZW50XT0gbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0O1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzcG9uc2VEYXRhKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKCdNYXRlcmlhbCBUYWtlT2ZmIFJlcG9ydCBOb3QgRm91bmQgRm9yICcrIGJ1aWxkaW5nICwgbnVsbCksIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBvcHVsYXRlTWF0ZXJpYWxUYWtlT2ZmUmVwb3J0RnJvbVJvd0RhdGEobWF0ZXJpYWxSZXBvcnRSb3dEYXRhOiBhbnksIG1hdGVyaWFsVGFrZU9mZlJlcG9ydDogTWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50V2lzZVJlcG9ydDogc3RyaW5nLCBidWlsZGluZzogc3RyaW5nKSB7XHJcbiAgICBmb3IgKGxldCByZWNvcmQgb2YgbWF0ZXJpYWxSZXBvcnRSb3dEYXRhKSB7XHJcbiAgICAgIGlmIChtYXRlcmlhbFRha2VPZmZSZXBvcnQuc2Vjb25kYXJ5Vmlld1tyZWNvcmQuaGVhZGVyXSA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnNlY29uZGFyeVZpZXdbcmVjb3JkLmhlYWRlcl0gPT09IG51bGwpIHtcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQudGl0bGUgPSBidWlsZGluZztcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQuc2Vjb25kYXJ5Vmlld1tyZWNvcmQuaGVhZGVyXSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBtYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3OiBNYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3ID0gbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnNlY29uZGFyeVZpZXdbcmVjb3JkLmhlYWRlcl07XHJcbiAgICAgIGlmKG1hdGVyaWFsVGFrZU9mZlNlY29uZGFyeVZpZXcudGFibGUgPT09IHVuZGVmaW5lZCB8fCBtYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3LnRhYmxlID09PSBudWxsKSB7XHJcbiAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmU2Vjb25kYXJ5Vmlldy50YWJsZSA9IG5ldyBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXcobnVsbCwgbnVsbCwgbnVsbCk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHRhYmxlOiBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXcgPSBtYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3LnRhYmxlO1xyXG4gICAgICBpZih0YWJsZS5jb250ZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgdGFibGUuY29udGVudCA9IHt9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZih0YWJsZS5oZWFkZXIgPT09IG51bGwpIHtcclxuICAgICAgICBsZXQgY29sdW1uT25lOiBzdHJpbmcgPSAnSXRlbSc7XHJcbiAgICAgICAgbGV0IGNvbHVtblR3bzogc3RyaW5nID0gJ1F1YW50aXR5JztcclxuICAgICAgICBsZXQgY29sdW1uVGhyZWU6IHN0cmluZyA9ICAnVW5pdCc7XHJcbiAgICAgICAgaWYoZWxlbWVudFdpc2VSZXBvcnQgPT09IENvbnN0YW50cy5TVFJfQ09TVEhFQUQgJiYgYnVpbGRpbmcgPT09IENvbnN0YW50cy5TVFJfQUxMX0JVSUxESU5HKXtcclxuICAgICAgICAgIGNvbHVtbk9uZSA9ICdCdWlsZGluZyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhYmxlLmhlYWRlciA9IG5ldyBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdIZWFkZXJzKGNvbHVtbk9uZSwgY29sdW1uVHdvLCBjb2x1bW5UaHJlZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBtYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50ID0gbnVsbDtcclxuICAgICAgaWYgKHJlY29yZC5zdWJWYWx1ZSAmJiByZWNvcmQuc3ViVmFsdWUgIT09ICdkZWZhdWx0JyAmJiByZWNvcmQuc3ViVmFsdWUgIT09ICdEaXJlY3QnKSB7XHJcbiAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3U3ViQ29udGVudCA9XHJcbiAgICAgICAgICBuZXcgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3U3ViQ29udGVudChyZWNvcmQuc3ViVmFsdWUsIHJlY29yZC5Ub3RhbCwgcmVjb3JkLnVuaXQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZih0YWJsZS5jb250ZW50W3JlY29yZC5yb3dWYWx1ZV0gPT09IHVuZGVmaW5lZCB8fCB0YWJsZS5jb250ZW50W3JlY29yZC5yb3dWYWx1ZV0gPT09IG51bGwpIHtcclxuICAgICAgICB0YWJsZS5jb250ZW50W3JlY29yZC5yb3dWYWx1ZV0gPSBuZXcgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Q29udGVudChyZWNvcmQucm93VmFsdWUsIDAsIHJlY29yZC51bml0LCB7fSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCB0YWJsZVZpZXdDb250ZW50OiBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdDb250ZW50ID0gdGFibGUuY29udGVudFtyZWNvcmQucm93VmFsdWVdO1xyXG4gICAgICB0YWJsZVZpZXdDb250ZW50LmNvbHVtblR3byA9IHRhYmxlVmlld0NvbnRlbnQuY29sdW1uVHdvICsgcmVjb3JkLlRvdGFsOyAgIC8vIHVwZGF0ZSB0b3RhbFxyXG5cclxuICAgICAgaWYobWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3U3ViQ29udGVudCkge1xyXG4gICAgICAgIHRhYmxlVmlld0NvbnRlbnQuc3ViQ29udGVudFtyZWNvcmQuc3ViVmFsdWVdID0gbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3U3ViQ29udGVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0Zvb3RlcjogTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyID0gbnVsbDtcclxuICAgICAgaWYodGFibGUuZm9vdGVyID09PSB1bmRlZmluZWQgfHwgdGFibGUuZm9vdGVyID09PSBudWxsKSB7XHJcbiAgICAgICAgdGFibGUuZm9vdGVyID1cclxuICAgICAgICAgIG5ldyBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdGb290ZXIoJ1RvdGFsJywgMCwgcmVjb3JkLnVuaXQpO1xyXG4gICAgICB9XHJcbiAgICAgIG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0Zvb3RlciA9IHRhYmxlLmZvb3RlcjtcclxuICAgICAgbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyLmNvbHVtblR3byA9ICBtYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdGb290ZXIuY29sdW1uVHdvICsgcmVjb3JkLlRvdGFsO1xyXG4gICAgICBtYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3LnRpdGxlID0gbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyLmNvbHVtblR3byArICcgJ1xyXG4gICAgICAgICsgbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyLmNvbHVtblRocmVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRNYXRlcmlhbERhdGFGcm9tRmxhdERldGFpbHNBcnJheShlbGVtZW50V2lzZVJlcG9ydDogc3RyaW5nLCBlbGVtZW50OiBzdHJpbmcsIGJ1aWxkaW5nOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5OiBBcnJheTxNYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTz4pIHtcclxuICAgIGxldCBzcWxRdWVyeTogc3RyaW5nO1xyXG4gICAgc3dpdGNoKGVsZW1lbnRXaXNlUmVwb3J0KSB7XHJcbiAgICAgIGNhc2UgQ29uc3RhbnRzLlNUUl9DT1NUSEVBRDpcclxuICAgICAgICBzcWxRdWVyeSA9IHRoaXMuYWxhc3FsUXVlcnlGb3JNYXRlcmlhbFRha2VPZmZEYXRhQ29zdEhlYWRXaXNlKGJ1aWxkaW5nKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBDb25zdGFudHMuU1RSX01BVEVSSUFMOlxyXG4gICAgICAgIHNxbFF1ZXJ5ID0gdGhpcy5hbGFzcWxRdWVyeUZvck1hdGVyaWFsVGFrZU9mZkRhdGFNYXRlcmlhbFdpc2UoYnVpbGRpbmcpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgbGV0IG1hdGVyaWFsUmVwb3J0Um93RGF0YSA9IGFsYXNxbChzcWxRdWVyeSwgW21hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXksZWxlbWVudF0pO1xyXG4gICAgcmV0dXJuIG1hdGVyaWFsUmVwb3J0Um93RGF0YTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWxhc3FsUXVlcnlGb3JNYXRlcmlhbFRha2VPZmZEYXRhTWF0ZXJpYWxXaXNlKGJ1aWxkaW5nOiBzdHJpbmcpIHtcclxuICAgIGxldCBzZWxlY3Q6IHN0cmluZyA9IENvbnN0YW50cy5TVFJfRU1QVFk7XHJcbiAgICBsZXQgZnJvbTogc3RyaW5nID0gQ29uc3RhbnRzLkFMQVNRTF9GUk9NO1xyXG4gICAgbGV0IHdoZXJlOiBzdHJpbmcgPSBDb25zdGFudHMuU1RSX0VNUFRZO1xyXG4gICAgbGV0IGdyb3VwQnk6IHN0cmluZyA9IENvbnN0YW50cy5BTEFTUUxfR1JPVVBfQllfTUFURVJJQUxfVEFLRU9GRl9NQVRFUklBTF9XSVNFO1xyXG4gICAgbGV0IG9yZGVyQnk6IHN0cmluZyA9IENvbnN0YW50cy5BTEFTUUxfT1JERVJfQllfTUFURVJJQUxfVEFLRU9GRl9NQVRFUklBTF9XSVNFO1xyXG4gICAgbGV0IHNxbFF1ZXJ5OiBzdHJpbmc7XHJcbiAgICBpZiAoYnVpbGRpbmcgIT09IENvbnN0YW50cy5TVFJfQUxMX0JVSUxESU5HKSB7XHJcbiAgICAgIHNlbGVjdCA9IENvbnN0YW50cy5BTEFTUUxfU0VMRUNUX01BVEVSSUFMX1RBS0VPRkZfTUFURVJJQUxfV0lTRSArIENvbnN0YW50cy5TVFJfQ09NTUFfU1BBQ0UgK1xyXG4gICAgICAgIENvbnN0YW50cy5BTEFTUUxfU0VMRUNUX1FVQU5USVRZX05BTUVfQVM7XHJcbiAgICAgIHdoZXJlID0gQ29uc3RhbnRzLkFMQVNRTF9XSEVSRV9NQVRFUklBTF9OQU1FX0VRVUFMU19UTyAgK1xyXG4gICAgICAgIENvbnN0YW50cy5TVFJfQU5EICsgQ29uc3RhbnRzLkFMQVNRTF9TRUxFQ1RfQlVJTERJTkdfTkFNRSArIGJ1aWxkaW5nICsgQ29uc3RhbnRzLlNUUl9ET1VCTEVfSU5WRVJURURfQ09NTUE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZWxlY3QgPSBDb25zdGFudHMuQUxBU1FMX1NFTEVDVF9NQVRFUklBTF9UQUtFT0ZGX01BVEVSSUFMX1dJU0UgO1xyXG4gICAgICB3aGVyZSA9IENvbnN0YW50cy5BTEFTUUxfV0hFUkVfTUFURVJJQUxfTkFNRV9FUVVBTFNfVE8gO1xyXG4gICAgfVxyXG4gICAgd2hlcmUgPSB3aGVyZSArIENvbnN0YW50cy5BTEFTUUxfQU5EX01BVEVSSUFMX05PVF9MQUJPVVI7XHJcbiAgICBzcWxRdWVyeSA9IHNlbGVjdCArIGZyb20gKyB3aGVyZSArIGdyb3VwQnkgKyBvcmRlckJ5O1xyXG4gICAgcmV0dXJuIHNxbFF1ZXJ5O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhbGFzcWxRdWVyeUZvck1hdGVyaWFsVGFrZU9mZkRhdGFDb3N0SGVhZFdpc2UoYnVpbGRpbmc6IHN0cmluZykge1xyXG4gICAgbGV0IHNlbGVjdDogc3RyaW5nID0gQ29uc3RhbnRzLlNUUl9FTVBUWTtcclxuICAgIGxldCBmcm9tOiBzdHJpbmcgPSBDb25zdGFudHMuQUxBU1FMX0ZST007XHJcbiAgICBsZXQgd2hlcmU6IHN0cmluZyA9IENvbnN0YW50cy5TVFJfRU1QVFk7XHJcbiAgICBsZXQgZ3JvdXBCeTogc3RyaW5nID0gQ29uc3RhbnRzLlNUUl9FTVBUWTtcclxuICAgIGxldCBvcmRlckJ5OiBzdHJpbmcgPSBDb25zdGFudHMuU1RSX0VNUFRZO1xyXG4gICAgbGV0IHNxbFF1ZXJ5OiBzdHJpbmc7XHJcbiAgICBpZiAoYnVpbGRpbmcgIT09IENvbnN0YW50cy5TVFJfQUxMX0JVSUxESU5HKSB7XHJcbiAgICAgIHNlbGVjdCA9IENvbnN0YW50cy5BTEFTUUxfU0VMRUNUX01BVEVSSUFMX1RBS0VPRkZfQ09TVEhFQURfV0lTRSArIENvbnN0YW50cy5TVFJfQ09NTUFfU1BBQ0UgK1xyXG4gICAgICAgIENvbnN0YW50cy5BTEFTUUxfU0VMRUNUX1FVQU5USVRZX05BTUVfQVM7XHJcbiAgICAgIHdoZXJlID0gQ29uc3RhbnRzLkFMQVNRTF9XSEVSRV9DT1NUSEVBRF9OQU1FX0VRVUFMU19UT1xyXG4gICAgICAgICsgQ29uc3RhbnRzLlNUUl9BTkQgKyBDb25zdGFudHMuQUxBU1FMX1NFTEVDVF9CVUlMRElOR19OQU1FICsgYnVpbGRpbmcgKyBDb25zdGFudHMuU1RSX0RPVUJMRV9JTlZFUlRFRF9DT01NQTtcclxuICAgICAgZ3JvdXBCeSA9IENvbnN0YW50cy5BTEFTUUxfR1JPVVBfTUFURVJJQUxfV09SS0lURU1fUVVBTlRJVFlfTUFURVJJQUxfVEFLRU9GRl9DT1NUSEVBRF9XSVNFO1xyXG4gICAgICBvcmRlckJ5ID0gQ29uc3RhbnRzLkFMQVNRTF9PUkRFUl9CWV9NQVRFUklBTF9XT1JLSVRFTV9DT1NUSEVBRF9XSVNFO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZWN0ID0gQ29uc3RhbnRzLkFMQVNRTF9TRUxFQ1RfTUFURVJJQUxfVEFLRU9GRl9DT1NUSEVBRF9XSVNFX0ZPUl9BTExfQlVJTERJTkdTO1xyXG4gICAgICB3aGVyZSA9IENvbnN0YW50cy5BTEFTUUxfV0hFUkVfQ09TVEhFQURfTkFNRV9FUVVBTFNfVE87XHJcbiAgICAgIGdyb3VwQnkgPSBDb25zdGFudHMuQUxBU1FMX0dST1VQX01BVEVSSUFMX0JVSUxESU5HX1FVQU5USVRZX01BVEVSSUFMX1RBS0VPRkZfQ09TVEhFQURfV0lTRV9GT1JfQUxMX0JVSUxESU5HUztcclxuICAgICAgb3JkZXJCeSA9IENvbnN0YW50cy5BTEFTUUxfT1JERVJfQllfTUFURVJJQUxfQlVJTERJTkdfTUFURVJJQUxfVEFLRU9GRl9DT1NUSEVBRF9XSVNFO1xyXG4gICAgfVxyXG4gICAgd2hlcmUgPSB3aGVyZSArIENvbnN0YW50cy5BTEFTUUxfQU5EX01BVEVSSUFMX05PVF9MQUJPVVI7XHJcbiAgICBzcWxRdWVyeSA9IHNlbGVjdCArIGZyb20gKyB3aGVyZSArIGdyb3VwQnkgKyBvcmRlckJ5O1xyXG4gICAgcmV0dXJuIHNxbFF1ZXJ5O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRNYXRlcmlhbFRha2VPZmZGaWx0ZXJPYmplY3QoYnVpbGRpbmdzOiBBcnJheTxCdWlsZGluZz4pIHtcclxuICAgIGxldCBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5OiBBcnJheTxNYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTz4gPSB0aGlzLmdldEJ1aWxkaW5nTWF0ZXJpYWxEZXRhaWxzKGJ1aWxkaW5ncyk7XHJcbiAgICBsZXQgY29sdW1uOiBzdHJpbmcgPSBDb25zdGFudHMuU1RSX0JVSUxESU5HX05BTUU7XHJcbiAgICBsZXQgYnVpbGRpbmdMaXN0OiBBcnJheTxzdHJpbmc+ID0gdGhpcy5nZXREaXN0aW5jdEFycmF5T2ZTdHJpbmdGcm9tQWxhc3FsKGNvbHVtbiwgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSk7XHJcbiAgICBjb2x1bW4gPSBDb25zdGFudHMuU1RSX0NPU1RIRUFEX05BTUU7XHJcbiAgICBsZXQgY29zdEhlYWRMaXN0OiBBcnJheTxzdHJpbmc+ID0gdGhpcy5nZXREaXN0aW5jdEFycmF5T2ZTdHJpbmdGcm9tQWxhc3FsKGNvbHVtbiwgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSk7XHJcbiAgICBjb2x1bW4gPSBDb25zdGFudHMuU1RSX01hdGVyaWFsX05BTUU7XHJcbiAgICBsZXQgbWF0ZXJpYWxMaXN0OiBBcnJheTxzdHJpbmc+ID0gdGhpcy5nZXREaXN0aW5jdEFycmF5T2ZTdHJpbmdGcm9tQWxhc3FsKGNvbHVtbiwgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSxcclxuICAgICAgQ29uc3RhbnRzLkFMQVNRTF9NQVRFUklBTF9OT1RfTEFCT1VSKTtcclxuICAgIGxldCBtYXRlcmlhbFRha2VPZmZGaWx0ZXJzT2JqZWN0OiBNYXRlcmlhbFRha2VPZmZGaWx0ZXJzTGlzdERUTyA9IG5ldyBNYXRlcmlhbFRha2VPZmZGaWx0ZXJzTGlzdERUTyhidWlsZGluZ0xpc3QsIGNvc3RIZWFkTGlzdCxcclxuICAgICAgbWF0ZXJpYWxMaXN0KTtcclxuICAgIHJldHVybiBtYXRlcmlhbFRha2VPZmZGaWx0ZXJzT2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXREaXN0aW5jdEFycmF5T2ZTdHJpbmdGcm9tQWxhc3FsKGNvbHVtbjogc3RyaW5nLCBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5OiBBcnJheTxNYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTz4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdExpa2VPcHRpb25hbD86IHN0cmluZykge1xyXG4gICAgbGV0IHNxbFF1ZXJ5OiBzdHJpbmcgPSAnU0VMRUNUIERJU1RJTkNUIGZsYXREYXRhLicgKyBjb2x1bW4gKyAnIEZST00gPyBBUyBmbGF0RGF0YSc7XHJcbiAgICBsZXQgd2hlcmUgPSAnIHdoZXJlICcrIG5vdExpa2VPcHRpb25hbDtcclxuICAgIGlmKG5vdExpa2VPcHRpb25hbCkge1xyXG4gICAgICBzcWxRdWVyeSA9IHNxbFF1ZXJ5ICsgd2hlcmU7XHJcbiAgICB9XHJcbiAgICBsZXQgZGlzdGluY3RPYmplY3RBcnJheSA9IGFsYXNxbChzcWxRdWVyeSwgW21hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXldKTtcclxuICAgIGxldCBkaXN0aW5jdE5hbWVTdHJpbmdBcnJheTogQXJyYXk8c3RyaW5nPiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICBmb3IobGV0IGRpc3RpbmN0T2JqZWN0IG9mIGRpc3RpbmN0T2JqZWN0QXJyYXkpIHtcclxuICAgICAgZGlzdGluY3ROYW1lU3RyaW5nQXJyYXkucHVzaChkaXN0aW5jdE9iamVjdFtjb2x1bW5dKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkaXN0aW5jdE5hbWVTdHJpbmdBcnJheTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkTWF0ZXJpYWxEVE9Gb3JBY3RpdmVDb3N0SGVhZEluRFRPQXJyYXkoYnVpbGRpbmc6IEJ1aWxkaW5nLCBidWlsZGluZ05hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPikge1xyXG4gICAgbGV0IGNvc3RIZWFkTmFtZTtcclxuICAgIGZvciAobGV0IGNvc3RIZWFkOiBDb3N0SGVhZCBvZiBidWlsZGluZy5jb3N0SGVhZHMpIHtcclxuICAgICAgaWYgKGNvc3RIZWFkLmFjdGl2ZSkge1xyXG4gICAgICAgIGNvc3RIZWFkTmFtZSA9IGNvc3RIZWFkLm5hbWU7XHJcbiAgICAgICAgdGhpcy5hZGRNYXRlcmlhbERUT0ZvckFjdGl2ZUNhdGVnb3J5SW5EVE9BcnJheShjb3N0SGVhZCwgYnVpbGRpbmdOYW1lLCBjb3N0SGVhZE5hbWUsIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZE1hdGVyaWFsRFRPRm9yQWN0aXZlQ2F0ZWdvcnlJbkRUT0FycmF5KGNvc3RIZWFkOiBDb3N0SGVhZCwgYnVpbGRpbmdOYW1lOiBzdHJpbmcsIGNvc3RIZWFkTmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+KSB7XHJcbiAgICBsZXQgY2F0ZWdvcnlOYW1lOiBzdHJpbmc7XHJcbiAgICBmb3IgKGxldCBjYXRlZ29yeSBvZiBjb3N0SGVhZC5jYXRlZ29yaWVzKSB7XHJcbiAgICAgIGlmIChjYXRlZ29yeS5hY3RpdmUpIHtcclxuICAgICAgICBjYXRlZ29yeU5hbWUgPSBjYXRlZ29yeS5uYW1lO1xyXG4gICAgICAgIHRoaXMuYWRkTWF0ZXJpYWxEVE9Gb3JBY3RpdmVXb3JraXRlbUluRFRPQXJyYXkoY2F0ZWdvcnksIGJ1aWxkaW5nTmFtZSwgY29zdEhlYWROYW1lLCBjYXRlZ29yeU5hbWUsIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZE1hdGVyaWFsRFRPRm9yQWN0aXZlV29ya2l0ZW1JbkRUT0FycmF5KGNhdGVnb3J5OiBDYXRlZ29yeSwgYnVpbGRpbmdOYW1lOiBzdHJpbmcsIGNvc3RIZWFkTmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlOYW1lOiBzdHJpbmcsIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPikge1xyXG4gICAgbGV0IHdvcmtJdGVtTmFtZTogc3RyaW5nO1xyXG4gICAgZm9yIChsZXQgd29ya0l0ZW0gb2YgY2F0ZWdvcnkud29ya0l0ZW1zKSB7XHJcbiAgICAgIGlmICh3b3JrSXRlbS5hY3RpdmUpIHtcclxuICAgICAgICB3b3JrSXRlbU5hbWUgPSB3b3JrSXRlbS5uYW1lO1xyXG4gICAgICAgIHRoaXMuYWRkRXN0aW1hdGVkUXVhbnRpdHlBbmRSYXRlTWF0ZXJpYWxJdGVtSW5EVE9BcnJheSh3b3JrSXRlbSwgYnVpbGRpbmdOYW1lLCBjb3N0SGVhZE5hbWUsIGNhdGVnb3J5TmFtZSxcclxuICAgICAgICAgIHdvcmtJdGVtTmFtZSwgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkRXN0aW1hdGVkUXVhbnRpdHlBbmRSYXRlTWF0ZXJpYWxJdGVtSW5EVE9BcnJheSh3b3JrSXRlbTogV29ya0l0ZW0sIGJ1aWxkaW5nTmFtZTogc3RyaW5nLCBjb3N0SGVhZE5hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlOYW1lIDogc3RyaW5nLCB3b3JrSXRlbU5hbWU6IHN0cmluZywgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+KSB7XHJcbiAgICBsZXQgcXVhbnRpdHlOYW1lOiBzdHJpbmc7XHJcbiAgICBpZih3b3JrSXRlbS5xdWFudGl0eS5pc0RpcmVjdFF1YW50aXR5ICYmIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQpIHtcclxuICAgICAgcXVhbnRpdHlOYW1lID0gQ29uc3RhbnRzLlNUUl9ESVJFQ1Q7XHJcbiAgICAgIHRoaXMuY3JlYXRlQW5kQWRkTWF0ZXJpYWxEVE9PYmplY3RJbkRUT0FycmF5KHdvcmtJdGVtLCBidWlsZGluZ05hbWUsIGNvc3RIZWFkTmFtZSwgY2F0ZWdvcnlOYW1lLCB3b3JrSXRlbU5hbWUsIHF1YW50aXR5TmFtZSxcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5LCB3b3JrSXRlbS5xdWFudGl0eS50b3RhbCk7XHJcbiAgICB9IGVsc2UgaWYgKHdvcmtJdGVtLnF1YW50aXR5LmlzRXN0aW1hdGVkICYmIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQpIHtcclxuICAgICAgZm9yIChsZXQgcXVhbnRpdHkgb2Ygd29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscykge1xyXG4gICAgICAgIHF1YW50aXR5TmFtZSA9IHF1YW50aXR5Lm5hbWU7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVBbmRBZGRNYXRlcmlhbERUT09iamVjdEluRFRPQXJyYXkod29ya0l0ZW0sIGJ1aWxkaW5nTmFtZSwgY29zdEhlYWROYW1lLCBjYXRlZ29yeU5hbWUsIHdvcmtJdGVtTmFtZSwgcXVhbnRpdHlOYW1lLFxyXG4gICAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSwgcXVhbnRpdHkudG90YWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUFuZEFkZE1hdGVyaWFsRFRPT2JqZWN0SW5EVE9BcnJheSh3b3JrSXRlbTogV29ya0l0ZW0sIGJ1aWxkaW5nTmFtZTogc3RyaW5nLCBjb3N0SGVhZE5hbWU6IHN0cmluZywgY2F0ZWdvcnlOYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgIHdvcmtJdGVtTmFtZTogc3RyaW5nLCBxdWFudGl0eU5hbWU6IHN0cmluZywgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgIGZvciAobGV0IHJhdGVJdGVtIG9mIHdvcmtJdGVtLnJhdGUucmF0ZUl0ZW1zKSB7XHJcbiAgICAgIGxldCBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsRFRPID0gbmV3IE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPKGJ1aWxkaW5nTmFtZSwgY29zdEhlYWROYW1lLCBjYXRlZ29yeU5hbWUsXHJcbiAgICAgICAgd29ya0l0ZW1OYW1lLCByYXRlSXRlbS5pdGVtTmFtZSwgcXVhbnRpdHlOYW1lLCBNYXRoLmNlaWwoKChxdWFudGl0eSAvIHdvcmtJdGVtLnJhdGUucXVhbnRpdHkpICogcmF0ZUl0ZW0ucXVhbnRpdHkpKSxcclxuICAgICAgICByYXRlSXRlbS51bml0KTtcclxuICAgICAgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheS5wdXNoKG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxEVE8pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoUmVwb3J0U2VydmljZSk7XHJcbmV4cG9ydCA9IFJlcG9ydFNlcnZpY2U7XHJcblxyXG4iXX0=
