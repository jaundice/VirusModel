import { HealthService } from "./HealthService";
import { Policies } from "./Policies";
import { Triggers } from "./Triggers";
import { RunningConfig } from "./RunningConfig";
import { Result } from "./Result";
import { TriggerBase } from "./Trigger";
import { Policy } from "./Policy";
import { Households } from "./Household";
import { People } from "./People";
import { AppInitConfig } from "./AppInitConfig";
import { Time } from "./Time";
import { Person } from "./Person";
import { Status } from "./Status";
import { Stats } from "./Stats";
import { EnvironmentType } from "./EnvironmentType";
import { Environments } from "./Environments";
import { Environment } from "./Environment";
import { List } from "./List";
import { AgeDemographic } from "./Demographic";

export class Model {
    private _healthService: HealthService;
    private _policies: Policies = new Policies();
    private _triggers: Triggers = new Triggers();
    private _runningConfig: RunningConfig;
    private _households: Households;
    private _people: People;
    private _environments: Environments;
    private _initConfig: AppInitConfig;
    private _time: Time = new Time();
    private _result: Result;
    private _usualDaytimeEnvironmentMap: Map<Environment, List<Person>>;

    get UsualDaytimeEnvironmentMap() {
        return this._usualDaytimeEnvironmentMap;
    }

    get Households() {
        return this._households;
    }

    get Result(): Result {
        return this._result;
    }

    get RunningConfig(): RunningConfig {
        return this._runningConfig;
    }

    get HealthService() {
        return this._healthService;
    }

    get People() {
        return this._people;
    }

    get Time() {
        return this._time;
    }

    get Environments(): Environments {
        return this._environments;
    }

    constructor(appInitConfig: AppInitConfig,
        healthService: HealthService,
        triggers: TriggerBase[],
        policies: Policy[],
        people: People,
        households: Households,
        environments: Environments,
        daytimeEnvironmentMap: Map<Environment, List<Person>>) {

        this._initConfig = appInitConfig;
        this._healthService = healthService;
        this._people = people;
        this._households = households;
        this._environments = environments;
        this._usualDaytimeEnvironmentMap = daytimeEnvironmentMap;

        for (var i = 0; i < triggers.length; i++) {
            this._triggers.AddTrigger(triggers[i]);
        }
        for (var j = 0; j < policies.length; j++) {
            this._policies.AddPolicy(policies[j]);
        }

    }

    private UpdateModel() {
        this._time.Tick();
        this._triggers.FireTriggers(this);
        this._runningConfig = this._policies.ApplyPolicies(new RunningConfig(this._initConfig));
        this._healthService.UpdateProperties(this);
        this._healthService.UpdateFactors();
        this._people.UpdateDiseaseProgression(this);
    }

    private UpdateResult() {
        var res = new Result()
        this._people.AllPeople.aggregate(res, (a, b) => {
            b.Counts.set(a.Disease.Status, b.Counts.get(a.Disease.Status) + 1);
            return res;
        });
        this._result = res;
    }

    TimeElapsed() {
        this.UpdateModel();
        this.DoTimeInterval();
        this.UpdateResult();
    }


    private DoTimeInterval() {
        if (this.Time.Hour < 9) {
            // home
            this.DoHousehold();
        }
        else if (this.Time.Hour < 13) {
            // morning work / school
            this.DoMorning();
        }
        else if (this.Time.Hour < 14) {
            // lunch 
            this.DoLunch();
        }
        else if (this.Time.Hour < 15) {
            // afternoon work / school
            this.DoMorning();
        }
        else if (this.Time.Hour < 18) {
            // child social / adult work
            this.DoEvening();
        }
        else if (this.Time.Hour < 24) {
            //adult social / home
            this.DoNightime();
        }
    }

    Transmit(
        person1: Person,
        person2: Person,
        environment: Environment) {


        if (person1 === person2) {
            return;
        }

        if (!this._policies.CanPeopleMeetInEnvironment(person1, person2, this, environment))
            return;

        //if ((/* neither has the illness */ person1.Disease.Status == Status.Clear && person2.Disease.Status == Status.Clear)
        //    || /* one or other party are quarantined so they dont really meet unless they share a household */
        //    ((person1.IsQuarantined || person2.IsQuarantined) && (person1.HouseholdIndex != person2.HouseholdIndex))) {
        //    return;
        //}

        var chance =
            environment.InterpersonalContactFactor
            * this._runningConfig.InterpersonalContactFactorModifier.get(environment.EnvironmentType)
            * person2.Disease.Infectiousness
            * person1.Susceptability 
            / (24 * 7);


        switch (person1.Disease.Status) {
            case Status.Clear:
                {
                    if (Stats.getUniform(0, 1) < chance) {
                        person1.Disease.Status = Status.Incubation;
                        person1.Disease.Infectiousness = 0.6;
                        return;
                    }
                }
            case Status.Recovered:
                {
                    if (Stats.getUniform(0, 1) < chance * this._runningConfig.ReinfectionProbability) {
                        person1.Disease.Status = Status.Incubation;
                        person1.Disease.Infectiousness = 0.6;
                        return;
                    }
                }
            case Status.Incubation:
            case Status.Asymptomatic: //already infected
            case Status.MildlyIll:
            case Status.SeriouslyIll:
            case Status.Dead:
                return;
        }



    }

    DoHousehold() {

        this.Households.Households.forEach(household => {
            this.ProcessPeople(household.Members, this.Environments.GetEnvironmentsByType(EnvironmentType.Home)?.get(0));
        });

    }

    DoMorning() {

        this.UsualDaytimeEnvironmentMap.forEach((people, environment) => {


            switch (environment.EnvironmentType) {

                case EnvironmentType.Home: {
                    this.DoHomeworkers(people);
                    break;
                }
                case EnvironmentType.Retail:
                case EnvironmentType.Entertainment:
                case EnvironmentType.Office:
                case EnvironmentType.School: {

                    this.ProcessPeople(people, environment);
                    break;
                }
            }
        });

    }

    private ProcessPeople(people: List<Person>, environment: Environment) {
        for (var i = 0; i < people.size; i++) {
            for (var k = 0; k < people.size; k++) {
                this.Transmit(people.get(i), people.get(k), environment);
            }
        }
    }

    private DoHomeworkers(people: List<Person>) {
        var homeworkerMap = new Map<number, List<Person>>();
        people.forEach(person => {
            var set = homeworkerMap.get(person.HouseholdIndex);
            if (!homeworkerMap.has(person.HouseholdIndex)) {
                set = new List<Person>();
                homeworkerMap.set(person.HouseholdIndex, set);
            }
            set?.add(person);
        });
        homeworkerMap.forEach(workers => {
            if (workers.size == 1) {
                if (Stats.getUniform(0, 1) < this._runningConfig.RandomInfectionProbability) {

                    var w = workers.get(0);// .StatusHandler = new AsymptomaticStatusHandler();
                    w.Disease.Status = Status.Incubation;
                    w.Disease.Infectiousness = 0.6;
                }
            }
            else {

                this.ProcessPeople(workers, this.Environments.GetEnvironmentsByType(EnvironmentType.Home)?.get(0));
            }
        });
    }

    DoLunch() {
        this.UsualDaytimeEnvironmentMap.forEach((people, environment) => {


            switch (environment.EnvironmentType) {

                case EnvironmentType.Home: {
                    this.DoHomeworkers(people);
                    break;
                }
                case EnvironmentType.Office:
                case EnvironmentType.School: {

                    this.ProcessPeople(people, environment);
                    break;
                }
                case EnvironmentType.Retail: {

                    var combinedSet = new List<Person>(people);
                    this.People.AllPeople.forEach(person => {
                        if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Retail || person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Entertainment || person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.School) {
                            // ignore other retail workers, social industry workers and  school children; 
                        }
                        else {
                            if (Stats.getUniform(0, 1) < this._runningConfig.RetailLunchtimeFactor / (this.Environments.GetEnvironmentsByType(EnvironmentType.Retail).size * 24)) {
                                combinedSet.add(person);
                            }
                        }
                    });


                    this.ProcessPeople(combinedSet, environment);
                    break;
                }
                case EnvironmentType.Entertainment:
                    {

                        var combinedSet = new List<Person>(people);
                        this.People.AllPeople.forEach(person => {
                            if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Retail || person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Entertainment || person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.School) {
                                // ignore other retail workers, social industry workers and  school children; 
                            }
                            else {
                                if (Stats.getUniform(0, 1) < this._runningConfig.SocialLunchFactor / (this.Environments.GetEnvironmentsByType(EnvironmentType.Entertainment).size*24)) {
                                    combinedSet.add(person);
                                }
                            }
                        });
                        this.ProcessPeople(combinedSet, environment);
                        break;
                    }
            }
        });
    }

    DoEvening() {
        this.UsualDaytimeEnvironmentMap.forEach((people, environment) => {


            switch (environment.EnvironmentType) {

                case EnvironmentType.Home: {
                    this.DoHomeworkers(people);
                    break;
                }
                case EnvironmentType.Office: {

                    this.ProcessPeople(people, environment);
                    break;
                }
                case EnvironmentType.Retail: {

                    var combinedSet = new List<Person>(people);
                    this.People.AllPeople.filter(a=>a.AgeDemographic ==AgeDemographic.Under10).forEach(person => { //school kids shopping
                        if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.School) {
                            if (Stats.getUniform(0, 1) < this._runningConfig.ChildRetailFactor / (this.Environments.GetEnvironmentsByType(EnvironmentType.Retail).size * 24)) {
                                combinedSet.add(person);
                            }
                        }
                    });

                    this.ProcessPeople(combinedSet, environment);
                    break;
                }
                case EnvironmentType.Entertainment:
                    {

                        var combinedSet = new List<Person>(people);
                        this.People.AllPeople.filter(a=>a.AgeDemographic == AgeDemographic.Under10).forEach(person => { //schoolkids being social
                            if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.School) {
                                if (Stats.getUniform(0, 1) < this._runningConfig.SocialLunchFactor / (this.Environments.GetEnvironmentsByType(EnvironmentType.Entertainment).size * 24) ) {
                                    combinedSet.add(person);
                                }
                            }
                        });

                        this.ProcessPeople(combinedSet, environment);
                        break;
                    }
            }
        });
    }

    DoNightime() {
        this.DoHousehold();

        this.Environments.GetEnvironmentsByType(EnvironmentType.Entertainment)?.forEach(env => {
            var workers = this.UsualDaytimeEnvironmentMap.get(env);
            var combinedSet = new List<Person>(workers);

            var adults = this.People.AllPeople.filter(a => a.AgeDemographic != AgeDemographic.Under10 
                && a.UsualDaytimeEnvironment.EnvironmentType != EnvironmentType.Entertainment);

            var entertainmentCount = this.Environments.GetEnvironmentsByType(EnvironmentType.Entertainment).size;

            var cutoff = this._runningConfig.SocialEveningFactor / (entertainmentCount * 24);

            //adults socializing
            for (var i = 0; i < adults.size; i++) {
                var p: Person = adults.get(i);

                if (Stats.getUniform(0, 1) < cutoff) {
                    combinedSet.add(p);
                }
            }

            this.ProcessPeople(combinedSet, env);

        });

    }

}