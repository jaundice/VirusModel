import { Environment } from "./Environment";
import { List } from "./List";
import { Demographics } from "./Demographic";
import { Stats } from "./Stats";
import { EnvironmentType } from "./EnvironmentType";

/*
All in employment2	    Public sector3	    Private sector	    
32,983	                7,174	            25,696

Oct-Dec 2019    
Agriculture, forestry & fishing	    Mining, energy and water supply	    Manufacturing	    Construction	    
338	                                547	                                3,011	            2,310	            

Wholesale, retail & repair of motor vehicles	    Transport & storage	    Accommodation & food services	
4,089	                                            1,574	                1,745	                        

Information & communication	    Financial & insurance activities	    Real estate activities	
1,498	                        1,276	                                386	                    

Professional, scientific & technical activities	    Administrative & support services	    
2,540	                                            1,545	                                

Public admin & defence; social security	    Education	    Human health & social work activities	    Other services
2,130	                                    3,428	        4,515	                                    1,902

*/


var agricultureRatio = 338000 / Demographics.UKPopulation;
var miningRatio = 547 / Demographics.UKPopulation;
var manufaturingRatio = 3011000 / Demographics.UKPopulation;
var constructionRatio = 2310000 / Demographics.UKPopulation;
var wholesaleRetail = 4089000 / Demographics.UKPopulation;
var transport = 1574000 / Demographics.UKPopulation;
var accomodationFood = 1745000 / Demographics.UKPopulation;
var information = 1498000 / Demographics.UKPopulation;
var financial = 1276000 / Demographics.UKPopulation;
var realEstate = 386000 / Demographics.UKPopulation;
var professional = 2540000 / Demographics.UKPopulation;
var admin = 1545000 / Demographics.UKPopulation;
var publicAdmin = 2130000 / Demographics.UKPopulation;
var education = 3428000 / Demographics.UKPopulation;
var health = 4515000 / Demographics.UKPopulation;
var other = 1902000 / Demographics.UKPopulation;


var outdoors = agricultureRatio + miningRatio + constructionRatio;
var office = admin + publicAdmin + professional + realEstate + financial + information + other;
var entertainment = accomodationFood;


export class Environments {
    private _allEnvironments: List<Environment> = new List<Environment>();
    private _allKeyEnvironments: List<Environment> = new List<Environment>();
    private _environmentMap:Map<EnvironmentType, List<Environment>>;

    GetEnvironmentsByType(type:EnvironmentType):List<Environment>{
        return this._environmentMap.get(type);
    }

    static GetRandomEnvironment():EnvironmentType {
        var u = Stats.getUniform(0, 1);
        if (u < manufaturingRatio) return EnvironmentType.Factory;
        else if (u < manufaturingRatio + wholesaleRetail) return EnvironmentType.Retail;
        else if (u < manufaturingRatio + wholesaleRetail + transport) return EnvironmentType.Logistics;
        else if (u < manufaturingRatio + wholesaleRetail + transport + education) return EnvironmentType.School;
        else if (u < manufaturingRatio + wholesaleRetail + transport + education + outdoors) return EnvironmentType.Outdoors;
        else if (u < manufaturingRatio + wholesaleRetail + transport + education + outdoors + office) return EnvironmentType.Office;
        else if (u < manufaturingRatio + wholesaleRetail + transport + education + outdoors + office + entertainment) return EnvironmentType.Entertainment;
        else if (u < manufaturingRatio + wholesaleRetail + transport + education + outdoors + office + entertainment + health) return EnvironmentType.Hospital;
        else return EnvironmentType.Home;

    }
}