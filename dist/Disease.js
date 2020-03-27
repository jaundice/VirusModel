(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Status", "./Time", "./Stats", "./Demographic"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Status_1 = require("./Status");
    const Time_1 = require("./Time");
    const Stats_1 = require("./Stats");
    const Demographic_1 = require("./Demographic");
    class Disease {
        constructor(status, infectiousness = 0) {
            this._time = new Time_1.Time();
            this._status = status;
            this._infectiousness = infectiousness;
        }
        get Status() {
            return this._status;
        }
        set Status(status) {
            if (status != this.Status) {
                this._status = status;
                this._time.Reset();
            }
        }
        get Time() {
            return this._time;
        }
        get Infectiousness() {
            return this._infectiousness;
        }
        set Infectiousness(infection) {
            this._infectiousness = infection;
        }
        static UpdateDiseaseProgression(person, model) {
            var d = person.Disease;
            if (d.Status == Status_1.Status.Dead) {
                d.Infectiousness = 0;
                return;
            }
            d.Time.Tick();
            switch (d.Status) {
                //case Status.Dead:
                case Status_1.Status.Clear:
                case Status_1.Status.Recovered: {
                    d.Infectiousness = 0;
                    break;
                }
                case Status_1.Status.Incubation: {
                    d.Infectiousness = 1;
                    if (d.Time.Day > Stats_1.Stats.getGaussianRandomGenerator(7, 1.5)()) {
                        if (this.randGen() > 0.8) {
                            d.Status = Status_1.Status.MildlyIll;
                            d.Infectiousness = 0.6;
                        }
                        else {
                            d.Status = Status_1.Status.Asymptomatic;
                            d.Infectiousness = 0.3;
                        }
                    }
                    break;
                }
                case Status_1.Status.Asymptomatic: {
                    if (d.Time.Day > 7) {
                        if ((d.Time.Day > 14) || this.randGen() * this.AgeFactor(person.AgeDemographic) < person.Health.HealthScore) {
                            d.Status = Status_1.Status.Recovered;
                            d.Infectiousness = 0;
                            break;
                        }
                    }
                    else if (this.randGen() * this.AgeFactor(person.AgeDemographic) > person.Health.HealthScore) {
                        var day = d.Time.Day;
                        var hour = d.Time.Hour;
                        d.Status = Status_1.Status.MildlyIll;
                        d.Infectiousness = 0.6;
                        d.Time.Day = day;
                        d.Time.Hour = hour;
                        break;
                    }
                    d.Infectiousness = d.Time.Day < 7 ? 1 : 0.6;
                    break;
                }
                case Status_1.Status.MildlyIll:
                    {
                        if (this.randGen() * this.AgeFactor(person.AgeDemographic) > person.Health.HealthScore) {
                            d.Status = Status_1.Status.SeriouslyIll;
                            d.Infectiousness = 0.6;
                            break;
                        }
                        if (d.Time.Day > 14) {
                            d.Status = Status_1.Status.Recovered;
                            d.Infectiousness = 0;
                        }
                        if (d.Time.Day < 7) {
                            d.Infectiousness = 0.6;
                        }
                        else {
                            d.Infectiousness = 0.3;
                        }
                        break;
                    }
                case Status_1.Status.SeriouslyIll: {
                    if (d.Time.Day > Stats_1.Stats.getGaussianRandomGenerator(7, 1.5)()) {
                        if (this.randGen() * this.AgeFactor(person.AgeDemographic) * model.HealthService.MorbidityFactor > person.Health.HealthScore) {
                            d.Status = Status_1.Status.Dead;
                            d.Infectiousness = 0;
                            break;
                        }
                    }
                    else if (d.Time.Day > 21) {
                        d.Status = Status_1.Status.Recovered;
                        d.Infectiousness = 0;
                        break;
                    }
                    d.Infectiousness = 0.5;
                    break;
                }
            }
        }
        static AgeFactor(ageDemographic) {
            var af = 0;
            switch (ageDemographic) {
                case Demographic_1.AgeDemographic.Under10:
                    af = 0.1;
                    break;
                case Demographic_1.AgeDemographic.Under20:
                    af = 0.2;
                    break;
                case Demographic_1.AgeDemographic.Under30:
                    af = 0.3;
                    break;
                case Demographic_1.AgeDemographic.Under40:
                    af = 0.4;
                    break;
                case Demographic_1.AgeDemographic.Under50:
                    af = 0.5;
                    break;
                case Demographic_1.AgeDemographic.Under60:
                    af = 0.6;
                    break;
                case Demographic_1.AgeDemographic.Under70:
                    af = 0.7;
                    break;
                case Demographic_1.AgeDemographic.Under80:
                    af = 0.8;
                    break;
                default:
                    af = 0.9;
                    break;
            }
            return af * af;
        }
    }
    exports.Disease = Disease;
    Disease.gauss = Stats_1.Stats.getGaussianRandomGenerator(0.5, 0.15);
    Disease.randGen = () => Stats_1.Stats.Clamp(0, 1, Disease.gauss); //()=>Stats.getUniform(0,1); 
});
//# sourceMappingURL=Disease.js.map