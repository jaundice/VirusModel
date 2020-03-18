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
    class Stats {
        static getGaussianRandomGenerator(mean, standardDeviation) {
            return () => {
                let q, u, v, p;
                do {
                    u = 2.0 * Math.random() - 1.0;
                    v = 2.0 * Math.random() - 1.0;
                    q = u * u + v * v;
                } while (q >= 1.0 || q === 0);
                p = Math.sqrt(-2.0 * Math.log(q) / q);
                return mean + standardDeviation * u * p;
            };
        }
        static getUniform(min, max) {
            return (Math.random() * (max - min)) + min;
        }
    }
    exports.Stats = Stats;
    ;
});
//# sourceMappingURL=Stats.js.map