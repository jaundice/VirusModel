import { RunningConfig } from './RunningConfig';
import { Person } from './Person';
import { Environment } from './Environment';
import { Model } from './Model';
import { Policy } from './Policy';
import { Status } from './Status';
import { Stats } from './Stats';

export class ProcativeTestingPolicy extends Policy {
    public UpdateModel(model: Model): void {

             model.People.AllPeople.filter(a => [Status.Asymptomatic, Status.Incubation].indexOf(a.Disease.Status) > -1).forEach(b => {

                if (Stats.getUniform(0, 1) < this._testingRatio) {
                    var infectiousness = b.Disease.Infectiousness;
                    b.Disease.Status = Status.MildlyIll; // disease has been identified and the person can be isolated early
                    b.Disease.Infectiousness = infectiousness;
                }
            });
    }


    private _testingRatio: number;

    constructor(testingRatio: number) {
        super();

        this._testingRatio = testingRatio;
    }
    protected ModifyRunningConfigInternal(runningConfig: RunningConfig): RunningConfig {
        return runningConfig;
    }
    protected CanPeopleMeetInEnvironmentInternal(person1: Person, person2: Person, model: Model, environment: Environment): boolean {
        return true;
    }

}
