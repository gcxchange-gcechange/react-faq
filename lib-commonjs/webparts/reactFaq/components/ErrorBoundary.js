"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type*/
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ErrorBoundary = /** @class */ (function (_super) {
    tslib_1.__extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            hasError: false,
            error: null,
            info: null
        };
        return _this;
    }
    ErrorBoundary.prototype.componentDidCatch = function (error, info) {
        this.setState({
            hasError: true,
            error: error,
            info: info
        });
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.hasError) {
            return (React.createElement("div", null,
                React.createElement("h1", null, "Oops, something went wrong :("),
                React.createElement("p", null,
                    "The error: ",
                    this.state.error.toString()),
                React.createElement("p", null,
                    "Where it occurred: ",
                    this.state.info.componentStack)));
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(React.Component));
exports.default = ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map