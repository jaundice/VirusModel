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
    class BasicHealth {
        constructor(heartDisease, asthma, autoImmune, diabetes, cancer) {
            this._heartdisease = heartDisease;
            this._asthma = asthma;
            this._autoImmune = autoImmune;
            this._diabetes = diabetes;
            this._cancer = cancer;
            var neg = 0;
            if (this.HasAsthma) {
                neg += 1.073 * 1.073;
            }
            if (this.HasAutoImmune || this.HasCancer) {
                neg += 1.056 * 1.056;
            }
            // if (this.HasCancer) {
            //     neg += 100;
            // }
            if (this.HasDiabetes) {
                neg += 1.063 * 1.063;
            }
            if (this.HasHeartDisease) {
                neg += 1.106 * 1.106;
            }
            this._healthScore = 1 - (Math.sqrt(neg) / 2.1493);
        }
        /* breaking these out in case futher info becomes available about relative outcomes */
        get HasCancer() {
            return this._cancer;
        }
        get HasDiabetes() {
            return this._diabetes;
        }
        get HasAutoImmune() {
            return this._autoImmune;
        }
        get HasAsthma() {
            return this._asthma;
        }
        get HasHeartDisease() {
            return this._heartdisease;
        }
        get HealthScore() {
            return this._healthScore;
        }
    }
    exports.BasicHealth = BasicHealth;
});
//# sourceMappingURL=Health.js.map