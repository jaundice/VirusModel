(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./List"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const List_1 = require("./List");
    class Triggers {
        constructor() {
            this._triggers = new List_1.List();
        }
        AddTrigger(trigger) {
            this._triggers.add(trigger);
        }
        FireTriggers(model) {
            for (var i = 0; i < this._triggers.size; i++) {
                this._triggers.get(i).Fire(model);
            }
        }
    }
    exports.Triggers = Triggers;
});
//# sourceMappingURL=Triggers.js.map