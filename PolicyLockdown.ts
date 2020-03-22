import { RunningConfig } from './RunningConfig';
import { Person } from './Person';
import { Environment } from './Environment';
import { Model } from './Model';
import { EnvironmentType } from './EnvironmentType';
import { Stats } from './Stats';
import { Policy } from './Policy';
import { AgeDemographic } from './Demographic';
export class PolicyLockdown extends Policy {
    protected ModifyRunningConfigInternal(runningConfig: RunningConfig): RunningConfig {
        return runningConfig;
    }
    protected CanPeopleMeetInEnvironmentInternal(person1: Person, person2: Person, model: Model, environment: Environment): boolean {
        switch (environment.EnvironmentType) {
            case EnvironmentType.Home:
                return person1.HouseholdIndex == person2.HouseholdIndex;
            case EnvironmentType.School:
                {
                    if(person1.UsualDaytimeEnvironment != environment || person2.UsualDaytimeEnvironment !=environment)
                        return false;

                    if (person1.AgeDemographic == AgeDemographic.Under10) {
                        if (!model.Households.Households.get(person1.HouseholdIndex).Members.any(a => a.IsKeyWorker))
                            return false;
                    }                    
                    if (person2.AgeDemographic == AgeDemographic.Under10) {
                        if (!model.Households.Households.get(person2.HouseholdIndex).Members.any(a => a.IsKeyWorker))
                            return false;
                    }
                    return true;
                }
            default:
                return environment.IsKeyInfrastructure || Stats.getUniform(0, 1) > this.PublicAdherance;
        }
    }
}
