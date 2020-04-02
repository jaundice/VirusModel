import { RunningConfig } from './RunningConfig';
import { Person } from './Person';
import { Environment } from './Environment';
import { Model } from './Model';
import { Status } from './Status';
import { Policy } from './Policy';
export class QuarantineHouseholdIfOneMemberIll extends Policy {
    public UpdateModel(model: Model): void {
        
    }
    protected ModifyRunningConfigInternal(runningConfig: RunningConfig): RunningConfig {
        return runningConfig;
    }
    protected CanPeopleMeetInEnvironmentInternal(person1: Person, person2: Person, model: Model, environment: Environment): boolean {
        return !model.Households.Households.get(person1.HouseholdIndex).Members.any(a => [Status.MildlyIll, Status.SeriouslyIll].indexOf(a.Disease.Status) > 1 || (a.Disease.Status == Status.Recovered && a.Disease.Time.Day < 14));
    }
}
