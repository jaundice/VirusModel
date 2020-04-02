import { RunningConfig } from './RunningConfig';
import { Person } from './Person';
import { Environment } from './Environment';
import { Model } from './Model';
import { Status } from './Status';
import { Policy } from './Policy';
export class IsolateIllPeoplePolicy extends Policy {
    public UpdateModel(model: Model): void {
       
    }
    protected ModifyRunningConfigInternal(runningConfig: RunningConfig): RunningConfig {
        return runningConfig;
    }
    protected CanPeopleMeetInEnvironmentInternal(person1: Person, person2: Person, model: Model, environment: Environment): boolean {
        return !(person2.Disease.Status == Status.MildlyIll || person2.Disease.Status == Status.SeriouslyIll);
    }
}
