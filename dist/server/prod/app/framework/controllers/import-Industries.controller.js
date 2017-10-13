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
    ImportIndustryController.prototype.readXlsx = function (req, res) {
        var filePath = config.get('TplSeed.filePathForMasterDataExcel');
        console.log(filePath);
        var isFileExist = fs.existsSync(filePath);
        if (!isFileExist) {
            res.status(403).send({
                error: Messages.MSG_ERROR_INCORRECT_INDUSTRY_NAME
            });
        }
        else {
            importIndustriesService.readXlsx(filePath, function (error, result) {
                if (error) {
                    res.status(403).send({
                        error: error.message
                    });
                }
                else {
                    importIndustriesService.create(result, function (error, result) {
                        if (error) {
                            res.send({
                                error: error.message
                            });
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
    };
    return ImportIndustryController;
}());
exports.ImportIndustryController = ImportIndustryController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvaW1wb3J0LUluZHVzdHJpZXMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHVCQUEwQjtBQUMxQiw2Q0FBZ0Q7QUFDaEQsNkVBQWdGO0FBQ2hGLElBQUksdUJBQXVCLEdBQUcsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO0FBQzFELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUvQjtJQUFBO0lBb0NBLENBQUM7SUFsQ0EsMkNBQVEsR0FBUixVQUFTLEdBQW9CLEVBQUUsR0FBcUI7UUFDbkQsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEIsSUFBSSxXQUFXLEdBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ25CLEtBQUssRUFBRSxRQUFRLENBQUMsaUNBQWlDO2FBQ2xELENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNSLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDdkQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDbkIsS0FBSyxFQUFHLEtBQUssQ0FBQyxPQUFPO3FCQUN0QixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTix1QkFBdUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07d0JBQ25ELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ1YsR0FBRyxDQUFDLElBQUksQ0FBQztnQ0FDUCxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU87NkJBQ3JCLENBQUMsQ0FBQzt3QkFDUCxDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dDQUNuQixNQUFNLEVBQUUsUUFBUSxDQUFDLGNBQWM7Z0NBQy9CLElBQUksRUFBRTtvQ0FDSixNQUFNLEVBQUUsUUFBUSxDQUFDLG1DQUFtQztvQ0FDcEQsTUFBTSxFQUFFLE1BQU07aUNBQ2Y7NkJBQ0YsQ0FBQyxDQUFDO3dCQUNQLENBQUM7b0JBQ0QsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDRCwrQkFBQztBQUFELENBcENBLEFBb0NDLElBQUE7QUFwQ1ksNERBQXdCIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvaW1wb3J0LUluZHVzdHJpZXMuY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgSW1wb3J0SW5kdXN0cnlTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvaW1wb3J0LWluZHVzdHJpZXMuc2VydmljZScpO1xyXG5sZXQgaW1wb3J0SW5kdXN0cmllc1NlcnZpY2UgPSBuZXcgSW1wb3J0SW5kdXN0cnlTZXJ2aWNlKCk7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbXBvcnRJbmR1c3RyeUNvbnRyb2xsZXIge1xyXG5cclxuIHJlYWRYbHN4KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBsZXQgZmlsZVBhdGggPSBjb25maWcuZ2V0KCdUcGxTZWVkLmZpbGVQYXRoRm9yTWFzdGVyRGF0YUV4Y2VsJyk7XHJcbiAgY29uc29sZS5sb2coZmlsZVBhdGgpO1xyXG4gIGxldCBpc0ZpbGVFeGlzdD1mcy5leGlzdHNTeW5jKGZpbGVQYXRoKTtcclxuICBpZighaXNGaWxlRXhpc3QpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHtcclxuICAgICAgZXJyb3I6IE1lc3NhZ2VzLk1TR19FUlJPUl9JTkNPUlJFQ1RfSU5EVVNUUllfTkFNRVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICBpbXBvcnRJbmR1c3RyaWVzU2VydmljZS5yZWFkWGxzeChmaWxlUGF0aCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7XHJcbiAgICAgICAgZXJyb3IgOiBlcnJvci5tZXNzYWdlXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaW1wb3J0SW5kdXN0cmllc1NlcnZpY2UuY3JlYXRlKHJlc3VsdCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICBzdGF0dXM6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19JTkRVU1RSWV9EQVRBX0lOU0VSVElPTixcclxuICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgfVxyXG59XHJcbn1cclxuIl19
