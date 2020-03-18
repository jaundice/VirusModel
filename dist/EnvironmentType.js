(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EnvironmentType;
    (function (EnvironmentType) {
        EnvironmentType[EnvironmentType["Home"] = 0] = "Home";
        EnvironmentType[EnvironmentType["Office"] = 1] = "Office";
        EnvironmentType[EnvironmentType["School"] = 2] = "School";
        EnvironmentType[EnvironmentType["Retail"] = 3] = "Retail";
        EnvironmentType[EnvironmentType["Social"] = 4] = "Social";
    })(EnvironmentType = exports.EnvironmentType || (exports.EnvironmentType = {}));
    ;
});
//# sourceMappingURL=EnvironmentType.js.map