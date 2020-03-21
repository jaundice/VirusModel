import { Model } from "./Model";

export class HealthService {
    private _availableMedicalStaff: number;
    private _availableBeds: number;
    private _availableICU: number;


    private _patientDemand: number;
    private _bedDemand: number;
    private _icuDemand: number;


    private _morbityFactor: number = 1;

    private _requiredPatientToMedicFactor = 4;


    private _medicsCritical: boolean;
    private _bedsCritical: boolean;
    private _icuCritical: boolean;

    constructor(availableMedicalStaff: number, availableBeds: number, availableICU: number) {
        this._availableMedicalStaff = availableMedicalStaff;
        this._availableBeds = availableBeds;
        this._availableICU = availableICU;
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

    get MedicsCritical() {
        return this._medicsCritical;
    }

    get BedsCritical() {
        return this._bedsCritical;
    }

    get ICUCritical() {
        return this._icuCritical;
    }

    //might need a better weighting 
    UpdateFactors() {
        var medicFactor = Math.max(1, this.PatientDemand / (this.AvailableMedicalStaff * this._requiredPatientToMedicFactor));
        var bedFactor = Math.max(1, this.BedDemand / this.AvailableBeds);
        var icuFactor = Math.max(1, this.ICUDemand / this.AvailableICU);

        this._medicsCritical = medicFactor > 1;
        this._bedsCritical = bedFactor > 1;
        this._icuCritical = icuFactor > 1;

        this._morbityFactor = Math.sqrt((medicFactor * medicFactor) + (bedFactor * bedFactor) + (icuFactor * icuFactor))
    }

    UpdateProperties(model:Model){
        
    }

}