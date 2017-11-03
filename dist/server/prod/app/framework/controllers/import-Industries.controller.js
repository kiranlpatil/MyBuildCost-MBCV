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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvaW1wb3J0LUluZHVzdHJpZXMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHVCQUEwQjtBQUMxQiw2Q0FBZ0Q7QUFDaEQsNkVBQWdGO0FBQ2hGLElBQUksdUJBQXVCLEdBQUcsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO0FBQzFELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUvQjtJQUFBO0lBMkNBLENBQUM7SUF6Q0MsMkNBQVEsR0FBUixVQUFTLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQzdELElBQUksQ0FBQztZQUNILElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUNoRSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDO29CQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsaUNBQWlDO29CQUNsRCxPQUFPLEVBQUUsUUFBUSxDQUFDLGlDQUFpQztvQkFDbkQsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO29CQUN2QixJQUFJLEVBQUUsR0FBRztpQkFDVixDQUFDLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sdUJBQXVCLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO29CQUN2RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDZCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTs0QkFDbkQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQ0FDVixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ2QsQ0FBQzs0QkFBQyxJQUFJLENBQUMsQ0FBQztnQ0FDTixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQ0FDbkIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxjQUFjO29DQUMvQixJQUFJLEVBQUU7d0NBQ0osTUFBTSxFQUFFLFFBQVEsQ0FBQyxtQ0FBbUM7d0NBQ3BELE1BQU0sRUFBRSxNQUFNO3FDQUNmO2lDQUNGLENBQUMsQ0FBQzs0QkFDTCxDQUFDO3dCQUNILENBQUMsQ0FBQyxDQUFDO29CQUNMLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUM7Z0JBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO2dCQUNqQixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87Z0JBQ2xCLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtnQkFDdkIsSUFBSSxFQUFFLEdBQUc7YUFDVixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUNILCtCQUFDO0FBQUQsQ0EzQ0EsQUEyQ0MsSUFBQTtBQTNDWSw0REFBd0IiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy9pbXBvcnQtSW5kdXN0cmllcy5jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgZnMgPSByZXF1aXJlKCdmcycpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IEltcG9ydEluZHVzdHJ5U2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2ltcG9ydC1pbmR1c3RyaWVzLnNlcnZpY2UnKTtcclxubGV0IGltcG9ydEluZHVzdHJpZXNTZXJ2aWNlID0gbmV3IEltcG9ydEluZHVzdHJ5U2VydmljZSgpO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcblxyXG5leHBvcnQgY2xhc3MgSW1wb3J0SW5kdXN0cnlDb250cm9sbGVyIHtcclxuXHJcbiAgcmVhZFhsc3gocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgZmlsZVBhdGggPSBjb25maWcuZ2V0KCdUcGxTZWVkLmZpbGVQYXRoRm9yTWFzdGVyRGF0YUV4Y2VsJyk7XHJcbiAgICAgIGxldCBpc0ZpbGVFeGlzdCA9IGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpO1xyXG4gICAgICBpZiAoIWlzRmlsZUV4aXN0KSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9JTkNPUlJFQ1RfSU5EVVNUUllfTkFNRSxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9JTkNPUlJFQ1RfSU5EVVNUUllfTkFNRSxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW1wb3J0SW5kdXN0cmllc1NlcnZpY2UucmVhZFhsc3goZmlsZVBhdGgsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbXBvcnRJbmR1c3RyaWVzU2VydmljZS5jcmVhdGUocmVzdWx0LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgc3RhdHVzOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfSU5EVVNUUllfREFUQV9JTlNFUlRJT04sXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDUwMFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19
