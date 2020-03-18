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
    class Environment {
        get environmentType() {
            return this._environmentType;
        }
        set environmentType(environmentType) {
            this._environmentType = environmentType;
        }
        get interpersonalContactFactor() {
            return this._interpersonalContactFactor;
        }
        set interpersonalContactFactor(factor) {
            this._interpersonalContactFactor = factor;
        }
    }
    exports.Environment = Environment;
    ;
});
//# sourceMappingURL=Environment.js.map