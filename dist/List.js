(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class List {
        constructor(copy = null) {
            this.items = [];
            if ((copy)) {
                copy.forEach(a => this.add(a));
            }
        }
        [Symbol.iterator]() {
            var arr = this.items;
            function* iter() {
                for (var i = 0; i < arr.length; i++) {
                    yield arr[i];
                }
            }
            ;
            return iter();
        }
        get size() {
            return this.items.length;
        }
        add(value) {
            this.items.push(value);
        }
        get(index) {
            return this.items[index];
        }
        set(index, value) {
            this.items[index] = value;
        }
        forEach(callback) {
            for (var i = 0; i < this.size; i++) {
                callback(this.get(i));
            }
        }
        any(callback) {
            for (var i = 0; i < this.items.length; i++) {
                if (callback(this.items[i]))
                    return true;
            }
            return false;
        }
        all(callback) {
            for (var i = 0; i < this.items.length; i++) {
                if (!callback(this.items[i]))
                    return false;
            }
            return true;
        }
        filter(callback) {
            var lst = new List();
            this.forEach(p => {
                if (callback(p)) {
                    lst.add(p);
                }
            });
            return lst;
        }
        count(callback) {
            var r = 0;
            this.forEach(a => {
                if (callback(a))
                    r++;
            });
            return r;
        }
        aggregate(seed, callback) {
            var res = seed;
            this.forEach(p => {
                res = callback(p, res);
            });
            return res;
        }
    }
    exports.List = List;
    ;
});
//# sourceMappingURL=List.js.map