(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Status", "./EnvironmentType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Status_1 = require("./Status");
    const EnvironmentType_1 = require("./EnvironmentType");
    class HealthService {
        constructor(availableMedicalStaff, availableBeds, availableICU, availableVentilators) {
            this._morbityFactor = 1;
            this._requiredPatientToMedicFactor = 4;
            this._availableMedicalStaff = availableMedicalStaff;
            this._availableBeds = availableBeds;
            this._availableICU = availableICU;
            this._availableVentilators = availableVentilators;
        }
        get AvailableMedicalStaff() {
            return this._availableMedicalStaff;
        }
        get AvailableBeds() {
            return this._availableBeds;
        }
        get AvailableICU() {
            return this._availableICU;
        }
        get AvailableVentilators() {
            return this._availableVentilators;
        }
        get MorbidityFactor() {
            return this._morbityFactor;
        }
        get PatientDemand() {
            return this._patientDemand;
        }
        get BedDemand() {
            return this._bedDemand;
        }
        get ICUDemand() {
            return this._icuDemand;
        }
        get VentilatorDemand() {
            return this._ventilatorDemand;
        }
        get MedicsCritical() {
            return this._medicsCritical;
        }
        get BedsCritical() {
            return this._bedsCritical;
        }
        get ICUCritical() {
            return this._icuCritical;
        }
        get VentilatorsCritical() {
            return this._ventilatorsCritical;
        }
        //might need a better weighting 
        UpdateFactors() {
            var medicFactor = Math.max(1, this.PatientDemand / (this.AvailableMedicalStaff * this._requiredPatientToMedicFactor));
            var bedFactor = Math.max(1, this.BedDemand / this.AvailableBeds);
            var icuFactor = Math.max(1, this.ICUDemand / this.AvailableICU);
            var ventilatorFactor = Math.max(1, this.VentilatorDemand / this.AvailableVentilators);
            this._medicsCritical = medicFactor > 1;
            this._bedsCritical = bedFactor > 1;
            this._icuCritical = icuFactor > 1;
            this._ventilatorsCritical = ventilatorFactor > 1;
            this._morbityFactor = Math.sqrt((medicFactor * medicFactor) +
                (bedFactor * bedFactor) +
                (icuFactor * icuFactor) +
                (ventilatorFactor * ventilatorFactor)) / 2; /* divided by 2 to give morbidity factor of 1 if all other factors are also 1 */
        }
        UpdateProperties(model) {
            var _a, _b, _c, _d, _e, _f;
            this._patientDemand = ((_a = model.Result) === null || _a === void 0 ? void 0 : _a.Counts.get(Status_1.Status.SeriouslyIll)) + (0.5 * ((_b = model.Result) === null || _b === void 0 ? void 0 : _b.Counts.get(Status_1.Status.MildlyIll)));
            this._bedDemand = ((_c = model.Result) === null || _c === void 0 ? void 0 : _c.Counts.get(Status_1.Status.SeriouslyIll)) + 0.3 * ((_d = model.Result) === null || _d === void 0 ? void 0 : _d.Counts.get(Status_1.Status.MildlyIll));
            this._icuDemand = (_e = model.Result) === null || _e === void 0 ? void 0 : _e.Counts.get(Status_1.Status.SeriouslyIll);
            this._ventilatorDemand = (_f = model.Result) === null || _f === void 0 ? void 0 : _f.Counts.get(Status_1.Status.SeriouslyIll);
            this._availableMedicalStaff = model.People.AllPeople.filter(p => p.IsKeyWorker && p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Hospital && [Status_1.Status.Clear, Status_1.Status.Recovered].indexOf(p.Disease.Status) > -1).size;
        }
    }
    exports.HealthService = HealthService;
});
//# sourceMappingURL=HealthService.js.map