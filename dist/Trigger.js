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
    class TriggerBase {
    }
    exports.TriggerBase = TriggerBase;
    class PolicyTrigger extends TriggerBase {
        constructor(policy, shouldFireDelegate) {
            super();
            this._policy = policy;
            this._shouldFireDelegate = shouldFireDelegate;
        }
        ShouldFire(model) {
            return this._shouldFireDelegate(model);
        }
        FireInternal(model) {
            this._policy.IsActive = this.ShouldFire(model);
        }
        Fire(model) {
            this.FireInternal(model);
        }
        get Policy() {
            return this._policy;
        }
    }
    exports.PolicyTrigger = PolicyTrigger;
});
//# sourceMappingURL=Trigger.js.map