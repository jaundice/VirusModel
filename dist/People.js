(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Demographic", "./EnvironmentType", "./Status", "./Disease"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Demographic_1 = require("./Demographic");
    const EnvironmentType_1 = require("./EnvironmentType");
    const Status_1 = require("./Status");
    const Disease_1 = require("./Disease");
    class People {
        constructor(people) {
            this._people = people;
        }
        UpdateDiseaseProgression(model) {
            this.AllPeople.forEach(p => {
                Disease_1.Disease.UpdateDiseaseProgression(p, model);
            });
        }
        get AllPeople() {
            return this._people;
        }
        ;
        static get KeyWorkerFilter() {
            return (p) => p.IsKeyWorker;
        }
        static get ChildFilter() {
            return (p) => p.AgeDemographic == Demographic_1.AgeDemographic.Under10;
        }
        static get OfficeWorkerFilter() {
            return (p) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Office;
        }
        static get LogisticWorkerFilter() {
            return (p) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Logistics;
        }
        static get FactoryWorkerFilter() {
            return (p) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Factory;
        }
        static get HospitalWorkerFilter() {
            return (p) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Hospital;
        }
        static get OutdoorsWorkerFilter() {
            return (p) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Outdoors;
        }
        static get RetailWorkerFilter() {
            return (p) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Retail;
        }
        static get SchoolFilter() {
            return (p) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.School;
        }
        static get EntertainmentWorkerFilter() {
            return (p) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Entertainment;
        }
        static get HomeWorkerFilter() {
            return (p) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Home;
        }
        static NoDiseasePersonFilter() {
            return (p) => [Status_1.Status.Clear, Status_1.Status.Recovered].find(a => a == p.Disease.Status) == p.Disease.Status;
        }
        static IncubatorsAndAsymptomaticPersonFilter() {
            return (p) => [Status_1.Status.Incubation, Status_1.Status.Asymptomatic].find(s => s == p.Disease.Status) == p.Disease.Status;
        }
        static DeadPersonFilter() {
            return (p) => p.Disease.Status == Status_1.Status.Dead;
        }
        static HospitalisedFilter() {
            return (p) => [Status_1.Status.MildlyIll, Status_1.Status.SeriouslyIll].find(s => s == p.Disease.Status) == p.Disease.Status;
        }
        static CombineAndFilters(filters) {
            return (p) => {
                return filters.every(a => a(p));
            };
        }
        static CombineAnyFilters(filters) {
            return (p) => {
                return filters.some(a => a(p));
            };
        }
    }
    exports.People = People;
});
//# sourceMappingURL=People.js.map