import { Model } from "./Model";
import { Status } from "./Status";
import { EnvironmentType } from "./EnvironmentType";

export class HealthService {
    private _availableMedicalStaff: number;
    private _availableBeds: number;
    private _availableICU: number;
    private _availableVentilators: number


    private _patientDemand: number;
    private _bedDemand: number;
    private _icuDemand: number;
    private _ventilatorDemand: number;

    private _morbityFactor: number = 1;

    private _requiredPatientToMedicFactor = 4;


    private _medicsCritical: boolean;
    private _bedsCritical: boolean;
    private _icuCritical: boolean;
    private _ventilatorsCritical: boolean;

    constructor(availableMedicalStaff: number, availableBeds: number, availableICU: number, availableVentilators: number) {
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
        this._morbityFactor = Math.sqrt(
                                        (medicFactor * medicFactor) + 
                                        (bedFactor * bedFactor) + 
                                        (icuFactor * icuFactor) + 
                                        (ventilatorFactor * ventilatorFactor)
                                        )/ 2; /* divided by 2 to give morbidity factor of 1 if all other factors are also 1 */
    }

    UpdateProperties(model: Model) {
        this._patientDemand = model.Result?.Counts.get(Status.SeriouslyIll) + (0.5* model.Result?.Counts.get(Status.MildlyIll)); 
        this._bedDemand = model.Result?.Counts.get(Status.SeriouslyIll) + 0.3*model.Result?.Counts.get(Status.MildlyIll);
        this._icuDemand = model.Result?.Counts.get(Status.SeriouslyIll);
        this._ventilatorDemand = model.Result?.Counts.get(Status.SeriouslyIll);
        this._availableMedicalStaff = model.People.AllPeople.filter(p=> p.IsKeyWorker && p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Hospital && [Status.Clear, Status.Recovered].indexOf(p.Disease.Status)> -1 ).size;
    }

}