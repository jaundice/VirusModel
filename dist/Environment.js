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
        get EnvironmentType() {
            return this._environmentType;
        }
        set EnvironmentType(environmentType) {
            this._environmentType = environmentType;
        }
        get InterpersonalContactFactor() {
            return this._interpersonalContactFactor;
        }
        set InterpersonalContactFactor(factor) {
            this._interpersonalContactFactor = factor;
        }
        get IsKeyInfrastructure() {
            return this._isKeyInfrastructure;
        }
        set IsKeyInfrastructure(isKey) {
            this._isKeyInfrastructure = isKey;
        }
    }
    exports.Environment = Environment;
    ;
});
//# sourceMappingURL=Environment.js.map