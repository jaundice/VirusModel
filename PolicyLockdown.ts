import { RunningConfig } from './RunningConfig';
import { Person } from './Person';
import { Environment } from './Environment';
import { Model } from './Model';
import { EnvironmentType } from './EnvironmentType';
import { Stats } from './Stats';
import { Policy } from './Policy';
export class PolicyLockdown extends Policy {
    protected ModifyRunningConfigInternal(runningConfig: RunningConfig): RunningConfig {
        return runningConfig;
    }
    protected CanPeopleMeetInEnvironmentInternal(person1: Person, person2: Person, model: Model, environment: Environment): boolean {
        switch (environment.EnvironmentType) {
            case EnvironmentType.Home:
                return person1.HouseholdIndex == person2.HouseholdIndex;
            default:
                return environment.IsKeyInfrastructure || Stats.getUniform(0, 1) > this.PublicAdherance;
        }
    }
}
