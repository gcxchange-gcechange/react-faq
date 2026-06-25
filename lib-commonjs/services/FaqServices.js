"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqServices = void 0;
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_page_context_1 = require("@microsoft/sp-page-context");
var sp_http_1 = require("@microsoft/sp-http");
var FaqServices = /** @class */ (function () {
    function FaqServices(serviceScope) {
        var _this = this;
        serviceScope.whenFinished(function () {
            _this._spHttpClient = serviceScope.consume(sp_http_1.SPHttpClient.serviceKey);
            _this._pageContext = serviceScope.consume(sp_page_context_1.PageContext.serviceKey);
            _this._currentWebUrl = _this._pageContext.web.absoluteUrl;
        });
    }
    FaqServices.prototype.getFaq = function (listName) {
        var _this = this;
        return new Promise(function (resolve) {
            var ParentDetails = _this.getFaqs(listName);
            resolve(ParentDetails);
        });
    };
    FaqServices.prototype.getMockFaq = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tempOrg;
            return tslib_1.__generator(this, function (_a) {
                tempOrg = [{
                        Id: 1,
                        Title: "What is the HR Policy?",
                        Answer: "There is no change in HR Policy",
                        Category: "HR Policy",
                        CategorySortOrder: 3,
                        QuestionSortOrder: 3,
                        Modified: '2020-03-27T11:07:21Z'
                    },
                    {
                        Id: 2,
                        Title: "What changes should I expect (or not) as an employee?",
                        Answer: "For the immediate future, There is no change.",
                        Category: "Top Questions",
                        CategorySortOrder: 2,
                        QuestionSortOrder: 2,
                        Modified: '2020-03-27T11:07:21Z'
                    },
                    {
                        Id: 3,
                        Title: "What is the finance policy in the company?",
                        Answer: "There is change in Finance Policy. ",
                        Category: "Finance Policy",
                        CategorySortOrder: 3,
                        QuestionSortOrder: 1,
                        Modified: '2020-03-27T11:07:21Z'
                    }
                ];
                return [2 /*return*/, tempOrg];
            });
        });
    };
    FaqServices.prototype.getFaqs = function (listName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var FaqProp_1, restUrl, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        FaqProp_1 = [];
                        restUrl = this._currentWebUrl;
                        //fix: load more than 100 items using top=5000
                        restUrl += "/_api/web/lists/getbytitle('" + listName + "')/items?$select=Id,QuestionEN,QuestionFR,AnswerEN,AnswerFR,CategoryNameEN,CategoryNameFR,CategorySortOrder,QuestionSortOrder,Modified&$top=5000";
                        return [4 /*yield*/, this._spHttpClient.get(restUrl, sp_http_1.SPHttpClient.configurations.v1, {
                                headers: {
                                    "Accept": "application/json;odata=nometadata",
                                    "odata-version": "3.0"
                                }
                            })
                                .then(function (response) {
                                return response.json().then(function (responseFormatted) {
                                    if (response.ok) {
                                        var collection = responseFormatted.value;
                                        for (var i = 0; i < collection.length; i++) {
                                            FaqProp_1.push({
                                                Id: collection[i].Id,
                                                QuestionEN: collection[i].QuestionEN,
                                                QuestionFR: collection[i].QuestionFR,
                                                AnswerEN: collection[i].AnswerEN,
                                                AnswerFR: collection[i].AnswerFR,
                                                CategoryNameEN: collection[i].CategoryNameEN,
                                                CategoryNameFR: collection[i].CategoryNameFR,
                                                CategorySortOrder: collection[i].CategorySortOrder,
                                                QuestionSortOrder: collection[i].QuestionSortOrder,
                                                Modified: collection[i].Modified
                                            });
                                        }
                                    }
                                    else {
                                        throw new Error(response.text().toString());
                                    }
                                    return FaqProp_1;
                                });
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        console.log("Service API Error - " + error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FaqServices.serviceKey = sp_core_library_1.ServiceKey.create('vrd:IFaqServices', FaqServices);
    return FaqServices;
}());
exports.FaqServices = FaqServices;
//# sourceMappingURL=FaqServices.js.map