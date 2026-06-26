"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type*/
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var sp_core_library_1 = require("@microsoft/sp-core-library");
var react_autosuggest_1 = tslib_1.__importDefault(require("react-autosuggest"));
var FaqServices_1 = require("../../../services/FaqServices");
//import ReactHtmlParser from 'react-html-parser';
var html_react_parser_1 = tslib_1.__importDefault(require("html-react-parser"));
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
//import * as strings from "ReactFaqWebPartStrings";
var SelectLanguage_1 = require("./SelectLanguage");
var react_accessible_accordion_1 = require("react-accessible-accordion");
require("./index.css");
var ErrorBoundary_1 = tslib_1.__importDefault(require("./ErrorBoundary"));
require("./reactAccordion.css");
var ReactFaq = /** @class */ (function (_super) {
    tslib_1.__extends(ReactFaq, _super);
    function ReactFaq(props, state) {
        var _this = _super.call(this, props) || this;
        _this.strings = (0, SelectLanguage_1.SelectLanguage)(_this.props.prefLang);
        _this.onHandleChange = function (event, value, FaqData) {
            if (FaqData.length > 0 && event !== undefined) {
                if (value === "") {
                    var FaqFilteredData = _this.filterByValue(FaqData, value);
                    _this.setState({ originalData: FaqFilteredData });
                }
                else {
                    _this.setState({ originalData: _this.state.actualData });
                }
            }
        };
        _this.onChange = function (event, _a) {
            var newValue = _a.newValue, method = _a.method;
            if (method === "enter") {
                console.log("enter");
            }
            else {
                console.log("not enter");
            }
            if (newValue !== "") {
                _this.setState({
                    value: newValue,
                });
            }
            else {
                _this.setState({
                    originalData: _this.state.actualData,
                });
            }
        };
        _this.onSuggestionSelected = function (FaqData, event, method) {
            var _a, _b, _c, _d;
            var currentTargetText = "";
            if (method.method === "enter") {
                console.log("enter" + JSON.stringify(method));
                currentTargetText = method.suggestionValue;
            }
            else {
                console.log("click");
                currentTargetText = event.currentTarget.innerText;
            }
            var FaqFilteredData = _this.filterByValue(FaqData, currentTargetText);
            if (FaqFilteredData) {
                if (FaqFilteredData.length > 0) {
                    var autoSuggestTextbox = document.getElementById("txtSearchBox");
                    autoSuggestTextbox.value = currentTargetText;
                    autoSuggestTextbox.blur();
                    var FaqId_1;
                    var FaqCategory_1;
                    if (FaqFilteredData.length > 1) {
                        FaqFilteredData.map(function (item, index) {
                            var _a, _b;
                            if (((_a = item.QuestionEN) === null || _a === void 0 ? void 0 : _a.trim()) === currentTargetText.trim() || ((_b = item.QuestionFR) === null || _b === void 0 ? void 0 : _b.trim()) === currentTargetText.trim()) {
                                FaqId_1 = FaqFilteredData[index].Id;
                                FaqCategory_1 = FaqFilteredData[index].CategoryNameEN;
                            }
                        });
                    }
                    else if (FaqFilteredData.length === 1) {
                        FaqId_1 = FaqFilteredData[0].Id;
                        FaqCategory_1 = FaqFilteredData[0].CategoryNameEN;
                    }
                    var catData = [];
                    catData.push(FaqCategory_1);
                    _this.setState({ filteredCategoryData: catData });
                    var nodElem = 'acc-' + FaqCategory_1;
                    var node = document.getElementsByClassName(nodElem);
                    var chNode = node[0].children[0].children[0].children[0];
                    var newAttr = document.createAttribute('aria-expanded');
                    newAttr.value = 'true';
                    chNode.setAttributeNode(newAttr);
                    node[0].children[0].children[1].removeAttribute('hidden');
                    var FaqNode = _this.getFaqElement(FaqId_1);
                    var txtNode = document.getElementById("txtSearchBox");
                    var FaqEle = FaqNode[0];
                    var newAttrII = document.createAttribute('aria-expanded');
                    newAttrII.value = 'true';
                    FaqEle.setAttributeNode(newAttrII);
                    FaqEle.nextSibling.style.display = 'block';
                    FaqEle.nextSibling.removeAttribute('class');
                    if (((_a = FaqEle.previousElementSibling) === null || _a === void 0 ? void 0 : _a.previousSibling).classList !== undefined) {
                        ((_b = FaqEle.previousElementSibling) === null || _b === void 0 ? void 0 : _b.previousSibling).classList.add("hideDiv");
                    }
                    if (((_c = FaqEle.previousElementSibling) === null || _c === void 0 ? void 0 : _c.classList) !== undefined) {
                        (_d = FaqEle.previousElementSibling) === null || _d === void 0 ? void 0 : _d.classList.remove("hideDiv");
                    }
                    var txtSibEle = txtNode === null || txtNode === void 0 ? void 0 : txtNode.nextElementSibling;
                    txtSibEle === null || txtSibEle === void 0 ? void 0 : txtSibEle.classList.remove("react-autosuggest__suggestions-container--open");
                    FaqEle.scrollIntoView({ behavior: 'smooth' });
                    if (document.getElementsByClassName("mainContent") !== undefined && document.getElementsByClassName("mainContent").length > 0) {
                        _this.setFaqWebPartHeightDynamic();
                    }
                }
            }
        };
        _this.onSuggestionsFetchRequested = function (_a) {
            var value = _a.value;
            _this.setState({
                suggestions: _this.getSuggestions(value),
            });
        };
        _this.onSuggestionsClearRequested = function () {
            var autoSuggestTextbox = document.getElementById("txtSearchBox");
            if (autoSuggestTextbox.value === "") {
                autoSuggestTextbox.value = "";
                _this.setState({
                    suggestions: [],
                    value: ""
                });
            }
        };
        // When suggestion is clicked, Autosuggest needs to populate the input
        // based on the clicked suggestion. Teach Autosuggest how to calculate the
        // input value for every given suggestion.
        _this.getSuggestionValue = function (suggestion) {
            if (suggestion.length < 0) {
                return "";
            }
            else {
                return (_this.strings.Lang === "FR" ? suggestion.QuestionFR : suggestion.QuestionEN);
            }
        };
        _this.getSuggestions = function (value) {
            var inputValue = value.trim().toLowerCase();
            var inputLength = inputValue.length;
            return inputLength === 0
                ? []
                : _this.state.actualData.filter(function (lang) {
                    return lang.QuestionFR.toLowerCase().indexOf(inputValue) !== -1 ||
                        lang.AnswerFR.toLowerCase().indexOf(inputValue) !== -1 ||
                        lang.QuestionEN.toLowerCase().indexOf(inputValue) !== -1 ||
                        lang.AnswerEN.toLowerCase().indexOf(inputValue) !== -1;
                });
        };
        _this.renderSuggestion = function (suggestion) {
            return (React.createElement("div", null, (_this.strings.Lang === "FR" ? suggestion.QuestionFR : suggestion.QuestionEN)));
        };
        _this.setNodeValues = function () {
            var _a, _b, _c, _d, _e;
            var mainContentElements = document.getElementsByClassName("mainContent");
            var spCanvasElement = mainContentElements.length > 0
                ? document.getElementsByClassName("SPCanvas")[0]
                : undefined;
            var SPCanvasFirstParent = (_b = (_a = spCanvasElement === null || spCanvasElement === void 0 ? void 0 : spCanvasElement.parentElement) === null || _a === void 0 ? void 0 : _a.offsetHeight) !== null && _b !== void 0 ? _b : 0;
            var SPCanvasSecondParent = (_e = (_d = (_c = spCanvasElement === null || spCanvasElement === void 0 ? void 0 : spCanvasElement.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.offsetHeight) !== null && _e !== void 0 ? _e : 0;
            _this.setState({
                actualCanvasContentHeight: SPCanvasFirstParent,
                actualCanvasWrapperHeight: SPCanvasSecondParent,
            }, _this.dynamicHeight);
        };
        _this.categoryAndQuestionSorting = function (Data) {
            var result = [];
            // Get Distinct category for sorting Category
            var distCate = _this.distinct(Data, "CategoryNameEN");
            distCate.sort(function (c, d) {
                return c.CategorySortOrder - d.CategorySortOrder;
            });
            //Sorting the FAQ as per CategorySortOrder
            distCate.forEach(function (distCateItem) {
                Data.map(function (item) {
                    if (distCateItem.CategoryNameEN.toLowerCase() === item.CategoryNameEN.toLowerCase()) {
                        result.push(item);
                    }
                });
            });
            //Sorting the FAQ as per QuestionSortOrder
            result.sort(function (a, b) {
                return a.QuestionSortOrder - b.QuestionSortOrder;
            });
            return result;
        };
        _this.filterByValue = function (arrayData, value) {
            return arrayData.filter(function (o) {
                return _this.includes(o.QuestionEN.toLowerCase(), value.toLowerCase()) ||
                    _this.includes(o.AnswerEN.toLowerCase(), value.toLowerCase()) ||
                    _this.includes(o.QuestionFR.toLowerCase(), value.toLowerCase()) ||
                    _this.includes(o.AnswerFR.toLowerCase(), value.toLowerCase());
            });
        };
        _this.getFaqElement = function (FaqId) {
            return Array.prototype.filter.call(document.getElementsByTagName('span'), function (el) { return el.getAttribute('data-id') === String(FaqId); });
        };
        _this.formatDate = function (ModifiedDate) {
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var dt = new Date(ModifiedDate);
            var hours = dt.getHours();
            var minutes = dt.getMinutes();
            var secs = dt.getSeconds();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            var strTime = hours + ':' + minutes + ':' + secs + ' ' + ampm;
            return (monthNames[dt.getMonth()] +
                " " +
                dt.getDate() +
                ", " +
                dt.getFullYear() +
                " " +
                strTime);
        };
        _this.dynamicHeight = function () {
            var SPCanvasNode = document.getElementsByClassName("SPCanvas");
            var accordionNode = document.getElementsByClassName("accordion");
            if (SPCanvasNode.length > 0 && accordionNode.length > 0) {
                var canvasParent = SPCanvasNode[0].parentElement;
                var canvasGrandParent = canvasParent === null || canvasParent === void 0 ? void 0 : canvasParent.parentElement;
                var accordionParent = accordionNode[0].parentElement;
                if (canvasParent && canvasGrandParent && accordionParent) {
                    canvasParent.style.height = (_this.state.actualCanvasContentHeight + (accordionParent.offsetHeight - _this.state.actualAccordionHeight)) + "px";
                    canvasGrandParent.style.height = (_this.state.actualCanvasWrapperHeight + (accordionParent.offsetHeight - _this.state.actualAccordionHeight)) + "px";
                }
            }
        };
        _this.setFaqWebPartHeightDynamic = function () {
            if (_this.state.actualCanvasContentHeight === 0) {
                _this.setNodeValues();
            }
            else {
                _this.dynamicHeight();
            }
        };
        _this.accordionOnchange = function () {
            if (document.getElementsByClassName("mainContent") !== undefined && document.getElementsByClassName("mainContent").length > 0) {
                _this.setFaqWebPartHeightDynamic();
            }
        };
        _this.includes = function (container, value) {
            var returnValue = false;
            var pos = container.indexOf(value);
            if (pos >= 0) {
                returnValue = true;
            }
            return returnValue;
        };
        _this.state = {
            originalData: [],
            actualData: [],
            BusinessCategory: [],
            isLoading: true,
            errorCause: "No Data",
            selectedEntity: [],
            show: false,
            filterData: [],
            searchValue: "",
            filteredCategoryData: [],
            filteredQuestion: "",
            value: "",
            suggestions: [],
            actualCanvasContentHeight: 0,
            actualCanvasWrapperHeight: 0,
            actualAccordionHeight: 0,
        };
        try {
            var serviceScope = _this.props.ServiceScope;
            if (sp_core_library_1.Environment.type === sp_core_library_1.EnvironmentType.SharePoint || sp_core_library_1.Environment.type === sp_core_library_1.EnvironmentType.ClassicSharePoint) {
                // Mapping to be used when webpart runs in SharePoint.
                _this.faqServicesInstance = serviceScope.consume(FaqServices_1.FaqServices.serviceKey);
            }
            else {
                console.log("App is not running in Sharepoint Online");
            }
        }
        catch (error) {
            console.log(error);
        }
        return _this;
    }
    ReactFaq.prototype.componentDidUpdate = function (prevProps) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(prevProps.prefLang !== this.props.prefLang)) return [3 /*break*/, 2];
                        this.strings = (0, SelectLanguage_1.SelectLanguage)(this.props.prefLang);
                        return [4 /*yield*/, this.props.updateWebPart()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ReactFaq.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var accordionElement, ua, trident, rv, searchBoxElement;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(sp_core_library_1.Environment.type === sp_core_library_1.EnvironmentType.SharePoint || sp_core_library_1.Environment.type === sp_core_library_1.EnvironmentType.ClassicSharePoint)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadFaq()];
                    case 1:
                        _c.sent();
                        return [3 /*break*/, 2];
                    case 2:
                        accordionElement = document.getElementsByClassName("accordion")[0];
                        this.setState({
                            actualAccordionHeight: (_b = (_a = accordionElement === null || accordionElement === void 0 ? void 0 : accordionElement.parentElement) === null || _a === void 0 ? void 0 : _a.offsetHeight) !== null && _b !== void 0 ? _b : 0
                        });
                        ua = window.navigator.userAgent;
                        trident = ua.indexOf('Trident/');
                        if (trident > 0) {
                            rv = ua.indexOf('rv:');
                            searchBoxElement = document.getElementById("txtSearchBox");
                            if (searchBoxElement && (parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)) < 12) {
                                searchBoxElement.style.paddingTop = '3px';
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ReactFaq.prototype.loadFaq = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.faqServicesInstance
                            .getFaq(this.props.listName)
                            .then(function (FaqData) {
                            try {
                                _this.setState({
                                    actualData: FaqData,
                                    originalData: FaqData,
                                });
                            }
                            catch (error) {
                                console.log("Error Occurred :" + error);
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReactFaq.prototype.distinct = function (items, prop) {
        var unique = [];
        var distinctItems = [];
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (unique[item[prop]] === undefined) {
                distinctItems.push(item);
            }
            unique[item[prop]] = 0;
        }
        return distinctItems;
    };
    ReactFaq.prototype.loadMoreEventFromKeybord = function (event) {
        //Only if enter press
        if (event.keyCode === 13) {
            this.loadMoreEvent(event);
        }
    };
    ReactFaq.prototype.loadMoreEvent = function (event) {
        var clickedId = event.target.getAttribute('data-id');
        console.log('clicked - ' + clickedId + ' ' + event.target);
        console.log(event.target.nodeName);
        if (event.target.nodeName === "SPAN") {
            if (event.target.nextElementSibling.classList.contains("hideDiv")) {
                event.target.nextElementSibling.classList.remove("hideDiv");
                try {
                    if (event.currentTarget.children[0].classList !== undefined) {
                        event.currentTarget.children[0].classList.add("hideDiv");
                    }
                    if (event.currentTarget.children[1].classList !== undefined) {
                        event.currentTarget.children[1].classList.remove("hideDiv");
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
                event.target.nextElementSibling.classList.add("hideDiv");
                try {
                    if (event.currentTarget.children[1].classList !== undefined) {
                        event.currentTarget.children[1].classList.add("hideDiv");
                    }
                    if (event.currentTarget.children[0].classList !== undefined) {
                        event.currentTarget.children[0].classList.remove("hideDiv");
                    }
                    event.currentTarget.children[3].removeAttribute("style");
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        else {
            if (event.target.nodeName === "I") {
                if (event.target.dataset.iconName === 'chevrondown') {
                    console.log("evenTarget1", event.target.className);
                    console.log("evenTarget3", event.target.nextElementSibling.nextElementSibling.nextElementSibling.className);
                    event.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove("hideDiv"); //answer
                    event.target.nextElementSibling.classList.remove("hideDiv"); //span
                    event.target.classList.add("hideDiv");
                }
                if (event.target.dataset.iconName === "chevronup") {
                    event.target.nextElementSibling.nextElementSibling.classList.add("hideDiv"); //answer
                    event.target.previousElementSibling.classList.remove("hideDiv"); //chevdown
                    event.target.classList.add("hideDiv"); //chevup
                }
                event.currentTarget.children[3].removeAttribute("style");
            }
        }
        if (document.getElementsByClassName("mainContent") !== undefined && document.getElementsByClassName("mainContent").length > 0) {
            this.setFaqWebPartHeightDynamic();
        }
    };
    ReactFaq.prototype.render = function () {
        var _this = this;
        var _a;
        var uniqueBC = [];
        var FaqData = [];
        if (((_a = this.state.originalData) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            FaqData = this.categoryAndQuestionSorting(this.state.originalData);
            uniqueBC = this.distinct(FaqData, "BusinessCategory");
        }
        var _b = this.state, value = _b.value, suggestions = _b.suggestions;
        // Autosuggest will pass through all these props to the input.
        var inputProps = {
            placeholder: this.strings.placeholderSearch,
            value: value,
            onChange: this.onChange,
            id: "txtSearchBox",
            "aria-label": this.strings.searchLabel,
        };
        var userLang = this.strings.Lang;
        return (React.createElement("div", { className: "container" },
            React.createElement("div", { className: "FaqSearchBox", "accept-charset": "UTF-8" },
                React.createElement(react_autosuggest_1.default, { suggestions: suggestions, onSuggestionsFetchRequested: this.onSuggestionsFetchRequested, onSuggestionsClearRequested: this.onSuggestionsClearRequested, getSuggestionValue: this.getSuggestionValue, renderSuggestion: this.renderSuggestion, onSuggestionSelected: this.onSuggestionSelected.bind(this, this.state.actualData), inputProps: inputProps, focusInputOnSuggestionClick: false })),
            React.createElement(ErrorBoundary_1.default, null,
                React.createElement("div", { className: "clearBody" },
                    React.createElement(react_accessible_accordion_1.Accordion, { allowMultipleExpanded: true, allowZeroExpanded: true, onChange: this.accordionOnchange.bind(this), preExpanded: this.state.filteredCategoryData }, uniqueBC.map(function (item, index) { return (React.createElement("div", { key: index }, _this.distinct(FaqData, "CategoryNameEN").map(function (allCat, index) { return (React.createElement("div", { className: "acc-".concat(allCat.CategoryNameEN, " accordeonBlock"), key: index },
                        React.createElement(react_accessible_accordion_1.AccordionItem, { uuid: allCat.Id },
                            React.createElement(react_accessible_accordion_1.AccordionItemHeading, null,
                                React.createElement(react_accessible_accordion_1.AccordionItemButton, null, (userLang === "EN" ? allCat.CategoryNameEN : allCat.CategoryNameFR))),
                            React.createElement(react_accessible_accordion_1.AccordionItemPanel, null,
                                React.createElement("div", { className: "acc-item-panel" }, FaqData.filter(function (it) { return it.CategoryNameEN === allCat.CategoryNameEN; }).map(function (allFaq, index) { return (React.createElement("div", { key: index, className: "acc-item", "data-id": allFaq.Id, onClick: function (event) { return _this.loadMoreEvent(event); } },
                                    React.createElement(office_ui_fabric_react_1.Icon, { id: "chevrondown", iconName: "chevrondown", "aria-label": _this.strings.iconPlusLabel, "data-id": allFaq.Id, className: "plusminusImg" }),
                                    React.createElement(office_ui_fabric_react_1.Icon, { id: "chevronup", iconName: "chevronup", "aria-label": _this.strings.iconMinusLabel, "data-id": allFaq.Id, className: "plusminusImg hideDiv" }),
                                    React.createElement("span", { role: "heading", "aria-level": 3, tabIndex: 0, onKeyUp: function (event) {
                                            return _this.loadMoreEventFromKeybord(event);
                                        }, className: "acc-span-text", "data-id": allFaq.Id }, userLang === "EN"
                                        ? allFaq.QuestionEN
                                        : allFaq.QuestionFR),
                                    React.createElement("div", { className: "hideDiv" },
                                        React.createElement("div", { className: "acc-answer" }, (0, html_react_parser_1.default)((userLang === "EN" ? allFaq.AnswerEN : allFaq.AnswerFR)))))); })))))); }))); }))))));
    };
    return ReactFaq;
}(React.Component));
exports.default = ReactFaq;
//# sourceMappingURL=ReactFaq.js.map