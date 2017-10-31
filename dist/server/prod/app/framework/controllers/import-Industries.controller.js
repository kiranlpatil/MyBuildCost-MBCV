"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Messages = require("../shared/messages");
var ImportIndustryService = require("../services/import-industries.service");
var importIndustriesService = new ImportIndustryService();
var config = require('config');
var ImportIndustryController = (function () {
    function ImportIndustryController() {
    }
    ImportIndustryController.prototype.readXlsx = function (req, res, next) {
        try {
            var filePath = config.get('TplSeed.filePathForMasterDataExcel');
            console.log(filePath);
            var isFileExist = fs.existsSync(filePath);
            if (!isFileExist) {
                next({
                    reason: Messages.MSG_ERROR_INCORRECT_INDUSTRY_NAME,
                    message: Messages.MSG_ERROR_INCORRECT_INDUSTRY_NAME,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                importIndustriesService.readXlsx(filePath, function (error, result) {
                    if (error) {
                        next(error);
                    }
                    else {
                        importIndustriesService.create(result, function (error, result) {
                            if (error) {
                                next(error);
                            }
                            else {
                                res.status(200).send({
                                    status: Messages.STATUS_SUCCESS,
                                    data: {
                                        reason: Messages.MSG_SUCCESS_INDUSTRY_DATA_INSERTION,
                                        result: result,
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
        catch (e) {
            next({
                reason: e.message,
                message: e.message,
                stackTrace: new Error(),
                code: 500
            });
        }
    };
    return ImportIndustryController;
}());
exports.ImportIndustryController = ImportIndustryController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvaW1wb3J0LUluZHVzdHJpZXMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHVCQUEwQjtBQUMxQiw2Q0FBZ0Q7QUFDaEQsNkVBQWdGO0FBQ2hGLElBQUksdUJBQXVCLEdBQUcsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO0FBQzFELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUvQjtJQUFBO0lBNENBLENBQUM7SUExQ0MsMkNBQVEsR0FBUixVQUFTLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQzdELElBQUksQ0FBQztZQUNILElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RCLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUM7b0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyxpQ0FBaUM7b0JBQ2xELE9BQU8sRUFBRSxRQUFRLENBQUMsaUNBQWlDO29CQUNuRCxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7b0JBQ3ZCLElBQUksRUFBRSxHQUFHO2lCQUNWLENBQUMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTix1QkFBdUIsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07b0JBQ3ZELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNkLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sdUJBQXVCLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNOzRCQUNuRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dDQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDZCxDQUFDOzRCQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO29DQUNuQixNQUFNLEVBQUUsUUFBUSxDQUFDLGNBQWM7b0NBQy9CLElBQUksRUFBRTt3Q0FDSixNQUFNLEVBQUUsUUFBUSxDQUFDLG1DQUFtQzt3Q0FDcEQsTUFBTSxFQUFFLE1BQU07cUNBQ2Y7aUNBQ0YsQ0FBQyxDQUFDOzRCQUNMLENBQUM7d0JBQ0gsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQztnQkFDSCxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU87Z0JBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztnQkFDbEIsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO2dCQUN2QixJQUFJLEVBQUUsR0FBRzthQUNWLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBQ0gsK0JBQUM7QUFBRCxDQTVDQSxBQTRDQyxJQUFBO0FBNUNZLDREQUF3QiIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2NvbnRyb2xsZXJzL2ltcG9ydC1JbmR1c3RyaWVzLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgSW1wb3J0SW5kdXN0cnlTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvaW1wb3J0LWluZHVzdHJpZXMuc2VydmljZScpO1xyXG5sZXQgaW1wb3J0SW5kdXN0cmllc1NlcnZpY2UgPSBuZXcgSW1wb3J0SW5kdXN0cnlTZXJ2aWNlKCk7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbXBvcnRJbmR1c3RyeUNvbnRyb2xsZXIge1xyXG5cclxuICByZWFkWGxzeChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBmaWxlUGF0aCA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuZmlsZVBhdGhGb3JNYXN0ZXJEYXRhRXhjZWwnKTtcclxuICAgICAgY29uc29sZS5sb2coZmlsZVBhdGgpO1xyXG4gICAgICBsZXQgaXNGaWxlRXhpc3QgPSBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKTtcclxuICAgICAgaWYgKCFpc0ZpbGVFeGlzdCkge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfSU5DT1JSRUNUX0lORFVTVFJZX05BTUUsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfSU5DT1JSRUNUX0lORFVTVFJZX05BTUUsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGltcG9ydEluZHVzdHJpZXNTZXJ2aWNlLnJlYWRYbHN4KGZpbGVQYXRoLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW1wb3J0SW5kdXN0cmllc1NlcnZpY2UuY3JlYXRlKHJlc3VsdCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0lORFVTVFJZX0RBVEFfSU5TRVJUSU9OLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA1MDBcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==
