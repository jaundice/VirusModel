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
    class Person {
        get statusHandler() {
            return this._statusHandler;
        }
        set statusHandler(statusHandler) {
            this._statusHandler = statusHandler;
        }
        get susceptability() {
            return this._susceptability;
        }
        set susceptability(susceptability) {
            this._susceptability = susceptability;
        }
        get householdIndex() {
            return this._householdIndex;
        }
        set householdIndex(index) {
            this._householdIndex = index;
        }
        get usualDaytimeEnvironment() {
            return this._usualDaytimeEnvironment;
        }
        set usualDaytimeEnvironment(env) {
            this._usualDaytimeEnvironment = env;
        }
        get isQuarantined() {
            return this._isQuarantined;
        }
        set isQuarantined(q) {
            this._isQuarantined = q;
        }
    }
    exports.Person = Person;
    ;
});
//# sourceMappingURL=Person.js.map