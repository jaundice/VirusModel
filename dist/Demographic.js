(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Stats", "./Health"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Stats_1 = require("./Stats");
    const Health_1 = require("./Health");
    class Demographics {
        static get UKPopulation() {
            return 67886011;
        }
        /* naieve attempt at skewing illness towards the older people.
        This is will alter the overall profile but might represent different age ranges
        better where there is no public data I can find */
        static GetAgeFactor(ageDemographic) {
            var f;
            switch (ageDemographic) {
                case AgeDemographic.Under10:
                    f = 1;
                    break;
                case AgeDemographic.Under20:
                    f = 2;
                    break;
                case AgeDemographic.Under30:
                    f = 3;
                    break;
                case AgeDemographic.Under40:
                    f = 4;
                    break;
                case AgeDemographic.Under50:
                    f = 5;
                    break;
                case AgeDemographic.Under60:
                    f = 6;
                    break;
                case AgeDemographic.Under70:
                    f = 7;
                    break;
                case AgeDemographic.Under80:
                    f = 8;
                    break;
                default:
                    f = 10;
                    break;
            }
            return (f * f) / 100;
        }
        static GetRandomHealth(ageDemographic) {
            var ageFactor = Demographics.GetAgeFactor(ageDemographic);
            var heartdisease = ageFactor * Demographics._heartDiseaseProportion < Stats_1.Stats.getUniform(0, 1);
            var asthma = ageFactor * Demographics._asthma < Stats_1.Stats.getUniform(0, 1);
            var autoImmune = ageFactor * Demographics._autoImmune < Stats_1.Stats.getUniform(0, 1);
            var diabetes = ageFactor * Demographics._diabetes < Stats_1.Stats.getUniform(0, 1);
            var cancer = ageFactor * Demographics._cancer < Stats_1.Stats.getUniform(0, 1);
            return new Health_1.BasicHealth(heartdisease, asthma, autoImmune, diabetes, cancer);
        }
        /* creates an age based on the age distribution of the UK */
        static RandomAgeDemographic() {
            var rnd = Stats_1.Stats.getUniform(0, 100);
            if (rnd < 11.8) {
                return AgeDemographic.Under10;
            }
            else if (rnd < 24.65) {
                return AgeDemographic.Under20; // inferred from avg u30 & u10
            }
            else if (rnd < 37.5) {
                return AgeDemographic.Under30;
            }
            else if (rnd < 50.8) {
                return AgeDemographic.Under40;
            }
            else if (rnd < 65.4) {
                return AgeDemographic.Under50;
            }
            else if (rnd < 77.5) {
                return AgeDemographic.Under60;
            }
            else if (rnd < 88.3) {
                return AgeDemographic.Under70;
            }
            else if (rnd < 95.4) {
                return AgeDemographic.Under80;
            }
            else {
                return AgeDemographic.Over80;
            }
        }
    }
    exports.Demographics = Demographics;
    Demographics._heartDiseaseProportion = 7400000 / Demographics.UKPopulation;
    Demographics._asthma = 5400000 / Demographics.UKPopulation;
    Demographics._autoImmune = 4000000 / Demographics.UKPopulation;
    Demographics._diabetes = 3900000 / Demographics.UKPopulation;
    Demographics._cancer = 2900000 / Demographics.UKPopulation;
    var AgeDemographic;
    (function (AgeDemographic) {
        AgeDemographic[AgeDemographic["Under10"] = 0] = "Under10";
        AgeDemographic[AgeDemographic["Under20"] = 1] = "Under20";
        AgeDemographic[AgeDemographic["Under30"] = 2] = "Under30";
        AgeDemographic[AgeDemographic["Under40"] = 3] = "Under40";
        AgeDemographic[AgeDemographic["Under50"] = 4] = "Under50";
        AgeDemographic[AgeDemographic["Under60"] = 5] = "Under60";
        AgeDemographic[AgeDemographic["Under70"] = 6] = "Under70";
        AgeDemographic[AgeDemographic["Under80"] = 7] = "Under80";
        AgeDemographic[AgeDemographic["Over80"] = 8] = "Over80";
    })(AgeDemographic = exports.AgeDemographic || (exports.AgeDemographic = {}));
});
//# sourceMappingURL=Demographic.js.map