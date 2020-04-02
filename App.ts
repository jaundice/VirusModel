import { EnvironmentType } from "./EnvironmentType";
import { Environment } from './Environment';
import { CleanStatusHandler, StatusHandler, AsymptomaticStatusHandler, SeriousStatusHandler, MildStatusHandler, DeadStatusHandler, RecoveredStatusHandler } from './StatusHandler';
import { Person } from './Person';
import { Stats } from './Stats';
import { AppInitConfig } from "./AppInitConfig";
import { Time } from "./Time";
import { Status } from "./Status";
import { List } from "./List";
import { Demographics, AgeDemographic } from './Demographic';
import { Model } from "./Model";
import { Households, Household } from "./Household";
import { Environments } from "./Environments";
import { People } from "./People";
import { HealthService } from "./HealthService";
import { TriggerBase, PolicyTrigger } from "./Trigger";
import { Policy } from "./Policy";
import { IsolateIllPeoplePolicy } from "./IsolateIllPeoplePolicy";
import { PolicyLockdown } from "./LockdownPolicy";
import { QuarantineHouseholdIfOneMemberIll as QuarantineHouseholdIfOneMemberIllPolicy } from "./QuarantineHouseholdIfOneMemberIllPolicy";
import { ProcativeTestingPolicy } from './ProcativeTestingPolicy';


export class App {

    private _model: Model;

    get Model(): Model {
        return this._model;
    }



    Init(config: AppInitConfig) {

        //create empty households

        var households: Households = new Households()

        for (var j = 0; j < config.NumberOfHouseholds; j++) {
            households.Households.add(new Household());
        }

        var environments: Environments = new Environments();
        var usualDaytimeEnv = new Map<Environment, List<Person>>();


        //create environments
        var interpersonalContactGenerator = (key: EnvironmentType) => Stats.Clamp(0, 1, Stats.getGaussianRandomGenerator(config.MeanInterpersonalContactFactors.get(key), config.MeanInterpersonalDeviation.get(key)));
        var keyInfrastructureGenerator = () => Stats.Clamp(0, 1, Stats.getGaussianRandomGenerator(0.5, 0.15));

        for (var k = 0; k < config.EnvironmentCount; k++) {

            var env = new Environment();
            env.EnvironmentType = Environments.GetRandomEnvironmentType();
            env.InterpersonalContactFactor = interpersonalContactGenerator(env.EnvironmentType);
            env.IsKeyInfrastructure = Stats.getUniform(0,1) < config.EnvironmentKeyWorkerRatio.get(env.EnvironmentType);
            environments.Add(env);
            usualDaytimeEnv.set(env, new List<Person>());

        }

        //create a generator that makes a random susceptability given the config mean and standard deviation
        //var susceptabilityGenerator = this.clamp(0, 1, Stats.getGaussianRandomGenerator(config.MeanPersonalSusceptability, config.PersonalSuceptabilityDeviation));

        //create temp structures to arrange environments

        var lstPeople = new List<Person>();

        //make the population
        // todo: ensure children are assigned to households with adults, 
        // assign adults to environments based on census data, add key healthcare professionals, delivery etc 
        for (var i = 0; i < config.PopulationSize; i++) {

            var ageDemograhic = Demographics.RandomAgeDemographic();
            var health = Demographics.GetRandomHealth(ageDemograhic);

            var person = new Person(ageDemograhic, health);

            //person.IsKeyWorker = keyInfrastructureGenerator() < 0.3;

            lstPeople.add(person);

            if (i < config.NumberOfHouseholds) { //ensure each household has a member
                households.Households.get(i).Members.add(person);
                person.HouseholdIndex = i;

            }
            else { //randomly assign remaining people to households
                var householdIndex = Math.trunc(Stats.getUniform(0, households.Households.size));
                households.Households.get(householdIndex).Members.add(person);
                person.HouseholdIndex = householdIndex;
            }


            if (person.AgeDemographic == AgeDemographic.Under10 || (person.AgeDemographic == AgeDemographic.Under20 && Stats.getUniform(0, 1) < 0.6)) { //assign children to schools
                var school = environments.GetEnvironmentsByType(EnvironmentType.School).get(Math.trunc(Stats.getUniform(0, environments.GetEnvironmentsByType(EnvironmentType.School).size)));
                usualDaytimeEnv.get(school)?.add(person);
                person.UsualDaytimeEnvironment = school;
            }
            else { //assign people to other environments

                var envo = environments.GetEnvironmentsByType(Environments.GetRandomEnvironmentType());

                var env = envo.get(Math.trunc(Stats.getUniform(0, envo.size)));// for now assign people uniformly across environments
                usualDaytimeEnv.get(env)?.add(person);
                person.UsualDaytimeEnvironment = env;

                person.IsKeyWorker = Stats.getUniform(0, 1) < config.EnvironmentKeyWorkerRatio.get(env.EnvironmentType);
            }
        }

        var healthService = new HealthService(config.MedicalStaffCount, config.AvailableBeds, config.AvailableICU, config.AvailableVentilators);

        var triggers: TriggerBase[] = new Array();
        var policies: Policy[] = new Array();

        var proactiveTesting = new ProcativeTestingPolicy(0.005);
        policies.push(proactiveTesting);

        var lockdown = new PolicyLockdown();
        policies.push(lockdown);

        var isolate = new IsolateIllPeoplePolicy();
        isolate.IsActive = true;
        policies.push(isolate);

        var quarantine = new QuarantineHouseholdIfOneMemberIllPolicy();
        quarantine.IsActive = true;
        policies.push(quarantine);

        var trgLockdown = new PolicyTrigger(lockdown, a => a.Result?.Counts.get(Status.Dead) > 4);
        triggers.push(trgLockdown);

        var trgProactive =  new PolicyTrigger(proactiveTesting, a=> a.Result?.Counts.get(Status.Dead)> 20);
        triggers.push(trgProactive);

        this._model = new Model(config, healthService, triggers, policies, new People(lstPeople), households, environments, usualDaytimeEnv);
    }


    TimeElapsed() {
        this._model.TimeElapsed();
    }
}



