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
    class Policies {
        constructor() {
            this._policies = new List_1.List();
        }
        AddPolicy(policy) {
            this._policies.add(policy);
        }
        ApplyPolicies(runningConfig) {
            var c = runningConfig;
            for (var i = 0; i < this._policies.size; i++) {
                c = this._policies.get(i).ModifyRunningConfig(c);
            }
            ;
            return c;
        }
        CanPeopleMeetInEnvironment(person1, person2, model, environment) {
            return this._policies.all(p => p.CanPeopleMeetInEnvironment(person1, person2, model, environment));
        }
    }
    exports.Policies = Policies;
});
//# sourceMappingURL=Policies.js.map