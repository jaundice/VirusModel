(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Status", "./Time"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Status_1 = require("./Status");
    const Time_1 = require("./Time");
    class StatusHandler {
        constructor(status) {
            this._time = new Time_1.Time();
            this._status = status;
        }
        get Time() {
            return this._time;
        }
        get Status() {
            return this._status;
        }
        Tick() {
            this.Time.Tick();
        }
    }
    exports.StatusHandler = StatusHandler;
    ;
    class CleanStatusHandler extends StatusHandler {
        constructor() {
            super(Status_1.Status.Clear);
            this._infectiousness = 0;
        }
        get Infectiousness() {
            return this._infectiousness;
        }
        Tick() {
            super.Tick();
            //do nothing
        }
    }
    exports.CleanStatusHandler = CleanStatusHandler;
    ;
    class AsymptomaticStatusHandler extends StatusHandler {
        constructor() {
            super(Status_1.Status.Asymptomatic);
            this._infectiousness = 0.8;
        }
        get Infectiousness() {
            return this._infectiousness;
        }
        Tick() {
            super.Tick();
            this._infectiousness *= 0.95; //todo vary infectiousness by time;
        }
    }
    exports.AsymptomaticStatusHandler = AsymptomaticStatusHandler;
    ;
    class DeadStatusHandler extends StatusHandler {
        constructor() {
            super(Status_1.Status.Dead);
        }
        get Infectiousness() {
            return 0;
        }
        Tick() {
            //still dead
        }
    }
    exports.DeadStatusHandler = DeadStatusHandler;
    ;
    class MildStatusHandler extends StatusHandler {
        constructor() {
            super(Status_1.Status.MildlyIll);
            this._infectiousness = 0.6;
        }
        get Infectiousness() {
            return this._infectiousness;
        }
        Tick() {
            super.Tick();
        }
    }
    exports.MildStatusHandler = MildStatusHandler;
    ;
    class SeriousStatusHandler extends StatusHandler {
        constructor() {
            super(Status_1.Status.SeriouslyIll);
            this._infectiousness = 1;
        }
        get Infectiousness() {
            return this._infectiousness;
        }
        Tick() {
            super.Tick(); //todo vary infectiousness by time;
        }
    }
    exports.SeriousStatusHandler = SeriousStatusHandler;
    ;
    class RecoveredStatusHandler extends StatusHandler {
        constructor() {
            super(Status_1.Status.Recovered);
            this._infectiousness = 0;
        }
        get Infectiousness() {
            return this._infectiousness;
        }
        Tick() {
            super.Tick(); //todo vary infectiousness by time;
        }
    }
    exports.RecoveredStatusHandler = RecoveredStatusHandler;
    ;
});
//# sourceMappingURL=StatusHandler.js.map