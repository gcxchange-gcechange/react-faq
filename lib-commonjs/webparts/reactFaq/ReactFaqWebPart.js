"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ReactDom = tslib_1.__importStar(require("react-dom"));
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_property_pane_1 = require("@microsoft/sp-property-pane");
var ReactFaq_1 = tslib_1.__importDefault(require("./components/ReactFaq"));
var SelectLanguage_1 = require("./components/SelectLanguage");
var ReactFaqWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(ReactFaqWebPart, _super);
    function ReactFaqWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.updateWebPart = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.context.propertyPane.refresh();
                this.render();
                return [2 /*return*/];
            });
        }); };
        return _this;
    }
    ReactFaqWebPart.prototype.onInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.strings = (0, SelectLanguage_1.SelectLanguage)(this.properties.prefLang);
                return [2 /*return*/];
            });
        });
    };
    ReactFaqWebPart.prototype.render = function () {
        var element = React.createElement(ReactFaq_1.default, {
            listName: this.properties.listName,
            ServiceScope: this.context.serviceScope,
            prefLang: this.properties.prefLang,
            updateWebPart: this.updateWebPart
        });
        ReactDom.render(element, this.domElement);
    };
    ReactFaqWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(ReactFaqWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse("1.0");
        },
        enumerable: false,
        configurable: true
    });
    ReactFaqWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: this.strings.PropertyPaneDescription,
                    },
                    groups: [
                        {
                            groupName: this.strings.BasicGroupName,
                            groupFields: [
                                (0, sp_property_pane_1.PropertyPaneTextField)("listName", {
                                    label: this.strings.ListNameFieldLabel,
                                }),
                                (0, sp_property_pane_1.PropertyPaneDropdown)("prefLang", {
                                    label: "Preferred Language",
                                    options: [
                                        { key: "account", text: "Account" },
                                        { key: "en-us", text: "English" },
                                        { key: "fr-fr", text: "Français" },
                                    ],
                                    selectedKey: this.strings.userLang,
                                }),
                            ],
                        },
                    ],
                },
            ],
        };
    };
    return ReactFaqWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = ReactFaqWebPart;
//# sourceMappingURL=ReactFaqWebPart.js.map