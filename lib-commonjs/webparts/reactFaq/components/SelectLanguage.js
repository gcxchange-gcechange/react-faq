"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectLanguage = SelectLanguage;
var tslib_1 = require("tslib");
var strings = tslib_1.__importStar(require("ReactFaqWebPartStrings"));
var english = tslib_1.__importStar(require("../loc/en-us.js"));
var french = tslib_1.__importStar(require("../loc/fr-fr.js"));
function SelectLanguage(lang) {
    switch (lang) {
        case "en-us": {
            return english;
        }
        case "fr-fr": {
            return french;
        }
        default: {
            return strings;
        }
    }
}
//# sourceMappingURL=SelectLanguage.js.map