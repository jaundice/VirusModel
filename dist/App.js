(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./EnvironmentType", "./Environment", "./StatusHandler", "./Person", "./Stats", "./AppInitConfig", "./Time", "./Status", "./List"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const EnvironmentType_1 = require("./EnvironmentType");
    const Environment_1 = require("./Environment");
    const StatusHandler_1 = require("./StatusHandler");
    const Person_1 = require("./Person");
    const Stats_1 = require("./Stats");
    const AppInitConfig_1 = require("./AppInitConfig");
    const Time_1 = require("./Time");
    const Status_1 = require("./Status");
    const List_1 = require("./List");
    class App {
        constructor() {
            this.Environments = new Map();
            this.People = new List_1.List();
            this.UsualDaytimeEnvironmentMap = new Map();
            this.Households = new List_1.List();
            this.QuarantinedHouseholds = new List_1.List();
            this.Config = new AppInitConfig_1.AppInitConfig();
            this.Time = new Time_1.Time();
            this.clamp = (min, max, gen) => {
                var n = gen();
                n = Math.max(min, n);
                n = Math.min(max, n);
                return n;
            };
        }
        Init(config) {
            var _a, _b;
            this.Config = config;
            //create empty households
            for (var j = 0; j < config.NumberOfHouseholds; j++) {
                this.Households.add(new List_1.List());
            }
            //create environments
            config.EnvironmentCounts.forEach((count, key) => {
                var _a;
                var interpersonalContactGenerator = this.clamp(0, 1, Stats_1.Stats.getGaussianRandomGenerator(config.MeanInterpersonalContactFactors.get(key), config.MeanInterpersonalDeviation.get(key)));
                if (!this.Environments.has(key))
                    this.Environments.set(key, new List_1.List());
                for (var k = 0; k < count; k++) {
                    var env = new Environment_1.Environment();
                    env.environmentType = key;
                    env.interpersonalContactFactor = interpersonalContactGenerator;
                    (_a = this.Environments.get(key)) === null || _a === void 0 ? void 0 : _a.add(env);
                }
            });
            //create a generator that makes a random susceptability given the config mean and standard deviation
            var susceptabilityGenerator = this.clamp(0, 1, Stats_1.Stats.getGaussianRandomGenerator(config.MeanPersonalSusceptability, config.PersonalSuceptabilityDeviation));
            //create temp structures to arrange environments
            var nonSchoolEnvironments = new List_1.List();
            var schoolEnvironments = new List_1.List();
            this.Environments.forEach((env, key) => {
                if (key != EnvironmentType_1.EnvironmentType.School) {
                    env.forEach(o => {
                        nonSchoolEnvironments.add(o);
                    });
                }
                else {
                    env.forEach(o => {
                        schoolEnvironments.add(o);
                    });
                }
            });
            //make the population
            for (var i = 0; i < config.PopulationSize; i++) {
                var person = new Person_1.Person();
                person.susceptability = susceptabilityGenerator;
                person.statusHandler = new StatusHandler_1.CleanStatusHandler(); //everbody starts clean
                this.People.add(person);
                if (i < config.NumberOfHouseholds) { //ensure each household has a member
                    this.Households.get(i).add(person);
                    person.householdIndex = i;
                }
                else { //randomly assign remaining people to households
                    var householdIndex = Math.trunc(Stats_1.Stats.getUniform(0, this.Households.size));
                    this.Households.get(householdIndex).add(person);
                    person.householdIndex = householdIndex;
                }
                if (Stats_1.Stats.getUniform(0, 1) < config.ProportionOfChildren) { //assign children to schools
                    var school = schoolEnvironments.get(Math.trunc(Stats_1.Stats.getUniform(0, schoolEnvironments.size)));
                    (_a = this.UsualDaytimeEnvironmentMap.get(school)) === null || _a === void 0 ? void 0 : _a.add(person);
                    person.usualDaytimeEnvironment = school;
                }
                else { //assign people to other environments
                    var env = nonSchoolEnvironments.get(Math.trunc(Stats_1.Stats.getUniform(0, nonSchoolEnvironments.size))); // for now assign people uniformly across environments
                    (_b = this.UsualDaytimeEnvironmentMap.get(env)) === null || _b === void 0 ? void 0 : _b.add(person);
                    person.usualDaytimeEnvironment = env;
                }
            }
        }
        TimeElapsed() {
            this.Time.Tick();
            this.UpdateQuarantine();
            this.People.forEach(o => {
                this.UpdateStatusByTick(o);
            });
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
        UpdateQuarantine() {
            for (var i = 0; i < this.Households.size; i++) {
                var doQuarantine = false;
                this.Households.get(i).forEach(o => { if (o.isQuarantined)
                    doQuarantine = true; });
                this.QuarantinedHouseholds.set(i, doQuarantine);
            }
        }
        UpdateStatusByTick(person) {
            person.statusHandler.Tick();
            switch (person.statusHandler.Status) {
                case Status_1.Status.Dead: {
                    person.isQuarantined = true;
                    return;
                }
                case Status_1.Status.Asymptomatic:
                    if (person.statusHandler.Time.Day > this.Config.AsymptomaticTime) {
                        if (person.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.School) {
                            if (Stats_1.Stats.getUniform(0, 1) < this.Config.ChildProgressionFactor) {
                                person.statusHandler = new StatusHandler_1.MildStatusHandler();
                                if (Stats_1.Stats.getUniform(0, 1) < this.Config.MildSymptomsQuarantineFactor) {
                                    person.isQuarantined = true;
                                }
                            }
                            else {
                                person.statusHandler = new StatusHandler_1.RecoveredStatusHandler();
                                person.isQuarantined = false;
                            }
                            return;
                        }
                        person.statusHandler =
                            Stats_1.Stats.getUniform(0, 1) < this.Config.SeriousIllnessRatio
                                ? new StatusHandler_1.SeriousStatusHandler()
                                : new StatusHandler_1.MildStatusHandler();
                        if (person.statusHandler.Status == Status_1.Status.SeriouslyIll) {
                            person.isQuarantined = true;
                        }
                        if (person.statusHandler.Status == Status_1.Status.MildlyIll) {
                            if (Stats_1.Stats.getUniform(0, 1) < this.Config.MildSymptomsQuarantineFactor) {
                                person.isQuarantined = true;
                            }
                        }
                        return;
                    }
                    break;
                case Status_1.Status.SeriouslyIll:
                    {
                        if ((person.statusHandler.Time.Day > this.Config.RecoveryTime)) {
                            if (Stats_1.Stats.getUniform(0, 1) < (1.0 / this.Config.DeathRatio)) {
                                person.statusHandler = new StatusHandler_1.DeadStatusHandler();
                                person.isQuarantined = true;
                            }
                            else {
                                person.statusHandler = new StatusHandler_1.RecoveredStatusHandler();
                                person.isQuarantined = false;
                            }
                            return;
                        }
                        break;
                    }
                case Status_1.Status.MildlyIll: {
                    if (person.statusHandler.Time.Day > this.Config.RecoveryTime) {
                        person.statusHandler = new StatusHandler_1.RecoveredStatusHandler();
                        person.isQuarantined = false;
                    }
                    return;
                }
                case Status_1.Status.Clear: {
                    person.isQuarantined = false;
                    if (Stats_1.Stats.getUniform(0, 1) < this.Config.RandomInfectionProbability / 24) {
                        person.statusHandler = new StatusHandler_1.AsymptomaticStatusHandler();
                    }
                    return;
                }
                case Status_1.Status.Recovered: {
                    person.isQuarantined = false;
                    if (Stats_1.Stats.getUniform(0, 1) < this.Config.RandomInfectionProbability * this.Config.ReinfectionProbability / 24) {
                        person.statusHandler = new StatusHandler_1.AsymptomaticStatusHandler();
                    }
                    return;
                }
            }
        }
        Transmit(person1, person2, contactFactor /* how much personal interaction people in the environment have*/) {
            if (person1.householdIndex != person2.householdIndex && this.Config.QuarantineWholeHouseholdOnInfection) {
                if (this.QuarantinedHouseholds.get(person1.householdIndex) || this.QuarantinedHouseholds.get(person2.householdIndex))
                    return person1.statusHandler;
            }
            if (person1 === person2) {
                return person1.statusHandler;
            }
            if (( /* neither has the illness */person1.statusHandler.Status == Status_1.Status.Clear && person2.statusHandler.Status == Status_1.Status.Clear)
                || /* one or other party are quarantined so they dont really meet unless they share a household */ ((person1.isQuarantined || person2.isQuarantined) && (person1.householdIndex != person2.householdIndex))) {
                return person1.statusHandler;
            }
            var chance = contactFactor * person2.statusHandler.Infectiousness * person1.susceptability / 24;
            switch (person1.statusHandler.Status) {
                case Status_1.Status.Dead: {
                    return person1.statusHandler;
                }
                case Status_1.Status.Clear:
                    {
                        if (Stats_1.Stats.getUniform(0, 1) < chance) {
                            return new StatusHandler_1.AsymptomaticStatusHandler();
                        }
                    }
                case Status_1.Status.Recovered:
                    {
                        if (Stats_1.Stats.getUniform(0, 1) < chance * this.Config.ReinfectionProbability) {
                            return new StatusHandler_1.AsymptomaticStatusHandler();
                        }
                    }
                case Status_1.Status.Asymptomatic: //already infected
                case Status_1.Status.MildlyIll:
                case Status_1.Status.SeriouslyIll:
                    return person1.statusHandler;
                    break;
            }
        }
        DoHousehold() {
            this.Households.forEach(household => {
                var _a, _b;
                this.ProcessPeople(household, (_b = (_a = this.Environments.get(EnvironmentType_1.EnvironmentType.Home)) === null || _a === void 0 ? void 0 : _a.get(0)) === null || _b === void 0 ? void 0 : _b.interpersonalContactFactor);
            });
        }
        DoMorning() {
            this.UsualDaytimeEnvironmentMap.forEach((people, environment) => {
                switch (environment.environmentType) {
                    case EnvironmentType_1.EnvironmentType.Home: {
                        this.DoHomeworkers(people);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Retail:
                    case EnvironmentType_1.EnvironmentType.Social:
                    case EnvironmentType_1.EnvironmentType.Office:
                    case EnvironmentType_1.EnvironmentType.School: {
                        this.ProcessPeople(people, environment.interpersonalContactFactor);
                        break;
                    }
                }
            });
        }
        ProcessPeople(people, interpersonalFactor) {
            for (var i = 0; i < people.size; i++) {
                for (var k = 0; k < people.size; k++) {
                    people.get(i).statusHandler = this.Transmit(people.get(i), people.get(k), interpersonalFactor);
                }
            }
        }
        DoHomeworkers(people) {
            var homeworkerMap = new Map();
            people.forEach(person => {
                var set = homeworkerMap.get(person.householdIndex);
                if (!homeworkerMap.has(person.householdIndex)) {
                    set = new List_1.List();
                    homeworkerMap.set(person.householdIndex, set);
                }
                set === null || set === void 0 ? void 0 : set.add(person);
            });
            homeworkerMap.forEach(workers => {
                var _a, _b;
                if (workers.size == 1) {
                    if (Stats_1.Stats.getUniform(0, 1) < this.Config.RandomInfectionProbability) {
                        workers.get(0).statusHandler = new StatusHandler_1.AsymptomaticStatusHandler();
                    }
                }
                else {
                    this.ProcessPeople(workers, (_b = (_a = this.Environments.get(EnvironmentType_1.EnvironmentType.Home)) === null || _a === void 0 ? void 0 : _a.get(0)) === null || _b === void 0 ? void 0 : _b.interpersonalContactFactor);
                }
            });
        }
        DoLunch() {
            this.UsualDaytimeEnvironmentMap.forEach((people, environment) => {
                switch (environment.environmentType) {
                    case EnvironmentType_1.EnvironmentType.Home: {
                        this.DoHomeworkers(people);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Office:
                    case EnvironmentType_1.EnvironmentType.School: {
                        this.ProcessPeople(people, environment.interpersonalContactFactor);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Retail: {
                        var combinedSet = new List_1.List(people);
                        this.People.forEach(person => {
                            if (person.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.Retail || person.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.Social || person.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.School) {
                                // ignore other retail workers, social industry workers and  school children; 
                            }
                            else {
                                if (Stats_1.Stats.getUniform(0, 1) < this.Config.RetailLunchtimeFactor / this.Config.EnvironmentCounts.get(EnvironmentType_1.EnvironmentType.Retail)) {
                                    combinedSet.add(person);
                                }
                            }
                        });
                        this.ProcessPeople(combinedSet, environment.interpersonalContactFactor);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Social:
                        {
                            var combinedSet = new List_1.List(people);
                            this.People.forEach(person => {
                                if (person.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.Retail || person.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.Social || person.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.School) {
                                    // ignore other retail workers, social industry workers and  school children; 
                                }
                                else {
                                    if (Stats_1.Stats.getUniform(0, 1) < this.Config.SocialLunchFactor / this.Config.EnvironmentCounts.get(EnvironmentType_1.EnvironmentType.Social)) {
                                        combinedSet.add(person);
                                    }
                                }
                            });
                            this.ProcessPeople(combinedSet, environment.interpersonalContactFactor);
                            break;
                        }
                }
            });
        }
        DoEvening() {
            this.UsualDaytimeEnvironmentMap.forEach((people, environment) => {
                switch (environment.environmentType) {
                    case EnvironmentType_1.EnvironmentType.Home: {
                        this.DoHomeworkers(people);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Office: {
                        this.ProcessPeople(people, environment.interpersonalContactFactor);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Retail: {
                        var combinedSet = new List_1.List(people);
                        this.People.forEach(person => {
                            if (person.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.School) {
                                if (Stats_1.Stats.getUniform(0, 1) < this.Config.ChildRetailFactor / this.Config.EnvironmentCounts.get(EnvironmentType_1.EnvironmentType.Retail)) {
                                    combinedSet.add(person);
                                }
                            }
                        });
                        this.ProcessPeople(combinedSet, environment.interpersonalContactFactor);
                        break;
                    }
                    case EnvironmentType_1.EnvironmentType.Social:
                        {
                            var combinedSet = new List_1.List(people);
                            this.People.forEach(person => {
                                if (person.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.School) {
                                    if (Stats_1.Stats.getUniform(0, 1) < this.Config.SocialLunchFactor / this.Config.EnvironmentCounts.get(EnvironmentType_1.EnvironmentType.Social)) {
                                        combinedSet.add(person);
                                    }
                                }
                            });
                            this.ProcessPeople(combinedSet, environment.interpersonalContactFactor);
                            break;
                        }
                }
            });
        }
        DoNightime() {
            var _a;
            this.DoHousehold();
            (_a = this.Environments.get(EnvironmentType_1.EnvironmentType.Social)) === null || _a === void 0 ? void 0 : _a.forEach(env => {
                var workers = this.UsualDaytimeEnvironmentMap.get(env);
                var combinedSet = new List_1.List(workers);
                //adults socializing
                for (var i = 0; i < this.People.size; i++) {
                    var p = this.People.get(i);
                    if (p.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.Retail || p.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.Home || p.usualDaytimeEnvironment.environmentType == EnvironmentType_1.EnvironmentType.Office) {
                        if (Stats_1.Stats.getUniform(0, 1) < this.Config.SocialEveningFactor / this.Config.EnvironmentCounts.get(EnvironmentType_1.EnvironmentType.Social)) {
                            combinedSet.add(p);
                        }
                    }
                }
                this.ProcessPeople(combinedSet, env.interpersonalContactFactor);
            });
        }
    }
    exports.App = App;
});
//# sourceMappingURL=App.js.map