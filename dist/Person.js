(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Disease", "./Status"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Disease_1 = require("./Disease");
    const Status_1 = require("./Status");
    class Person {
        constructor(ageDemographic, health) {
            this._disease = new Disease_1.Disease(Status_1.Status.Clear);
            this._health = health;
            this._ageDemographic = ageDemographic;
        }
        get Disease() {
            return this._disease;
        }
        set Disease(disease) {
            this._disease = disease;
        }
        get IsKeyWorker() {
            return this._isKeyWorker;
        }
        set IsKeyWorker(iskey) {
            this._isKeyWorker = iskey;
        }
        get AgeDemographic() {
            return this._ageDemographic;
        }
        get Health() {
            return this._health;
        }
        get Susceptability() {
            return 1.0 - this.Health.HealthScore; //this._susceptability;
        }
        // set susceptability(susceptability: number) {
        //     this._susceptability = susceptability;
        // }
        get HouseholdIndex() {
            return this._householdIndex;
        }
        set HouseholdIndex(index) {
            this._householdIndex = index;
        }
        get UsualDaytimeEnvironment() {
            return this._usualDaytimeEnvironment;
        }
        set UsualDaytimeEnvironment(env) {
            this._usualDaytimeEnvironment = env;
        }
        get IsQuarantined() {
            return this._isQuarantined;
        }
        set IsQuarantined(q) {
            this._isQuarantined = q;
        }
    }
    exports.Person = Person;
    ;
});
//# sourceMappingURL=Person.js.map