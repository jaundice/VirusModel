import { Stats } from './Stats';
import { Health } from './Health';

export class Demographics {

    static get UKPopulation() {
        return 67886011;
    }

    private static _heartDiseaseProportion: number = 7400000 / Demographics.UKPopulation;

    private static _asthma: number = 5400000 / Demographics.UKPopulation;

    private static _autoImmune: number = 4000000 / Demographics.UKPopulation;

    private static _diabetes: number = 3900000 / Demographics.UKPopulation;

    private static _cancer: number = 2900000 / Demographics.UKPopulation;


    /* naieve attempt at skewing illness towards the older people. 
    This is will alter the overall profile but might represent different age ranges
    better where there is no public data I can find */
    private static getAgeFactor(ageDemographic: AgeDemographic): number {

        var f: number;
        switch (ageDemographic) {
            case AgeDemographic.Under10:
                f = 1;
                break;
            case AgeDemographic.Under20:
                f = 2;
                break;
            case AgeDemographic.Under30:
                f = 3;
                break;
            case AgeDemographic.Under40:
                f = 4;
                break;
            case AgeDemographic.Under50:
                f = 5;
                break;
            case AgeDemographic.Under60:
                f = 6;
                break;
            case AgeDemographic.Under70:
                f = 7;
                break;
            case AgeDemographic.Under80:
                f = 8;
                break;
            default:
                f = 10;
                break;
        }

        return (f * f) / 100;

    }


    static getRandomHealth(ageDemographic: AgeDemographic): Health {
        var ageFactor = Demographics.getAgeFactor(ageDemographic);

        var heartdisease = ageFactor * Demographics._heartDiseaseProportion < Stats.getUniform(0, 1);
        var asthma = ageFactor * Demographics._asthma < Stats.getUniform(0, 1);
        var autoImmune = ageFactor * Demographics._autoImmune < Stats.getUniform(0, 1);
        var diabetes = ageFactor * Demographics._diabetes < Stats.getUniform(0, 1);
        var cancer = ageFactor * Demographics._cancer < Stats.getUniform(0, 1);

        return new Health(heartdisease, asthma, autoImmune, diabetes, cancer);

    }


    /* creates an age based on the age distribution of the UK */

    static RandomAgeDemographic(): AgeDemographic {
        var rnd = Stats.getUniform(0, 100);

        if (rnd < 11.8) {
            return AgeDemographic.Under10;
        }
        else if (rnd < 24.65) {
            return AgeDemographic.Under20; // inferred from avg u30 & u10
        }
        else if (rnd < 37.5) {
            return AgeDemographic.Under30;
        }
        else if (rnd < 50.8) {
            return AgeDemographic.Under40;
        }
        else if (rnd < 65.4) {
            return AgeDemographic.Under50;
        }
        else if (rnd < 77.5) {
            return AgeDemographic.Under60;
        }
        else if (rnd < 88.3) {
            return AgeDemographic.Under70;
        }
        else if (rnd < 95.4) {
            return AgeDemographic.Under80;
        }
        else {
            return AgeDemographic.Over80;
        }
    }
}

export enum AgeDemographic {
    Under10,
    Under20,
    Under30,
    Under40,
    Under50,
    Under60,
    Under70,
    Under80,
    Over80
}


