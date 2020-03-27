(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./List"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const List_1 = require("./List");
    class Household {
        constructor() {
            this._members = new List_1.List();
        }
        get Members() {
            return this._members;
        }
    }
    exports.Household = Household;
    class Households {
        constructor() {
            this._households = new List_1.List();
        }
        get Households() {
            return this._households;
        }
    }
    exports.Households = Households;
});
//# sourceMappingURL=Household.js.map