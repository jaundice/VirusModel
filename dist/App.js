(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./EnvironmentType", "./Environment", "./Person", "./Stats", "./List", "./Demographic", "./Model", "./Household", "./Environments", "./People", "./HealthService", "./IsolateIllPeoplePolicy", "./QuarantineHouseholdIfOneMemberIllPolicy"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const EnvironmentType_1 = require("./EnvironmentType");
    const Environment_1 = require("./Environment");
    const Person_1 = require("./Person");
    const Stats_1 = require("./Stats");
    const List_1 = require("./List");
    const Demographic_1 = require("./Demographic");
    const Model_1 = require("./Model");
    const Household_1 = require("./Household");
    const Environments_1 = require("./Environments");
    const People_1 = require("./People");
    const HealthService_1 = require("./HealthService");
    const IsolateIllPeoplePolicy_1 = require("./IsolateIllPeoplePolicy");
    const QuarantineHouseholdIfOneMemberIllPolicy_1 = require("./QuarantineHouseholdIfOneMemberIllPolicy");
    class App {
        get Model() {
            return this._model;
        }
        Init(config) {
            //create empty households
            var _a, _b;
            var households = new Household_1.Households();
            for (var j = 0; j < config.NumberOfHouseholds; j++) {
                households.Households.add(new Household_1.Household());
            }
            var environments = new Environments_1.Environments();
            var usualDaytimeEnv = new Map();
            //create environments
            var interpersonalContactGenerator = (key) => Stats_1.Stats.Clamp(0, 1, Stats_1.Stats.getGaussianRandomGenerator(config.MeanInterpersonalContactFactors.get(key), config.MeanInterpersonalDeviation.get(key)));
            var keyInfrastructureGenerator = () => Stats_1.Stats.Clamp(0, 1, Stats_1.Stats.getGaussianRandomGenerator(0.5, 0.15));
            for (var k = 0; k < config.EnvironmentCount; k++) {
                var env = new Environment_1.Environment();
                env.EnvironmentType = Environments_1.Environments.GetRandomEnvironmentType();
                env.InterpersonalContactFactor = interpersonalContactGenerator(env.EnvironmentType);
                env.IsKeyInfrastructure = Stats_1.Stats.getUniform(0, 1) < config.EnvironmentKeyWorkerRatio.get(env.EnvironmentType);
                environments.Add(env);
                usualDaytimeEnv.set(env, new List_1.List());
            }
            //create a generator that makes a random susceptability given the config mean and standard deviation
            //var susceptabilityGenerator = this.clamp(0, 1, Stats.getGaussianRandomGenerator(config.MeanPersonalSusceptability, config.PersonalSuceptabilityDeviation));
            //create temp structures to arrange environments
            var lstPeople = new List_1.List();
            //make the population
            // todo: ensure children are assigned to households with adults, 
            // assign adults to environments based on census data, add key healthcare professionals, delivery etc 
            for (var i = 0; i < config.PopulationSize; i++) {
                var ageDemograhic = Demographic_1.Demographics.RandomAgeDemographic();
                var health = Demographic_1.Demographics.GetRandomHealth(ageDemograhic);
                var person = new Person_1.Person(ageDemograhic, health);
                //person.IsKeyWorker = keyInfrastructureGenerator() < 0.3;
                lstPeople.add(person);
                if (i < config.NumberOfHouseholds) { //ensure each household has a member
                    households.Households.get(i).Members.add(person);
                    person.HouseholdIndex = i;
                }
                else { //randomly assign remaining people to households
                    var householdIndex = Math.trunc(Stats_1.Stats.getUniform(0, households.Households.size));
                    households.Households.get(householdIndex).Members.add(person);
                    person.HouseholdIndex = householdIndex;
                }
                if (person.AgeDemographic == Demographic_1.AgeDemographic.Under10 || (person.AgeDemographic == Demographic_1.AgeDemographic.Under20 && Stats_1.Stats.getUniform(0, 1) < 0.6)) { //assign children to schools
                    var school = environments.GetEnvironmentsByType(EnvironmentType_1.EnvironmentType.School).get(Math.trunc(Stats_1.Stats.getUniform(0, environments.GetEnvironmentsByType(EnvironmentType_1.EnvironmentType.School).size)));
                    (_a = usualDaytimeEnv.get(school)) === null || _a === void 0 ? void 0 : _a.add(person);
                    person.UsualDaytimeEnvironment = school;
                }
                else { //assign people to other environments
                    var envo = environments.GetEnvironmentsByType(Environments_1.Environments.GetRandomEnvironmentType());
                    var env = envo.get(Math.trunc(Stats_1.Stats.getUniform(0, envo.size))); // for now assign people uniformly across environments
                    (_b = usualDaytimeEnv.get(env)) === null || _b === void 0 ? void 0 : _b.add(person);
                    person.UsualDaytimeEnvironment = env;
                    person.IsKeyWorker = Stats_1.Stats.getUniform(0, 1) < config.EnvironmentKeyWorkerRatio.get(env.EnvironmentType);
                }
            }
            var healthService = new HealthService_1.HealthService(config.MedicalStaffCount, config.AvailableBeds, config.AvailableICU, config.AvailableVentilators);
            var triggers = new Array();
            var policies = new Array();
            //var lockdown = new PolicyLockdown();
            //policies.push(lockdown);
            var isolate = new IsolateIllPeoplePolicy_1.IsolateIllPeoplePolicy();
            isolate.IsActive = true;
            policies.push(isolate);
            var quarantine = new QuarantineHouseholdIfOneMemberIllPolicy_1.QuarantineHouseholdIfOneMemberIll();
            quarantine.IsActive = true;
            policies.push(quarantine);
            //var trgLockdown = new PolicyTrigger(lockdown, a => a.Result?.Counts.get(Status.Dead) > 4);
            //triggers.push(trgLockdown);
            this._model = new Model_1.Model(config, healthService, triggers, policies, new People_1.People(lstPeople), households, environments, usualDaytimeEnv);
        }
        TimeElapsed() {
            this._model.TimeElapsed();
        }
    }
    exports.App = App;
});
//# sourceMappingURL=App.js.map