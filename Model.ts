import { HealthService } from "./HealthService";
import { Policies } from "./Policies";
import { Triggers } from "./Triggers";
import { RunningConfig } from "./RunningConfig";
import { Result } from "./Result";
import { Trigger } from "./Trigger";
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

export class Model {
    private _healthService: HealthService;
    private _policies: Policies = new Policies();
    private _triggers: Triggers = new Triggers();
    private _runningConfig: RunningConfig;
    private _households: Households = new Households();
    private _people: People;
    private _initConfig: AppInitConfig;
    private _time: Time = new Time();
    private _result: Result;
    private _environments: Environments;
    private _usualDaytimeEnvironmentMap: Map<Environment, List<Person>> = new Map<Environment, List<Person>>();

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

    constructor(healthService: HealthService, triggers: Trigger[], policies: Policy[], people: People) {
        this._healthService = healthService;
        this._people = people;
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

    }

    TimeElapsed() {
        this.UpdateModel()
        this.DoTimeInterval();
        this.UpdateResult()
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
        contactFactor: number /* how much personal interaction people in the environment have*/) {


        if (person1 === person2) {
            return;
        }

        if ((/* neither has the illness */ person1.Disease.Status == Status.Clear && person2.Disease.Status == Status.Clear)
            || /* one or other party are quarantined so they dont really meet unless they share a household */
            ((person1.IsQuarantined || person2.IsQuarantined) && (person1.HouseholdIndex != person2.HouseholdIndex))) {
            return;
        }




        var chance = contactFactor * person2.StatusHandler.Infectiousness * person1.Susceptability / 24;


        switch (person1.StatusHandler.Status) {
            case Status.Dead: {
                return person1.StatusHandler;
            }
            case Status.Clear:
                {
                    if (Stats.getUniform(0, 1) < chance) {
                        person1.Disease.Status = Status.Incubation;
                        return;
                    }
                }
            case Status.Recovered:
                {
                    if (Stats.getUniform(0, 1) < chance * this._runningConfig.ReinfectionProbability) {
                        person1.Disease.Status = Status.Incubation;
                        return;
                    }
                }
            case Status.Asymptomatic: //already infected
            case Status.MildlyIll:
            case Status.SeriouslyIll:
                return;
                break;
        }



    }

    DoHousehold() {

        this.Households.Households.forEach(household => {
            this.ProcessPeople(household.Members, this.Environments.GetEnvironmentsByType(EnvironmentType.Home)?.get(0)?.InterpersonalContactFactor);
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

                    this.ProcessPeople(people, environment.InterpersonalContactFactor);
                    break;
                }
            }
        });

    }

    private ProcessPeople(people: List<Person>, interpersonalFactor: number) {
        for (var i = 0; i < people.size; i++) {
            for (var k = 0; k < people.size; k++) {
                people.get(i).StatusHandler = this.Transmit(people.get(i), people.get(k), interpersonalFactor);
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
                }
            }
            else {

                this.ProcessPeople(workers, this.Environments.GetEnvironmentsByType(EnvironmentType.Home)?.get(0)?.InterpersonalContactFactor);
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

                    this.ProcessPeople(people, environment.InterpersonalContactFactor);
                    break;
                }
                case EnvironmentType.Retail: {

                    var combinedSet = new List<Person>(people);
                    this.People.AllPeople.forEach(person => {
                        if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Retail || person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Entertainment || person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.School) {
                            // ignore other retail workers, social industry workers and  school children; 
                        }
                        else {
                            if (Stats.getUniform(0, 1) < this._runningConfig.RetailLunchtimeFactor / this.Environments.GetEnvironmentsByType(EnvironmentType.Retail).size) {
                                combinedSet.add(person);
                            }
                        }
                    });


                    this.ProcessPeople(combinedSet, environment.InterpersonalContactFactor);
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
                                if (Stats.getUniform(0, 1) < this._runningConfig.SocialLunchFactor / this.Environments.GetEnvironmentsByType(EnvironmentType.Entertainment).size) {
                                    combinedSet.add(person);
                                }
                            }
                        });
                        this.ProcessPeople(combinedSet, environment.InterpersonalContactFactor);
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

                    this.ProcessPeople(people, environment.InterpersonalContactFactor);
                    break;
                }
                case EnvironmentType.Retail: {

                    var combinedSet = new List<Person>(people);
                    this.People.AllPeople.forEach(person => { //school kids shopping
                        if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.School) {
                            if (Stats.getUniform(0, 1) < this._runningConfig.ChildRetailFactor / this.Environments.GetEnvironmentsByType(EnvironmentType.Retail).size) {
                                combinedSet.add(person);
                            }
                        }
                    });

                    this.ProcessPeople(combinedSet, environment.InterpersonalContactFactor);
                    break;
                }
                case EnvironmentType.Entertainment:
                    {

                        var combinedSet = new List<Person>(people);
                        this.People.AllPeople.forEach(person => { //schoolkids being social
                            if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.School) {
                                if (Stats.getUniform(0, 1) < this._runningConfig.SocialLunchFactor / this.Environments.GetEnvironmentsByType(EnvironmentType.Entertainment).size) {
                                    combinedSet.add(person);
                                }
                            }
                        });

                        this.ProcessPeople(combinedSet, environment.InterpersonalContactFactor);
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


            //adults socializing
            for (var i = 0; i < this.People.AllPeople.size; i++) {
                var p: Person = this.People.AllPeople.get(i);

                if (p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Retail || p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Home || p.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType.Office) {
                    if (Stats.getUniform(0, 1) < this._runningConfig.SocialEveningFactor / this.Environments.GetEnvironmentsByType(EnvironmentType.Entertainment).size) {
                        combinedSet.add(p);
                    }
                }
            }

            this.ProcessPeople(combinedSet, env.InterpersonalContactFactor);

        });

    }

}