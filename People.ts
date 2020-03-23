import { List } from "./List";
import { Person } from "./Person";
import { AgeDemographic } from "./Demographic";
import { EnvironmentType } from "./EnvironmentType";
import { Status } from "./Status";

export class People {

    private _people: List<Person>;


    get AllPeople() {
        return this._people;
    }

    constructor(people: List<Person>) {
        this._people = people;
    };

    static get KeyWorkerFilter(): (p: Person) => boolean {
        return (p: Person) => p.IsKeyWorker;
    }

    static get ChildFilter(): (p: Person) => boolean {
        return (p: Person) => p.AgeDemographic == AgeDemographic.Under10;
    }

    static get OfficeWorkerFilter(): (p: Person) => boolean {
        return (p: Person) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Office;
    }

    static get LogisticWorkerFilter(): (p: Person) => boolean {
        return (p: Person) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Logistics;
    }

    static get FactoryWorkerFilter(): (p: Person) => boolean {
        return (p: Person) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Factory;
    }

    static get HospitalWorkerFilter(): (p: Person) => boolean {
        return (p: Person) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Hospital;
    }

    static get OutdoorsWorkerFilter(): (p: Person) => boolean {
        return (p: Person) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Outdoors;
    }

    static get RetailWorkerFilter(): (p: Person) => boolean {
        return (p: Person) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Retail;
    }

    static get SchoolFilter(): (p: Person) => boolean {
        return (p: Person) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.School;
    }

    static get EntertainmentWorkerFilter(): (p: Person) => boolean {
        return (p: Person) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Entertainment;
    }

    static get HomeWorkerFilter(): (p: Person) => boolean {
        return (p: Person) => p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Home;
    }

    static NoDiseasePersonFilter(): (p: Person) => boolean {
        return (p: Person) => [Status.Clear, Status.Recovered].find(a => a == p.Disease.Status) == p.Disease.Status;
    }

    static IncubatorsAndAsymptomaticPersonFilter(): (p: Person) => boolean {
        return (p: Person) => [Status.Incubation, Status.Asymptomatic].find(s => s == p.Disease.Status) == p.Disease.Status;
    }

    static DeadPersonFilter(): (p: Person) => boolean {
        return (p: Person) => p.Disease.Status == Status.Dead;
    }

    static HospitalisedFilter(): (p: Person) => boolean {
        return (p: Person) => [Status.MildlyIll, Status.SeriouslyIll].find(s => s == p.Disease.Status) == p.Disease.Status;
    }

    static CombineAndFilters(filters: ((p: Person) => boolean)[]): (p: Person) => boolean {
        return (p: Person) => {
            return filters.every(a => a(p));
        };
    }
    
    static CombineAnyFilters(filters: ((p: Person) => boolean)[]): (p: Person) => boolean {
        return (p: Person) => {
            return filters.some(a => a(p));
        };
    }

}