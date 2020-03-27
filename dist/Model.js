(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Policies", "./Triggers", "./RunningConfig", "./Result", "./Time", "./Status", "./Stats", "./EnvironmentType", "./List", "./Demographic"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Policies_1 = require("./Policies");
    const Triggers_1 = require("./Triggers");
    const RunningConfig_1 = require("./RunningConfig");
    const Result_1 = require("./Result");
    const Time_1 = require("./Time");
    const Status_1 = require("./Status");
    const Stats_1 = require("./Stats");
    const EnvironmentType_1 = require("./EnvironmentType");
    const List_1 = require("./List");
    const Demographic_1 = require("./Demographic");
    class Model {
        constructor(appInitConfig, healthService, triggers, policies, people, households, environments, daytimeEnvironmentMap) {
            this._policies = new Policies_1.Policies();
            this._triggers = new Triggers_1.Triggers();
            this._time = new Time_1.Time();
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
        get UsualDaytimeEnvironmentMap() {
            return this._usualDaytimeEnvironmentMap;
        }
        get Households() {
            return this._households;
        }
        get Result() {
            return this._result;
        }
        get RunningConfig() {
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
        get Environments() {
            return this._environments;
        }
        UpdateModel() {
            this._time.Tick();
            this._triggers.FireTriggers(this);
            this._runningConfig = this._policies.ApplyPolicies(new RunningConfig_1.RunningConfig(this._initConfig));
            this._healthService.UpdateProperties(this);
            this._healthService.UpdateFactors();
            this._people.UpdateDiseaseProgression(this);
        }
        UpdateResult() {
            var res = new Result_1.Result();
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
        DoTimeInterval() {
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
        Transmit(person1, person2, environment) {
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
            var chance = environment.InterpersonalContactFactor
                * this._runningConfig.InterpersonalContactFactorModifier.get(environment.EnvironmentType)
                * person2.Disease.Infectiousness
                * person1.Susceptability
                / (24 * 7);
            switch (person1.Disease.Status) {
                case Status_1.Status.Clear:
                    {
                        if (Stats_1.Stats.getUniform(0, 1) < chance) {
                            person1.Disease.Status = Status_1.Status.Incubation;
                            person1.Disease.Infectiousness = 0.6;
                            return;
                        }
                    }
                case Status_1.Status.Recovered:
                    {
                        if (Stats_1.Stats.getUniform(0, 1) < chance * this._runningConfig.ReinfectionProbability) {
                            person1.Disease.Status = Status_1.Status.Incubation;
                            person1.Disease.Infectiousness = 0.6;
                            return;
                        }
                    }
                case Status_1.Status.Incubation:
                case Status_1.Status.Asymptomatic: //already infected
                case Status_1.Status.MildlyIll:
                case Status_1.Status.SeriouslyIll:
                case Status_1.Status.Dead:
                    return;
            }
        }
        DoHousehold() {
            this.Households.Households.forEach(household => {
                var _a;
                this.ProcessPeople(household.Members, (_a = this.Environments.GetEnvironmentsByType(EnvironmentType_1.EnvironmentType.Home)) === null || _a === void 0 ? void 0 : _a.get(0));
            });
        }
        DoMorning() {
            this.UsualDaytimeEnvironmentMap.forEach((people, environment) => {
                switch (environment.EnvironmentType) {
                    case EnvironmentType_1.EnvironmentType.Home: {
                        this.DoHomeworkers(people);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Retail:
                    case EnvironmentType_1.EnvironmentType.Entertainment:
                    case EnvironmentType_1.EnvironmentType.Office:
                    case EnvironmentType_1.EnvironmentType.School: {
                        this.ProcessPeople(people, environment);
                        break;
                    }
                }
            });
        }
        ProcessPeople(people, environment) {
            for (var i = 0; i < people.size; i++) {
                for (var k = 0; k < people.size; k++) {
                    this.Transmit(people.get(i), people.get(k), environment);
                }
            }
        }
        DoHomeworkers(people) {
            var homeworkerMap = new Map();
            people.forEach(person => {
                var set = homeworkerMap.get(person.HouseholdIndex);
                if (!homeworkerMap.has(person.HouseholdIndex)) {
                    set = new List_1.List();
                    homeworkerMap.set(person.HouseholdIndex, set);
                }
                set === null || set === void 0 ? void 0 : set.add(person);
            });
            homeworkerMap.forEach(workers => {
                var _a;
                if (workers.size == 1) {
                    if (Stats_1.Stats.getUniform(0, 1) < this._runningConfig.RandomInfectionProbability) {
                        var w = workers.get(0); // .StatusHandler = new AsymptomaticStatusHandler();
                        w.Disease.Status = Status_1.Status.Incubation;
                        w.Disease.Infectiousness = 0.6;
                    }
                }
                else {
                    this.ProcessPeople(workers, (_a = this.Environments.GetEnvironmentsByType(EnvironmentType_1.EnvironmentType.Home)) === null || _a === void 0 ? void 0 : _a.get(0));
                }
            });
        }
        DoLunch() {
            this.UsualDaytimeEnvironmentMap.forEach((people, environment) => {
                switch (environment.EnvironmentType) {
                    case EnvironmentType_1.EnvironmentType.Home: {
                        this.DoHomeworkers(people);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Office:
                    case EnvironmentType_1.EnvironmentType.School: {
                        this.ProcessPeople(people, environment);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Retail: {
                        var combinedSet = new List_1.List(people);
                        this.People.AllPeople.forEach(person => {
                            if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Retail || person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Entertainment || person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.School) {
                                // ignore other retail workers, social industry workers and  school children; 
                            }
                            else {
                                if (Stats_1.Stats.getUniform(0, 1) < this._runningConfig.RetailLunchtimeFactor / (this.Environments.GetEnvironmentsByType(EnvironmentType_1.EnvironmentType.Retail).size * 24)) {
                                    combinedSet.add(person);
                                }
                            }
                        });
                        this.ProcessPeople(combinedSet, environment);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Entertainment:
                        {
                            var combinedSet = new List_1.List(people);
                            this.People.AllPeople.forEach(person => {
                                if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Retail || person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.Entertainment || person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.School) {
                                    // ignore other retail workers, social industry workers and  school children; 
                                }
                                else {
                                    if (Stats_1.Stats.getUniform(0, 1) < this._runningConfig.SocialLunchFactor / (this.Environments.GetEnvironmentsByType(EnvironmentType_1.EnvironmentType.Entertainment).size * 24)) {
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
                    case EnvironmentType_1.EnvironmentType.Home: {
                        this.DoHomeworkers(people);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Office: {
                        this.ProcessPeople(people, environment);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Retail: {
                        var combinedSet = new List_1.List(people);
                        this.People.AllPeople.filter(a => a.AgeDemographic == Demographic_1.AgeDemographic.Under10).forEach(person => {
                            if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.School) {
                                if (Stats_1.Stats.getUniform(0, 1) < this._runningConfig.ChildRetailFactor / (this.Environments.GetEnvironmentsByType(EnvironmentType_1.EnvironmentType.Retail).size * 24)) {
                                    combinedSet.add(person);
                                }
                            }
                        });
                        this.ProcessPeople(combinedSet, environment);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Entertainment:
                        {
                            var combinedSet = new List_1.List(people);
                            this.People.AllPeople.filter(a => a.AgeDemographic == Demographic_1.AgeDemographic.Under10).forEach(person => {
                                if (person.UsualDaytimeEnvironment.EnvironmentType == EnvironmentType_1.EnvironmentType.School) {
                                    if (Stats_1.Stats.getUniform(0, 1) < this._runningConfig.SocialLunchFactor / (this.Environments.GetEnvironmentsByType(EnvironmentType_1.EnvironmentType.Entertainment).size * 24)) {
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
            var _a;
            this.DoHousehold();
            (_a = this.Environments.GetEnvironmentsByType(EnvironmentType_1.EnvironmentType.Entertainment)) === null || _a === void 0 ? void 0 : _a.forEach(env => {
                var workers = this.UsualDaytimeEnvironmentMap.get(env);
                var combinedSet = new List_1.List(workers);
                var adults = this.People.AllPeople.filter(a => a.AgeDemographic != Demographic_1.AgeDemographic.Under10
                    && a.UsualDaytimeEnvironment.EnvironmentType != EnvironmentType_1.EnvironmentType.Entertainment);
                var entertainmentCount = this.Environments.GetEnvironmentsByType(EnvironmentType_1.EnvironmentType.Entertainment).size;
                var cutoff = this._runningConfig.SocialEveningFactor / (entertainmentCount * 24);
                //adults socializing
                for (var i = 0; i < adults.size; i++) {
                    var p = adults.get(i);
                    if (Stats_1.Stats.getUniform(0, 1) < cutoff) {
                        combinedSet.add(p);
                    }
                }
                this.ProcessPeople(combinedSet, env);
            });
        }
    }
    exports.Model = Model;
});
//# sourceMappingURL=Model.js.map