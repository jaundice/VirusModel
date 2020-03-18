import { EnvironmentType } from "./EnvironmentType";
import { Environment } from './Environment';
import { CleanStatusHandler, StatusHandler, AsymptomaticStatusHandler, SeriousStatusHandler, MildStatusHandler, DeadStatusHandler, RecoveredStatusHandler } from './StatusHandler';
import { Person } from './Person';
import { Stats } from './Stats';
import { AppInitConfig } from "./AppInitConfig";
import { Time } from "./Time";
import { Status } from "./Status";
import { List } from "./List";


export class App {
    Environments: Map<EnvironmentType, List<Environment>> = new Map<EnvironmentType, List<Environment>>();
    People: List<Person> = new List<Person>();
    UsualDaytimeEnvironmentMap: Map<Environment, List<Person>> = new Map<Environment, List<Person>>();
    Households: List<List<Person>> = new List<List<Person>>();
    QuarantinedHouseholds: List<boolean> = new List<boolean>();

    Config: AppInitConfig = new AppInitConfig();

    Time: Time = new Time();


    Init(config: AppInitConfig) {
        this.Config = config;

        //create empty households
        for (var j = 0; j < config.NumberOfHouseholds; j++) {
            this.Households.add(new List<Person>());
        }

        //create environments
        config.EnvironmentCounts.forEach((count, key) => {

            var interpersonalContactGenerator = Stats.getGaussianRandomGenerator(config.MeanInterpersonalContactFactors.get(key), config.MeanInterpersonalDeviation.get(key));

            if (!this.Environments.has(key))
                this.Environments.set(key, new List<Environment>());

            for (var k = 0; k < count; k++) {


                var env = new Environment();
                env.environmentType = key;
                env.interpersonalContactFactor = interpersonalContactGenerator();

                this.Environments.get(key)?.add(env);
            }
        });

        //create a generator that makes a random susceptability given the config mean and standard deviation
        var susceptabilityGenerator = Stats.getGaussianRandomGenerator(config.MeanPersonalSusceptability, config.PersonalSuceptabilityDeviation);

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
        for (var i = 0; i < config.PopulationSize; i++) {
            var person = new Person();
            person.susceptability = susceptabilityGenerator();
            person.statusHandler = new CleanStatusHandler(); //everbody starts clean

            this.People.add(person);

            if (i < config.NumberOfHouseholds) { //ensure each household has a member
                this.Households.get(i).add(person);
                person.householdIndex = i;
            }
            else { //randomly assign remaining people to households
                var householdIndex = Math.trunc(Stats.getUniform(0, this.Households.size));
                this.Households.get(householdIndex).add(person);
                person.householdIndex = householdIndex;
            }

            if (Stats.getUniform(0, 1) < config.ProportionOfChildren) { //assign children to schools
                var school = schoolEnvironments.get(Math.trunc(Stats.getUniform(0, schoolEnvironments.size)));
                this.UsualDaytimeEnvironmentMap.get(school)?.add(person);
                person.usualDaytimeEnvironment = school;
            }
            else { //assign people to other environments
                var env = nonSchoolEnvironments.get(Math.trunc(Stats.getUniform(0, nonSchoolEnvironments.size)));// for now assign people uniformly across environments
                this.UsualDaytimeEnvironmentMap.get(env)?.add(person);
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
    UpdateQuarantine() { //always updates even if tracking is off in config
        for (var i = 0; i < this.Households.size; i++) {
            var doQuarantine = false;
            this.Households.get(i).forEach(o => { if (o.isQuarantined) doQuarantine = true; });
            this.QuarantinedHouseholds.set(i, doQuarantine);
        }
    }
    UpdateStatusByTick(person: Person) {

        person.statusHandler.Tick();

        switch (person.statusHandler.Status) {
            case Status.Dead: {
                person.isQuarantined = true;
                return;
            }

            case Status.Asymptomatic:
                if (person.statusHandler.Time.Day > this.Config.AsymptomaticTime) {

                    if (person.usualDaytimeEnvironment.environmentType == EnvironmentType.School) {
                        if (Stats.getUniform(0, 1) < this.Config.ChildProgressionFactor) {
                            person.statusHandler = new MildStatusHandler();
                            if (Stats.getUniform(0, 1) < this.Config.MildSymptomsQuarantineFactor) {
                                person.isQuarantined = true;
                            }
                        }
                        else {
                            person.statusHandler = new RecoveredStatusHandler();
                            person.isQuarantined = false;
                        }
                        return;
                    }
                    person.statusHandler =
                        Stats.getUniform(0, 1) < this.Config.SeriousIllnessRatio
                            ? new SeriousStatusHandler()
                            : new MildStatusHandler();

                    if (person.statusHandler.Status == Status.SeriouslyIll) {
                        person.isQuarantined = true;
                    }
                    if (person.statusHandler.Status == Status.MildlyIll) {
                        if (Stats.getUniform(0, 1) < this.Config.MildSymptomsQuarantineFactor) {
                            person.isQuarantined = true;
                        }
                    }
                    return;
                }
                break;
            case Status.SeriouslyIll:
                {
                    if ((person.statusHandler.Time.Day > this.Config.RecoveryTime)) {
                        if (Stats.getUniform(0, 1) < (1.0 / this.Config.DeathRatio)) {
                            person.statusHandler = new DeadStatusHandler();
                            person.isQuarantined = true;
                        }
                        else {
                            person.statusHandler = new RecoveredStatusHandler();
                            person.isQuarantined = false;
                        }
                        return;
                    }
                    break;
                }
            case Status.MildlyIll: {
                if (person.statusHandler.Time.Day > this.Config.RecoveryTime) {
                    person.statusHandler = new RecoveredStatusHandler();
                    person.isQuarantined = false;
                }
                return;
            }
            case Status.Clear: {
                person.isQuarantined = false;
                if (Stats.getUniform(0, 1) < this.Config.RandomInfectionProbability / 24) {
                    person.statusHandler = new AsymptomaticStatusHandler();
                }
                return;
            }
            case Status.Recovered: {
                person.isQuarantined = false;
                if (Stats.getUniform(0, 1) < this.Config.RandomInfectionProbability * this.Config.ReinfectionProbability / 24) {
                    person.statusHandler = new AsymptomaticStatusHandler();
                }
                return;
            }
        }
    }

    Transmit(
        person1: Person,
        person2: Person,
        contactFactor: number /* how much personal interaction people in the environment have*/): StatusHandler {


        if (person1.householdIndex != person2.householdIndex && this.Config.QuarantineWholeHouseholdOnInfection) {
            if (this.QuarantinedHouseholds.get(person1.householdIndex) || this.QuarantinedHouseholds.get(person2.householdIndex))
                return person1.statusHandler;
        }

        if (person1 === person2) {
            return person1.statusHandler;
        }

        if ((/* neither has the illness */ person1.statusHandler.Status == Status.Clear && person2.statusHandler.Status == Status.Clear)
            || /* one or other party are quarantined so they dont really meet unless they share a household */ ((person1.isQuarantined || person2.isQuarantined) && (person1.householdIndex != person2.householdIndex))) {
            return person1.statusHandler;
        }




        var chance = contactFactor * person2.statusHandler.Infectiousness * person1.susceptability / 24;

        switch (person1.statusHandler.Status) {
            case Status.Dead: {
                return person1.statusHandler;
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
                return person1.statusHandler;
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
                people.get(i).statusHandler = this.Transmit(people.get(i), people.get(k), interpersonalFactor);
            }
        }
    }

    private DoHomeworkers(people: List<Person>) {
        var homeworkerMap = new Map<number, List<Person>>();
        people.forEach(person => {
            var set = homeworkerMap.get(person.householdIndex);
            if (!homeworkerMap.has(person.householdIndex)) {
                set = new List<Person>();
                homeworkerMap.set(person.householdIndex, set);
            }
            set?.add(person);
        });
        homeworkerMap.forEach(workers => {
            if (workers.size == 1) {
                if (Stats.getUniform(0, 1) < this.Config.RandomInfectionProbability) {
                    workers.get(0).statusHandler = new AsymptomaticStatusHandler();
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
                        if (person.usualDaytimeEnvironment.environmentType == EnvironmentType.Retail || person.usualDaytimeEnvironment.environmentType == EnvironmentType.Social || person.usualDaytimeEnvironment.environmentType == EnvironmentType.School) {
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
                            if (person.usualDaytimeEnvironment.environmentType == EnvironmentType.Retail || person.usualDaytimeEnvironment.environmentType == EnvironmentType.Social || person.usualDaytimeEnvironment.environmentType == EnvironmentType.School) {
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
                        if (person.usualDaytimeEnvironment.environmentType == EnvironmentType.School) {
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
                            if (person.usualDaytimeEnvironment.environmentType == EnvironmentType.School) {
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

                if (p.usualDaytimeEnvironment.environmentType == EnvironmentType.Retail || p.usualDaytimeEnvironment.environmentType == EnvironmentType.Home || p.usualDaytimeEnvironment.environmentType == EnvironmentType.Office) {
                    if (Stats.getUniform(0, 1) < this.Config.SocialEveningFactor / this.Config.EnvironmentCounts.get(EnvironmentType.Social)) {
                        combinedSet.add(p);
                    }
                }
            }

            this.ProcessPeople(combinedSet, env.interpersonalContactFactor);

        });

    }

}



