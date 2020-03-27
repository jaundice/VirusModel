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
    class Policy {
        constructor() {
            this._publicAdherance = 1;
        }
        get IsActive() {
            return this._isActive;
        }
        set IsActive(active) {
            this._isActive = active;
        }
        get PublicAdherance() {
            return this._publicAdherance;
        }
        set PublicAdherance(adherance) {
            this._publicAdherance = adherance;
        }
        ModifyRunningConfig(runningConfig) {
            if (!this.IsActive) {
                return runningConfig;
            }
            return this.ModifyRunningConfigInternal(runningConfig);
        }
        CanPeopleMeetInEnvironment(person1, person2, model, environment) {
            if (!this.IsActive)
                return true;
            return this.CanPeopleMeetInEnvironmentInternal(person1, person2, model, environment);
        }
    }
    exports.Policy = Policy;
});
//# sourceMappingURL=Policy.js.map