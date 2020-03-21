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


export class App {
    Environments: Map<EnvironmentType, List<Environment>> = new Map<EnvironmentType, List<Environment>>();
    People: List<Person> = new List<Person>();
    UsualDaytimeEnvironmentMap: Map<Environment, List<Person>> = new Map<Environment, List<Person>>();
    Households: List<List<Person>> = new List<List<Person>>();
    QuarantinedHouseholds: List<boolean> = new List<boolean>();

    Config: AppInitConfig = new AppInitConfig();

    Time: Time = new Time();

    private clamp = (min: number, max: number, gen: () => number) => {
        var n = gen();

        n = Math.max(min, n);
        n = Math.min(max, n);
        return n;
    }

    Init(config: AppInitConfig) {
        this.Config = config;

        //create empty households
        for (var j = 0; j < config.NumberOfHouseholds; j++) {
            this.Households.add(new List<Person>());
        }



        //create environments
        config.EnvironmentCounts.forEach((count, key) => {

            var interpersonalContactGenerator = this.clamp(0, 1, Stats.getGaussianRandomGenerator(config.MeanInterpersonalContactFactors.get(key), config.MeanInterpersonalDeviation.get(key)));

            if (!this.Environments.has(key))
                this.Environments.set(key, new List<Environment>());

            for (var k = 0; k < count; k++) {


                var env = new Environment();
                env.environmentType = key;
                env.interpersonalContactFactor = interpersonalContactGenerator;

                this.Environments.get(key)?.add(env);
            }
        });

        //create a generator that makes a random susceptability given the config mean and standard deviation
        //var susceptabilityGenerator = this.clamp(0, 1, Stats.getGaussianRandomGenerator(config.MeanPersonalSusceptability, config.PersonalSuceptabilityDeviation));

        //create temp structures to arrange environments
        var nonSchoolEnvironments = new List<Environment>();
        var schoolEnvironments = new List<Environment>();
        this.Environments.forEach((env, key) => {
            if (key != EnvironmentType.School) {
                env.forEach(o => {
                    nonSchoolEnvironments.add(o);
                })
            }
            else {
                env.forEach(o => {
                    schoolEnvironments.add(o);
                })
            }
        });

        //make the population
        // todo: ensure children are assigned to households with adults, 
        // assign adults to environments based on census data, add key healthcare professionals, delivery etc 
        for (var i = 0; i < config.PopulationSize; i++) {

            var ageDemograhic = Demographics.RandomAgeDemographic();
            var health = Demographics.getRandomHealth(ageDemograhic);

            var person = new Person(ageDemograhic, health);
            //person.susceptability = susceptabilityGenerator;
            person.StatusHandler = new CleanStatusHandler(); //everbody starts clean

            this.People.add(person);

            if (i < config.NumberOfHouseholds) { //ensure each household has a member
                this.Households.get(i).add(person);
                person.HouseholdIndex = i;
            }
            else { //randomly assign remaining people to households
                var householdIndex = Math.trunc(Stats.getUniform(0, this.Households.size));
                this.Households.get(householdIndex).add(person);
                person.HouseholdIndex = householdIndex;
            }

            if (person.AgeDemographic == AgeDemographic.Under10 || (person.AgeDemographic == AgeDemographic.Under20 && Stats.getUniform(0, 1) < 0.6)) { //assign children to schools
                var school = schoolEnvironments.get(Math.trunc(Stats.getUniform(0, schoolEnvironments.size)));
                this.UsualDaytimeEnvironmentMap.get(school)?.add(person);
                person.UsualDaytimeEnvironment = school;
            }
            else { //assign people to other environments
                var env = nonSchoolEnvironments.get(Math.trunc(Stats.getUniform(0, nonSchoolEnvironments.size)));// for now assign people uniformly across environments
                this.UsualDaytimeEnvironmentMap.get(env)?.add(person);
                person.UsualDaytimeEnvironment = env;
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
    UpdateQuarantine() { //always updates even if tracking is off in config
        for (var i = 0; i < this.Households.size; i++) {
            var doQuarantine = false;
            this.Households.get(i).forEach(o => { if (o.IsQuarantined) doQuarantine = true; });
            this.QuarantinedHouseholds.set(i, doQuarantine);
        }
    }
    UpdateStatusByTick(person: Person) {

        person.StatusHandler.Tick();

        switch (person.StatusHandler.Status) {
            case Status.Dead: {
                person.IsQuarantined = true;
                return;
            }

            case Status.Asymptomatic:
                if (person.StatusHandler.Time.Day > this.Config.AsymptomaticTime) {
                    if (person.UsualDaytimeEnvironment.environmentType == EnvironmentType.School) {
                        if (Stats.getUniform(0, 1) < this.Config.ChildProgressionFactor) {
                            person.StatusHandler = new MildStatusHandler();
                            if (Stats.getUniform(0, 1) < this.Config.MildSymptomsQuarantineFactor) {
                                person.IsQuarantined = true;
                            }
                        }
                        else {
                            person.StatusHandler = new RecoveredStatusHandler();
                            person.IsQuarantined = false;
                        }
                        return;
                    }
                    person.StatusHandler =
                        Stats.getUniform(0, 1) < this.Config.SeriousIllnessRatio
                            ? new SeriousStatusHandler()
                            : new MildStatusHandler();

                    if (person.StatusHandler.Status == Status.SeriouslyIll) {
                        person.IsQuarantined = true;
                    }
                    if (person.StatusHandler.Status == Status.MildlyIll) {
                        if (Stats.getUniform(0, 1) < this.Config.MildSymptomsQuarantineFactor) {
                            person.IsQuarantined = true;
                        }
                    }
                    return;
                }
                break;
            case Status.SeriouslyIll:
                {
                    if ((person.StatusHandler.Time.Day > this.Config.RecoveryTime)) {
                        if (Stats.getUniform(0, 1) < (1.0 / this.Config.DeathRatio)) {
                            person.StatusHandler = new DeadStatusHandler();
                            person.IsQuarantined = true;
                        }
                        else {
                            person.StatusHandler = new RecoveredStatusHandler();
                            person.IsQuarantined = false;
                        }
                        return;
                    }
                    break;
                }
            case Status.MildlyIll: {
                if (person.StatusHandler.Time.Day > this.Config.RecoveryTime) {
                    person.StatusHandler = new RecoveredStatusHandler();
                    person.IsQuarantined = false;
                }
                return;
            }
            case Status.Clear: {
                person.IsQuarantined = false;
                if (Stats.getUniform(0, 1) < this.Config.RandomInfectionProbability / 24) {
                    person.StatusHandler = new AsymptomaticStatusHandler();
                }
                return;
            }
            case Status.Recovered: {
                person.IsQuarantined = false;
                if (Stats.getUniform(0, 1) < this.Config.RandomInfectionProbability * this.Config.ReinfectionProbability / 24) {
                    person.StatusHandler = new AsymptomaticStatusHandler();
                }
                return;
            }
        }
    }

    Transmit(
        person1: Person,
        person2: Person,
        contactFactor: number /* how much personal interaction people in the environment have*/): StatusHandler {


        if (person1.HouseholdIndex != person2.HouseholdIndex && this.Config.QuarantineWholeHouseholdOnInfection) {
            if (this.QuarantinedHouseholds.get(person1.HouseholdIndex) || this.QuarantinedHouseholds.get(person2.HouseholdIndex))
                return person1.StatusHandler;
        }

        if (person1 === person2) {
            return person1.StatusHandler;
        }

        if ((/* neither has the illness */ person1.StatusHandler.Status == Status.Clear && person2.StatusHandler.Status == Status.Clear)
            || /* one or other party are quarantined so they dont really meet unless they share a household */ ((person1.IsQuarantined || person2.IsQuarantined) && (person1.HouseholdIndex != person2.HouseholdIndex))) {
            return person1.StatusHandler;
        }




        var chance = contactFactor * person2.StatusHandler.Infectiousness * person1.Susceptability / 24;


        switch (person1.StatusHandler.Status) {
            case Status.Dead: {
                return person1.StatusHandler;
            }
            case Status.Clear:
                {
                    if (Stats.getUniform(0, 1) < chance) {
                        return new AsymptomaticStatusHandler();
                    }
                }
            case Status.Recovered:
                {
                    if (Stats.getUniform(0, 1) < chance * this.Config.ReinfectionProbability) {
                        return new AsymptomaticStatusHandler();
                    }
                }
            case Status.Asymptomatic: //already infected
            case Status.MildlyIll:
            case Status.SeriouslyIll:
                return person1.StatusHandler;
                break;
        }



    }

    DoHousehold() {

        this.Households.forEach(household => {
            this.ProcessPeople(household, this.Environments.get(EnvironmentType.Home)?.get(0)?.interpersonalContactFactor);
        });


    }

    DoMorning() {

        this.UsualDaytimeEnvironmentMap.forEach((people, environment) => {


            switch (environment.environmentType) {

                case EnvironmentType.Home: {
                    this.DoHomeworkers(people);
                    break;
                }
                case EnvironmentType.Retail:
                case EnvironmentType.Social:
                case EnvironmentType.Office:
                case EnvironmentType.School: {

                    this.ProcessPeople(people, environment.interpersonalContactFactor);
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
                if (Stats.getUniform(0, 1) < this.Config.RandomInfectionProbability) {
                    workers.get(0).StatusHandler = new AsymptomaticStatusHandler();
                }
            }
            else {

                this.ProcessPeople(workers, this.Environments.get(EnvironmentType.Home)?.get(0)?.interpersonalContactFactor);
            }
        });
    }

    DoLunch() {
        this.UsualDaytimeEnvironmentMap.forEach((people, environment) => {


            switch (environment.environmentType) {

                case EnvironmentType.Home: {
                    this.DoHomeworkers(people);
                    break;
                }
                case EnvironmentType.Office:
                case EnvironmentType.School: {

                    this.ProcessPeople(people, environment.interpersonalContactFactor);
                    break;
                }
                case EnvironmentType.Retail: {

                    var combinedSet = new List<Person>(people);
                    this.People.forEach(person => {
                        if (person.UsualDaytimeEnvironment.environmentType == EnvironmentType.Retail || person.UsualDaytimeEnvironment.environmentType == EnvironmentType.Social || person.UsualDaytimeEnvironment.environmentType == EnvironmentType.School) {
                            // ignore other retail workers, social industry workers and  school children; 
                        }
                        else {
                            if (Stats.getUniform(0, 1) < this.Config.RetailLunchtimeFactor / this.Config.EnvironmentCounts.get(EnvironmentType.Retail)) {
                                combinedSet.add(person);
                            }
                        }
                    });


                    this.ProcessPeople(combinedSet, environment.interpersonalContactFactor);
                    break;
                }
                case EnvironmentType.Social:
                    {

                        var combinedSet = new List<Person>(people);
                        this.People.forEach(person => {
                            if (person.UsualDaytimeEnvironment.environmentType == EnvironmentType.Retail || person.UsualDaytimeEnvironment.environmentType == EnvironmentType.Social || person.UsualDaytimeEnvironment.environmentType == EnvironmentType.School) {
                                // ignore other retail workers, social industry workers and  school children; 
                            }
                            else {
                                if (Stats.getUniform(0, 1) < this.Config.SocialLunchFactor / this.Config.EnvironmentCounts.get(EnvironmentType.Social)) {
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

                case EnvironmentType.Home: {
                    this.DoHomeworkers(people);
                    break;
                }
                case EnvironmentType.Office: {

                    this.ProcessPeople(people, environment.interpersonalContactFactor);
                    break;
                }
                case EnvironmentType.Retail: {

                    var combinedSet = new List<Person>(people);
                    this.People.forEach(person => { //school kids shopping
                        if (person.UsualDaytimeEnvironment.environmentType == EnvironmentType.School) {
                            if (Stats.getUniform(0, 1) < this.Config.ChildRetailFactor / this.Config.EnvironmentCounts.get(EnvironmentType.Retail)) {
                                combinedSet.add(person);
                            }
                        }
                    });

                    this.ProcessPeople(combinedSet, environment.interpersonalContactFactor);
                    break;
                }
                case EnvironmentType.Social:
                    {

                        var combinedSet = new List<Person>(people);
                        this.People.forEach(person => { //schoolkids being social
                            if (person.UsualDaytimeEnvironment.environmentType == EnvironmentType.School) {
                                if (Stats.getUniform(0, 1) < this.Config.SocialLunchFactor / this.Config.EnvironmentCounts.get(EnvironmentType.Social)) {
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
        this.DoHousehold();

        this.Environments.get(EnvironmentType.Social)?.forEach(env => {
            var workers = this.UsualDaytimeEnvironmentMap.get(env);
            var combinedSet = new List<Person>(workers);


            //adults socializing
            for (var i = 0; i < this.People.size; i++) {
                var p: Person = this.People.get(i);

                if (p.UsualDaytimeEnvironment.environmentType == EnvironmentType.Retail || p.UsualDaytimeEnvironment.environmentType == EnvironmentType.Home || p.UsualDaytimeEnvironment.environmentType == EnvironmentType.Office) {
                    if (Stats.getUniform(0, 1) < this.Config.SocialEveningFactor / this.Config.EnvironmentCounts.get(EnvironmentType.Social)) {
                        combinedSet.add(p);
                    }
                }
            }

            this.ProcessPeople(combinedSet, env.interpersonalContactFactor);

        });

    }

}



