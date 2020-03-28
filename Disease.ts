import { Status } from "./Status";
import { Time } from "./Time";
import { Person } from "./Person";
import { Model } from "./Model";
import { Stats } from "./Stats";
import { AgeDemographic } from "./Demographic";

export class Disease {
    private _status: Status;
    private _time: Time = new Time();
    private _infectiousness: number;

    get Status(): Status {
        return this._status;
    }

    set Status(status: Status) {
        if (status != this.Status) {
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

    set Infectiousness(infection: number) {
        this._infectiousness = infection;
    }

    constructor(status: Status, infectiousness: number = 0) {
        this._status = status;
        this._infectiousness = infectiousness;

    }

    private static gauss = Stats.getGaussianRandomGenerator(0.5, 0.2);
    private static randGen = () => Stats.Clamp(0, 1, Disease.gauss);
    //private static randGen = () => Stats.getUniform(0, 1);


    static UpdateDiseaseProgression(person: Person, model: Model) {

        var d = person.Disease;

        if (d.Status == Status.Dead) {
            d.Infectiousness = 0;
            return;
        }
        d.Time.Tick();

        switch (d.Status) {

            //case Status.Dead:
            case Status.Clear:
            case Status.Recovered: {
                d.Infectiousness = 0;
                break;
            }
            case Status.Incubation: {
                d.Infectiousness = 1;
                if (d.Time.Day > 5 && Stats.getGaussianRandomGenerator(0.5, 0.2)() > 0.5) {
                    if (this.randGen() < 0.2 / 24) {
                        d.Status = Status.MildlyIll;
                        d.Infectiousness = 0.6;
                    }
                    else {
                        d.Status = Status.Asymptomatic;
                        d.Infectiousness = 0.3;
                    }
                }
                break;
            }
            case Status.Asymptomatic: {
                if (d.Time.Day > 7) {
                    if (this.randGen() < 0.5 /24 && this.randGen() * this.AgeFactor(person.AgeDemographic) < person.Health.HealthScore) {
                        d.Status = Status.Recovered;
                        d.Infectiousness = 0;
                        break;
                    }
                }
                else if (this.randGen() < 0.5 /24 && this.randGen() * this.AgeFactor(person.AgeDemographic) > person.Health.HealthScore) {
                    var day = d.Time.Day;
                    var hour = d.Time.Hour;

                    d.Status = Status.MildlyIll;
                    d.Infectiousness = 0.6;
                    d.Time.Day = day;
                    d.Time.Hour = hour;
                    break;
                }


                d.Infectiousness = d.Time.Day < 7 ? 0.6 : 0.3;
                break;

            }
            case Status.MildlyIll:
                {

                    if (d.Time.Day > 7 && Stats.getGaussianRandomGenerator(0.5, 0.2)() < 0.8 / 24) {
                        d.Status = Status.Recovered;
                        d.Infectiousness = 0;
                        break;
                    } else if (Stats.getGaussianRandomGenerator(0.5, 0.2)() < 0.2 / 24 && this.randGen() * this.AgeFactor(person.AgeDemographic) > person.Health.HealthScore) {
                        var day = d.Time.Day;
                        var hour = d.Time.Hour;

                        d.Status = Status.SeriouslyIll;
                        d.Infectiousness = 0.6
                        d.Time.Day = day;
                        d.Time.Hour = hour;
                        break;
                    }

                    if (d.Time.Day < 7) {
                        d.Infectiousness = 0.6;
                    } else {
                        d.Infectiousness = 0.3;
                    }
                    break;
                }
            case Status.SeriouslyIll: {
                if (d.Time.Day > 7 && Stats.getGaussianRandomGenerator(0.5, 0.2)() < 0.5 / 24) {
                    d.Status = Status.Recovered;
                    d.Infectiousness = 0;
                    break;
                }
                else if (d.Time.Day > 3 && Stats.getGaussianRandomGenerator(0.5, 0.2)() < 0.5 / 24) {
                    if ( this.randGen() < 0.5 /24 && this.randGen() * this.AgeFactor(person.AgeDemographic) * model.HealthService.MorbidityFactor > person.Health.HealthScore) {
                        d.Status = Status.Dead;
                        d.Infectiousness = 0;
                        break;
                    }
                }
                d.Infectiousness = 0.3;
                break;

            }
        }
    }

    private static AgeFactor(ageDemographic: AgeDemographic) {
        var af: number = 0;
        switch (ageDemographic) {
            case AgeDemographic.Under10:
                af = 0.1; break;
            case AgeDemographic.Under20:
                af = 0.2; break;
            case AgeDemographic.Under30:
                af = 0.3; break;
            case AgeDemographic.Under40:
                af = 0.4; break;
            case AgeDemographic.Under50:
                af = 0.5; break;
            case AgeDemographic.Under60:
                af = 0.6; break;
            case AgeDemographic.Under70:
                af = 0.7; break;
            case AgeDemographic.Under80:
                af = 0.8; break;
            default:
                af = 0.9; break;
        }

        return af * af;
    }

}