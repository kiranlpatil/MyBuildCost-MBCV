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
            if (elementWiseReport === Constants.STR_MATERIAL) {
                materialTakeOffReport.subTitle.columnTwo = materialTakeOffReport.subTitle.columnTwo + record.Total;
                materialTakeOffReport.subTitle.columnThree = record.unit;
                materialTakeOffReport.subTitle.columnOne = ': ' + materialTakeOffReport.subTitle.columnTwo + ' ' +
                    materialTakeOffReport.subTitle.columnThree;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmVwb3J0U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEVBQWlGO0FBQ2pGLGdGQUFtRjtBQUNuRixvRUFBdUU7QUFDdkUsa0VBQXFFO0FBR3JFLG1GQUFzRjtBQUN0RixxRkFBd0Y7QUFDeEYsOEVBQWlGO0FBRWpGLG1GQUFzRjtBQUN0RixpRkFBb0Y7QUFDcEYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSwyREFBOEQ7QUFFOUQsK0JBQWtDO0FBQ2xDLCtDQUFrRDtBQUNsRCxpREFBb0Q7QUFLcEQsc0dBQXlHO0FBQ3pHLHNHQUF5RztBQUV6RyxpR0FBb0c7QUFDcEcsdUdBQTBHO0FBRTFHLHFIQUF3SDtBQUN4SCwySEFBOEg7QUFDOUgscUhBQXdIO0FBQ3hILG1IQUFzSDtBQUN0SCwwRUFBNkU7QUFDN0UsNkZBQWdHO0FBQ2hHLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBRTlDO0lBVUU7UUFDRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztJQUN2RCxDQUFDO0lBRUQsaUNBQVMsR0FBVCxV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LFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUN6SCwrQkFBK0IsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEQ7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVPLCtEQUF1QyxHQUEvQyxVQUFnRCxRQUFrQixFQUFFLFlBQW9CLEVBQUUsWUFBb0IsRUFBRSxZQUFvQixFQUNwSCxZQUFvQixFQUFFLFlBQW9CLEVBQUUsK0JBQXFFLEVBQ2pGLFFBQWdCO1FBQzlELEdBQUcsQ0FBQyxDQUFpQixVQUF1QixFQUF2QixLQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUF2QixjQUF1QixFQUF2QixJQUF1QjtZQUF2QyxJQUFJLFFBQVEsU0FBQTtZQUNmLElBQUksNEJBQTRCLEdBQUcsSUFBSSw2QkFBNkIsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFDM0csWUFBWSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUNuSCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakIsK0JBQStCLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQS9nQkEsQUErZ0JDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzNCLGlCQUFTLGFBQWEsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1JlcG9ydFNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvamVjdFJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvUHJvamVjdFJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEJ1aWxkaW5nUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9CdWlsZGluZ1JlcG9zaXRvcnknKTtcclxuaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi8uLi8uLi9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UnKTtcclxuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XHJcbmltcG9ydCBVc2VyID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL2RhdGFhY2Nlc3MvbW9uZ29vc2UvdXNlcicpO1xyXG5pbXBvcnQgQnVpbGRpbmcgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vbmdvb3NlL0J1aWxkaW5nJyk7XHJcbmltcG9ydCBCdWlsZGluZ1JlcG9ydCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL0J1aWxkaW5nUmVwb3J0Jyk7XHJcbmltcG9ydCBUaHVtYlJ1bGVSZXBvcnQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvcmVwb3J0cy9UaHVtYlJ1bGVSZXBvcnQnKTtcclxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvQ29zdEhlYWQnKTtcclxuaW1wb3J0IEVzdGltYXRlUmVwb3J0ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvRXN0aW1hdGVSZXBvcnQnKTtcclxuaW1wb3J0IFByb2plY3RSZXBvcnQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvcmVwb3J0cy9Qcm9qZWN0UmVwb3J0Jyk7XHJcbmltcG9ydCBUaHVtYlJ1bGUgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvVGh1bWJSdWxlJyk7XHJcbmltcG9ydCBFc3RpbWF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Fc3RpbWF0ZScpO1xyXG5pbXBvcnQgUmF0ZUFuYWx5c2lzU2VydmljZSA9IHJlcXVpcmUoJy4vUmF0ZUFuYWx5c2lzU2VydmljZScpO1xyXG5pbXBvcnQgQ2F0ZWdvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQ2F0ZWdvcnknKTtcclxuaW1wb3J0IGFsYXNxbCA9IHJlcXVpcmUoJ2FsYXNxbCcpO1xyXG5pbXBvcnQgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xyXG5pbXBvcnQgUHJvamVjdFNlcnZpY2UgPSByZXF1aXJlKCcuL1Byb2plY3RTZXJ2aWNlJyk7XHJcbmltcG9ydCBDZW50cmFsaXplZFJhdGUgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvQ2VudHJhbGl6ZWRSYXRlJyk7XHJcbmltcG9ydCBNYXRlcmlhbERldGFpbERUTyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvZHRvL3Byb2plY3QvTWF0ZXJpYWxEZXRhaWxEVE8nKTtcclxuaW1wb3J0IFdvcmtJdGVtID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1dvcmtJdGVtJyk7XHJcbmltcG9ydCB7UXVhbnRpdHlEZXRhaWxzfSBmcm9tICcuLi8uLi8uLi8uLi9jbGllbnQvYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL21vZGVsL3F1YW50aXR5LWRldGFpbHMnO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL2R0by9SZXBvcnQvTWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8nKTtcclxuaW1wb3J0IE1hdGVyaWFsVGFrZU9mZkZpbHRlcnNMaXN0RFRPID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9kdG8vUmVwb3J0L01hdGVyaWFsVGFrZU9mZkZpbHRlcnNMaXN0RFRPJyk7XHJcbmltcG9ydCB7ZWxlbWVudH0gZnJvbSAncHJvdHJhY3Rvcic7XHJcbmltcG9ydCBNYXRlcmlhbFRha2VPZmZSZXBvcnQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvcmVwb3J0cy9NYXRlcmlhbFRha2VPZmZSZXBvcnQnKTtcclxuaW1wb3J0IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlldyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL01hdGVyaWFsVGFrZU9mZlRhYmxlVmlldycpO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmU2Vjb25kYXJ5VmlldyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL01hdGVyaWFsVGFrZU9mZlNlY29uZGFyeVZpZXcnKTtcclxuaW1wb3J0IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0NvbnRlbnQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvcmVwb3J0cy9NYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdDb250ZW50Jyk7XHJcbmltcG9ydCBNYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdTdWJDb250ZW50ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3U3ViQ29udGVudCcpO1xyXG5pbXBvcnQgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3SGVhZGVycyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL01hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0hlYWRlcnMnKTtcclxuaW1wb3J0IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0Zvb3RlciA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL01hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0Zvb3RlcicpO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZShcIi4uL2V4Y2VwdGlvbi9Db3N0Q29udHJvbGxFeGNlcHRpb25cIik7XHJcbmltcG9ydCBNYXRlcmlhbFRha2VPZmZWaWV3ID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL01hdGVyaWFsVGFrZU9mZlZpZXdcIik7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxudmFyIGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG52YXIgbG9nZ2VyPWxvZzRqcy5nZXRMb2dnZXIoJ1JlcG9ydCBTZXJ2aWNlJyk7XHJcblxyXG5jbGFzcyBSZXBvcnRTZXJ2aWNlIHtcclxuICBBUFBfTkFNRTogc3RyaW5nO1xyXG4gIGNvbXBhbnlfbmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgcHJvamVjdFJlcG9zaXRvcnk6IFByb2plY3RSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgYnVpbGRpbmdSZXBvc2l0b3J5OiBCdWlsZGluZ1JlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBhdXRoSW50ZXJjZXB0b3I6IEF1dGhJbnRlcmNlcHRvcjtcclxuICBwcml2YXRlIHVzZXJTZXJ2aWNlIDogVXNlclNlcnZpY2U7XHJcbiAgcHJpdmF0ZSByYXRlQW5hbHlzaXNTZXJ2aWNlIDogUmF0ZUFuYWx5c2lzU2VydmljZTtcclxuICBwcml2YXRlIHByb2plY3RTZXJ2aWNlIDogUHJvamVjdFNlcnZpY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeSA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkgPSBuZXcgQnVpbGRpbmdSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVwb3J0KCBwcm9qZWN0SWQgOiBhbnksIHJlcG9ydFR5cGUgOiBzdHJpbmcsIHJhdGVVbml0IDogc3RyaW5nLCBhcmVhVHlwZSA6IHN0cmluZyzigILigIJ1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdSZXBvcnQgU2VydmljZSwgZ2V0UmVwb3J0IGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQ6IHByb2plY3RJZH07XHJcbiAgICBsZXQgcG9wdWxhdGUgPSB7cGF0aCA6ICdidWlsZGluZ3MnfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBmaW5kQW5kUG9wdWxhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBidWlsZGluZ3MgPSByZXN1bHRbMF0uYnVpbGRpbmdzO1xyXG4gICAgICAgIHZhciB0eXBlT2ZBcmVhOiBzdHJpbmc7XHJcbiAgICAgICAgbGV0IHRvdGFsQXJlYTogbnVtYmVyO1xyXG4gICAgICAgIGxldCBjaG9pY2UgPSBhcmVhVHlwZTtcclxuICAgICAgICBzd2l0Y2ggKGNob2ljZSkge1xyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuU0xBQl9BUkVBOlxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlT2ZBcmVhID0gQ29uc3RhbnRzLlRPVEFMX1NMQUJfQVJFQTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuU0FMRUFCTEVfQVJFQTpcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZU9mQXJlYSA9IENvbnN0YW50cy5UT1RBTF9TQUxFQUJMRV9BUkVBO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjYXNlICBDb25zdGFudHMuQ0FSUEVUX0FSRUEgOlxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlT2ZBcmVhID0gQ29uc3RhbnRzLlRPVEFMX0NBUlBFVF9BUkVBO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGRlZmF1bHQgOiAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICBsZXQgdG90YWxPZkFyZWEgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBST1VORChTVU0oJyt0eXBlT2ZBcmVhKycpLDIpIEZST00gPycsW2J1aWxkaW5nc10pO1xyXG4gICAgICAgIGlmKHJhdGVVbml0ID09PSBDb25zdGFudHMuU1FVUkVNRVRFUl9VTklUKSB7XHJcbiAgICAgICAgIHRvdGFsQXJlYSA9dG90YWxPZkFyZWEgKiBjb25maWcuZ2V0KENvbnN0YW50cy5TUVVBUkVfTUVURVIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0b3RhbEFyZWEgPSB0b3RhbE9mQXJlYTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHByb2plY3RSZXBvcnQgOiBQcm9qZWN0UmVwb3J0ID0gbmV3IFByb2plY3RSZXBvcnQoKTtcclxuXHJcbiAgICAgICAgcHJvamVjdFJlcG9ydC5idWlsZGluZ3MgPSB0aGlzLmdlbmVyYXRlUmVwb3J0QnlDb3N0SGVhZHMoYnVpbGRpbmdzLCB0eXBlT2ZBcmVhLCByYXRlVW5pdCk7XHJcblxyXG4gICAgICAgIGxldCBwcm9qZWN0Q29zdEhlYWRzID0gcmVzdWx0WzBdLnByb2plY3RDb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IHByb2plY3RSYXRlcyA9IHJlc3VsdFswXS5yYXRlcztcclxuICAgICAgICBpZihwcm9qZWN0Q29zdEhlYWRzIT09IG51bGwpIHtcclxuICAgICAgICAgIHByb2plY3RSZXBvcnQuY29tbW9uQW1lbml0aWVzID0gdGhpcy5nZW5lcmF0ZVJlcG9ydEZvclByb2plY3RDb3N0SGVhZHMocHJvamVjdENvc3RIZWFkcywgcHJvamVjdFJhdGVzLCB0b3RhbEFyZWEsIHJhdGVVbml0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCxlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwseyBkYXRhOiBwcm9qZWN0UmVwb3J0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVSZXBvcnRCeUNvc3RIZWFkcyggYnVpbGRpbmdzOiAgQXJyYXk8QnVpbGRpbmc+ICwgdHlwZU9mQXJlYTogc3RyaW5nLCByYXRlVW5pdDogc3RyaW5nKSB7XHJcblxyXG4gICAgbGV0IGJ1aWxkaW5nc1JlcG9ydCA6IEFycmF5PEJ1aWxkaW5nUmVwb3J0PiA9IG5ldyBBcnJheTxCdWlsZGluZ1JlcG9ydD4oKTtcclxuICAgIGZvciAobGV0IGJ1aWxkaW5nIG9mIGJ1aWxkaW5ncykge1xyXG4gICAgICBsZXQgYnVpbGRpbmdSZXBvcnQgPSBuZXcgQnVpbGRpbmdSZXBvcnQ7XHJcbiAgICAgIGJ1aWxkaW5nUmVwb3J0Lm5hbWUgPSBidWlsZGluZy5uYW1lO1xyXG4gICAgICBidWlsZGluZ1JlcG9ydC5faWQgPSBidWlsZGluZy5faWQ7XHJcbiAgICAgIGlmKHJhdGVVbml0ID09PSBDb25zdGFudHMuU1FVUkVNRVRFUl9VTklUKSB7XHJcbiAgICAgICAgYnVpbGRpbmdSZXBvcnQuYXJlYSA9ICBidWlsZGluZ1t0eXBlT2ZBcmVhXSAqIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlNRVUFSRV9NRVRFUik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnVpbGRpbmdSZXBvcnQuYXJlYSA9IGJ1aWxkaW5nW3R5cGVPZkFyZWFdO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCB0aHVtYlJ1bGUgID0gbmV3IFRodW1iUnVsZSgpO1xyXG4gICAgICBsZXQgZXN0aW1hdGUgID0gbmV3IEVzdGltYXRlKCk7XHJcbiAgICAgIGxldCB0aHVtYlJ1bGVSZXBvcnRzID0gbmV3IEFycmF5PFRodW1iUnVsZVJlcG9ydD4oKTtcclxuICAgICAgbGV0IGVzdGltYXRlZFJlcG9ydHMgPSBuZXcgQXJyYXk8RXN0aW1hdGVSZXBvcnQ+KCk7XHJcblxyXG5cclxuICAgICAgdGhpcy5nZXRUaHVtYlJ1bGVBbmRFc3RpbWF0ZWRSZXBvcnQoYnVpbGRpbmcsIGJ1aWxkaW5nUmVwb3J0LCB0aHVtYlJ1bGVSZXBvcnRzLCBlc3RpbWF0ZWRSZXBvcnRzLCByYXRlVW5pdCk7XHJcblxyXG4gICAgICBsZXQgdG90YWxSYXRlcyA9IGFsYXNxbCgnU0VMRUNUIFJPVU5EKFNVTShhbW91bnQpLDIpIEFTIHRvdGFsQW1vdW50LCBST1VORChTVU0ocmF0ZSksMikgQVMgdG90YWxSYXRlIEZST00gPycsW3RodW1iUnVsZVJlcG9ydHNdKTtcclxuICAgICAgdGh1bWJSdWxlLnRvdGFsUmF0ZSA9IHRvdGFsUmF0ZXNbMF0udG90YWxSYXRlO1xyXG4gICAgICB0aHVtYlJ1bGUudG90YWxCdWRnZXRlZENvc3QgPSBNYXRoLnJvdW5kKHRvdGFsUmF0ZXNbMF0udG90YWxBbW91bnQpO1xyXG4gICAgICB0aHVtYlJ1bGUudGh1bWJSdWxlUmVwb3J0cyA9IHRodW1iUnVsZVJlcG9ydHM7XHJcblxyXG4gICAgICBsZXQgdG90YWxFc3RpbWF0ZWRSYXRlcyA9IGFsYXNxbCgnU0VMRUNUIFJPVU5EKFNVTSh0b3RhbCksMikgQVMgdG90YWxBbW91bnQsIFJPVU5EKFNVTShyYXRlKSwyKSBBUyB0b3RhbFJhdGUgRlJPTSA/JyxcclxuICAgICAgICBbZXN0aW1hdGVkUmVwb3J0c10pO1xyXG4gICAgICBlc3RpbWF0ZS50b3RhbFJhdGUgPSB0b3RhbEVzdGltYXRlZFJhdGVzWzBdLnRvdGFsUmF0ZTtcclxuICAgICAgZXN0aW1hdGUudG90YWxFc3RpbWF0ZWRDb3N0ID0gdG90YWxFc3RpbWF0ZWRSYXRlc1swXS50b3RhbEFtb3VudDtcclxuICAgICAgZXN0aW1hdGUuZXN0aW1hdGVkQ29zdHMgPSBlc3RpbWF0ZWRSZXBvcnRzO1xyXG5cclxuICAgICAgYnVpbGRpbmdSZXBvcnQudGh1bWJSdWxlID0gdGh1bWJSdWxlO1xyXG4gICAgICBidWlsZGluZ1JlcG9ydC5lc3RpbWF0ZSA9IGVzdGltYXRlO1xyXG4gICAgICBidWlsZGluZ3NSZXBvcnQucHVzaChidWlsZGluZ1JlcG9ydCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4oYnVpbGRpbmdzUmVwb3J0KTtcclxuICB9XHJcblxyXG5cclxuICBnZXRUaHVtYlJ1bGVBbmRFc3RpbWF0ZWRSZXBvcnQoYnVpbGRpbmcgOkJ1aWxkaW5nLCBidWlsZGluZ1JlcG9ydDogQnVpbGRpbmdSZXBvcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRodW1iUnVsZVJlcG9ydHM6IFRodW1iUnVsZVJlcG9ydFtdLCBlc3RpbWF0ZWRSZXBvcnRzOiBFc3RpbWF0ZVJlcG9ydFtdLCByYXRlVW5pdDpzdHJpbmcpIHtcclxuXHJcbiAgICBmb3IgKGxldCBjb3N0SGVhZCBvZiBidWlsZGluZy5jb3N0SGVhZHMpIHtcclxuXHJcbiAgICAgIGlmKGNvc3RIZWFkLmFjdGl2ZSkge1xyXG4gICAgICAgIC8vVGh1bWJSdWxlIFJlcG9ydFxyXG4gICAgICAgIGxldCB0aHVtYlJ1bGVSZXBvcnQgPSBuZXcgVGh1bWJSdWxlUmVwb3J0KCk7XHJcbiAgICAgICAgdGh1bWJSdWxlUmVwb3J0Lm5hbWUgPSBjb3N0SGVhZC5uYW1lO1xyXG4gICAgICAgIHRodW1iUnVsZVJlcG9ydC5yYXRlQW5hbHlzaXNJZCA9IGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgIHRodW1iUnVsZVJlcG9ydC5hbW91bnQgPSBNYXRoLnJvdW5kKGNvc3RIZWFkLmJ1ZGdldGVkQ29zdEFtb3VudCk7XHJcbiAgICAgICAgdGh1bWJSdWxlUmVwb3J0LmNvc3RIZWFkQWN0aXZlID0gY29zdEhlYWQuYWN0aXZlO1xyXG4gICAgICAgIHRodW1iUnVsZVJlcG9ydC5yYXRlID0gdGh1bWJSdWxlUmVwb3J0LmFtb3VudCAvIGJ1aWxkaW5nUmVwb3J0LmFyZWE7XHJcbiAgICAgICAgdGh1bWJSdWxlUmVwb3J0cy5wdXNoKHRodW1iUnVsZVJlcG9ydCk7XHJcblxyXG4gICAgICAgIC8vRXN0aW1hdGVkIGNvc3QgUmVwb3J0XHJcbiAgICAgICAgbGV0IGVzdGltYXRlUmVwb3J0ID0gbmV3IEVzdGltYXRlUmVwb3J0KCk7XHJcbiAgICAgICAgZXN0aW1hdGVSZXBvcnQgPSB0aGlzLmdldEVzdGltYXRlZFJlcG9ydChidWlsZGluZy5yYXRlcywgY29zdEhlYWQsIGJ1aWxkaW5nUmVwb3J0LmFyZWEsIHJhdGVVbml0KTtcclxuICAgICAgICBlc3RpbWF0ZWRSZXBvcnRzLnB1c2goZXN0aW1hdGVSZXBvcnQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRFc3RpbWF0ZWRSZXBvcnQoY2VudHJhbGl6ZWRSYXRlczpBcnJheTxDZW50cmFsaXplZFJhdGU+LCBjb3N0SGVhZDogYW55LCBhcmVhOm51bWJlciwgcmF0ZVVuaXQ6c3RyaW5nKSB7XHJcblxyXG4gICAgbGV0IGVzdGltYXRlUmVwb3J0ID0gbmV3IEVzdGltYXRlUmVwb3J0KCk7XHJcbiAgICBlc3RpbWF0ZVJlcG9ydC5uYW1lID0gY29zdEhlYWQubmFtZTtcclxuICAgIGVzdGltYXRlUmVwb3J0LnJhdGVBbmFseXNpc0lkID0gY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+ID0gY29zdEhlYWQuY2F0ZWdvcmllcztcclxuICAgIGxldCBwcm9qZWN0U2VydmljZSA6IFByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICBsZXQgY2F0ZWdvcmllc09iaiA9IHByb2plY3RTZXJ2aWNlLmdldENhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoY29zdEhlYWRDYXRlZ29yaWVzLCBjZW50cmFsaXplZFJhdGVzKTtcclxuICAgIGVzdGltYXRlUmVwb3J0LnRvdGFsID0gY2F0ZWdvcmllc09iai5jYXRlZ29yaWVzQW1vdW50O1xyXG4gICAgZXN0aW1hdGVSZXBvcnQucmF0ZSA9IGVzdGltYXRlUmVwb3J0LnRvdGFsIC8gYXJlYTtcclxuICAgIHJldHVybiBlc3RpbWF0ZVJlcG9ydDtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlUmVwb3J0Rm9yUHJvamVjdENvc3RIZWFkcyhwcm9qZWN0Q29zdEhlYWRzOiAgQXJyYXk8Q29zdEhlYWQ+LCBwcm9qZWN0UmF0ZXM6IEFycmF5PENlbnRyYWxpemVkUmF0ZT4sIHRvdGFsQXJlYTogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0ZVVuaXQ6IHN0cmluZykge1xyXG4gICAgbGV0IGNvbW1vbkFtZW5pdGllc1JlcG9ydCA6IEFycmF5PEJ1aWxkaW5nUmVwb3J0PiA9IG5ldyBBcnJheTxCdWlsZGluZ1JlcG9ydD4oKTtcclxuICAgICAgbGV0IHByb2plY3RSZXBvcnQgPSBuZXcgQnVpbGRpbmdSZXBvcnQ7XHJcbiAgICAgIHByb2plY3RSZXBvcnQubmFtZSA9IENvbnN0YW50cy5BTUVOSVRJRVM7XHJcbiAgICAgIHByb2plY3RSZXBvcnQuYXJlYSA9IHRvdGFsQXJlYTtcclxuXHJcbiAgICAgIGxldCB0aHVtYlJ1bGUgID0gbmV3IFRodW1iUnVsZSgpO1xyXG4gICAgICBsZXQgZXN0aW1hdGUgID0gbmV3IEVzdGltYXRlKCk7XHJcbiAgICAgIGxldCB0aHVtYlJ1bGVSZXBvcnRzID0gbmV3IEFycmF5PFRodW1iUnVsZVJlcG9ydD4oKTtcclxuICAgICAgbGV0IGVzdGltYXRlZFJlcG9ydHMgPSBuZXcgQXJyYXk8RXN0aW1hdGVSZXBvcnQ+KCk7XHJcblxyXG5cclxuICAgICAgdGhpcy5nZXRUaHVtYlJ1bGVBbmRFc3RpbWF0ZWRSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQocHJvamVjdENvc3RIZWFkcywgcHJvamVjdFJhdGVzLFxyXG4gICAgICAgIHByb2plY3RSZXBvcnQsIHRodW1iUnVsZVJlcG9ydHMsIGVzdGltYXRlZFJlcG9ydHMsIHRvdGFsQXJlYSwgcmF0ZVVuaXQpO1xyXG5cclxuICAgIGxldCB0b3RhbFJhdGVzID0gYWxhc3FsKCdTRUxFQ1QgUk9VTkQoU1VNKGFtb3VudCksMikgQVMgdG90YWxBbW91bnQsIFJPVU5EKFNVTShyYXRlKSwyKSBBUyB0b3RhbFJhdGUgRlJPTSA/JyxbdGh1bWJSdWxlUmVwb3J0c10pO1xyXG4gICAgICB0aHVtYlJ1bGUudG90YWxSYXRlID0gdG90YWxSYXRlc1swXS50b3RhbFJhdGU7XHJcbiAgICAgIHRodW1iUnVsZS50b3RhbEJ1ZGdldGVkQ29zdCA9IE1hdGgucm91bmQodG90YWxSYXRlc1swXS50b3RhbEFtb3VudCk7XHJcbiAgICAgIHRodW1iUnVsZS50aHVtYlJ1bGVSZXBvcnRzID0gdGh1bWJSdWxlUmVwb3J0cztcclxuXHJcbiAgICBsZXQgdG90YWxFc3RpbWF0ZWRSYXRlcyA9IGFsYXNxbCgnU0VMRUNUIFJPVU5EKFNVTSh0b3RhbCksMikgQVMgdG90YWxBbW91bnQsIFJPVU5EKFNVTShyYXRlKSwyKSBBUyB0b3RhbFJhdGUgRlJPTSA/JyxcclxuICAgICAgW2VzdGltYXRlZFJlcG9ydHNdKTtcclxuICAgICAgZXN0aW1hdGUudG90YWxSYXRlID0gdG90YWxFc3RpbWF0ZWRSYXRlc1swXS50b3RhbFJhdGU7XHJcbiAgICAgIGVzdGltYXRlLnRvdGFsRXN0aW1hdGVkQ29zdCA9IHRvdGFsRXN0aW1hdGVkUmF0ZXNbMF0udG90YWxBbW91bnQ7XHJcbiAgICAgIGVzdGltYXRlLmVzdGltYXRlZENvc3RzID0gZXN0aW1hdGVkUmVwb3J0cztcclxuXHJcbiAgICAgIHByb2plY3RSZXBvcnQudGh1bWJSdWxlID0gdGh1bWJSdWxlO1xyXG4gICAgICBwcm9qZWN0UmVwb3J0LmVzdGltYXRlID0gZXN0aW1hdGU7XHJcbiAgICBjb21tb25BbWVuaXRpZXNSZXBvcnQucHVzaChwcm9qZWN0UmVwb3J0KTtcclxuICAgIHJldHVybihjb21tb25BbWVuaXRpZXNSZXBvcnQpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGh1bWJSdWxlQW5kRXN0aW1hdGVkUmVwb3J0Rm9yUHJvamVjdENvc3RIZWFkKHByb2plY3RDb3N0SGVhZDogQXJyYXk8Q29zdEhlYWQ+LCBwcm9qZWN0UmF0ZXM6IEFycmF5PENlbnRyYWxpemVkUmF0ZT4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3RSZXBvcnQ6IEJ1aWxkaW5nUmVwb3J0LCB0aHVtYlJ1bGVSZXBvcnRzOiBUaHVtYlJ1bGVSZXBvcnRbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXN0aW1hdGVkUmVwb3J0czogRXN0aW1hdGVSZXBvcnRbXSwgdG90YWxBcmVhOm51bWJlciwgcmF0ZVVuaXQ6c3RyaW5nKSB7XHJcbiAgZm9yIChsZXQgY29zdEhlYWQgIG9mIHByb2plY3RDb3N0SGVhZCkge1xyXG4gICAgaWYgKGNvc3RIZWFkLmFjdGl2ZSkge1xyXG4gICAgICAvL1RodW1iUnVsZSBSZXBvcnRcclxuICAgICAgbGV0IHRodW1iUnVsZVJlcG9ydCA9IG5ldyBUaHVtYlJ1bGVSZXBvcnQoKTtcclxuICAgICAgdGh1bWJSdWxlUmVwb3J0Lm5hbWUgPSBjb3N0SGVhZC5uYW1lO1xyXG4gICAgICB0aHVtYlJ1bGVSZXBvcnQucmF0ZUFuYWx5c2lzSWQgPSBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgdGh1bWJSdWxlUmVwb3J0LmFtb3VudCA9IE1hdGgucm91bmQoY29zdEhlYWQuYnVkZ2V0ZWRDb3N0QW1vdW50KTtcclxuICAgICAgdGh1bWJSdWxlUmVwb3J0LmNvc3RIZWFkQWN0aXZlID0gY29zdEhlYWQuYWN0aXZlO1xyXG4gICAgICB0aHVtYlJ1bGVSZXBvcnQucmF0ZSA9IHRodW1iUnVsZVJlcG9ydC5hbW91bnQgLyB0b3RhbEFyZWE7XHJcbiAgICAgIHRodW1iUnVsZVJlcG9ydHMucHVzaCh0aHVtYlJ1bGVSZXBvcnQpO1xyXG5cclxuICAgICAgLy9Fc3RpbWF0ZWQgY29zdCBSZXBvcnRcclxuICAgICAgbGV0IGVzdGltYXRlUmVwb3J0ID0gbmV3IEVzdGltYXRlUmVwb3J0KCk7XHJcbiAgICAgIGVzdGltYXRlUmVwb3J0ID0gdGhpcy5nZXRFc3RpbWF0ZWRSZXBvcnQocHJvamVjdFJhdGVzLCBjb3N0SGVhZCwgdG90YWxBcmVhLCByYXRlVW5pdCk7XHJcbiAgICAgIGVzdGltYXRlZFJlcG9ydHMucHVzaChlc3RpbWF0ZVJlcG9ydCk7XHJcbiAgICB9XHJcbiAgIH1cclxuICB9XHJcblxyXG5cclxuICBnZXRDb3N0SGVhZHMoICB1cmw6IHN0cmluZyAsIHVzZXI6IFVzZXIsY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1NlcnZpY2UuZ2V0Q29zdEhlYWRzKCB1cmwsIHVzZXIsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwseyBkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXMoIHVybDogc3RyaW5nICwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRXb3JrSXRlbXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1NlcnZpY2UuZ2V0V29ya0l0ZW1zKCB1cmwsIHVzZXIsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwseyBkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXRlcmlhbERldGFpbHMoIHByb2plY3RJZCA6IGFueSzigIJ1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdSZXBvcnQgU2VydmljZSwgZ2V0TWF0ZXJpYWxEZXRhaWxzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQ6IHByb2plY3RJZH07XHJcbiAgICBsZXQgcG9wdWxhdGUgPSB7cGF0aCA6ICdidWlsZGluZ3MnfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBmaW5kQW5kUG9wdWxhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuZ2V0QnVpbGRpbmdNYXRlcmlhbERldGFpbHMocmVzdWx0WzBdLmJ1aWxkaW5ncykpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nTWF0ZXJpYWxEZXRhaWxzKGJ1aWxkaW5ncyA6IEFycmF5PEJ1aWxkaW5nPik6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPiB7XHJcbiAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSA6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPj0gbmV3IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPigpO1xyXG4gICAgbGV0IGJ1aWxkaW5nTmFtZTogc3RyaW5nO1xyXG4gICAgZm9yKGxldCBidWlsZGluZzogQnVpbGRpbmcgb2YgYnVpbGRpbmdzKSB7XHJcbiAgICAgIGJ1aWxkaW5nTmFtZSA9IGJ1aWxkaW5nLm5hbWU7XHJcbiAgICAgIHRoaXMuYWRkTWF0ZXJpYWxEVE9Gb3JBY3RpdmVDb3N0SGVhZEluRFRPQXJyYXkoYnVpbGRpbmcsIGJ1aWxkaW5nTmFtZSwgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSk7XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXRlcmlhbEZpbHRlcnMoIHByb2plY3RJZCA6IGFueSzigIJ1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdSZXBvcnQgU2VydmljZSwgZ2V0TWF0ZXJpYWxGaWx0ZXJzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQ6IHByb2plY3RJZH07XHJcbiAgICBsZXQgcG9wdWxhdGUgPSB7cGF0aCA6ICdidWlsZGluZ3MnfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBmaW5kQW5kUG9wdWxhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuZ2V0TWF0ZXJpYWxUYWtlT2ZmRmlsdGVyT2JqZWN0KHJlc3VsdFswXS5idWlsZGluZ3MpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXRlcmlhbFRha2VPZmZSZXBvcnQoIHByb2plY3RJZCA6IGFueSwgYnVpbGRpbmc6IHN0cmluZywgZWxlbWVudFdpc2VSZXBvcnQ6IHN0cmluZywgZWxlbWVudDogc3RyaW5nLOKAgnVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRNYXRlcmlhbFRha2VPZmZSZXBvcnQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5ncyd9O1xyXG4gICAgaWYoYnVpbGRpbmcgIT09IENvbnN0YW50cy5TVFJfQUxMX0JVSUxESU5HKSB7XHJcbiAgICAgIHBvcHVsYXRlID0ge3BhdGggOiAnYnVpbGRpbmdzJywgbWF0Y2g6e25hbWU6IGJ1aWxkaW5nfX07XHJcbiAgICB9XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRBbmRQb3B1bGF0ZShxdWVyeSwgcG9wdWxhdGUsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdSZXBvcnQgU2VydmljZSwgZmluZEFuZFBvcHVsYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZihyZXN1bHRbMF0uYnVpbGRpbmdzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbignVW5hYmxlIHRvIGZpbmQgQnVpbGRpbmcnLG51bGwpLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPiA9IHRoaXMuZ2V0QnVpbGRpbmdNYXRlcmlhbERldGFpbHMocmVzdWx0WzBdLmJ1aWxkaW5ncyk7XHJcbiAgICAgICAgbGV0IG1hdGVyaWFsUmVwb3J0Um93RGF0YSA9XHJcbiAgICAgICAgICB0aGlzLmdldE1hdGVyaWFsRGF0YUZyb21GbGF0RGV0YWlsc0FycmF5KGVsZW1lbnRXaXNlUmVwb3J0LCBlbGVtZW50LCBidWlsZGluZywgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSk7XHJcbiAgICAgICAgaWYobWF0ZXJpYWxSZXBvcnRSb3dEYXRhLmxlbmd0aD4wICYmIG1hdGVyaWFsUmVwb3J0Um93RGF0YVswXS5oZWFkZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgbGV0IG1hdGVyaWFsVGFrZU9mZlJlcG9ydDogTWF0ZXJpYWxUYWtlT2ZmUmVwb3J0ID0gbmV3IE1hdGVyaWFsVGFrZU9mZlJlcG9ydChudWxsLCBudWxsKTtcclxuICAgICAgICAgIG1hdGVyaWFsVGFrZU9mZlJlcG9ydC5zZWNvbmRhcnlWaWV3ID0ge307XHJcbiAgICAgICAgICB0aGlzLnBvcHVsYXRlTWF0ZXJpYWxUYWtlT2ZmUmVwb3J0RnJvbVJvd0RhdGEobWF0ZXJpYWxSZXBvcnRSb3dEYXRhLCBtYXRlcmlhbFRha2VPZmZSZXBvcnQsIGVsZW1lbnRXaXNlUmVwb3J0LCBidWlsZGluZyk7XHJcbiAgICAgICAgICBsZXQgcmVzcG9uc2VEYXRhID0ge307XHJcbiAgICAgICAgICByZXNwb25zZURhdGFbZWxlbWVudF09IG1hdGVyaWFsVGFrZU9mZlJlcG9ydDtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlRGF0YSk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbignTWF0ZXJpYWwgVGFrZU9mZiBSZXBvcnQgTm90IEZvdW5kIEZvciAnKyBidWlsZGluZyAsIG51bGwpLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwb3B1bGF0ZU1hdGVyaWFsVGFrZU9mZlJlcG9ydEZyb21Sb3dEYXRhKG1hdGVyaWFsUmVwb3J0Um93RGF0YTogYW55LCBtYXRlcmlhbFRha2VPZmZSZXBvcnQ6IE1hdGVyaWFsVGFrZU9mZlJlcG9ydCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFdpc2VSZXBvcnQ6IHN0cmluZywgYnVpbGRpbmc6IHN0cmluZykge1xyXG4gICAgZm9yIChsZXQgcmVjb3JkIG9mIG1hdGVyaWFsUmVwb3J0Um93RGF0YSkge1xyXG4gICAgICBpZiAobWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnNlY29uZGFyeVZpZXdbcmVjb3JkLmhlYWRlcl0gPT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICAgIG1hdGVyaWFsVGFrZU9mZlJlcG9ydC5zZWNvbmRhcnlWaWV3W3JlY29yZC5oZWFkZXJdID09PSBudWxsKSB7XHJcbiAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnRpdGxlID0gYnVpbGRpbmc7XHJcbiAgICAgICAgaWYobWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnN1YlRpdGxlID09PSBudWxsIHx8IG1hdGVyaWFsVGFrZU9mZlJlcG9ydC5zdWJUaXRsZSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgIGxldCBtYXRlcmlhbFRha2VPZmZSZXBvcnRTdWJUaXRsZTogTWF0ZXJpYWxUYWtlT2ZmVmlldyA9IG5ldyBNYXRlcmlhbFRha2VPZmZWaWV3KCcnLCAwLCAnJyk7XHJcbiAgICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQuc3ViVGl0bGUgPSBtYXRlcmlhbFRha2VPZmZSZXBvcnRTdWJUaXRsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qfSovXHJcbiAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnNlY29uZGFyeVZpZXdbcmVjb3JkLmhlYWRlcl0gPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmU2Vjb25kYXJ5VmlldzogTWF0ZXJpYWxUYWtlT2ZmU2Vjb25kYXJ5VmlldyA9IG1hdGVyaWFsVGFrZU9mZlJlcG9ydC5zZWNvbmRhcnlWaWV3W3JlY29yZC5oZWFkZXJdO1xyXG4gICAgICBpZihtYXRlcmlhbFRha2VPZmZTZWNvbmRhcnlWaWV3LnRhYmxlID09PSB1bmRlZmluZWQgfHwgbWF0ZXJpYWxUYWtlT2ZmU2Vjb25kYXJ5Vmlldy50YWJsZSA9PT0gbnVsbCkge1xyXG4gICAgICAgIG1hdGVyaWFsVGFrZU9mZlNlY29uZGFyeVZpZXcudGFibGUgPSBuZXcgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3KG51bGwsIG51bGwsIG51bGwpO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCB0YWJsZTogTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3ID0gbWF0ZXJpYWxUYWtlT2ZmU2Vjb25kYXJ5Vmlldy50YWJsZTtcclxuICAgICAgaWYodGFibGUuY29udGVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgIHRhYmxlLmNvbnRlbnQgPSB7fTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYodGFibGUuaGVhZGVyID09PSBudWxsKSB7XHJcbiAgICAgICAgbGV0IGNvbHVtbk9uZTogc3RyaW5nID0gJ0l0ZW0nO1xyXG4gICAgICAgIGxldCBjb2x1bW5Ud286IHN0cmluZyA9ICdRdWFudGl0eSc7XHJcbiAgICAgICAgbGV0IGNvbHVtblRocmVlOiBzdHJpbmcgPSAgJ1VuaXQnO1xyXG4gICAgICAgIGlmKGVsZW1lbnRXaXNlUmVwb3J0ID09PSBDb25zdGFudHMuU1RSX0NPU1RIRUFEICYmIGJ1aWxkaW5nID09PSBDb25zdGFudHMuU1RSX0FMTF9CVUlMRElORyl7XHJcbiAgICAgICAgICBjb2x1bW5PbmUgPSAnQnVpbGRpbmcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YWJsZS5oZWFkZXIgPSBuZXcgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3SGVhZGVycyhjb2x1bW5PbmUsIGNvbHVtblR3bywgY29sdW1uVGhyZWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3U3ViQ29udGVudCA9IG51bGw7XHJcbiAgICAgIGlmIChyZWNvcmQuc3ViVmFsdWUgJiYgcmVjb3JkLnN1YlZhbHVlICE9PSAnZGVmYXVsdCcgJiYgcmVjb3JkLnN1YlZhbHVlICE9PSAnRGlyZWN0Jykge1xyXG4gICAgICAgIG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld1N1YkNvbnRlbnQgPVxyXG4gICAgICAgICAgbmV3IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld1N1YkNvbnRlbnQocmVjb3JkLnN1YlZhbHVlLCByZWNvcmQuVG90YWwsIHJlY29yZC51bml0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYodGFibGUuY29udGVudFtyZWNvcmQucm93VmFsdWVdID09PSB1bmRlZmluZWQgfHwgdGFibGUuY29udGVudFtyZWNvcmQucm93VmFsdWVdID09PSBudWxsKSB7XHJcbiAgICAgICAgdGFibGUuY29udGVudFtyZWNvcmQucm93VmFsdWVdID0gbmV3IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0NvbnRlbnQocmVjb3JkLnJvd1ZhbHVlLCAwLCByZWNvcmQudW5pdCwge30pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgdGFibGVWaWV3Q29udGVudDogTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Q29udGVudCA9IHRhYmxlLmNvbnRlbnRbcmVjb3JkLnJvd1ZhbHVlXTtcclxuICAgICAgdGFibGVWaWV3Q29udGVudC5jb2x1bW5Ud28gPSB0YWJsZVZpZXdDb250ZW50LmNvbHVtblR3byArIHJlY29yZC5Ub3RhbDsgICAvLyB1cGRhdGUgdG90YWxcclxuXHJcbiAgICAgIGlmKG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld1N1YkNvbnRlbnQpIHtcclxuICAgICAgICB0YWJsZVZpZXdDb250ZW50LnN1YkNvbnRlbnRbcmVjb3JkLnN1YlZhbHVlXSA9IG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld1N1YkNvbnRlbnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBtYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdGb290ZXI6IE1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0Zvb3RlciA9IG51bGw7XHJcbiAgICAgIGlmKHRhYmxlLmZvb3RlciA9PT0gdW5kZWZpbmVkIHx8IHRhYmxlLmZvb3RlciA9PT0gbnVsbCkge1xyXG4gICAgICAgIHRhYmxlLmZvb3RlciA9XHJcbiAgICAgICAgICBuZXcgTWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyKCdUb3RhbCcsIDAsIHJlY29yZC51bml0KTtcclxuICAgICAgfVxyXG4gICAgICBtYXRlcmlhbFRha2VPZmZUYWJsZVZpZXdGb290ZXIgPSB0YWJsZS5mb290ZXI7XHJcbiAgICAgIG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0Zvb3Rlci5jb2x1bW5Ud28gPSAgbWF0ZXJpYWxUYWtlT2ZmVGFibGVWaWV3Rm9vdGVyLmNvbHVtblR3byArIHJlY29yZC5Ub3RhbDtcclxuICAgICAgbWF0ZXJpYWxUYWtlT2ZmU2Vjb25kYXJ5Vmlldy50aXRsZSA9IG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0Zvb3Rlci5jb2x1bW5Ud28gKyAnICdcclxuICAgICAgICArIG1hdGVyaWFsVGFrZU9mZlRhYmxlVmlld0Zvb3Rlci5jb2x1bW5UaHJlZTtcclxuICAgICAgaWYoZWxlbWVudFdpc2VSZXBvcnQgPT09IENvbnN0YW50cy5TVFJfTUFURVJJQUwpIHtcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQuc3ViVGl0bGUuY29sdW1uVHdvID0gbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0LnN1YlRpdGxlLmNvbHVtblR3byArIHJlY29yZC5Ub3RhbDtcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQuc3ViVGl0bGUuY29sdW1uVGhyZWUgPSByZWNvcmQudW5pdDtcclxuICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQuc3ViVGl0bGUuY29sdW1uT25lID0gJzogJyttYXRlcmlhbFRha2VPZmZSZXBvcnQuc3ViVGl0bGUuY29sdW1uVHdvICsnICcrXHJcbiAgICAgICAgICBtYXRlcmlhbFRha2VPZmZSZXBvcnQuc3ViVGl0bGUuY29sdW1uVGhyZWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0TWF0ZXJpYWxEYXRhRnJvbUZsYXREZXRhaWxzQXJyYXkoZWxlbWVudFdpc2VSZXBvcnQ6IHN0cmluZywgZWxlbWVudDogc3RyaW5nLCBidWlsZGluZzogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+KSB7XHJcbiAgICBsZXQgc3FsUXVlcnk6IHN0cmluZztcclxuICAgIHN3aXRjaChlbGVtZW50V2lzZVJlcG9ydCkge1xyXG4gICAgICBjYXNlIENvbnN0YW50cy5TVFJfQ09TVEhFQUQ6XHJcbiAgICAgICAgc3FsUXVlcnkgPSB0aGlzLmFsYXNxbFF1ZXJ5Rm9yTWF0ZXJpYWxUYWtlT2ZmRGF0YUNvc3RIZWFkV2lzZShidWlsZGluZyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgQ29uc3RhbnRzLlNUUl9NQVRFUklBTDpcclxuICAgICAgICBzcWxRdWVyeSA9IHRoaXMuYWxhc3FsUXVlcnlGb3JNYXRlcmlhbFRha2VPZmZEYXRhTWF0ZXJpYWxXaXNlKGJ1aWxkaW5nKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGxldCBtYXRlcmlhbFJlcG9ydFJvd0RhdGEgPSBhbGFzcWwoc3FsUXVlcnksIFttYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5LGVsZW1lbnRdKTtcclxuICAgIHJldHVybiBtYXRlcmlhbFJlcG9ydFJvd0RhdGE7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFsYXNxbFF1ZXJ5Rm9yTWF0ZXJpYWxUYWtlT2ZmRGF0YU1hdGVyaWFsV2lzZShidWlsZGluZzogc3RyaW5nKSB7XHJcbiAgICBsZXQgc2VsZWN0OiBzdHJpbmcgPSBDb25zdGFudHMuU1RSX0VNUFRZO1xyXG4gICAgbGV0IGZyb206IHN0cmluZyA9IENvbnN0YW50cy5BTEFTUUxfRlJPTTtcclxuICAgIGxldCB3aGVyZTogc3RyaW5nID0gQ29uc3RhbnRzLlNUUl9FTVBUWTtcclxuICAgIGxldCBncm91cEJ5OiBzdHJpbmcgPSBDb25zdGFudHMuQUxBU1FMX0dST1VQX0JZX01BVEVSSUFMX1RBS0VPRkZfTUFURVJJQUxfV0lTRTtcclxuICAgIGxldCBvcmRlckJ5OiBzdHJpbmcgPSBDb25zdGFudHMuQUxBU1FMX09SREVSX0JZX01BVEVSSUFMX1RBS0VPRkZfTUFURVJJQUxfV0lTRTtcclxuICAgIGxldCBzcWxRdWVyeTogc3RyaW5nO1xyXG4gICAgaWYgKGJ1aWxkaW5nICE9PSBDb25zdGFudHMuU1RSX0FMTF9CVUlMRElORykge1xyXG4gICAgICBzZWxlY3QgPSBDb25zdGFudHMuQUxBU1FMX1NFTEVDVF9NQVRFUklBTF9UQUtFT0ZGX01BVEVSSUFMX1dJU0UgKyBDb25zdGFudHMuU1RSX0NPTU1BX1NQQUNFICtcclxuICAgICAgICBDb25zdGFudHMuQUxBU1FMX1NFTEVDVF9RVUFOVElUWV9OQU1FX0FTO1xyXG4gICAgICB3aGVyZSA9IENvbnN0YW50cy5BTEFTUUxfV0hFUkVfTUFURVJJQUxfTkFNRV9FUVVBTFNfVE8gICtcclxuICAgICAgICBDb25zdGFudHMuU1RSX0FORCArIENvbnN0YW50cy5BTEFTUUxfU0VMRUNUX0JVSUxESU5HX05BTUUgKyBidWlsZGluZyArIENvbnN0YW50cy5TVFJfRE9VQkxFX0lOVkVSVEVEX0NPTU1BO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZWN0ID0gQ29uc3RhbnRzLkFMQVNRTF9TRUxFQ1RfTUFURVJJQUxfVEFLRU9GRl9NQVRFUklBTF9XSVNFIDtcclxuICAgICAgd2hlcmUgPSBDb25zdGFudHMuQUxBU1FMX1dIRVJFX01BVEVSSUFMX05BTUVfRVFVQUxTX1RPIDtcclxuICAgIH1cclxuICAgIHdoZXJlID0gd2hlcmUgKyBDb25zdGFudHMuQUxBU1FMX0FORF9NQVRFUklBTF9OT1RfTEFCT1VSO1xyXG4gICAgc3FsUXVlcnkgPSBzZWxlY3QgKyBmcm9tICsgd2hlcmUgKyBncm91cEJ5ICsgb3JkZXJCeTtcclxuICAgIHJldHVybiBzcWxRdWVyeTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWxhc3FsUXVlcnlGb3JNYXRlcmlhbFRha2VPZmZEYXRhQ29zdEhlYWRXaXNlKGJ1aWxkaW5nOiBzdHJpbmcpIHtcclxuICAgIGxldCBzZWxlY3Q6IHN0cmluZyA9IENvbnN0YW50cy5TVFJfRU1QVFk7XHJcbiAgICBsZXQgZnJvbTogc3RyaW5nID0gQ29uc3RhbnRzLkFMQVNRTF9GUk9NO1xyXG4gICAgbGV0IHdoZXJlOiBzdHJpbmcgPSBDb25zdGFudHMuU1RSX0VNUFRZO1xyXG4gICAgbGV0IGdyb3VwQnk6IHN0cmluZyA9IENvbnN0YW50cy5TVFJfRU1QVFk7XHJcbiAgICBsZXQgb3JkZXJCeTogc3RyaW5nID0gQ29uc3RhbnRzLlNUUl9FTVBUWTtcclxuICAgIGxldCBzcWxRdWVyeTogc3RyaW5nO1xyXG4gICAgaWYgKGJ1aWxkaW5nICE9PSBDb25zdGFudHMuU1RSX0FMTF9CVUlMRElORykge1xyXG4gICAgICBzZWxlY3QgPSBDb25zdGFudHMuQUxBU1FMX1NFTEVDVF9NQVRFUklBTF9UQUtFT0ZGX0NPU1RIRUFEX1dJU0UgKyBDb25zdGFudHMuU1RSX0NPTU1BX1NQQUNFICtcclxuICAgICAgICBDb25zdGFudHMuQUxBU1FMX1NFTEVDVF9RVUFOVElUWV9OQU1FX0FTO1xyXG4gICAgICB3aGVyZSA9IENvbnN0YW50cy5BTEFTUUxfV0hFUkVfQ09TVEhFQURfTkFNRV9FUVVBTFNfVE9cclxuICAgICAgICArIENvbnN0YW50cy5TVFJfQU5EICsgQ29uc3RhbnRzLkFMQVNRTF9TRUxFQ1RfQlVJTERJTkdfTkFNRSArIGJ1aWxkaW5nICsgQ29uc3RhbnRzLlNUUl9ET1VCTEVfSU5WRVJURURfQ09NTUE7XHJcbiAgICAgIGdyb3VwQnkgPSBDb25zdGFudHMuQUxBU1FMX0dST1VQX01BVEVSSUFMX1dPUktJVEVNX1FVQU5USVRZX01BVEVSSUFMX1RBS0VPRkZfQ09TVEhFQURfV0lTRTtcclxuICAgICAgb3JkZXJCeSA9IENvbnN0YW50cy5BTEFTUUxfT1JERVJfQllfTUFURVJJQUxfV09SS0lURU1fQ09TVEhFQURfV0lTRTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNlbGVjdCA9IENvbnN0YW50cy5BTEFTUUxfU0VMRUNUX01BVEVSSUFMX1RBS0VPRkZfQ09TVEhFQURfV0lTRV9GT1JfQUxMX0JVSUxESU5HUztcclxuICAgICAgd2hlcmUgPSBDb25zdGFudHMuQUxBU1FMX1dIRVJFX0NPU1RIRUFEX05BTUVfRVFVQUxTX1RPO1xyXG4gICAgICBncm91cEJ5ID0gQ29uc3RhbnRzLkFMQVNRTF9HUk9VUF9NQVRFUklBTF9CVUlMRElOR19RVUFOVElUWV9NQVRFUklBTF9UQUtFT0ZGX0NPU1RIRUFEX1dJU0VfRk9SX0FMTF9CVUlMRElOR1M7XHJcbiAgICAgIG9yZGVyQnkgPSBDb25zdGFudHMuQUxBU1FMX09SREVSX0JZX01BVEVSSUFMX0JVSUxESU5HX01BVEVSSUFMX1RBS0VPRkZfQ09TVEhFQURfV0lTRTtcclxuICAgIH1cclxuICAgIHdoZXJlID0gd2hlcmUgKyBDb25zdGFudHMuQUxBU1FMX0FORF9NQVRFUklBTF9OT1RfTEFCT1VSO1xyXG4gICAgc3FsUXVlcnkgPSBzZWxlY3QgKyBmcm9tICsgd2hlcmUgKyBncm91cEJ5ICsgb3JkZXJCeTtcclxuICAgIHJldHVybiBzcWxRdWVyeTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0TWF0ZXJpYWxUYWtlT2ZmRmlsdGVyT2JqZWN0KGJ1aWxkaW5nczogQXJyYXk8QnVpbGRpbmc+KSB7XHJcbiAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+ID0gdGhpcy5nZXRCdWlsZGluZ01hdGVyaWFsRGV0YWlscyhidWlsZGluZ3MpO1xyXG4gICAgbGV0IGNvbHVtbjogc3RyaW5nID0gQ29uc3RhbnRzLlNUUl9CVUlMRElOR19OQU1FO1xyXG4gICAgbGV0IGJ1aWxkaW5nTGlzdDogQXJyYXk8c3RyaW5nPiA9IHRoaXMuZ2V0RGlzdGluY3RBcnJheU9mU3RyaW5nRnJvbUFsYXNxbChjb2x1bW4sIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkpO1xyXG4gICAgY29sdW1uID0gQ29uc3RhbnRzLlNUUl9DT1NUSEVBRF9OQU1FO1xyXG4gICAgbGV0IGNvc3RIZWFkTGlzdDogQXJyYXk8c3RyaW5nPiA9IHRoaXMuZ2V0RGlzdGluY3RBcnJheU9mU3RyaW5nRnJvbUFsYXNxbChjb2x1bW4sIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkpO1xyXG4gICAgY29sdW1uID0gQ29uc3RhbnRzLlNUUl9NYXRlcmlhbF9OQU1FO1xyXG4gICAgbGV0IG1hdGVyaWFsTGlzdDogQXJyYXk8c3RyaW5nPiA9IHRoaXMuZ2V0RGlzdGluY3RBcnJheU9mU3RyaW5nRnJvbUFsYXNxbChjb2x1bW4sIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXksXHJcbiAgICAgIENvbnN0YW50cy5BTEFTUUxfTUFURVJJQUxfTk9UX0xBQk9VUik7XHJcbiAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmRmlsdGVyc09iamVjdDogTWF0ZXJpYWxUYWtlT2ZmRmlsdGVyc0xpc3REVE8gPSBuZXcgTWF0ZXJpYWxUYWtlT2ZmRmlsdGVyc0xpc3REVE8oYnVpbGRpbmdMaXN0LCBjb3N0SGVhZExpc3QsXHJcbiAgICAgIG1hdGVyaWFsTGlzdCk7XHJcbiAgICByZXR1cm4gbWF0ZXJpYWxUYWtlT2ZmRmlsdGVyc09iamVjdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RGlzdGluY3RBcnJheU9mU3RyaW5nRnJvbUFsYXNxbChjb2x1bW46IHN0cmluZywgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheTogQXJyYXk8TWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNEVE8+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RMaWtlT3B0aW9uYWw/OiBzdHJpbmcpIHtcclxuICAgIGxldCBzcWxRdWVyeTogc3RyaW5nID0gJ1NFTEVDVCBESVNUSU5DVCBmbGF0RGF0YS4nICsgY29sdW1uICsgJyBGUk9NID8gQVMgZmxhdERhdGEnO1xyXG4gICAgbGV0IHdoZXJlID0gJyB3aGVyZSAnKyBub3RMaWtlT3B0aW9uYWw7XHJcbiAgICBpZihub3RMaWtlT3B0aW9uYWwpIHtcclxuICAgICAgc3FsUXVlcnkgPSBzcWxRdWVyeSArIHdoZXJlO1xyXG4gICAgfVxyXG4gICAgbGV0IGRpc3RpbmN0T2JqZWN0QXJyYXkgPSBhbGFzcWwoc3FsUXVlcnksIFttYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5XSk7XHJcbiAgICBsZXQgZGlzdGluY3ROYW1lU3RyaW5nQXJyYXk6IEFycmF5PHN0cmluZz4gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgZm9yKGxldCBkaXN0aW5jdE9iamVjdCBvZiBkaXN0aW5jdE9iamVjdEFycmF5KSB7XHJcbiAgICAgIGRpc3RpbmN0TmFtZVN0cmluZ0FycmF5LnB1c2goZGlzdGluY3RPYmplY3RbY29sdW1uXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGlzdGluY3ROYW1lU3RyaW5nQXJyYXk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZE1hdGVyaWFsRFRPRm9yQWN0aXZlQ29zdEhlYWRJbkRUT0FycmF5KGJ1aWxkaW5nOiBCdWlsZGluZywgYnVpbGRpbmdOYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5OiBBcnJheTxNYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTz4pIHtcclxuICAgIGxldCBjb3N0SGVhZE5hbWU7XHJcbiAgICBmb3IgKGxldCBjb3N0SGVhZDogQ29zdEhlYWQgb2YgYnVpbGRpbmcuY29zdEhlYWRzKSB7XHJcbiAgICAgIGlmIChjb3N0SGVhZC5hY3RpdmUpIHtcclxuICAgICAgICBjb3N0SGVhZE5hbWUgPSBjb3N0SGVhZC5uYW1lO1xyXG4gICAgICAgIHRoaXMuYWRkTWF0ZXJpYWxEVE9Gb3JBY3RpdmVDYXRlZ29yeUluRFRPQXJyYXkoY29zdEhlYWQsIGJ1aWxkaW5nTmFtZSwgY29zdEhlYWROYW1lLCBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRNYXRlcmlhbERUT0ZvckFjdGl2ZUNhdGVnb3J5SW5EVE9BcnJheShjb3N0SGVhZDogQ29zdEhlYWQsIGJ1aWxkaW5nTmFtZTogc3RyaW5nLCBjb3N0SGVhZE5hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPikge1xyXG4gICAgbGV0IGNhdGVnb3J5TmFtZTogc3RyaW5nO1xyXG4gICAgZm9yIChsZXQgY2F0ZWdvcnkgb2YgY29zdEhlYWQuY2F0ZWdvcmllcykge1xyXG4gICAgICBpZiAoY2F0ZWdvcnkuYWN0aXZlKSB7XHJcbiAgICAgICAgY2F0ZWdvcnlOYW1lID0gY2F0ZWdvcnkubmFtZTtcclxuICAgICAgICB0aGlzLmFkZE1hdGVyaWFsRFRPRm9yQWN0aXZlV29ya2l0ZW1JbkRUT0FycmF5KGNhdGVnb3J5LCBidWlsZGluZ05hbWUsIGNvc3RIZWFkTmFtZSwgY2F0ZWdvcnlOYW1lLCBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRNYXRlcmlhbERUT0ZvckFjdGl2ZVdvcmtpdGVtSW5EVE9BcnJheShjYXRlZ29yeTogQ2F0ZWdvcnksIGJ1aWxkaW5nTmFtZTogc3RyaW5nLCBjb3N0SGVhZE5hbWU6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5TmFtZTogc3RyaW5nLCBtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0FycmF5OiBBcnJheTxNYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTz4pIHtcclxuICAgIGxldCB3b3JrSXRlbU5hbWU6IHN0cmluZztcclxuICAgIGZvciAobGV0IHdvcmtJdGVtIG9mIGNhdGVnb3J5LndvcmtJdGVtcykge1xyXG4gICAgICBpZiAod29ya0l0ZW0uYWN0aXZlKSB7XHJcbiAgICAgICAgd29ya0l0ZW1OYW1lID0gd29ya0l0ZW0ubmFtZTtcclxuICAgICAgICB0aGlzLmFkZEVzdGltYXRlZFF1YW50aXR5QW5kUmF0ZU1hdGVyaWFsSXRlbUluRFRPQXJyYXkod29ya0l0ZW0sIGJ1aWxkaW5nTmFtZSwgY29zdEhlYWROYW1lLCBjYXRlZ29yeU5hbWUsXHJcbiAgICAgICAgICB3b3JrSXRlbU5hbWUsIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZEVzdGltYXRlZFF1YW50aXR5QW5kUmF0ZU1hdGVyaWFsSXRlbUluRFRPQXJyYXkod29ya0l0ZW06IFdvcmtJdGVtLCBidWlsZGluZ05hbWU6IHN0cmluZywgY29zdEhlYWROYW1lOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGNhdGVnb3J5TmFtZSA6IHN0cmluZywgd29ya0l0ZW1OYW1lOiBzdHJpbmcsIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPikge1xyXG4gICAgbGV0IHF1YW50aXR5TmFtZTogc3RyaW5nO1xyXG4gICAgaWYod29ya0l0ZW0ucXVhbnRpdHkuaXNEaXJlY3RRdWFudGl0eSAmJiB3b3JrSXRlbS5yYXRlLmlzRXN0aW1hdGVkKSB7XHJcbiAgICAgIHF1YW50aXR5TmFtZSA9IENvbnN0YW50cy5TVFJfRElSRUNUO1xyXG4gICAgICB0aGlzLmNyZWF0ZUFuZEFkZE1hdGVyaWFsRFRPT2JqZWN0SW5EVE9BcnJheSh3b3JrSXRlbSwgYnVpbGRpbmdOYW1lLCBjb3N0SGVhZE5hbWUsIGNhdGVnb3J5TmFtZSwgd29ya0l0ZW1OYW1lLCBxdWFudGl0eU5hbWUsXHJcbiAgICAgICAgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbHNBcnJheSwgd29ya0l0ZW0ucXVhbnRpdHkudG90YWwpO1xyXG4gICAgfSBlbHNlIGlmICh3b3JrSXRlbS5xdWFudGl0eS5pc0VzdGltYXRlZCAmJiB3b3JrSXRlbS5yYXRlLmlzRXN0aW1hdGVkKSB7XHJcbiAgICAgIGZvciAobGV0IHF1YW50aXR5IG9mIHdvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMpIHtcclxuICAgICAgICBxdWFudGl0eU5hbWUgPSBxdWFudGl0eS5uYW1lO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQW5kQWRkTWF0ZXJpYWxEVE9PYmplY3RJbkRUT0FycmF5KHdvcmtJdGVtLCBidWlsZGluZ05hbWUsIGNvc3RIZWFkTmFtZSwgY2F0ZWdvcnlOYW1lLCB3b3JrSXRlbU5hbWUsIHF1YW50aXR5TmFtZSxcclxuICAgICAgICAgIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXksIHF1YW50aXR5LnRvdGFsKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVBbmRBZGRNYXRlcmlhbERUT09iamVjdEluRFRPQXJyYXkod29ya0l0ZW06IFdvcmtJdGVtLCBidWlsZGluZ05hbWU6IHN0cmluZywgY29zdEhlYWROYW1lOiBzdHJpbmcsIGNhdGVnb3J5TmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICB3b3JrSXRlbU5hbWU6IHN0cmluZywgcXVhbnRpdHlOYW1lOiBzdHJpbmcsIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXk6IEFycmF5PE1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzRFRPPixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogbnVtYmVyKSB7XHJcbiAgICBmb3IgKGxldCByYXRlSXRlbSBvZiB3b3JrSXRlbS5yYXRlLnJhdGVJdGVtcykge1xyXG4gICAgICBsZXQgbWF0ZXJpYWxUYWtlT2ZmRmxhdERldGFpbERUTyA9IG5ldyBNYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsc0RUTyhidWlsZGluZ05hbWUsIGNvc3RIZWFkTmFtZSwgY2F0ZWdvcnlOYW1lLFxyXG4gICAgICAgIHdvcmtJdGVtTmFtZSwgcmF0ZUl0ZW0uaXRlbU5hbWUsIHF1YW50aXR5TmFtZSwgTWF0aC5jZWlsKCgocXVhbnRpdHkgLyB3b3JrSXRlbS5yYXRlLnF1YW50aXR5KSAqIHJhdGVJdGVtLnF1YW50aXR5KSksXHJcbiAgICAgICAgcmF0ZUl0ZW0udW5pdCk7XHJcbiAgICAgIG1hdGVyaWFsVGFrZU9mZkZsYXREZXRhaWxzQXJyYXkucHVzaChtYXRlcmlhbFRha2VPZmZGbGF0RGV0YWlsRFRPKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKFJlcG9ydFNlcnZpY2UpO1xyXG5leHBvcnQgPSBSZXBvcnRTZXJ2aWNlO1xyXG5cclxuIl19
