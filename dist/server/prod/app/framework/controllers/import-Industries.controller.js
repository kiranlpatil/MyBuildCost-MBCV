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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvaW1wb3J0LUluZHVzdHJpZXMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHVCQUEwQjtBQUMxQiw2Q0FBZ0Q7QUFDaEQsNkVBQWdGO0FBQ2hGLElBQUksdUJBQXVCLEdBQUcsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO0FBQzFELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUvQjtJQUFBO0lBMkNBLENBQUM7SUF6Q0MsMkNBQVEsR0FBUixVQUFTLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQzdELElBQUksQ0FBQztZQUNILElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUNoRSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDO29CQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsaUNBQWlDO29CQUNsRCxPQUFPLEVBQUUsUUFBUSxDQUFDLGlDQUFpQztvQkFDbkQsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO29CQUN2QixJQUFJLEVBQUUsR0FBRztpQkFDVixDQUFDLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sdUJBQXVCLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO29CQUN2RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDZCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTs0QkFDbkQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQ0FDVixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ2QsQ0FBQzs0QkFBQyxJQUFJLENBQUMsQ0FBQztnQ0FDTixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQ0FDbkIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxjQUFjO29DQUMvQixJQUFJLEVBQUU7d0NBQ0osTUFBTSxFQUFFLFFBQVEsQ0FBQyxtQ0FBbUM7d0NBQ3BELE1BQU0sRUFBRSxNQUFNO3FDQUNmO2lDQUNGLENBQUMsQ0FBQzs0QkFDTCxDQUFDO3dCQUNILENBQUMsQ0FBQyxDQUFDO29CQUNMLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUM7Z0JBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO2dCQUNqQixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87Z0JBQ2xCLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtnQkFDdkIsSUFBSSxFQUFFLEdBQUc7YUFDVixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUNILCtCQUFDO0FBQUQsQ0EzQ0EsQUEyQ0MsSUFBQTtBQTNDWSw0REFBd0IiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy9pbXBvcnQtSW5kdXN0cmllcy5jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xuaW1wb3J0IEltcG9ydEluZHVzdHJ5U2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2ltcG9ydC1pbmR1c3RyaWVzLnNlcnZpY2UnKTtcbmxldCBpbXBvcnRJbmR1c3RyaWVzU2VydmljZSA9IG5ldyBJbXBvcnRJbmR1c3RyeVNlcnZpY2UoKTtcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcblxuZXhwb3J0IGNsYXNzIEltcG9ydEluZHVzdHJ5Q29udHJvbGxlciB7XG5cbiAgcmVhZFhsc3gocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBmaWxlUGF0aCA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuZmlsZVBhdGhGb3JNYXN0ZXJEYXRhRXhjZWwnKTtcbiAgICAgIGxldCBpc0ZpbGVFeGlzdCA9IGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpO1xuICAgICAgaWYgKCFpc0ZpbGVFeGlzdCkge1xuICAgICAgICBuZXh0KHtcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9JTkNPUlJFQ1RfSU5EVVNUUllfTkFNRSxcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfSU5DT1JSRUNUX0lORFVTVFJZX05BTUUsXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAzXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW1wb3J0SW5kdXN0cmllc1NlcnZpY2UucmVhZFhsc3goZmlsZVBhdGgsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW1wb3J0SW5kdXN0cmllc1NlcnZpY2UuY3JlYXRlKHJlc3VsdCwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICAgICAgICAgICAgc3RhdHVzOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19JTkRVU1RSWV9EQVRBX0lOU0VSVElPTixcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV4dCh7XG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICBjb2RlOiA1MDBcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19
