define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class List {
        constructor(copy = null) {
            this.items = [];
            if ((copy)) {
                copy.forEach(a => this.add(a));
            }
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
    }
    exports.List = List;
    ;
});
//# sourceMappingURL=List.js.map