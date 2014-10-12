/**
 * Point model.
 */

Drawings.Point = function (x, y) {
    this.x = x;
    this.y = y;
    this.name = '';
};

Drawings.Point.prototype = {

    getX: function () {
        return this.x;
    },

    getY: function () {
        return this.y;
    },

    setName: function (name) {
        this.name = name;
    },

    getName: function () {
        return this.name;
    }
};