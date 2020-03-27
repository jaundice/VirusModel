(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./List", "./Demographic", "./Stats", "./EnvironmentType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const List_1 = require("./List");
    const Demographic_1 = require("./Demographic");
    const Stats_1 = require("./Stats");
    const EnvironmentType_1 = require("./EnvironmentType");
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
    var agricultureRatio = 338000 / Demographic_1.Demographics.UKPopulation;
    var miningRatio = 547 / Demographic_1.Demographics.UKPopulation;
    var manufaturingRatio = 3011000 / Demographic_1.Demographics.UKPopulation;
    var constructionRatio = 2310000 / Demographic_1.Demographics.UKPopulation;
    var wholesaleRetail = 4089000 / Demographic_1.Demographics.UKPopulation;
    var transport = 1574000 / Demographic_1.Demographics.UKPopulation;
    var accomodationFood = 1745000 / Demographic_1.Demographics.UKPopulation;
    var information = 1498000 / Demographic_1.Demographics.UKPopulation;
    var financial = 1276000 / Demographic_1.Demographics.UKPopulation;
    var realEstate = 386000 / Demographic_1.Demographics.UKPopulation;
    var professional = 2540000 / Demographic_1.Demographics.UKPopulation;
    var admin = 1545000 / Demographic_1.Demographics.UKPopulation;
    var publicAdmin = 2130000 / Demographic_1.Demographics.UKPopulation;
    var education = 3428000 / Demographic_1.Demographics.UKPopulation;
    var health = 4515000 / Demographic_1.Demographics.UKPopulation;
    var other = 1902000 / Demographic_1.Demographics.UKPopulation;
    var outdoors = agricultureRatio + miningRatio + constructionRatio;
    var office = admin + publicAdmin + professional + realEstate + financial + information + other;
    var entertainment = accomodationFood;
    class Environments {
        constructor() {
            this._allEnvironments = new List_1.List();
            this._allKeyEnvironments = new List_1.List();
            this._environmentMap = new Map();
            this._environmentMap.set(EnvironmentType_1.EnvironmentType.Entertainment, new List_1.List());
            this._environmentMap.set(EnvironmentType_1.EnvironmentType.Factory, new List_1.List());
            this._environmentMap.set(EnvironmentType_1.EnvironmentType.Home, new List_1.List());
            this._environmentMap.set(EnvironmentType_1.EnvironmentType.Hospital, new List_1.List());
            this._environmentMap.set(EnvironmentType_1.EnvironmentType.Logistics, new List_1.List());
            this._environmentMap.set(EnvironmentType_1.EnvironmentType.Office, new List_1.List());
            this._environmentMap.set(EnvironmentType_1.EnvironmentType.Outdoors, new List_1.List());
            this._environmentMap.set(EnvironmentType_1.EnvironmentType.Retail, new List_1.List());
            this._environmentMap.set(EnvironmentType_1.EnvironmentType.School, new List_1.List());
        }
        GetEnvironmentsByType(type) {
            return this._environmentMap.get(type);
        }
        Add(environment) {
            this._allEnvironments.add(environment);
            this._environmentMap.get(environment.EnvironmentType).add(environment);
            if (environment.IsKeyInfrastructure) {
                this._allKeyEnvironments.add(environment);
            }
        }
        static GetRandomEnvironmentType() {
            var u = Stats_1.Stats.getUniform(0, 1);
            if (u < manufaturingRatio)
                return EnvironmentType_1.EnvironmentType.Factory;
            else if (u < manufaturingRatio + wholesaleRetail)
                return EnvironmentType_1.EnvironmentType.Retail;
            else if (u < manufaturingRatio + wholesaleRetail + transport)
                return EnvironmentType_1.EnvironmentType.Logistics;
            else if (u < manufaturingRatio + wholesaleRetail + transport + education)
                return EnvironmentType_1.EnvironmentType.School;
            else if (u < manufaturingRatio + wholesaleRetail + transport + education + outdoors)
                return EnvironmentType_1.EnvironmentType.Outdoors;
            else if (u < manufaturingRatio + wholesaleRetail + transport + education + outdoors + office)
                return EnvironmentType_1.EnvironmentType.Office;
            else if (u < manufaturingRatio + wholesaleRetail + transport + education + outdoors + office + entertainment)
                return EnvironmentType_1.EnvironmentType.Entertainment;
            else if (u < manufaturingRatio + wholesaleRetail + transport + education + outdoors + office + entertainment + health)
                return EnvironmentType_1.EnvironmentType.Hospital;
            else
                return EnvironmentType_1.EnvironmentType.Home;
        }
    }
    exports.Environments = Environments;
});
//# sourceMappingURL=Environments.js.map