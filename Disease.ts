import { Status } from "./Status";
import { Time } from "./Time";
import { Stats } from "./Stats";
import { Person } from "./Person";
import { Model } from "./Model";

export class Disease {
    private _status: Status;
    private _time: Time;
    private _infectiousness: number;

    get Status(): Status {
        return this._status;
    }

    set Status(status:Status){
        if(status != this.Status){
            this._status = status;
            this._time.Reset();
        }
    }

    get Time(): Time {
        return this._time;
    }

    get Infectiousness(): number {
        return this._infectiousness;
    }

    constructor(status: Status, infectiousness: number = 0) {
        this._status = status;
        this._infectiousness = infectiousness;

    }

    static UpdatePersonsDisease(person: Person, model: Model) {

        if(person.Disease.Status == Status.Dead)
            return;

        person.Disease.Time.Tick();

        if (person.Disease.Status == Status.Clear) {
            return;
        }

        throw "Not implemented";
    }

}